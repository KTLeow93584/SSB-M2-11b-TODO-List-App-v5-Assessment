// ==============================================
import { useState, useEffect } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
    formatTime, formatDate, formatTimezone,
    timeEventPerSecond, timeEventPerMinute, timeEventPerHour, timeEventPerDay
} from '../data/time.js';
// ==============================================
export default function TimeSection() {
    const now = new Date();

    const [time, setTime] = useState(now);
    const [localDate, setLocalDate] = useState(formatDate(now));
    const [localTime, setLocalTime] = useState(formatTime(now));
    const localTimezone = formatTimezone(now);

    useEffect(() => {
        const timer = setInterval(() => {
            const updatedNowInterval = new Date();
            // ============================================
            onSecondsChanged(updatedNowInterval, time);
            onMinutesChanged(updatedNowInterval, time);
            onHoursChanged(updatedNowInterval, time);
            onDaysChanged(updatedNowInterval, time, () => setLocalDate(formatDate(updatedNowInterval)));
            // ============================================
            setTime(updatedNowInterval);
            setLocalTime(formatTime(updatedNowInterval, false));
        }, 100);

        return (() => {
            if (timer)
                clearInterval(timer);
        });
    });

    return (
        <Row className="mt-3 mb-2">
            <Col className="col-12 d-flex flex-column align-items-center justify-content-center text-center">
                <p className="fs-3 fw-bold m-0 p-0">Your local time: </p>
                <p className="fs-1 fw-bold m-0 p-0">{localTime}</p>
                <p className="fs-5 fw-bold m-0 p-0">{localDate}</p>
                <p className="fs-5 fw-bold m-0 p-0">{localTimezone}</p>
            </Col>
        </Row>
    );
}
// ==============================================
function onSecondsChanged(previousNow, currentNow, onSecondChangedCallback = null) {
    // Unequal seconds (Triggers after every ~1000ms with margin of error being a few milliseconds)
    // Send out a message ("onTimeUpdate") to all listening components.
    if (previousNow.getSeconds() !== currentNow.getSeconds()) {
        // Debug
        //console.log("Diff: " + updatedNowInterval.getSeconds() + ", " + time.getSeconds());

        const timeEvent = new CustomEvent(timeEventPerSecond, {
            time: {
                date: previousNow.getDate(), hour: previousNow.getHours(),
                minute: previousNow.getMinutes(), second: previousNow.getSeconds()
            }
        });
        window.dispatchEvent(timeEvent);

        if (onSecondChangedCallback)
            onSecondChangedCallback();
    }
}

function onMinutesChanged(previousNow, currentNow, onMinuteChangedCallback = null) {
    // Unequal minutes (Triggers after every ~60000ms with margin of error being a few milliseconds)
    // Send out a message ("onTimeUpdate") to all listening components.
    if (previousNow.getMinutes() !== currentNow.getMinutes()) {
        const timeEvent = new CustomEvent(timeEventPerMinute, {
            time: {
                date: previousNow.getDate(), hour: previousNow.getHours(),
                minute: previousNow.getMinutes(), second: previousNow.getSeconds()
            }
        });
        window.dispatchEvent(timeEvent);

        if (onMinuteChangedCallback)
            onMinuteChangedCallback();
    }
}

function onHoursChanged(previousNow, currentNow, onHourChangedCallback = null) {

    // Unequal hours (e.g. 12th of March v.s 13th of March)
    // Update the date.
    if (currentNow.getHours() !== previousNow.getHours()) {
        const timeEvent = new CustomEvent(timeEventPerHour, {
            time: {
                date: currentNow.getDate(), hour: currentNow.getHours(),
                minute: currentNow.getMinutes(), second: currentNow.getSeconds()
            }
        });
        window.dispatchEvent(timeEvent);

        if (onHourChangedCallback)
            onHourChangedCallback();
    }
}

function onDaysChanged(previousNow, currentNow, onDateChangedCallback = null) {
    // Unequal dates (e.g. 12th of March v.s 13th of March)
    // Update the date.
    if (currentNow.getDate() !== previousNow.getDate()) {
        const timeEvent = new CustomEvent(timeEventPerDay, {
            time: {
                date: currentNow.getDate(), hour: currentNow.getHours(),
                minute: currentNow.getMinutes(), second: currentNow.getSeconds()
            }
        });
        window.dispatchEvent(timeEvent);

        if (onDateChangedCallback)
            onDateChangedCallback();
    }
}
// ==============================================