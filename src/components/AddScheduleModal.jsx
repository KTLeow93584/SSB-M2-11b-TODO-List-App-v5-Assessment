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

import { createTask } from '../feature/tasks/tasksSlice.jsx';
import { ActiveUserContextGet } from '../contexts/ActiveUserContext.jsx';

import gameInfo from '../data/gameInfo.js';
import { formatTime, millisecondsInAMinute, millisecondsInAnHour, registerNewScheduleEvent } from '../data/time.js';
// ==============================================
export default function AddScheduleModal({ isVisible, handleClose, initialGame = null, initialRegion = null }) {
    const userContext = ActiveUserContextGet();
    const user = userContext.activeUserObj.user;

    const [selectedGame, setSelectedGame] = useState({
        id: gameInfo[0].id,
        title: gameInfo[0].title,
        supportedRegions: gameInfo[0].supportedRegions
    });

    useEffect(() => {
        setSelectedGame({ id: initialGame.id, title: initialGame.title, supportedRegions: initialGame.supportedRegions });
    }, [initialGame]);

    const [selectedRegion, setSelectedRegion] = useState(() =>
        reformatRegionData(initialGame ? initialGame : gameInfo[0],
            initialRegion ? initialRegion : selectedGame.supportedRegions[0])
    );

    useEffect(() => {
        setSelectedRegion(() => reformatRegionData(initialGame, initialRegion));
    }, [initialGame, initialRegion]);

    const [description, setDescription] = useState("");
    const [alarmFile, setAlarmFile] = useState(null);
    const [notifyTime, setNotifyTime] = useState("12:00");
    // =============================
    const mappedGameEntries = gameInfo.map((game) => ({
        id: game.id,
        title: game.title,
        supportedRegions: game.supportedRegions
    }));
    // =============================
    const handleSelectGameID = (gameIDKey) => {
        const gameIndex = mappedGameEntries.findIndex((game) => game.id === gameIDKey);

        setSelectedGame(mappedGameEntries[gameIndex]);
        setSelectedRegion(reformatRegionData(mappedGameEntries[gameIndex], mappedGameEntries[gameIndex].supportedRegions[0]));
    };

    const handleSelectRegion = (regionNameKey) => {
        const regionIndex = selectedGame.supportedRegions.findIndex((region) => region.name === regionNameKey);

        setSelectedRegion(reformatRegionData(selectedGame, selectedGame.supportedRegions[regionIndex]));
    };

    const handleAlarmFileUpload = (event) => {
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

    const dispatch = useDispatch();
    const handleSubmitNewSchedule = (event) => {
        // ===============================
        event.preventDefault();

        const newSchedule = {
            id: new Date().toISOString(),
            gameID: selectedGame.id,
            title: selectedGame.title,
            regionName: selectedRegion.name,
            alarmFile: alarmFile,
            notifyTime: notifyTime,
            description: description
        };

        // Debug
        //console.log("[New Schedule] Create.", newSchedule);

        onRegisterScheduleEvent(newSchedule);

        dispatch(createTask(newSchedule));
        // ===============================
        userContext.updateActiveUserProfile("tasks", [...user.tasks, newSchedule]);
        // ===============================
        handleClose();
    };
    // =============================
    return (
        <Modal size="xl" show={isVisible} onHide={handleClose}>
            <Modal.Header closeButton className="primary-container">
                <Modal.Title>Create a new game notification schedule</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmitNewSchedule}>
                <Modal.Body className="secondary-container">
                    <Form.Group>
                        {/* ----------------------------- */}
                        {/* Game ID */}
                        <Row className="d-flex align-items-center mb-3">
                            <Col className="col-3">
                                <Form.Label className="text-non-links">Game: </Form.Label>
                            </Col>
                            <Col className="col-9 mx-auto">
                                <Dropdown onSelect={handleSelectGameID} key={selectedGame.id}>
                                    <Dropdown.Toggle id="game-id-dropdown">
                                        {selectedGame.title}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {
                                            mappedGameEntries.map((gameEntry, index) => {
                                                return (
                                                    <Dropdown.Item key={`game-id-dropdown-element-${index}`}
                                                        eventKey={gameEntry.id}
                                                        active={selectedGame.id === gameEntry.id}>
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
                                <Dropdown onSelect={handleSelectRegion}>
                                    <Dropdown.Toggle id="game-region-id-dropdown">
                                        {selectedRegion.name}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {
                                            selectedGame.supportedRegions.map((region, index) => {
                                                return (
                                                    <Dropdown.Item key={`game-id-dropdown-element-${index}`}
                                                        eventKey={region.name}
                                                        active={selectedRegion.name === region.name}>
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
                                <Form.Text>{`Local Reset Time: ${selectedRegion.localResetTime}.`}</Form.Text>
                                <Form.Text>{`Time Until Next Reset: ${selectedRegion.timeUntilReset}.`}</Form.Text>
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
                                    onChange={(event) => handleAlarmFileUpload(event)} />
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
                    <Button type="submit" variant="primary">Add</Button>
                    <Button variant="danger" onClick={handleClose}>Discard</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
// ==============================================
function formatServerRegionTimeDisplay(game, now, hours, minutes, timezoneHours, timezoneMinutes) {
    // ===============
    // Debug
    //console.log("--------" + game + "----------");
    //console.log(`[Parameters] Hour: ${hours}, Minute: ${minutes}, TZ Hour: ${timezoneHours}, TZ Minute: ${timezoneMinutes}`);

    const serverResetDate = new Date();
    serverResetDate.setHours(hours, minutes);

    // Debug
    //console.log(`[Server] Date Post-Adjustment:[` +
    //`${serverResetDate.getHours().toString().padStart(2, "0") + ":" + serverResetDate.getMinutes().toString().padStart(2, "0")}]`);
    // ===============
    if (serverResetDate < now)
        serverResetDate.setDate(serverResetDate.getDate() + 1);

    const serverTZ = (timezoneHours * 60 + timezoneMinutes);
    const clientTZ = now.getTimezoneOffset() * -1;
    const serverTZOffsetFromClient = (serverTZ - clientTZ) * millisecondsInAMinute;

    // Debug
    // console.log(`[Server (${serverTZ} mins) And Client (${clientTZ} mins)] Offset (milliseconds): ${serverTZOffsetFromClient} ms.`);
    // ===============
    const nowToServerDate = new Date()
    nowToServerDate.setTime(now.getTime() + serverTZOffsetFromClient);
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
        timeUntilReset: `${diffHours} hours ${diffMinutes} minutes`
    };
}
// ==============================================
function reformatRegionData(game, region) {
    const { localResetTime, timeUntilReset } = formatServerRegionTimeDisplay(game, new Date(),
        region.serverResetHour, region.serverResetMinute,
        region.timezoneOffsetHours, region.timezoneOffsetMinutes);

    return {
        name: region.name,
        serverResetHour: region.serverResetHour,
        serverResetMinute: region.serverResetMinute,
        timezoneOffsetHours: region.timezoneOffsetHours,
        timezoneOffsetMinutes: region.timezoneOffsetMinutes,
        localResetTime,
        timeUntilReset
    }
}
// ==============================================
function onRegisterScheduleEvent(schedule) {
    const timeEvent = new CustomEvent(registerNewScheduleEvent, {
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