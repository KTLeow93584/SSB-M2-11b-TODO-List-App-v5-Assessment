// ==============================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import Image from 'react-bootstrap/Image';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { ModeContextGet } from '../contexts/ModeContext.jsx';

import './NavigationPanel.css';
// ==============================================
function adjustGlobalCSSProperties({ useDarkMode }) {
    document.documentElement.style.setProperty("--core-bg-primary-color", useDarkMode ? "#1e1e1e" : "#eeeeee");
    document.documentElement.style.setProperty("--core-bg-primary-contrast-color", useDarkMode ? "#eeeeee" : "#1e1e1e");

    document.documentElement.style.setProperty("--core-bg-secondary-color", useDarkMode ? "#212121" : "white");
    document.documentElement.style.setProperty("--core-bg-secondary-contrast-color", useDarkMode ? "white" : "#212121");

    document.documentElement.style.setProperty("--core-bg-tertiary-color", useDarkMode ? "#322646" : "#7e56c1");
    document.documentElement.style.setProperty("--core-bg-tertiary-contrast-color", useDarkMode ? "#7e56c1" : "#322646");

    document.documentElement.style.setProperty("--core-bg-container-contrast-color", useDarkMode ? "#b7b5b9" : "#2f2e30");

    document.documentElement.style.setProperty("--core-text-non-links-color", useDarkMode ? "white" : "black");
    document.documentElement.style.setProperty("--core-text-non-links-contrast-color", useDarkMode ? "black" : "white");

    document.documentElement.style.setProperty("--core-text-links-color", useDarkMode ? "white" : "black");
    document.documentElement.style.setProperty("--core-text-links-contrast-color", useDarkMode ? "black" : "white");

    document.documentElement.style.setProperty("--core-text-button-color", useDarkMode ? "white" : "black");
    document.documentElement.style.setProperty("--core-text-button-contrast-color", useDarkMode ? "black" : "white");

    document.documentElement.style.setProperty("--core-border-primary-color", useDarkMode ? "#f4f4f4" : "#1f1f1f");
    document.documentElement.style.setProperty("--core-border-secondary-color", useDarkMode ? "#7e7676" : "#ada7a7");
}
// ==============================================
export default function NavigationPanel({ foundingName }) {
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
    const navigate = useNavigate();

    const modeContext = ModeContextGet();
    const themeSuffix = modeContext.useDarkMode ? "dark" : "light";

    function onChangeMode() {
        const newDarkMode = !modeContext.useDarkMode;
        modeContext.setUseDarkMode(newDarkMode);

        adjustGlobalCSSProperties(newDarkMode);
    }

    const handleLogout = () => {
        localStorage.setItem("activeUser", JSON.stringify({
            user: null,
            lastLogActivity: null,
            token: null
        }));

        navigate('/');
    }

    return (
        <Container fluid id="nav-panel" className="header-container w-100" data-bs-theme="dark">
            <Container fluid className="w-100 navbar-container rounded">
                <Navbar expand="lg">
                    <Container fluid className="d-flex justify-content-start">
                        <Navbar.Brand as={Link} to={"/"}
                            className="d-flex align-items-center">
                            <Image className="me-3" src={new URL("../assets/logo.webp", import.meta.url)}
                                style={{ width: "48px", height: "auto", minWidth: "48px", minHeight: "48px", maxWidth: "48px", maxHeight: "48px" }} />
                            <span className="fs-3 fw-bold me-2">{foundingName}</span>
                        </Navbar.Brand>

                        <Nav.Link as={Link} to={"/games"} className="me-2">
                            <span className="text-links fw-bold">Games List</span>
                        </Nav.Link>
                        <Nav.Link as={Link} to={"/tasks"} className="me-2">
                            <span className="text-links fw-bold">Schedule</span>
                        </Nav.Link>
                        <Nav.Link as={Link} to={"/kururin"} className="me-2">
                            <span className="text-links fw-bold">Kuru Kuru</span>
                        </Nav.Link>

                        <div className="d-flex align-items-center ms-auto">
                            <Image onClick={() => navigate("/dashboard")}
                                type="button"
                                src={
                                    new URL(((userObj.user && userObj.user.image) ? userObj.user.image : "../assets/user-profile-default.webp"),
                                        import.meta.url)}
                                className="me-2"
                                style={{ width: "32px", height: "auto", minWidth: "32px", minHeight: "32px", maxWidth: "32px", maxHeight: "32px" }}
                            />
                            {
                                userObj.user ? (
                                    <Nav.Link as={Link} onClick={handleLogout} className="me-2">
                                        <span className="text-links fw-bold">Logout</span>
                                    </Nav.Link>
                                ) : (
                                    <>
                                        <Nav.Link as={Link} to={"/login"} className="me-2">
                                            <span className="text-links fw-bold">Login</span>
                                        </Nav.Link>
                                        <Nav.Link as={Link} to={"/register"}>
                                            <span className="text-links fw-bold">Register</span>
                                        </Nav.Link>
                                    </>
                                )
                            }
                        </div>
                    </Container>
                </Navbar>
            </Container>
        </Container>
    );
}
// ==============================================