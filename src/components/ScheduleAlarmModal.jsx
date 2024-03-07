// ==============================================
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// ==============================================
export default function ScheduleAlarmModal({ isVisible, activeAlarms, onEndIndividualAlarm, onEndAllAlarms }) {
    // =============================
    return (
        <Modal size="xl" show={isVisible} onHide={onEndAllAlarms} centered>
            <Modal.Header closeButton className="primary-container">
                <Modal.Title className="text-non-links-primary"> Time to do your dailies![Alarm Notice]</Modal.Title>
            </Modal.Header>

            <Modal.Body className="secondary-container">
                <Row className="w-100">
                    {
                        activeAlarms.map((alarm, index) =>
                            <AlarmGroup key={`alarm-${index}`}
                                alarm={alarm}
                                index={index}
                                onEndIndividualAlarmCallback={onEndIndividualAlarm} />
                        )
                    }
                </Row>
            </Modal.Body>

            <Modal.Footer className="secondary-container">
                <Button variant="primary" onClick={onEndAllAlarms}>End All Alarms</Button>
            </Modal.Footer>
        </Modal>
    );
}
// ==============================================
function AlarmGroup({ alarm, index, onEndIndividualAlarmCallback }) {
    return (
        <Col className="col-12 d-flex align-items-center">
            <p className="my-0 ms-0 me-3 p-0">
                <span className="text-non-links-primary fw-bold">{`${index + 1}`}.</span>
                <span> </span>
                <span className="text-non-links-primary fw-bold">{`${alarm.schedule.title}`}</span>
                <span> </span>
                <span className="text-non-links-primary fw-bold">{`${alarm.schedule.regionName}`}</span>
            </p>
            <Button variant="danger" onClick={() => onEndIndividualAlarmCallback(alarm.schedule.gameID)}>
                End Alarm
            </Button>
        </Col >
    );
}
// ==============================================