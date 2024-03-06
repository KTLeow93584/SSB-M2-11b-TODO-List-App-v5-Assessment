// ==============================================
import { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

import './GameList.css';

import Timekeeper from '../../components/Timekeeper.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import AddScheduleModal from '../../components/AddScheduleModal.jsx';
import ModifyScheduleModal from '../../components/ModifyScheduleModal.jsx';

import { ActiveUserContextGet } from '../../contexts/ActiveUserContext.jsx';

import gameInfo from '../../data/gameInfo.js';
import {
    formatTime, formatTimezoneSimpleParseH,
    millisecondsInAMinute, millisecondsInAnHour,
    timeEventPerMinute
} from '../../data/time.js';
// ==============================================
export default function GameList() {
    // ===========================
    let activeUserContext = ActiveUserContextGet();
    const user = activeUserContext.activeUserObj ? activeUserContext.activeUserObj.user : null;
    // ===========================
    const [createNewSchedule, setCreateNewSchedule] = useState(false);
    const handleHideNewScheduleModal = () => setCreateNewSchedule(false);

    const [modifyExistingSchedule, setModifyExistingSchedule] = useState(false);
    const [schedule, setSchedule] = useState(null);
    const handleHideModifyScheduleModal = () => setModifyExistingSchedule(false);
    const handleShowModifyScheduleModal = (scheduleIndex) => {
        setSchedule(user.tasks[scheduleIndex]);
        setModifyExistingSchedule(true);
    };
    // ===========================
    const [targetGameName, setTargetGameName] = useState("");

    const [selectedGame, setSelectedGame] = useState(gameInfo[0]);
    const [selectedGameRegion, setSelectedGameRegion] = useState(gameInfo[0].supportedRegions[0]);

    return (
        <>
            <Container fluid className="d-flex flex-column primary-container" style={{ flex: 1, overflowX: "hidden" }}>
                <Timekeeper />
                <hr className="horizontal-line-text" />
                <SearchBar id="query-item-name"
                    placeholder="Filter by Game Name"
                    minWidth={30}
                    searchFilterCallback={(keyword) => setTargetGameName(keyword)} />
                <Row className="w-100">
                    <Games
                        user={user}
                        filteredGameName={targetGameName}
                        setSelectedGameCallback={setSelectedGame}
                        setSelectedGameRegionCallback={setSelectedGameRegion}
                        onCreateScheduleCallback={() => setCreateNewSchedule(true)}
                        setScheduleCallback={handleShowModifyScheduleModal} />
                </Row>
            </Container>
            <AddScheduleModal
                isVisible={createNewSchedule}
                handleClose={handleHideNewScheduleModal}
                initialGame={selectedGame}
                initialRegion={selectedGameRegion} />
            <ModifyScheduleModal
                isVisible={modifyExistingSchedule}
                handleClose={handleHideModifyScheduleModal}
                schedule={schedule}
                scheduleGameData={selectedGame}
                scheduleRegionData={selectedGameRegion} />
        </>
    );
}

function Games({ user, filteredGameName,
    setSelectedGameCallback = null, setSelectedGameRegionCallback = null, onCreateScheduleCallback = null,
    setScheduleCallback = null }) {
    return gameInfo.map((game, gameIndex) => {
        return (filteredGameName !== null && filteredGameName !== undefined && filteredGameName.trim().length > 0) &&
            !game.title.toLowerCase().includes(filteredGameName.toLowerCase()) ? null : (
            <GameRegions key={`game-${gameIndex}`}
                user={user} game={game} gameIndex={gameIndex}
                setSelectedGameCallback={setSelectedGameCallback}
                setSelectedGameRegionCallback={setSelectedGameRegionCallback}
                onCreateScheduleCallback={onCreateScheduleCallback}
                setScheduleCallback={setScheduleCallback} />
        )
    });
}

function GameRegions({ user, game, gameIndex,
    setSelectedGameCallback = null, setSelectedGameRegionCallback = null, onCreateScheduleCallback = null,
    setScheduleCallback = null }) {
    return game.supportedRegions.map((region, regionIndex) =>
        <GameRegion key={`game-${gameIndex}-region-${regionIndex}`}
            user={user}
            game={game} region={region}
            setSelectedGameCallback={setSelectedGameCallback}
            setSelectedGameRegionCallback={setSelectedGameRegionCallback}
            onCreateScheduleCallback={onCreateScheduleCallback}
            setScheduleCallback={setScheduleCallback} />
    );
}

function GameRegion({ user, game, region,
    setSelectedGameCallback = null, setSelectedGameRegionCallback = null, onCreateScheduleCallback = null,
    setScheduleCallback = null }) {
    const [timeData, setTimeData] = useState(reassignTimeData());

    function reassignTimeData() {
        return formatServerRegionTimeDisplay(`${game.title} [${region.name}]`, new Date(),
            region.serverResetHour, region.serverResetMinute, region.timezoneOffsetHours, region.timezoneOffsetMinutes)
    }
    // ===========================
    useEffect(() => {
        const callbackPerMinute = () => setTimeData(reassignTimeData());
        window.addEventListener(timeEventPerMinute, callbackPerMinute);

        return (() => window.removeEventListener(timeEventPerMinute, callbackPerMinute));
    });
    // ===========================
    return (
        <Col className="col-md-6 col-xxl-4 col-12 mx-auto mb-3">
            <Card className="secondary-container shadow-sm">
                <Card.Header className="d-flex align-items-center justify-content-between">
                    <Image src={new URL(`../../assets/game-icons/${game.icon}`, import.meta.url)}
                        className="rounded me-2"
                        style={{ minWidth: "32px", minHeight: "32px", maxWidth: "32px", maxHeight: "32px", width: "100%", height: "auto" }} />
                    <span className="fs-4 text-non-links">{game.title}</span>
                    <span className="fs-6 text-non-links ms-auto">{region.name}</span>
                </Card.Header>
                <Card.Body>
                    <Row className="w-100">
                        <Col className="col-6">
                            <Card.Text className="fs-6 text-non-links fw-bold my-0">Local Reset Time:</Card.Text>
                            <Card.Text className="fs-6 text-non-links">
                                {timeData.localResetTime}
                            </Card.Text>
                            <Card.Text className="fs-6 text-non-links fw-bold my-0">Time Until Reset:</Card.Text>
                            <Card.Text className="fs-6 text-non-links">
                                {timeData.timeUntilReset}
                            </Card.Text>
                        </Col>
                        <Col className="col-6">
                            <Card.Text className="fs-6 text-non-links fw-bold my-0">Server Reset Time:</Card.Text>
                            <Card.Text className="fs-6 text-non-links">
                                {timeData.serverResetTime}
                            </Card.Text>
                            <Card.Text className="fs-6 text-non-links fw-bold my-0">Current Server Time:</Card.Text>
                            <Card.Text className="fs-6 text-non-links">
                                {timeData.currentServerTime}
                            </Card.Text>
                        </Col>
                    </Row>
                </Card.Body>
                <RegisterSchedule game={game} region={region} user={user}
                    setSelectedGameCallback={setSelectedGameCallback}
                    setSelectedGameRegionCallback={setSelectedGameRegionCallback}
                    onCreateScheduleCallback={onCreateScheduleCallback}
                    setScheduleCallback={setScheduleCallback} />
            </Card>
        </Col>
    );
}
// ==============================================
function RegisterSchedule({ game, region, user,
    setSelectedGameCallback = null, setSelectedGameRegionCallback = null, onCreateScheduleCallback = null,
    setScheduleCallback = null }) {
    let result = null;

    if (user) {
        const scheduleIndex = user.tasks.findIndex((schedule) => schedule.gameID === game.id && schedule.gameRegionName === region.name);

        if (scheduleIndex !== -1) {
            result = (
                <Card.Body>
                    <Row className="w-100 d-flex justify-content-center">
                        <Button
                            onClick={() => {
                                if (setSelectedGameCallback)
                                    setSelectedGameCallback(game);
                                if (setSelectedGameRegionCallback)
                                    setSelectedGameRegionCallback(region);

                                if (setScheduleCallback)
                                    setScheduleCallback(scheduleIndex);
                            }}
                            className="btn-secondary primary-border">
                            Modify Existing Game Schedule
                        </Button>
                    </Row>
                </Card.Body>
            )
        }
        else {
            result = (
                <Card.Body>
                    <Row className="w-100 d-flex justify-content-center">
                        <Button
                            onClick={() => {
                                if (setSelectedGameCallback)
                                    setSelectedGameCallback(game);
                                if (setSelectedGameRegionCallback)
                                    setSelectedGameRegionCallback(region);

                                if (onCreateScheduleCallback)
                                    onCreateScheduleCallback(true);
                            }}
                            className="primary-container-contrast add-schedule-button primary-border">
                            Add to Schedule
                        </Button>
                    </Row>
                </Card.Body>
            );
        }
    }
    return result;
}
// ==============================================
function formatServerRegionTimeDisplay(gameName, now, hours, minutes, timezoneHours, timezoneMinutes) {
    // ===============
    // Debug
    //console.log("--------" + gameName + "----------");
    //console.log(`[Parameters] Hour: ${hours}, Minute: ${minutes}, TZ Hour: ${timezoneHours}, TZ Minute: ${timezoneMinutes}`);

    // Debug
    //console.log(`[Server] Date Post-Adjustment:[` +
    //`${serverResetDate.getHours().toString().padStart(2, "0") + ":" + serverResetDate.getMinutes().toString().padStart(2, "0")}]`);
    // ===============
    const serverTZ = (timezoneHours * 60 + timezoneMinutes);
    const clientTZ = now.getTimezoneOffset() * -1;
    const serverTZOffsetFromClient = (serverTZ - clientTZ) * millisecondsInAMinute;

    // Debug
    // console.log(`[Server (${serverTZ} mins) And Client (${clientTZ} mins)] Offset (milliseconds): ${serverTZOffsetFromClient} ms.`);
    // ===============
    const serverResetDate = new Date();
    serverResetDate.setHours(hours, minutes);

    const nowToServerDate = new Date();
    nowToServerDate.setTime(now.getTime() + serverTZOffsetFromClient);

    // Sync up [Server Reset Date] to [Current System's Date (Post-parse to server time zone)].
    // The former can be 1 day behind when, e.g. it's 11pm in GMT+8 (Local Time) but 1am in GMT+10 (Server Time)
    serverResetDate.setDate(nowToServerDate.getDate());

    // If after sync and the [Server Reset Date] is still behind [Current System's Date] (Post-parse to server time zone).
    // Add 1 to move it up to the next day. E.g. it's 1am in GMT+10 (Server Time) but server reset was 12am in GMT+10 (Server Time).
    if (serverResetDate < nowToServerDate)
        serverResetDate.setDate(serverResetDate.getDate() + 1);
    // ===============
    const diff = serverResetDate - nowToServerDate;
    const diffHours = Math.floor(diff / millisecondsInAnHour);
    const diffMinutes = Math.floor(diff / millisecondsInAMinute) % 60;
    // ===============
    const serverResetDateOnClientTZ = new Date(serverResetDate);
    serverResetDateOnClientTZ.setTime(serverResetDateOnClientTZ.getTime() - serverTZOffsetFromClient);
    // ===============
    const timezoneDisplay = formatTimezoneSimpleParseH(timezoneHours);
    // ===============
    return {
        localResetTime: formatTime(serverResetDateOnClientTZ, true),
        timeUntilReset: `${diffHours} hours ${diffMinutes} minutes`,
        serverResetTime: formatTime(serverResetDate, true) + " " + timezoneDisplay,
        currentServerTime: formatTime(nowToServerDate, true) + " " + timezoneDisplay
    };
}
// ==============================================