// ==============================================
import { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faPen } from '@fortawesome/free-solid-svg-icons';

import ClearAllScheduleModal from '../../components/ClearAllScheduleModal.jsx';
import { ActiveUserContextGet } from '../../contexts/ActiveUserContext.jsx';
// ==============================================
export default function Dashboard() {
    // =======================================
    let activeUserContext = ActiveUserContextGet();

    let userObj = activeUserContext.activeUserObj;
    let updateUserProfileInfo = activeUserContext.updateActiveUserProfile;

    let users = localStorage.getItem("users");
    if (users !== null && users !== undefined)
        users = JSON.parse(users);
    // =======================================
    const [isModifyingFirstName, setIsModifyingFirstName] = useState(false);
    const [firstName, setFirstName] = useState(userObj.user.firstName);

    const updateUserInfoFName = () => updateUserProfileInfo("first-name", firstName);
    // ==================
    const [isModifyingLastName, setIsModifyingLastName] = useState(false);
    const [lastName, setLastName] = useState(userObj.user.lastName);

    const updateUserInfoLName = () => updateUserProfileInfo("last-name", lastName);
    // ==================
    const [image, setImage] = useState(userObj.user.image);
    const [isCorrectImageFormat, setIsCorrectImageFormat] = useState(true);

    const updateProfilePicture = (event) => {
        // ===================================================
        const file = event.target.files[0];

        if (!file) {
            setImage(null);
            return;
        }

        // Debug
        //console.log("[On Profile Picture Upload] Size.", file.size);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.addEventListener("load", () => {
            const url = fileReader.result;

            // Test for width and height
            const testImg = new window.Image();
            testImg.onload = () => {
                const width = testImg.width;
                const height = testImg.height;

                // Debug
                //console.log("[On Profile Picture Upload] Width: " + width + ", Height: " + height);

                const isValid = width === height & file.size <= 512000;
                setIsCorrectImageFormat(isValid);

                if (isValid) {
                    setImage(url);
                    updateUserProfileInfo("image", url);
                }
            }
            testImg.src = url;
        });
        // ===================================================
    }
    // =======================================
    const updateClearUserSchedule = () => updateUserProfileInfo("tasks", []);
    // =======================================
    const [isModalVisible, setIsModalVisible] = useState(false);
    // =======================================
    return (
        <>
            <Container fluid className="d-flex flex-column primary-container m-0 p-0" style={{ flex: 1, overflowX: "hidden" }}>
                <Form className="mt-3 mx-3">
                    {/* -------------------------- */}
                    {/* First Name */}
                    <Row className="w-100 mb-3">
                        <Col className="col-12 d-flex align-items-center">
                            <Form.Label className="text-non-link fw-bold me-2 my-0 py-0">First Name: </Form.Label>
                            {
                                isModifyingFirstName ?
                                    (
                                        <Form.Control id="first-name" value={firstName}
                                            className="text-non-links input-bar-no-shadow me-2"
                                            type="name" placeholder="First Name"
                                            style={{ width: "30%" }}
                                            onChange={(event) => setFirstName(event.target.value)} />
                                    ) :
                                    (
                                        <Form.Control id="first-name" disabled value={firstName}
                                            className="text-non-links input-bar-no-shadow me-2"
                                            type="name" placeholder="First Name"
                                            style={{ width: "30%" }}
                                            onChange={(event) => setFirstName(event.target.value)} />
                                    )
                            }
                            {
                                isModifyingFirstName ? (
                                    <Button className="button-primary"
                                        onClick={() => {
                                            setIsModifyingFirstName(!isModifyingFirstName);
                                            updateUserInfoFName();
                                        }}>
                                        <FontAwesomeIcon
                                            className={"text-center text-links-button me-auto"}
                                            icon={faFloppyDisk} />
                                    </Button>
                                ) : (
                                    <Button className="button-primary"
                                        onClick={() => setIsModifyingFirstName(!isModifyingFirstName)}>
                                        <FontAwesomeIcon
                                            className={"text-center text-links-button me-auto"}
                                            icon={faPen} />
                                    </Button>
                                )
                            }
                        </Col>
                    </Row>
                    {/* -------------------------- */}
                    {/* Last Name */}
                    <Row className="w-100 mb-3">
                        <Col className="col-12 d-flex align-items-center">
                            <Form.Label className="text-non-link fw-bold me-2 my-0 py-0">Last Name: </Form.Label>
                            {
                                isModifyingLastName ?
                                    (
                                        <Form.Control id="last-name" value={lastName}
                                            className="text-non-links input-bar-no-shadow me-2"
                                            type="name" placeholder="Last Name"
                                            style={{ width: "30%" }}
                                            onChange={(event) => setLastName(event.target.value)} />
                                    ) :
                                    (
                                        <Form.Control id="last-name" disabled value={lastName}
                                            className="text-non-links input-bar-no-shadow me-2"
                                            type="name" placeholder="Last Name"
                                            style={{ width: "30%" }}
                                            onChange={(event) => setLastName(event.target.value)} />
                                    )
                            }
                            {
                                isModifyingLastName ?
                                    (
                                        <Button className="button-primary"
                                            onClick={() => {
                                                setIsModifyingLastName(!isModifyingLastName);
                                                updateUserInfoLName();
                                            }}>
                                            <FontAwesomeIcon
                                                className={"text-center text-links-button me-auto"}
                                                icon={faFloppyDisk} />
                                        </Button>
                                    ) :
                                    (
                                        <Button className="button-primary"
                                            onClick={() => setIsModifyingLastName(!isModifyingLastName)}>
                                            <FontAwesomeIcon
                                                className={"text-center text-links-button me-auto"}
                                                icon={faPen} />
                                        </Button>
                                    )
                            }
                        </Col>
                    </Row>
                    {/* -------------------------- */}
                    {/* Image (Profile Picture) */}
                    <Row className="w-100 mb-3">
                        <Col className="col-12 d-flex align-items-center mb-3">
                            <Form.Label className="text-non-link fw-bold me-2 my-0 py-0">Profile Picture: </Form.Label>
                            <Form.Control id="profile-picture"
                                className={`text-non-links login-text input-bar-no-shadow mb-2 ${isCorrectImageFormat ? "text-secondary" : "text-danger fw-bold"}`}
                                type="file" accept="image/png, image/jpg, image/jpeg, image/webp, image/svg"
                                style={{ width: "30%" }}
                                onChange={updateProfilePicture} />
                        </Col>
                        {/* ----------------------------- */}
                        {
                            image ? (
                                <Col className="col-12 d-flex align-items-center mb-3">
                                    <Image src={image} className="me-3"
                                        style={{ minWidth: "96px", minHeight: "96px", maxWidth: "128px", maxHeight: "128px", width: "100%", height: "auto" }} />
                                    <Image src={image} className="me-3"
                                        style={{ minWidth: "64px", minHeight: "64px", maxWidth: "96px", maxHeight: "96px", width: "100%", height: "auto" }} />
                                    <Image src={image}
                                        style={{ minWidth: "32px", minHeight: "32x", maxWidth: "64px", maxHeight: "64px", width: "100%", height: "auto" }} />
                                </Col>
                            ) : null
                        }
                        {/* ----------------------------- */}
                        {/* Image Format */}
                        {
                            (!isCorrectImageFormat) ?
                                (<Form.Label className="login-text text-danger">{`The current profile picture does not meet the requirements.`}</Form.Label>) :
                                null
                        }
                        {/* ----------------------------- */}
                        <Col className="col-lg-4 col-md-5 col-sm-8 col-12 d-flex flex-column secondary-container primary-border rounded mb-2 px-2 py-1">
                            <Form.Text className="text-non-links login-text fw-bold">Requirements for profile picture setup: </Form.Text>
                            <Form.Text className="text-non-links login-text">1. Must not exceed 512kb. </Form.Text>
                            <Form.Text className="text-non-links login-text">2. Equal Width and Height Dimensions. </Form.Text>
                        </Col>
                        {/* ----------------------------- */}
                    </Row>
                    {/* -------------------------- */}
                    {/* Image (Profile Picture) */}
                    <Row className="w-100 mb-3">
                        <Col className="col-12">
                            <Button variant="danger" onClick={() => setIsModalVisible(true)}>
                                Clear All My Scheduled Gacha Alarms!
                            </Button>
                        </Col>
                    </Row>
                    {/* -------------------------- */}
                </Form>
            </Container>
            <ClearAllScheduleModal
                isVisible={isModalVisible}
                handleClose={() => setIsModalVisible(false)}
                handleExecute={updateClearUserSchedule} />
        </>
    );
}