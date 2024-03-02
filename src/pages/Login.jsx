import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { ModeContextGet } from '../contexts/ModeContext.jsx';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';

import './Login.css';

export default function Login() {
    // ===========================
    let userObj = localStorage.getItem("user");

    if (userObj !== null && userObj !== undefined)
        userObj = JSON.parse(userObj);
    else {
        userObj = {
            user: null,
            lastLogActivity: null,
            token: null
        };
    }
    // ===========================
    const isLoggedIn = (userObj.user !== null && userObj.user !== undefined);

    const modeContext = ModeContextGet();
    const navigate = useNavigate();

    const handleLogin = (email, password) => {
        let users = localStorage.getItem("users");
        if (users !== null && users !== undefined)
            users = JSON.parse(users);

        const userIndex = users.findIndex((user) => user.email === email && user.password === password);
        let loggedInUserObj = {
            user: null,
            lastLogActivity: null,
            token: null
        };

        if (userIndex !== -1) {
            const user = users[userIndex];
            const date = new Date();

            loggedInUserObj = {
                user: user,
                lastLogActivity: date.toISOString(),
                token: date.toISOString()
            };
        }

        // Debug
        console.log("[User Logged In] User.", loggedInUserObj);

        localStorage.setItem("activeUser", JSON.stringify(loggedInUserObj));
    };
    const user = userObj.user;
    const pageMode = modeContext.useDarkMode ? "dark" : "light";

    return (
        <Container fluid
            className="d-flex flex-column align-items-center justify-content-start primary-container"
            style={{ flex: 1 }}
            data-bs-theme={pageMode}>
            <Row className="d-flex flex-column align-items-center justify-content-start mt-5 w-100 rounded">
                <Col className="col-lg-10 col-12 d-flex justify-content-center">
                    <Card className="w-100 secondary-container">
                        <Card.Header className="primary-container-contrast">
                            <p className="fs-2 my-0 text-non-links-contrast">
                                {`${isLoggedIn ? ("Welcome," + user.lastName + " " + user.firstName) : "Login Page"}`}
                            </p>
                        </Card.Header>
                        <Card.Body className="mt-3 mx-3 primary-container rounded">
                            <Row className="secondary-container rounded mx-0 px-0">
                                <LoginForm user={user} successfulCallback={handleLogin} />
                            </Row>
                        </Card.Body>
                        <Card.Body className="d-flex flex-column align-items-center justify-content-start"
                            style={{ backgroundColor: "transparent" }}>
                            <p className="text-non-links login-text">Don&apos;t have an account?</p>
                            <Button onClick={() => navigate("/register")} style={{ maxWidth: "220px", width: "100%" }}>
                                <span className="login-text">Sign Up</span>
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

function LoginForm({ user, successfulCallback }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [hasLoggedInOnce, setHasLoggedInOnce] = useState(false);

    const handlePasswordVisibility = () => {
        const newVisibility = !isPasswordVisible;
        setPasswordVisibility(newVisibility);
    };

    return (
        <>
            <Col className="col-lg-6 col-12 secondary-border"
                style={{ borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px", borderRightWidth: "0px" }}>
                <Form className="mb-2" onSubmit={(event) => {
                    event.preventDefault();

                    if (successfulCallback)
                        successfulCallback(email, password);

                    setHasLoggedInOnce(true);
                }}>
                    <Card.Body>
                        <Form.Group className="d-flex flex-column">
                            <Form.Label className="text-non-links login-text">Please login with your email and password: </Form.Label>
                            {/* ----------------------------- */}
                            {/* Email Form */}
                            <div className="login-form-border rounded mb-2">
                                <Form.Control
                                    required id="email" value={email}
                                    className="text-non-links"
                                    type="email" placeholder="Enter email here"
                                    onChange={(event) => setEmail(event.target.value)} />
                            </div>
                            {/* ----------------------------- */}
                            {/* Password Form */}
                            <div className="d-flex secondary-container login-form-border rounded m-0 p-0 mb-2">
                                <Form.Control
                                    required id="password" value={password} autoComplete="on"
                                    className="text-non-links me-1"
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
                            {/* Forgot Password */}
                            <Nav.Link as={Link} to={"/forgotPassword"}>
                                <span className="text-links login-text-form-link">
                                    <i className="bi bi-arrow-right-circle"></i> Forgot Your Password? Click here.
                                </span>
                            </Nav.Link>
                            {/* ----------------------------- */}
                        </Form.Group>
                        {
                            (user === null && hasLoggedInOnce) ?
                                (<Form.Text className="login-text text-danger">Invalid Email/Password Combination</Form.Text>) :
                                null
                        }
                    </Card.Body>
                </Form>
            </Col>
            <Col className="col-lg-6 col-12 secondary-border d-flex flex-column"
                style={{ borderTopRightRadius: "5px", borderBottomRightRadius: "5px", borderLeftWidth: "1px" }}>
                <Card.Body>
                    <p className="login-text fw-bold text-non-links mx-0 mt-0 mb-3 p-0">Login with other services: </p>
                    <Container fluid className="w-100 m-0 p-0">
                        <Row className="d-flex w-100 m-0 p-0">
                            <Col className="col-sm-6 col-12 mt-0 mb-2 me-auto">
                                {/* Google */}
                                <Button className="d-flex align-items-center justify-content-start login-other-methods-button me-2"
                                    style={{ maxWidth: "200px", width: "100%" }}>
                                    <Image src={new URL("../assets/login-methods/google.webp", import.meta.url)}
                                        style={{ width: "100%", height: "auto", minWidth: "16px", minHeight: "16px", maxWidth: "16px", maxHeight: "16px" }} />
                                    <span className="login-text mx-auto"> Google</span>
                                </Button>
                            </Col>
                            <Col className="col-sm-6 col-12 mt-0 mb-2 ms-auto">
                                {/* Facebook */}
                                <Button className="d-flex align-items-center justify-content-start login-other-methods-button"
                                    style={{ maxWidth: "200px", width: "100%" }}>
                                    <Image src={new URL("../assets/login-methods/line.webp", import.meta.url)}
                                        style={{ width: "100%", height: "auto", minWidth: "16px", minHeight: "16px", maxWidth: "16px", maxHeight: "16px" }} />
                                    <span className="login-text mx-auto"> LINE</span>
                                </Button>
                            </Col>
                            <Col className="col-sm-6 col-12 mt-0 mb-2 me-auto">
                                {/* LINE */}
                                <Button className="d-flex align-items-center justify-content-start login-other-methods-button me-2"
                                    style={{ maxWidth: "200px", width: "100%" }}>
                                    <Image src={new URL("../assets/login-methods/facebook.webp", import.meta.url)}
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