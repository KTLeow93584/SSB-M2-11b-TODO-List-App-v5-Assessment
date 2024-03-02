// ==============================================
import { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

import './GameList.css';

import Timekeeper from '../components/Timekeeper.jsx';
import SearchBar from '../components/SearchBar.jsx';

import gameInfo from '../data/gameInfo.js';
import { formatTime, formatTimezoneSimpleParseH } from '../data/time.js';
// ==============================================
const millisecondsInAMinute = 1000 * 60;
const millisecondsInAnHour = millisecondsInAMinute * 60;
// ==============================================
export default function GameList() {
    const now = new Date();
    const [targetGameName, setTargetGameName] = useState("");

    function renderGames() {
        return gameInfo.map((game, gameIndex) => renderGameRegion(game, gameIndex));
    }

    function renderGameRegion(game, gameIndex) {
        if ((targetGameName !== null && targetGameName !== undefined && targetGameName.trim().length > 0) &&
            !game.title.toLowerCase().includes(targetGameName.toLowerCase()))
            return null;

        return game.supportedRegions.map((region, regionIndex) => {
            const timeData = formatServerRegionTimeDisplay(`${game.title} [${region.name}]`, now,
                region.serverResetHour, region.serverResetMinute, region.timezoneOffsetHours, region.timezoneOffsetMinutes);

            return (
                <Col key={`game-${gameIndex}-region-${regionIndex} `} className="col-md-6 col-xxl-4 col-12 mx-auto mb-3">
                    <Card className="secondary-container shadow-sm">
                        <Card.Header className="d-flex align-items-center justify-content-between">
                            <Image src={new URL(`../assets/game-icons/${game.icon}`, import.meta.url)}
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
                        <Card.Body>
                            <Row className="w-100 d-flex justify-content-center">
                                <Button className="primary-container-contrast add-schedule-button primary-border">
                                    Add to Schedule
                                </Button>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            );
        });
    }

    return (
        <Container fluid className="d-flex flex-column primary-container" style={{ flex: 1 }}>
            <Timekeeper />
            <hr className="horizontal-line-text" />
            <SearchBar id="query-item-name"
                placeholder="Filter by Game Name"
                minWidth={30}
                searchFilterCallback={(keyword) => setTargetGameName(keyword)} />
            <Row className="w-100">
                {renderGames()}
            </Row>
        </Container >
    );
}

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
    const timezoneDisplay = formatTimezoneSimpleParseH(timezoneHours);
    // ===============
    return {
        localResetTime: formatTime(serverResetDateOnClientTZ, true),
        timeUntilReset: `${diffHours} hours ${diffMinutes} minutes`,
        serverResetTime: formatTime(serverResetDate, true) + " " + timezoneDisplay,
        currentServerTime: formatTime(nowToServerDate, true) + " " + timezoneDisplay
    };
}