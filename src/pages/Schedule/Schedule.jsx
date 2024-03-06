// ==============================================
import { useEffect, useState } from "react";
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

import {
    formatTime, millisecondsInAnHour, millisecondsInAMinute,
    registerScheduleTimerRemovalEvent,
    timeEventPerMinute
} from '../../data/time.js';
import gameInfo from '../../data/gameInfo.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faScrewdriver, faTrashCan } from '@fortawesome/free-solid-svg-icons';
// ==============================================
export default function Schedule() {
    const dispatch = useDispatch();
    // ===========================
    const userContext = ActiveUserContextGet();
    const user = userContext.activeUserObj.user;
    const scheduleList = userContext.activeUserObj.user.tasks;
    // ===========================
    const [schedule, setSchedule] = useState(null);
    const [selectedGame, setSelectedGame] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    // ===========================
    const onDeleteSchedule = (id) => {
        dispatch(removeTask({ taskId: id }));

        let schedules = user.tasks;
        const taskIndex = schedules.findIndex((task) => task.id === id);

        onRegisterScheduleRemovalEvent(user.tasks[taskIndex].gameID);

        user.tasks.splice(taskIndex, 1);
        userContext.updateActiveUserProfile("tasks", schedules);
    };
    // ===========================
    const [modifyExistingSchedule, setModifyExistingSchedule] = useState(false);
    const onHideScheduleModal = () => setModifyExistingSchedule(false);
    // ===========================
    return scheduleList.length > 0 ? (
        <Container fluid className="primary-container" style={{ flex: 1, overflowX: "hidden" }}>
            <Timekeeper />
            <hr className="horizontal-line-text" />
            <Row className="w-100">
                {
                    scheduleList.map((schedule, index) => {
                        const gameIndex = gameInfo.findIndex((game) => game.id === schedule.gameID);
                        const regionIndex = gameInfo[gameIndex].supportedRegions.findIndex((region) => region.name === schedule.regionName);

                        const alarmDate = new Date();
                        const notifyTimeSplit = schedule.notifyTime.split(":");
                        alarmDate.setHours(parseInt(notifyTimeSplit[0]), parseInt(notifyTimeSplit[1]));

                        return <ScheduleContainer key={`schedule-${index}`}
                            schedule={schedule}
                            alarmDate={alarmDate}
                            game={gameInfo[gameIndex]}
                            region={gameInfo[gameIndex].supportedRegions[regionIndex]}
                            setScheduleCallback={setSchedule} setGameCallback={setSelectedGame} setRegionCallback={setSelectedRegion}
                            setScheduleModalVisibleCallback={setModifyExistingSchedule}
                            deleteScheduleCallback={onDeleteSchedule} />
                    })
                }
            </Row>
            <ModifyScheduleModal
                isVisible={modifyExistingSchedule}
                handleClose={onHideScheduleModal}
                schedule={schedule}
                scheduleGameData={selectedGame}
                scheduleRegionData={selectedRegion} />
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
function ScheduleContainer({ schedule, alarmDate, game, region,
    setScheduleCallback, setGameCallback, setRegionCallback, setScheduleModalVisibleCallback, deleteScheduleCallback }) {
    // ===========================
    const audioPlaybackInstance = new Audio();
    // ===========================
    const reassignTimeData = () => formatTimeToAlarmDisplay(game, region, new Date(), alarmDate.getHours(), alarmDate.getMinutes());
    const [timeData, setTimeData] = useState(reassignTimeData());
    const alarmTime = formatTime(alarmDate, true);

    // Use Effect to reassign time data when alarm date was manually changed.
    useEffect(() => {
        setTimeData(reassignTimeData());
    }, [alarmDate]);

    // Use Effect to reassign time data after every minute has passed.
    useEffect(() => {
        const callbackPerMinute = () => setTimeData(reassignTimeData());
        window.addEventListener(timeEventPerMinute, callbackPerMinute);

        return (() => window.removeEventListener(timeEventPerMinute, callbackPerMinute));
    });
    // ===========================
    return (
        <Col className="col-md-6 col-xxl-4 col-12 mx-auto mb-3">
            <Card>
                { /* ------------------------------------- */}
                {/* Game Icon + Game Title + Region Name */}
                <Card.Header className="d-flex align-items-center justify-content-between">
                    <Image src={new URL(`../../assets/game-icons/${game.icon}`, import.meta.url)}
                        className="rounded me-2"
                        style={{ minWidth: "32px", minHeight: "32px", maxWidth: "32px", maxHeight: "32px", width: "100%", height: "auto" }} />
                    <span className="fs-4 text-non-links">{game.title}</span>
                    <span className="fs-6 text-non-links ms-auto">{region.name}</span>
                </Card.Header>
                { /* ------------------------------------- */}
                <Card.Body>
                    { /* ------------------------------------- */}
                    {/* Description */}
                    <Card.Title className="fs-5 text-non-links">Description: </Card.Title>
                    <Card.Text className="fs-6 text-non-links rounded secondary-container px-2 py-2" style={{ width: "100%", border: "1px black solid" }}>
                        {schedule.description ? schedule.description : "N/A"}
                    </Card.Text>
                    { /* ------------------------------------- */}
                    {/* Alarm Time At */}
                    <div className="d-flex align-items-center mb-3">
                        <Card.Title className="fs-5 text-non-links me-3 my-0 py-0">Alarm Time: </Card.Title>
                        <Card.Text className="fs-6 fw-bold text-non-links my-0 py-0">
                            {alarmTime}
                        </Card.Text>
                    </div>
                    { /* ------------------------------------- */}
                    {/* Time til Alarm */}
                    <div className="d-flex align-items-center">
                        <Card.Title className="fs-5 text-non-links me-3 my-0 py-0">Time Remaining (h/m): </Card.Title>
                        <Card.Text className="fs-6 fw-bold text-non-links my-0 py-0">
                            {timeData.timeUntilAlarm}
                        </Card.Text>
                    </div>
                    { /* ------------------------------------- */}
                </Card.Body>
                { /* ------------------------------------- */}
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
                        setScheduleCallback(schedule);
                        setGameCallback(game);
                        setRegionCallback(region);

                        setScheduleModalVisibleCallback(true);
                    }}>
                        <FontAwesomeIcon className={"text-center text-light px-3"} icon={faScrewdriver} />
                    </Button>
                    <Button variant="danger" onClick={() => deleteScheduleCallback(schedule.id)}>
                        <FontAwesomeIcon
                            className={"text-center text-light px-3"}
                            icon={faTrashCan} />
                    </Button>
                </Card.Footer>
            </Card>
        </Col >
    );
}
// ==============================================
function formatTimeToAlarmDisplay(game, region, now, alarmHour, alarmMinute) {
    // ===============
    // Debug
    //console.log("--------" + game.title + " [" + region.name + "]----------");
    // ===============
    const alarmDate = new Date();
    alarmDate.setHours(alarmHour, alarmMinute);
    if (alarmDate < now)
        alarmDate.setDate(alarmDate.getDate() + 1);
    // ===============
    const diff = alarmDate - now;
    const diffHours = Math.floor(diff / millisecondsInAnHour);
    const diffMinutes = Math.floor(diff / millisecondsInAMinute) % 60;
    // ===============
    return {
        currentTime: formatTime(now, true),
        timeUntilAlarm: `${diffHours} hour(s) ${diffMinutes} minute(s)`
    };
}
// ==============================================
function onRegisterScheduleRemovalEvent(gameID) {
    const timeEvent = new CustomEvent(registerScheduleTimerRemovalEvent, { detail: { gameID: gameID } });
    window.dispatchEvent(timeEvent);
}
// ==============================================