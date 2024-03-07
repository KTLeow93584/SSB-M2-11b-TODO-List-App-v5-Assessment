// ==============================================
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// ==============================================
export default function ClearAllScheduleModal({ isVisible, handleClose, handleExecute }) {
    const handleClearAllSchedule = () => {
        handleExecute();
        handleClose();
    };

    return (
        <Modal size="md" show={isVisible} onHide={handleClose} className="d-flex flex-column align-items-center justify-content-center">
            <Modal.Header closeButton className="primary-container">
                <Modal.Title className="fs-5 text-non-links-primary">Are you sure to delete all your scheduled alarms? (This action is irreversible)</Modal.Title>
            </Modal.Header>

            <Modal.Body className="secondary-container d-flex justify-content-evenly">
                <Button variant="danger"
                    style={{ width: "20%" }}
                    onClick={handleClearAllSchedule}>
                    Yes
                </Button>
                <Button variant="primary"
                    style={{ width: "20%" }}
                    onClick={handleClose}>
                    No
                </Button>
            </Modal.Body>
        </Modal>
    );
}
// ==============================================