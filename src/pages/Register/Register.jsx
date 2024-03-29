// ==============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';

import { ModeContextGet } from '../../contexts/ModeContext.jsx';
import users from '../../data/users.js';

import './Register.css';

import googleRegister from '../../assets/images/login-methods/google.webp';
import facebookRegister from '../../assets/images/login-methods/facebook.webp';
import lineRegister from '../../assets/images/login-methods/line.webp';
// ==============================================
export default function Register() {
    const modeContext = ModeContextGet();
    const navigate = useNavigate();
    const cachedUsers = useLocalStorage("users", users)[0];

    const onRegister = (email, password, firstName, lastName, image) => {
        // Debug
        //console.log("[Registration] Payload.", action.payload);

        const newUser = {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            image: image,
            tasks: []
        };

        // Debug
        //console.log("[On Register] New User.", newUser);

        const newUsersBatch = [...cachedUsers, newUser];
        localStorage.setItem("users", JSON.stringify(newUsersBatch));

        navigate("/login");
    };

    const pageMode = modeContext.useDarkMode ? "dark" : "light";

    return (
        <Container fluid
            className="d-flex flex-column align-items-center justify-content-start primary-container mb-5"
            style={{ flex: 1 }}
            data-bs-theme={pageMode}>
            <Row className="d-flex flex-column align-items-center justify-content-start mt-5 w-100 rounded">
                <Col className="col-lg-10 col-12 d-flex justify-content-center">
                    <Card className="w-100 secondary-container">
                        <Card.Header className="primary-container-contrast">
                            <p className="fs-2 my-0 text-non-links-primary-contrast">Registration</p>
                        </Card.Header>
                        <Card.Body className="mx-3 mt-3 primary-container rounded">
                            <Row className="secondary-container rounded mx-0 px-0s">
                                <RegisterForm successfulCallback={onRegister} />
                            </Row>
                        </Card.Body>
                        <Card.Body className="d-flex flex-column align-items-center justify-content-start">
                            <p className="text-non-links-primary login-text">Already have an account?</p>
                            <Button onClick={() => navigate("/login")} style={{ maxWidth: "220px", width: "100%" }}>
                                <span className="login-text">Login</span>
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
// ==============================================
function RegisterForm({ successfulCallback }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [isPasswordConfirmationVisible, setPasswordConfirmationVisibility] = useState(false);

    const [doesPasswordMatch, setDoesPasswordMatch] = useState(true);
    const [doesUserExist, setDoesUserExist] = useState(false);

    const [isCorrectImageFormat, setIsCorrectImageFormat] = useState(true);
    const [isCorrectPasswordFormat, setIsCorrectPasswordFormat] = useState(true);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [image, setImage] = useState("");

    const onInputFieldChanged = () => {
        setDoesPasswordMatch(true);
        setDoesUserExist(false);
    }

    const onPasswordVisibilityChanged = () => {
        const newVisibility = !isPasswordVisible;
        setPasswordVisibility(newVisibility);
    };

    const onPasswordConfirmationVisibilityChanged = () => {
        const newVisibility = !isPasswordConfirmationVisible;
        setPasswordConfirmationVisibility(newVisibility);
    };

    function doPasswordsMatch() {
        const match = password === passwordConfirmation;

        setDoesPasswordMatch(match);
        return match;
    }

    function doPasswordsMeetCriteria() {
        const regexUpperLetters = /[A-Z]/;
        const regexLowerLetters = /[a-z]/;
        const regexNumbers = /[0-9]/;
        const regexSymbols = /[^a-zA-z0-9]/;

        const pass = password.length >= 8 & regexUpperLetters.test(password) &
            regexLowerLetters.test(password) & regexNumbers.test(password) &
            regexSymbols.test(password);

        setIsCorrectPasswordFormat(pass);

        return pass;
    }

    function doesEmailAlreadyExist() {
        const existingUser = users.findIndex((user) => user.email === email);
        const hasExistingUser = existingUser !== -1;

        setDoesUserExist(hasExistingUser)
        return hasExistingUser;
    }

    function onNewProfilePictureUploaded(event) {
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

                const isValid = width === height & file.size <= 128000;
                setIsCorrectImageFormat(isValid);
                setImage(url);
            }
            testImg.src = url;
        });
        onInputFieldChanged();
        // ===================================================
    }

    return (
        <>
            <Col className="col-lg-6 col-12 secondary-border"
                style={{ borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px", borderRightWidth: "0px" }}>
                <Form className="m-0 p-0" onSubmit={(event) => {
                    event.preventDefault();

                    if (!doPasswordsMatch() || doesEmailAlreadyExist() || !doPasswordsMeetCriteria())
                        return;

                    if (successfulCallback)
                        successfulCallback(email, password, firstName, lastName, image);
                }}>
                    <Card.Body>
                        <Form.Group className="d-flex flex-column">
                            <Form.Label htmlFor="email" className="text-non-links-primary login-text">Register with Email Address: </Form.Label>
                            {/* ----------------------------- */}
                            {/* Email Form */}
                            <div className="login-form-border rounded mb-2">
                                <Form.Control
                                    required id="email" value={email} autoComplete="on"
                                    className="text-non-links-primary input-bar-no-shadow"
                                    type="email" placeholder="Email"
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        onInputFieldChanged();
                                    }} />
                            </div>
                            {/* User already Exist Error */}
                            {
                                (doesUserExist) ?
                                    (<Form.Label className="login-text text-danger ms-1 mb-3">{`The user with the email ${email} already exists.`}</Form.Label>) :
                                    null
                            }
                            {/* ----------------------------- */}
                            <hr className="horizontal-line-text" />
                            {/* ----------------------------- */}
                            {/* Password Form */}
                            <Form.Label htmlFor="password" className="text-non-links-primary login-text">Password: </Form.Label>
                            <div className="d-flex secondary-container login-form-border rounded m-0 p-0 mb-2">
                                <Form.Control
                                    required id="password" value={password} autoComplete="on"
                                    className="text-non-links-primary input-bar-no-shadow me-1"
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder="Password"
                                    style={{ border: "none" }}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                        onInputFieldChanged();
                                    }} />

                                <Button variant="link" onClick={onPasswordVisibilityChanged}>
                                    <i className={`text-links bi ${isPasswordVisible ? "bi-eye" : "bi-eye-slash"}`}></i>
                                </Button>
                            </div>
                            {/* ----------------------------- */}
                            {/* Password Confirmation Form */}
                            {/* Password Form */}
                            <div className="d-flex secondary-container login-form-border rounded m-0 p-0 mb-2">
                                <Form.Control
                                    required id="password-confirmation" value={passwordConfirmation} autoComplete="on"
                                    className="text-non-links-primary input-bar-no-shadow me-1"
                                    type={isPasswordConfirmationVisible ? "text" : "password"}
                                    placeholder="Confirm your Password"
                                    style={{ border: "none" }}
                                    onChange={(event) => {
                                        setPasswordConfirmation(event.target.value);
                                        onInputFieldChanged();
                                    }} />

                                <Button variant="link" onClick={onPasswordConfirmationVisibilityChanged}>
                                    <i className={`text-links bi ${isPasswordConfirmationVisible ? "bi-eye" : "bi-eye-slash"}`}></i>
                                </Button>
                            </div>

                            {/* Mismatched Password Error */}
                            {
                                (!doesPasswordMatch) ?
                                    (<Form.Label className="login-text text-danger ms-1 mb-3">Both the Password and Password Confirmation fields do not match</Form.Label>) :
                                    null
                            }

                            {/* Password Format */}
                            {
                                (!isCorrectPasswordFormat) ?
                                    (<Form.Label className="login-text text-danger ms-1 mb-3">{`The current password does not meet the criteria.`}</Form.Label>) :
                                    null
                            }
                            {/* ----------------------------- */}
                            <div className="d-flex flex-column secondary-container primary-border rounded mb-2 px-2 py-1">
                                <Form.Text className="text-non-links-primary login-text fw-bold">Requirements for password: </Form.Text>
                                <Form.Text className="text-non-links-primary login-text">1. 8 characters long. </Form.Text>
                                <Form.Text className="text-non-links-primary login-text">2. Must contain 1 symbol, 1 number, 1 lower and 1 uppercase letter. </Form.Text>
                            </div>
                            {/* ----------------------------- */}
                            <hr className="horizontal-line-text" />
                            {/* ----------------------------- */}
                            {/* First Name + Last Name Forms */}
                            <Form.Label htmlFor="first-name" className="text-non-links-primary login-text">Name: </Form.Label>
                            <div className="login-form-border rounded mb-2">
                                <Form.Control
                                    required id="first-name" value={firstName} autoComplete="on"
                                    className="text-non-links-primary input-bar-no-shadow"
                                    type="name" placeholder="First Name"
                                    onChange={(event) => {
                                        setFirstName(event.target.value);
                                        onInputFieldChanged();
                                    }} />
                            </div>
                            {/* ----------------------------- */}
                            {/* Last Name Form */}
                            <div className="login-form-border rounded mb-2">
                                <Form.Control
                                    required id="last-name input-bar-no-shadow" value={lastName} autoComplete="on"
                                    className="text-non-links-primary"
                                    type="name" placeholder="Last Name"
                                    onChange={(event) => {
                                        setLastName(event.target.value);
                                        onInputFieldChanged();
                                    }} />
                            </div>
                            {/* ----------------------------- */}
                            <hr className="horizontal-line-text" />
                            {/* ----------------------------- */}
                            {/* Image (File Upload) */}
                            <Form.Label htmlFor="profile-picture" className="text-non-links-primary login-text">Profile Picture: </Form.Label>
                            <Form.Control id="profile-picture"
                                className={`text-non-links-primary login-text input-bar-no-shadow mb-2 ${isCorrectImageFormat ? "text-secondary" : "text-danger fw-bold"}`}
                                type="file" accept="image/png, image/jpg, image/jpeg, image/webp, image/svg"
                                onChange={onNewProfilePictureUploaded} />
                            {
                                image ? (
                                    <div className="d-flex align-items-center justify-content-center w-100 mb-2">
                                        <Image src={image} className="me-3"
                                            style={{ minWidth: "96px", minHeight: "96px", maxWidth: "128px", maxHeight: "128px", width: "100%", height: "auto" }} />
                                        <Image src={image} className="me-3"
                                            style={{ minWidth: "64px", minHeight: "64px", maxWidth: "96px", maxHeight: "96px", width: "100%", height: "auto" }} />
                                        <Image src={image}
                                            style={{ minWidth: "32px", minHeight: "32x", maxWidth: "64px", maxHeight: "64px", width: "100%", height: "auto" }} />
                                    </div>
                                ) : null
                            }
                            <div className="d-flex flex-column secondary-container primary-border rounded mb-2 px-2 py-1">
                                <Form.Text className="text-non-links-primary login-text fw-bold">Requirements for profile picture setup: </Form.Text>
                                <Form.Text className="text-non-links-primary login-text">1. Must not exceed 128kb. </Form.Text>
                                <Form.Text className="text-non-links-primary login-text">2. Equal Width and Height Dimensions. </Form.Text>
                            </div>

                            {/* Image Format */}
                            {
                                (!isCorrectImageFormat) ?
                                    (<Form.Label className="login-text text-danger ms-1 mb-3">{`The current profile picture does not meet the requirements.`}</Form.Label>) :
                                    null
                            }
                            {/* ----------------------------- */}
                            <hr className="horizontal-line-text" />
                            {/* ----------------------------- */}
                            {/* Submit Button */}
                            <Button type="submit" className="button-primary">Register</Button>
                            {/* ----------------------------- */}
                        </Form.Group>
                    </Card.Body>
                </Form>
                {/* ----------------------------- */}
            </Col>
            <Col className="col-lg-6 col-12 secondary-border d-flex flex-column"
                style={{ borderTopRightRadius: "5px", borderBottomRightRadius: "5px", borderLeftWidth: "1px" }}>
                <Card.Body>
                    <p className="login-text fw-bold text-non-links-primary mx-0 mt-0 mb-3 p-0">Register with other services: </p>
                    <Container fluid className="w-100 m-0 p-0">
                        <Row className="d-flex w-100 m-0 p-0">
                            <Col className="col-sm-6 col-12 mt-0 mb-2 me-auto">
                                {/* Google */}
                                <Button className="d-flex align-items-center justify-content-start login-other-methods-button me-2"
                                    style={{ maxWidth: "200px", width: "100%" }}>
                                    <Image src={googleRegister}
                                        style={{ width: "100%", height: "auto", minWidth: "16px", minHeight: "16px", maxWidth: "16px", maxHeight: "16px" }} />
                                    <span className="login-text mx-auto"> Google</span>
                                </Button>
                            </Col>
                            <Col className="col-sm-6 col-12 mt-0 mb-2 ms-auto">
                                {/* Facebook */}
                                <Button className="d-flex align-items-center justify-content-start login-other-methods-button"
                                    style={{ maxWidth: "200px", width: "100%" }}>
                                    <Image src={lineRegister}
                                        style={{ width: "100%", height: "auto", minWidth: "16px", minHeight: "16px", maxWidth: "16px", maxHeight: "16px" }} />
                                    <span className="login-text mx-auto"> LINE</span>
                                </Button>
                            </Col>
                            <Col className="col-sm-6 col-12 mt-0 mb-2 me-auto">
                                {/* LINE */}
                                <Button className="d-flex align-items-center justify-content-start login-other-methods-button me-2"
                                    style={{ maxWidth: "200px", width: "100%" }}>
                                    <Image src={facebookRegister}
                                        style={{ width: "100%", height: "auto", minWidth: "16px", minHeight: "16px", maxWidth: "16px", maxHeight: "16px" }} />
                                    <span className="login-text mx-auto"> Facebook</span>
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Col>
        </>
    );
}
// ==============================================