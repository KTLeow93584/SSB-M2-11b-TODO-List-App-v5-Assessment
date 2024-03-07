// ==============================================
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { ModeContextGet } from '../contexts/ModeContext.jsx';

import { logout } from '../feature/activeUser/activeUserSlice.jsx';

import './NavigationPanel.css';
// ==============================================
export default function NavigationPanel({ foundingName }) {
    // ===========================
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onLogout = () => {
        dispatch(logout());
        navigate('/');
    };
    // ===========================
    const userObj = useSelector((state) => state.activeUser);
    const user = userObj.user;

    const [windowWidth, setWindowWidth] = useState(document.documentElement.clientWidth);

    const handleResize = () => {
        setWindowWidth(document.documentElement.clientWidth);
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
                            <span className="fs-3 fw-bold me-2 text-non-links-primary">{foundingName}</span>
                        </Navbar.Brand>
                        {
                            windowWidth <= 768 ?
                                (
                                    <NavigationBarBodyOffCanvas user={user} onLogoutCallback={onLogout} />
                                ) :
                                (
                                    <NavigationBarBodyElements user={user} onLogoutCallback={onLogout} />
                                )
                        }
                    </Container>
                </Navbar>
            </Container>
        </Container>
    );
}
// ==============================================
function NavigationBarBodyElements({ user, onLogoutCallback }) {
    // ===========================
    const navigate = useNavigate();
    // ===========================
    const modeContext = ModeContextGet();
    useEffect(() => adjustGlobalCSSProperties(modeContext.useDarkMode), [])

    function onChangeMode() {
        const newDarkMode = !modeContext.useDarkMode;
        modeContext.setUseDarkMode(newDarkMode);

        adjustGlobalCSSProperties(newDarkMode);
    }
    // ===========================
    return (
        <>
            {/* ------------------------------ */}
            {/* Games & Schedule Section */}
            <Nav.Link as={Link} to={"/games"}
                className="text-links fw-bold me-2">
                Games List
            </Nav.Link>

            {
                user ? (
                    <Nav.Link as={Link} to={"/schedule"}
                        className="text-links fw-bold me-2">
                        Schedule
                    </Nav.Link>
                ) : null
            }
            {/* ------------------------------ */}
            {/* Kuru Kuru Section */}
            <Nav.Link as={Link} to={"/kururin"}
                className="text-links fw-bold me-2">
                Kuru Kuru
            </Nav.Link>
            {/* ------------------------------ */}
            {/* Dark/Light Mode Feature */}
            <div className="d-flex align-items-center form-check form-switch ms-auto me-4">
                <input className="form-check-input me-2"
                    type="checkbox"
                    role="switch"
                    checked={modeContext.useDarkMode}
                    id="darkModeSwitch"
                    onChange={onChangeMode} />
                <label className="form-check-label text-non-links-primary" htmlFor="darkModeSwitch">
                    {
                        modeContext.useDarkMode ?
                            (<i className="fs-3 bi bi-moon-fill"></i>) :
                            (<i className="fs-3 bi bi-sun-fill"></i>)
                    }
                </label>
            </div>
            {/* ------------------------------ */}
            {/* Profile Picture */}
            <Image onClick={() => navigate("/dashboard")}
                type="button"
                src={
                    new URL(((user && user.image) ? user.image : "../assets/user-profile-default.webp"),
                        import.meta.url)}
                className="me-2 rounded"
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
                        <Nav.Link as={Link} onClick={onLogoutCallback}
                            className="text-links fw-bold me-2">
                            Logout
                        </Nav.Link>
                    </>
                ) : (
                    <>
                        <Nav.Link as={Link} to={"/login"}
                            className="text-links fw-bold me-2">
                            Login
                        </Nav.Link>
                    </>
                )
            }
            {/* ------------------------------ */}
            {/* Register Button */}
            {
                user ? null : (
                    <Nav.Link as={Link} to={"/register"}
                        className="text-links fw-bold">
                        Register
                    </Nav.Link>
                )
            }
            {/* ------------------------------ */}
        </>
    );
}
// ==============================================
function NavigationBarBodyOffCanvas({ user, onLogoutCallback }) {
    // ===========================
    const modeContext = ModeContextGet();
    useEffect(() => adjustGlobalCSSProperties(modeContext.useDarkMode), [])

    function onChangeMode() {
        const newDarkMode = !modeContext.useDarkMode;
        modeContext.setUseDarkMode(newDarkMode);

        adjustGlobalCSSProperties(newDarkMode);
    }
    // ===========================
    const [showOffCanvasNav, setShowOffCanvasNav] = useState(false);

    const navigate = useNavigate();
    const handleClose = () => setShowOffCanvasNav(false);
    // ===========================
    return (
        <>
            {/* ------------------------------ */}
            <Button variant="link" onClick={() => setShowOffCanvasNav(!showOffCanvasNav)}>
                <i className="fs-2 text-non-links-primary bi bi-list"></i>
            </Button>
            {/* ------------------------------ */}
            <Offcanvas show={showOffCanvasNav}
                onHide={handleClose}
                responsive="lg"
                className="primary-container"
                placement="end">
                <Offcanvas.Header closeButton className="mt-2 py-0">
                    <Offcanvas.Title className="text-non-links-primary">Navigation</Offcanvas.Title>
                </Offcanvas.Header>
                <hr className="horizontal-line-text" />
                <Offcanvas.Body>
                    {/* ------------------------------ */}
                    {/* Games and Schedule Section */}
                    <Nav.Link as={Link} to={"/games"} className="text-links fw-bold mb-3">
                        Games List
                    </Nav.Link>

                    {
                        user ? (
                            <Nav.Link as={Link} to={"/schedule"}
                                className="text-links fw-bold mb-3">
                                Schedule
                            </Nav.Link>
                        ) : null
                    }
                    {/* ------------------------------ */}
                    {/* Kuru Kuru Section */}
                    <Nav.Link as={Link} to={"/kururin"}
                        className="text-links fw-bold mb-3">
                        Kuru Kuru
                    </Nav.Link>
                    {/* ------------------------------ */}
                    {/* Dark/Light Mode Feature */}
                    <div className="d-flex align-items-center form-check form-switch ms-auto mb-4">
                        <input className="form-check-input me-3"
                            type="checkbox"
                            role="switch"
                            checked={modeContext.useDarkMode}
                            id="darkModeSwitch"
                            onChange={onChangeMode} />
                        <label className="form-check-label text-non-links-primary" htmlFor="darkModeSwitch">
                            {
                                modeContext.useDarkMode ?
                                    (<i className="fs-2 bi bi-moon-fill"></i>) :
                                    (<i className="fs-2 bi bi-sun-fill"></i>)
                            }
                        </label>
                    </div>
                    {/* ------------------------------ */}
                    {/* Profile Picture + Login/Logout */}
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
                                    <Nav.Link as={Link} to={"/login"}
                                        className="text-links fw-bold me-2">
                                        Login
                                    </Nav.Link>
                                </>
                            )
                        }
                    </div>
                    {
                        user ? (
                            <Nav.Link as={Link} onClick={onLogoutCallback}
                                className="text-links fw-bold me-auto">
                                Logout
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
function adjustGlobalCSSProperties(useDarkMode) {
    // ======================
    // Containers

    // Light Theme Hex: #eeeeee
    // Dark Theme Hex: #1e1e1e
    document.documentElement.style.setProperty("--core-bg-primary-color", useDarkMode ? "#1e1e1e" : "#eeeeee");
    document.documentElement.style.setProperty("--core-bg-primary-contrast-color", useDarkMode ? "#eeeeee" : "#1e1e1e");

    // Light Theme Hex: #f8f8f8
    // Dark Theme Hex: #212121
    document.documentElement.style.setProperty("--core-bg-secondary-color", useDarkMode ? "#212121" : "#f8f8f8");
    document.documentElement.style.setProperty("--core-bg-secondary-contrast-color", useDarkMode ? "#f8f8f8" : "#212121");

    // Light Theme Hex: #7e56c1
    // Dark Theme Hex: #322646
    document.documentElement.style.setProperty("--core-bg-tertiary-color", useDarkMode ? "#322646" : "#7e56c1");
    document.documentElement.style.setProperty("--core-bg-tertiary-contrast-color", useDarkMode ? "#7e56c1" : "#322646");

    // Light Theme Hex: #2f2e30
    // Dark Theme Hex: #b7b5b9
    document.documentElement.style.setProperty("--core-bg-container-contrast-color", useDarkMode ? "#b7b5b9" : "#2f2e30");
    // ======================
    // Text (Non-Links)

    // Light Theme Hex: black
    // Dark Theme Hex: white
    document.documentElement.style.setProperty("--core-text-non-links-primary-color", useDarkMode ? "white" : "black");
    document.documentElement.style.setProperty("--core-text-non-links-primary-contrast-color", useDarkMode ? "black" : "white");

    /* Light Theme Hex: #333333 */
    /* Dark Theme Hex: #cccccc */
    document.documentElement.style.setProperty("--core-text-non-links-secondary-color", useDarkMode ? "#cccccc" : "#333333");
    document.documentElement.style.setProperty("--core-text-non-links-secondary-contrast-color", useDarkMode ? "#333333" : "#cccccc");
    // ======================
    // Text (Links)

    // Light Theme Hex: #292929
    // Dark Theme Hex: #c5c5c5
    document.documentElement.style.setProperty("--core-text-links-color", useDarkMode ? "#c5c5c5" : "#292929");
    document.documentElement.style.setProperty("--core-text-links-contrast-color", useDarkMode ? "#292929" : "#c5c5c5");
    // ======================
    // Text (Buttons)

    // Light Theme Hex: black
    // Dark Theme Hex: white
    document.documentElement.style.setProperty("--core-text-button-color", useDarkMode ? "white" : "black");
    document.documentElement.style.setProperty("--core-text-button-contrast-color", useDarkMode ? "black" : "white");
    // ======================
    // Border

    // Light Theme Hex: #1f1f1f
    // Dark Theme Hex: #f4f4f4
    document.documentElement.style.setProperty("--core-border-primary-color", useDarkMode ? "#f4f4f4" : "#1f1f1f");

    // Light Theme Hex: #ada7a7
    // Dark Theme Hex: #7e7676
    document.documentElement.style.setProperty("--core-border-secondary-color", useDarkMode ? "#7e7676" : "#ada7a7");
    // ======================
}
// ==============================================