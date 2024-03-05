// ==============================================
import { useState } from "react";
import { useDispatch } from "react-redux";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

import Timekeeper from '../../components/Timekeeper.jsx';
import ModifyScheduleModal from '../../components/ModifyScheduleModal.jsx';

import { ActiveUserContextGet } from '../../contexts/ActiveUserContext.jsx';
import { removeTask } from '../../feature/tasks/tasksSlice.jsx';

import { formatTime } from '../../data/time.js';
import gameInfo from '../../data/gameInfo.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faScrewdriver, faTrashCan } from '@fortawesome/free-solid-svg-icons';
// ==============================================
export default function Schedule() {
    // ===========================
    const userContext = ActiveUserContextGet();
    const user = userContext.activeUserObj.user;
    const scheduleList = userContext.activeUserObj.user.tasks;
    // ===========================
    const [schedule, setSchedule] = useState(null);
    const [selectedGameIndex, setSelectedGameIndex] = useState(0);
    const [selectedRegionIndex, setSelectedRegionIndex] = useState(0);
    // ===========================
    const dispatch = useDispatch();
    const handleDelete = (id) => {
        dispatch(removeTask({ taskId: id }));

        let newTasks = user.tasks;
        const taskIndex = newTasks.findIndex((task) => task.id === id);

        user.tasks.splice(taskIndex, 1);
        userContext.updateActiveUserProfile("tasks", newTasks);
    };

    const [modifyExistingSchedule, setModifyExistingSchedule] = useState(false);
    const handleHideScheduleModal = () => setModifyExistingSchedule(false);

    const audioPlaybackInstance = new Audio();

    return scheduleList.length > 0 ? (
        <Container fluid className="primary-container" style={{ flex: 1, overflowX: "hidden" }}>
            <Timekeeper />
            <hr className="horizontal-line-text" />
            <Row className="w-100">
                {
                    scheduleList.map((schedule, index) => {
                        const targetGameIndex = gameInfo.findIndex((game) => game.id === schedule.gameID);
                        const targetRegionIndex = gameInfo[targetGameIndex].supportedRegions.findIndex(
                            (region) => region.name === schedule.gameRegionName);

                        const date = new Date();
                        const notifyTimeSplit = schedule.notifyTime.split(":");
                        date.setHours(parseInt(notifyTimeSplit[0]));
                        date.setMinutes(parseInt(notifyTimeSplit[1]));

                        const formattedTime = formatTime(date, true);

                        return (
                            <Col key={`schedule-${index}`} className="col-md-6 col-xxl-4 col-12 mx-auto mb-3">
                                <Card key={`schedule-${index}`}>
                                    <Card.Header className="d-flex align-items-center justify-content-between">
                                        <Image src={new URL(`../../assets/game-icons/${gameInfo[targetGameIndex].icon}`, import.meta.url)}
                                            className="rounded me-2"
                                            style={{ minWidth: "32px", minHeight: "32px", maxWidth: "32px", maxHeight: "32px", width: "100%", height: "auto" }} />
                                        <span className="fs-4 text-non-links">{gameInfo[targetGameIndex].title}</span>
                                        <span className="fs-6 text-non-links ms-auto">{gameInfo[targetGameIndex].supportedRegions[targetRegionIndex].name}</span>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Title className="fs-5 text-non-links">Description: </Card.Title>
                                        <Card.Text className="fs-6 text-non-links rounded secondary-container px-2 py-2" style={{ width: "100%", border: "1px black solid" }}>
                                            {schedule.description ? schedule.description : "N/A"}
                                        </Card.Text>
                                        <div className="d-flex align-items-center">
                                            <Card.Title className="fs-5 text-non-links me-3 my-0 py-0">Alarm Time: </Card.Title>
                                            <Card.Text className="fs-6 fw-bold text-non-links my-0 py-0">
                                                {formattedTime}
                                            </Card.Text>
                                        </div>
                                    </Card.Body>
                                    <Card.Footer className="d-flex justify-content-evenly">
                                        <Button variant="primary"
                                            onClick={() => {
                                                if (audioPlaybackInstance.src !== schedule.alarmFile) {
                                                    if (audioPlaybackInstance.src !== null && audioPlaybackInstance.src !== undefined &&
                                                        audioPlaybackInstance.src.trim().length > 0) {
                                                        audioPlaybackInstance.pause();
                                                        audioPlaybackInstance.currentTime = 0;
                                                    }

                                                    audioPlaybackInstance.src = schedule.alarmFile;
                                                }

                                                if (!audioPlaybackInstance.ended && !audioPlaybackInstance.paused)
                                                    audioPlaybackInstance.currentTime = 0;
                                                audioPlaybackInstance.play();
                                            }}>
                                            <FontAwesomeIcon
                                                className={"text-center text-light px-3"}
                                                icon={faPlay} />
                                        </Button>
                                        <Button variant="secondary" onClick={() => {
                                            setSchedule(schedule);
                                            setSelectedGameIndex(targetGameIndex);
                                            setSelectedRegionIndex(targetRegionIndex);

                                            setModifyExistingSchedule(true);
                                        }}>
                                            <FontAwesomeIcon
                                                className={"text-center text-light px-3"}
                                                icon={faScrewdriver} />
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDelete(schedule.id)}>
                                            <FontAwesomeIcon
                                                className={"text-center text-light px-3"}
                                                icon={faTrashCan} />
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        );
                    })
                }
            </Row>
            <ModifyScheduleModal isVisible={modifyExistingSchedule} handleClose={handleHideScheduleModal}
                schedule={schedule}
                scheduleGameData={gameInfo[selectedGameIndex]}
                scheduleRegionData={gameInfo[selectedGameIndex].supportedRegions[selectedRegionIndex]} />
        </Container>
    ) : (
        <Container fluid className="primary-container m-0 p-0 d-flex flex-column justify-content-end" style={{ flex: 1, overflowX: "hidden" }}>
            <Row className="w-100 m-0 p-0">
                <Col className="col-12">
                    <Image src={new URL("../../assets/schedule/hsr-bronya-caption.webp", import.meta.url)}
                        style={{
                            minWidth: "640px", minHeight: "400px",
                            maxWidth: "1152px", maxHeight: "1152px",
                            width: "100%", height: "auto"
                        }} />
                </Col>
            </Row>
        </Container>
    );
}
// ==============================================