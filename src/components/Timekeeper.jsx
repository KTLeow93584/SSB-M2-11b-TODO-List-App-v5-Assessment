// ==============================================
import { useState, useEffect } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { formatTime, formatDate, formatTimezone } from '../data/time.js';
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

            if (updatedNowInterval.getDate() !== time.getDate()) {
                setTime(updatedNowInterval);
                setLocalDate(formatDate(updatedNowInterval));
            }

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