// ==============================================
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// ==============================================
export default function ScheduleAlarmModal({ isVisible, activeAlarms, handleEndAlarm, handleEndAllAlarms }) {
    // =============================
    return (
        <Modal size="xl" show={isVisible} onHide={handleEndAllAlarms}>
            <Modal.Header closeButton className="primary-container">
                <Modal.Title className="text-non-links">Time to do your dailies! [Alarm Notice]</Modal.Title>
            </Modal.Header>

            <Modal.Body className="secondary-container">
                <Row className="w-100">
                    {
                        activeAlarms.map((alarm, index) =>
                            <AlarmGroup key={`alarm-${index}`}
                                alarm={alarm}
                                index={index}
                                handleEndAlarmCallback={handleEndAlarm} />
                        )
                    }
                </Row>
            </Modal.Body>

            <Modal.Footer className="secondary-container">
                <Button variant="primary" onClick={handleEndAllAlarms}>End All Alarms</Button>
            </Modal.Footer>
        </Modal>
    );
}
// ==============================================
function AlarmGroup({ alarm, index, handleEndAlarmCallback }) {
    return (
        <Col className="col-12 d-flex align-items-center mb-3">
            <p className="my-0 ms-0 me-3 p-0">
                <span className="text-non-links fw-bold">{`${index + 1}`}.</span>
                <span> </span>
                <span className="text-non-links fw-bold">{`${alarm.schedule.title}`}</span>
                <span> </span>
                <span className="text-non-links fw-bold">{`${alarm.schedule.regionName}`}</span>
            </p>
            <Button variant="danger" onClick={() => handleEndAlarmCallback(alarm.schedule.gameID)}>
                End Alarm
            </Button>
        </Col >
    );
}
// ==============================================