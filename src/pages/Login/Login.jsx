import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';

import { login } from '../../feature/activeUser/activeUserSlice.jsx';
import { ModeContextGet } from '../../contexts/ModeContext.jsx';

import { registerCachedScheduleEvent } from '../../data/time.js';
import users from '../../data/users.js';

import './Login.css';

import googleLogin from '../../assets/images/login-methods/google.webp';
import facebookLogin from '../../assets/images/login-methods/facebook.webp';
import lineLogin from '../../assets/images/login-methods/line.webp';
// ==============================================
export default function Login() {
    const cachedUsers = useLocalStorage("users", users)[0];
    // ===========================
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // ===========================
    // Login Process
    const onLogin = (email, password, onProcessSuccessfulCallback = null, onProcessFailedCallback = null) => {
        // =======================
        let loggedInUserObj = {
            user: null,
            lastLogActivity: null,
            token: null
        };

        const userIndex = cachedUsers.findIndex((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
        if (userIndex !== -1) {
            const user = cachedUsers[userIndex];
            const date = new Date();

            loggedInUserObj = {
                user: { email: user.email, firstName: user.firstName, lastName: user.lastName, image: user.image, tasks: user.tasks },
                lastLogActivity: date.toISOString(),
                token: date.toISOString()
            };
        }
        // =======================
        dispatch(login(loggedInUserObj));
        // =======================
        // Dial up the "Register User's Cached Schedules" Event from "App.jsx".
        const timeEvent = new CustomEvent(registerCachedScheduleEvent);
        window.dispatchEvent(timeEvent);
        // =======================
        // Debug
        //console.log("On Successfully Logged In", loggedInUserObj);
        // =======================
        if (onProcessSuccessfulCallback)
            onProcessSuccessfulCallback(loggedInUserObj);

        // On Successful Login Process
        if (loggedInUserObj.user !== null) {
            if (onProcessSuccessfulCallback)
                onProcessSuccessfulCallback(loggedInUserObj);
            navigate("/");
        }
        // On Failed Login Process
        else {
            if (onProcessFailedCallback)
                onProcessFailedCallback(true);
        }
        // =======================
    };
    // ===========================
    const modeContext = ModeContextGet();
    const pageMode = modeContext.useDarkMode ? "dark" : "light";
    // ===========================
    return (
        <Container fluid
            className="d-flex flex-column align-items-center justify-content-start primary-container"
            style={{ flex: 1 }}
            data-bs-theme={pageMode}>
            <Row className="d-flex flex-column align-items-center justify-content-start mt-5 w-100 rounded">
                <Col className="col-lg-10 col-12 d-flex justify-content-center">
                    <Card className="w-100 secondary-container">
                        {/* ---------------------- */}
                        {/* Card Title/Header */}
                        <Card.Header className="primary-container-contrast">
                            <p className="fs-2 my-0 text-non-links-primary-contrast">
                                Login Page
                            </p>
                        </Card.Header>
                        {/* ---------------------- */}
                        {/* Card Body (Email/Password) */}
                        <Card.Body className="mt-3 mx-3 primary-container rounded">
                            <Row className="secondary-container rounded mx-0 px-0">
                                <LoginForm onLoginCallback={onLogin} />
                            </Row>
                        </Card.Body>
                        {/* ---------------------- */}
                        {/* Card Body (To Registration Page) */}
                        <Card.Body className="d-flex flex-column align-items-center justify-content-start"
                            style={{ backgroundColor: "transparent" }}>
                            <p className="text-non-links-primary login-text">Don&apos;t have an account?</p>
                            <Button onClick={() => navigate("/register")} style={{ maxWidth: "220px", width: "100%" }}>
                                <span className="login-text">Sign Up</span>
                            </Button>
                        </Card.Body>
                        {/* ---------------------- */}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

function LoginForm({ onLoginCallback }) {
    // ===========================
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [invalidUser, setInvalidUser] = useState(false);

    const handlePasswordVisibility = () => {
        const newVisibility = !isPasswordVisible;
        setPasswordVisibility(newVisibility);
    };
    // ===========================
    const startingInputRef = useRef();
    useEffect(() => {
        startingInputRef.current.focus();
    }, []);
    // ===========================
    return (
        <>
            <Col className="col-lg-6 col-12 secondary-border"
                style={{ borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px", borderRightWidth: "0px" }}>
                <Form className="mb-2" onSubmit={(event) => {
                    event.preventDefault();

                    if (onLoginCallback)
                        onLoginCallback(email, password, null, (state) => setInvalidUser(state));
                }}>
                    <Card.Body>
                        <Form.Group className="d-flex flex-column">
                            <Form.Label htmlFor="email" className="text-non-links-primary login-text">Please login with your email and password: </Form.Label>
                            {/* ----------------------------- */}
                            {/* Email Form */}
                            <div className="login-form-border rounded mb-2">
                                <Form.Control
                                    ref={startingInputRef}
                                    required id="email" value={email} autoComplete="on"
                                    className="text-non-links-primary input-bar-no-shadow"
                                    type="email" placeholder="Enter email here"
                                    onChange={(event) => setEmail(event.target.value)} />
                            </div>
                            {/* ----------------------------- */}
                            {/* Password Form */}
                            <div className="d-flex secondary-container login-form-border rounded m-0 p-0 mb-2">
                                <Form.Control
                                    required id="password" value={password} autoComplete="on"
                                    className="text-non-links-primary input-bar-no-shadow me-1"
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder="Enter password here"
                                    style={{ border: "none" }}
                                    onChange={(event) => setPassword(event.target.value)} />

                                <Button variant="link" onClick={handlePasswordVisibility}>
                                    <i className={`text-links bi ${isPasswordVisible ? "bi-eye" : "bi-eye-slash"}`}></i>
                                </Button>
                            </div>
                            {/* ----------------------------- */}
                            {/* Submit */}
                            <Button type="submit" className="button-primary mb-1">Login</Button>
                            {/* ----------------------------- */}
                            {/* Forgot Password (Intended to be missing to show error page) */}
                            <Nav.Link as={Link} to={"/forgotPassword"}>
                                <span className="text-links login-text-form-link">
                                    <i className="bi bi-arrow-right-circle"></i> Forgot Your Password? Click here.
                                </span>
                            </Nav.Link>
                            {/* ----------------------------- */}
                        </Form.Group>
                        {
                            invalidUser ?
                                (<Form.Text className="login-text text-danger">Invalid Email/Password Combination</Form.Text>) :
                                null
                        }
                    </Card.Body>
                </Form>
            </Col>
            <Col className="col-lg-6 col-12 secondary-border d-flex flex-column"
                style={{ borderTopRightRadius: "5px", borderBottomRightRadius: "5px", borderLeftWidth: "1px" }}>
                <Card.Body>
                    <p className="login-text fw-bold text-non-links-primary mx-0 mt-0 mb-3 p-0">Login with other services: </p>
                    <Container fluid className="w-100 m-0 p-0">
                        <Row className="d-flex w-100 m-0 p-0">
                            <Col className="col-sm-6 col-12 mt-0 mb-2 me-auto">
                                {/* Google */}
                                <Button className="d-flex align-items-center justify-content-start login-other-methods-button me-2"
                                    style={{ maxWidth: "200px", width: "100%" }}>
                                    <Image src={googleLogin}
                                        style={{ width: "100%", height: "auto", minWidth: "16px", minHeight: "16px", maxWidth: "16px", maxHeight: "16px" }} />
                                    <span className="login-text mx-auto"> Google</span>
                                </Button>
                            </Col>
                            <Col className="col-sm-6 col-12 mt-0 mb-2 ms-auto">
                                {/* Facebook */}
                                <Button className="d-flex align-items-center justify-content-start login-other-methods-button"
                                    style={{ maxWidth: "200px", width: "100%" }}>
                                    <Image src={lineLogin}
                                        style={{ width: "100%", height: "auto", minWidth: "16px", minHeight: "16px", maxWidth: "16px", maxHeight: "16px" }} />
                                    <span className="login-text mx-auto"> LINE</span>
                                </Button>
                            </Col>
                            <Col className="col-sm-6 col-12 mt-0 mb-2 me-auto">
                                {/* LINE */}
                                <Button className="d-flex align-items-center justify-content-start login-other-methods-button me-2"
                                    style={{ maxWidth: "200px", width: "100%" }}>
                                    <Image src={facebookLogin}
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