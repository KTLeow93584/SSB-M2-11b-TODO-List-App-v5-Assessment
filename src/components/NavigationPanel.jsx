// ==============================================
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { ModeContextGet } from '../contexts/ModeContext.jsx';
import { ActiveUserContextGet } from '../contexts/ActiveUserContext.jsx';

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
    let userObj = ActiveUserContextGet().activeUserObj;
    // ===========================
    const modeContext = ModeContextGet();
    const themeSuffix = modeContext.useDarkMode ? "dark" : "light";

    function onChangeMode() {
        const newDarkMode = !modeContext.useDarkMode;
        modeContext.setUseDarkMode(newDarkMode);

        adjustGlobalCSSProperties(newDarkMode);
    }
    // ===========================
    const [windowWidth, setWindowWidth] = useState(document.documentElement.clientWidth);
    const [windowHeight, setWindowHeight] = useState(document.documentElement.clientHeight);

    const handleResize = () => {
        setWindowWidth(document.documentElement.clientWidth);
        setWindowHeight(document.documentElement.clientHeight);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    // ===========================
    return (
        <Container fluid id="nav-panel" className="header-container w-100">
            <Container fluid className="w-100 navbar-container rounded">
                <Navbar expand="lg">
                    <Container fluid className="d-flex align-items-center">
                        <Navbar.Brand as={Link} to={"/"}
                            className="d-flex align-items-center">
                            <Image className="me-3" src={new URL("../assets/logo.webp", import.meta.url)}
                                style={{ width: "48px", height: "auto", minWidth: "48px", minHeight: "48px", maxWidth: "48px", maxHeight: "48px" }} />
                            <span className="fs-3 fw-bold me-2">{foundingName}</span>
                        </Navbar.Brand>
                        {
                            windowWidth <= 768 ?
                                (
                                    <NavigationBarBodyOffCanvas user={userObj.user} />
                                ) :
                                (
                                    <NavigationBarBodyElements user={userObj.user} />
                                )
                        }
                    </Container>
                </Navbar>
            </Container >
        </Container >
    );
}
// ==============================================
function NavigationBarBodyElements({ user }) {
    const navigate = useNavigate();
    const logout = ActiveUserContextGet().logout;

    const handleLogout = () => logout(() => navigate('/'));

    return (
        <>
            {/* ------------------------------ */}
            {/* Games & Schedule Section */}
            <Nav.Link as={Link} to={"/games"} className="me-2">
                <span className="text-links fw-bold">Games List</span>
            </Nav.Link>

            {
                user ? (
                    <Nav.Link as={Link} to={"/schedule"} className="me-2">
                        <span className="text-links fw-bold">Schedule</span>
                    </Nav.Link>
                ) : null
            }
            {/* ------------------------------ */}
            {/* Kuru Kuru Section */}
            <Nav.Link as={Link} to={"/kururin"} className="me-2">
                <span className="text-links fw-bold">Kuru Kuru</span>
            </Nav.Link>
            {/* ------------------------------ */}
            <Image onClick={() => navigate("/dashboard")}
                type="button"
                src={
                    new URL(((user && user.image) ? user.image : "../assets/user-profile-default.webp"),
                        import.meta.url)}
                className="ms-auto me-2 rounded"
                style={{
                    width: "32px", height: "auto",
                    minWidth: "32px", minHeight: "32px",
                    maxWidth: "32px", maxHeight: "32px"
                }}
            />
            {/* ------------------------------ */}
            {/* Login/Logout Button */}
            {
                user ? (
                    <>
                        <Nav.Link as={Link} to={"/dashboard"}
                            className="text-links fw-bold me-3">
                            {`${user.firstName} ${user.lastName}`}
                        </Nav.Link>
                        <Nav.Link as={Link} onClick={handleLogout} className="me-2">
                            <span className="text-links fw-bold">Logout</span>
                        </Nav.Link>
                    </>
                ) : (
                    <>
                        <Nav.Link as={Link} to={"/login"} className="me-2">
                            <span className="text-links fw-bold">Login</span>
                        </Nav.Link>
                    </>
                )
            }
            {/* ------------------------------ */}
            {/* Register Button */}
            {
                user ? null : (
                    <Nav.Link as={Link} to={"/register"}>
                        <span className="text-links fw-bold">Register</span>
                    </Nav.Link>
                )
            }
            {/* ------------------------------ */}
        </>
    );
}
// ==============================================
function NavigationBarBodyOffCanvas({ user }) {
    const [showOffCanvasNav, setShowOffCanvasNav] = useState(false);

    const navigate = useNavigate();
    const logout = ActiveUserContextGet().logout;

    const handleLogout = () => logout(() => navigate('/'));
    const handleClose = () => setShowOffCanvasNav(false);

    return (
        <>
            {/* ------------------------------ */}
            <Button variant="link" onClick={() => setShowOffCanvasNav(!showOffCanvasNav)}>
                <i className="fs-2 text-non-links bi bi-list"></i>
            </Button>
            {/* ------------------------------ */}
            <Offcanvas show={showOffCanvasNav}
                onHide={handleClose}
                responsive="lg"
                className="primary-container"
                placement="end">
                <Offcanvas.Header closeButton className="mt-2 py-0">
                    <Offcanvas.Title>Navigation</Offcanvas.Title>
                </Offcanvas.Header>
                <hr className="horizontal-line-text" />
                <Offcanvas.Body>
                    {/* ------------------------------ */}
                    <Nav.Link as={Link} to={"/games"} className="mb-3">
                        <span className="text-links fw-bold">Games List</span>
                    </Nav.Link>

                    {
                        user ? (
                            <Nav.Link as={Link} to={"/schedule"} className="mb-3">
                                <span className="text-links fw-bold">Schedule</span>
                            </Nav.Link>
                        ) : null
                    }
                    {/* ------------------------------ */}
                    <Nav.Link as={Link} to={"/kururin"} className="mb-3">
                        <span className="text-links fw-bold">Kuru Kuru</span>
                    </Nav.Link>
                    {/* ------------------------------ */}
                    <div className="d-flex align-items-center mb-3">
                        <Image onClick={() => navigate("/dashboard")}
                            type="button"
                            src={
                                new URL(((user && user.image) ? user.image : "../assets/user-profile-default.webp"),
                                    import.meta.url)}
                            className="ms-0 rounded me-3"
                            style={{
                                width: "32px", height: "auto",
                                minWidth: "32px", minHeight: "32px",
                                maxWidth: "32px", maxHeight: "32px"
                            }}
                        />
                        {/* Login/Logout Button */}
                        {
                            user ? (
                                <>
                                    <Nav.Link as={Link} to={"/dashboard"}
                                        className="text-links fw-bold me-auto">
                                        {`${user.firstName} ${user.lastName}`}
                                    </Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to={"/login"} className="me-2">
                                        <span className="text-links fw-bold">Login</span>
                                    </Nav.Link>
                                </>
                            )
                        }
                    </div>
                    {
                        user ? (
                            <Nav.Link as={Link} onClick={handleLogout} className="me-auto">
                                <span className="text-links fw-bold">Logout</span>
                            </Nav.Link>
                        ) : null
                    }
                    {/* ------------------------------ */}
                    {/* Register Button */}
                    {
                        user ? null : (
                            <Nav.Link as={Link} to={"/register"}>
                                <span className="text-links fw-bold">Register</span>
                            </Nav.Link>
                        )
                    }
                    {/* ------------------------------ */}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
// ==============================================