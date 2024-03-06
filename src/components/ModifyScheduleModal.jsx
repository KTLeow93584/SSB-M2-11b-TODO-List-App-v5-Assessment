// ==============================================
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
// ==============================================
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';

import { modifyTask } from '../feature/tasks/tasksSlice.jsx';
import { ActiveUserContextGet } from '../contexts/ActiveUserContext.jsx';

import gameInfo from '../data/gameInfo.js';
import {
    formatTime, millisecondsInAMinute, millisecondsInAnHour,
    timeEventPerMinute,
    registerModifiedScheduleEvent
} from '../data/time.js';
// ==============================================
export default function ModifyScheduleModal({ isVisible, handleClose, schedule, scheduleGameData, scheduleRegionData }) {
    // =============================
    const dispatch = useDispatch();
    const userContext = ActiveUserContextGet();
    const user = userContext.activeUserObj.user;

    const reassignTimeData = (game, region) => {
        return formatServerRegionTimeDisplay(game, region, new Date(),
            region.serverResetHour, region.serverResetMinute,
            region.timezoneOffsetHours, region.timezoneOffsetMinutes)
    };

    const [modalData, setModalData] = useState({
        game: scheduleGameData ? scheduleGameData : gameInfo[0],
        region: scheduleRegionData ? scheduleRegionData : gameInfo[0].supportedRegions[0],
        time: reassignTimeData(scheduleGameData ? scheduleGameData : gameInfo[0],
            scheduleRegionData ? scheduleRegionData : gameInfo[0].supportedRegions[0])
    });

    useEffect(() => {
        setModalData({
            game: scheduleGameData ? scheduleGameData : gameInfo[0],
            region: scheduleRegionData ? scheduleRegionData : gameInfo[0].supportedRegions[0],
            time: reassignTimeData(scheduleGameData ? scheduleGameData : gameInfo[0],
                scheduleRegionData ? scheduleRegionData : gameInfo[0].supportedRegions[0])
        });
    }, [scheduleGameData]);
    // =============================
    const [description, setDescription] = useState(schedule ? schedule.description : "");
    const [alarmFile, setAlarmFile] = useState(schedule ? schedule.alarmFile : null);
    const [notifyTime, setNotifyTime] = useState(schedule ? schedule.notifyTime : "12:00");

    useEffect(() => {
        if (schedule) {
            setDescription(schedule.description);
            setAlarmFile(schedule.alarmFile);
            setNotifyTime(schedule.notifyTime);
        }
    }, [schedule]);
    // =============================
    useEffect(() => {
        const callbackPerMinute = () => setModalData((previousModalData) => (
            {
                game: previousModalData.game,
                region: previousModalData.region,
                time: reassignTimeData(previousModalData.game, previousModalData.region)
            }
        ));
        window.addEventListener(timeEventPerMinute, callbackPerMinute);

        return (() => window.removeEventListener(timeEventPerMinute, callbackPerMinute));
    }, []);
    // =============================
    const onSelectNewGameType = (gameIDKey) => {
        const gameIndex = gameInfo.findIndex((game) => game.id === gameIDKey);

        setModalData((previousModalData) => {
            previousModalData.game = gameInfo[gameIndex];
            previousModalData.region = gameInfo[gameIndex].supportedRegions[0];
            previousModalData.time = reassignTimeData(gameInfo[gameIndex], gameInfo[gameIndex].supportedRegions[0]);

            return previousModalData;
        });
    };

    const onSelectNewGameRegion = (regionNameKey) => {
        const regionIndex = modalData.game.supportedRegions.findIndex((region) => region.name === regionNameKey);

        setModalData((previousModalData) => {
            previousModalData.region = modalData.game.supportedRegions[regionIndex];
            previousModalData.time = reassignTimeData(modalData.game, modalData.game.supportedRegions[regionIndex]);

            return previousModalData;
        });
    };

    const onUploadNewAlarmFile = (event) => {
        // ===================================================
        const file = event.target.files[0];

        if (!file) {
            setAlarmFile(null);
            return;
        }

        // Debug
        //console.log("[On Audio File Upload] Size.", file.size);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.addEventListener("load", () => {
            const url = fileReader.result;
            setAlarmFile(url);
        });
        // ===================================================
    };
    // =============================
    const onSubmitModifications = (event) => {
        event.preventDefault();

        const newSchedule = {
            id: schedule.id,
            gameID: modalData.game.id,
            title: modalData.game.title,
            regionName: modalData.region.name,
            alarmFile: alarmFile,
            notifyTime: notifyTime,
            description: description
        };

        // Debug
        //console.log("[Modified Schedule] Modify To:", newSchedule);

        onModifyScheduleEvent(newSchedule);

        const scheduleIndex = user.tasks.findIndex((task) => task.gameID === schedule.gameID && task.regionName === schedule.regionName);
        user.tasks[scheduleIndex] = newSchedule;

        const data = { taskIndex: scheduleIndex, modifiedTaskData: newSchedule };
        dispatch(modifyTask(data));
        // ===============================
        userContext.updateActiveUserProfile("tasks", user.tasks);
        // ===============================
        handleClose();
    };
    // =============================
    return (
        <Modal size="xl" show={isVisible} onHide={handleClose}>
            <Modal.Header closeButton className="primary-container">
                <Modal.Title>Modify an existing game notification schedule</Modal.Title>
            </Modal.Header>

            <Form onSubmit={onSubmitModifications}>
                <Modal.Body className="secondary-container">
                    <Form.Group>
                        {/* ----------------------------- */}
                        {/* Game ID */}
                        <Row className="d-flex align-items-center mb-3">
                            <Col className="col-3">
                                <Form.Label className="text-non-links">Game: </Form.Label>
                            </Col>
                            <Col className="col-9 mx-auto">
                                <Dropdown onSelect={onSelectNewGameType} key={modalData.game.id}>
                                    <Dropdown.Toggle id="game-id-dropdown">
                                        {modalData.game.title}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {
                                            gameInfo.map((gameEntry, index) => {
                                                return (
                                                    <Dropdown.Item key={`game-id-dropdown-element-${index}`}
                                                        eventKey={gameEntry.id}
                                                        active={modalData.game.id === gameEntry.id}>
                                                        {gameEntry.title}
                                                    </Dropdown.Item>
                                                );
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                        {/* ----------------------------- */}
                        {/* Game Regions */}
                        <Row className="d-flex align-items-center mb-3">
                            <Col className="col-3">
                                <Form.Label className="text-non-links">Region: </Form.Label>
                            </Col>
                            <Col className="col-9 mx-auto">
                                <Dropdown onSelect={onSelectNewGameRegion}>
                                    <Dropdown.Toggle id="game-region-id-dropdown">
                                        {modalData.region.name}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {
                                            modalData.game.supportedRegions.map((region, index) => {
                                                return (
                                                    <Dropdown.Item key={`game-id-dropdown-element-${index}`}
                                                        eventKey={region.name}
                                                        active={modalData.region.name === region.name}>
                                                        {region.name}
                                                    </Dropdown.Item>
                                                );
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                        <Row className="d-flex flex-column align-items-center mb-3">
                            <Col className="d-flex flex-column secondary-border me-3 py-2 rounded" style={{ width: "fit-content" }}>
                                <Form.Text>{`Local Reset Time: ${modalData.time.localResetTime}.`}</Form.Text>
                                <Form.Text>{`Time Until Next Reset: ${modalData.time.timeUntilReset}.`}</Form.Text>
                            </Col>
                        </Row>
                        {/* ----------------------------- */}
                        {/* Alarm File */}
                        <Row className="d-flex align-items-center mb-3">
                            <Col className="col-3">
                                <Form.Label className="text-non-links e-3">Notification Sound: </Form.Label>
                            </Col>
                            <Col className="col-9">
                                <Form.Control required id="description"
                                    className="text-non-links input-bar-no-shadow"
                                    type="file" accept="audio/mpeg, audio/ogg, audio/webm, audio/flac"
                                    placeholder="Enter additional notes/descriptions here."
                                    onChange={(event) => onUploadNewAlarmFile(event)} />
                            </Col>
                        </Row>
                        {/* ----------------------------- */}
                        {/* Time to Notify */}
                        {/* Description */}
                        <Row className="d-flex align-items-center mb-3">
                            <Col className="col-3">
                                <Form.Label className="text-non-links me-3">Notify Me At: </Form.Label>
                            </Col>
                            <Col className="col-9">
                                <Form.Control id="notify-time" value={notifyTime}
                                    className="text-non-links input-bar-no-shadow"
                                    type="time" placeholder="Enter additional notes/descriptions here."
                                    onChange={(event) => setNotifyTime(event.target.value)} />
                            </Col>
                        </Row>
                        {/* ----------------------------- */}
                        {/* Description */}
                        <Row className="d-flex align-items-center mb-3">
                            <Col className="col-3">
                                <Form.Label className="text-non-links me-3">Note: </Form.Label>
                            </Col>
                            <Col className="col-9">
                                <Form.Control id="description" value={description} autoFocus
                                    as="textarea"
                                    rows={3}
                                    className="text-non-links input-bar-no-shadow"
                                    type="name" placeholder="Enter additional notes/descriptions here."
                                    onChange={(event) => setDescription(event.target.value)} />
                            </Col>
                        </Row>
                        {/* ----------------------------- */}
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer className="secondary-container">
                    <Button type="submit" variant="primary">Save Changes</Button>
                    <Button variant="danger" onClick={handleClose}>Discard Changes</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
// ==============================================
function formatServerRegionTimeDisplay(game, region, now, hours, minutes, timezoneHours, timezoneMinutes) {
    // ===============
    // Debug
    //console.log("--------" + game.title + " [" + region.name + "]----------");
    //console.log(`[Parameters] Hour: ${hours}, Minute: ${minutes}, TZ Hour: ${timezoneHours}, TZ Minute: ${timezoneMinutes}`);

    const serverResetDate = new Date();
    serverResetDate.setHours(hours, minutes);

    // Debug
    //console.log(`[Server] Date Post-Adjustment:[` +
    //`${serverResetDate.getHours().toString().padStart(2, "0") + ":" + serverResetDate.getMinutes().toString().padStart(2, "0")}]`);
    // ===============
    const serverTZ = (timezoneHours * 60 + timezoneMinutes);
    const clientTZ = now.getTimezoneOffset() * -1;
    const serverTZOffsetFromClient = (serverTZ - clientTZ) * millisecondsInAMinute;

    // Debug
    //console.log(`[Server (${serverTZ} mins) And Client (${clientTZ} mins)] Offset (milliseconds): ${serverTZOffsetFromClient} ms.`);
    // ===============
    const nowToServerDate = new Date();
    nowToServerDate.setTime(nowToServerDate.getTime() + serverTZOffsetFromClient);

    // Sync up [Server Reset Date] to [Current System's Date (Post-parse to server time zone)].
    // The former can be 1 day behind when, e.g. it's 11pm in GMT+8 (Local Time) but 1am in GMT+10 (Server Time)
    serverResetDate.setDate(nowToServerDate.getDate());
    if (serverResetDate < nowToServerDate)
        serverResetDate.setDate(serverResetDate.getDate() + 1);

    //console.log("Server.", serverResetDate);
    //console.log("Now.", nowToServerDate);
    // ===============
    const diff = serverResetDate - nowToServerDate;
    const diffHours = Math.floor(diff / millisecondsInAnHour);
    const diffMinutes = Math.floor(diff / millisecondsInAMinute) % 60;
    // ===============
    const serverResetDateOnClientTZ = new Date(serverResetDate);
    serverResetDateOnClientTZ.setTime(serverResetDateOnClientTZ.getTime() - serverTZOffsetFromClient);
    // ===============
    return {
        localResetTime: formatTime(serverResetDateOnClientTZ, true),
        timeUntilReset: `${diffHours} hour(s) ${diffMinutes} minute(s)`
    };
}
// ==============================================
function onModifyScheduleEvent(schedule) {
    const timeEvent = new CustomEvent(registerModifiedScheduleEvent, {
        detail: {
            gameID: schedule.gameID,
            title: schedule.title,
            regionName: schedule.regionName,
            notifyTime: schedule.notifyTime,
            alarmFile: schedule.alarmFile
        }
    });
    window.dispatchEvent(timeEvent);
}
// ==============================================