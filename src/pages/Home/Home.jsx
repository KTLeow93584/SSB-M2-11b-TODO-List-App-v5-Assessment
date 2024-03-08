// ==============================================
import { useSelector } from 'react-redux';

import Container from 'react-bootstrap/Container';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Image from 'react-bootstrap/Image';

import Timekeeper from "../../components/Timekeeper.jsx";

import fgoParodyGuest from '../../assets/images/home/fgo-parody-1.webp';
import fgoParodyUser from '../../assets/images/home/fgo-parody-2.webp';
// ==============================================
export default function Home() {
    return (
        <Container fluid className="d-flex flex-column primary-container" style={{ flex: 1, overflowX: "hidden" }}>
            <Timekeeper />
            <hr className="horizontal-line-text" />
            <BodySection />
        </Container>
    )
}

function BodySection() {
    // ===========================
    let activeUserObj = useSelector((state) => state.activeUser);
    const user = activeUserObj.user;
    // ===========================
    // Debug
    //console.log("User.", user);

    let render = null;

    if (user) {
        render = (
            <Row className="mt-3 d-flex flex-column align-items-center justify-content-center" style={{ flex: 1 }}>
                <Col className="col-8 text-center d-flex flex-column align-items-center justify-content-between" style={{ flex: 1 }}>
                    <p className="text-non-links-primary fw-bold mt-5">
                        {`Welcome back, ${user.firstName} ${user.lastName}! Here's your cake 🍰.`}
                    </p>
                    <Image src={fgoParodyUser}
                        style={{
                            minWidth: "128px", minHeight: "128px",
                            maxWidth: "384px", maxHeight: "384px",
                            width: "75%", height: "auto"
                        }} />
                </Col>
            </Row>
        );
    }
    else {
        render = (
            <Row className="mt-3 d-flex flex-column align-items-center justify-content-center" style={{ flex: 1 }}>
                <Col className="col-8 text-center d-flex flex-column align-items-center justify-content-between" style={{ flex: 1 }}>
                    <p className="text-non-links-primary fw-bold mt-5">
                        We may have forgotten who you are,
                        but if you can spend a few seconds to identify yourself,
                        we can usher the blessings of the
                        <span className="text-danger"> RNG Gods</span> and give
                        you this cake 🍰.
                    </p>
                    <Image src={fgoParodyGuest}
                        style={{
                            minWidth: "128px", minHeight: "128px",
                            maxWidth: "384px", maxHeight: "384px",
                            width: "75%", height: "auto"
                        }} />
                </Col>
            </Row>
        );
    }
    return render;
}
// ==============================================
