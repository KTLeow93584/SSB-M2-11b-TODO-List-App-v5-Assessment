// ==============================================
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Image from 'react-bootstrap/Image';

import errorKoyuki from '../../assets/images/error-page/blue-archive-koyuki.webp';
// ==============================================
export default function ErrorPage() {
    return (
        <Container fluid className="primary-container w-100 d-flex flex-column align-items-center justify-content-end" style={{ flex: 1 }}>
            <Row className="mt-3 d-flex flex-column align-items-center justify-content-center" style={{ flex: 1 }}>
                <Col className="col-8 text-center d-flex flex-column align-items-center justify-content-between" style={{ flex: 1 }}>
                    <p className="text-non-links-primary fw-bold mt-5">
                        We were unable to locate the page you&apos;re looking for. Here&apos;s a
                        <span> </span>
                        <a href="https://www.youtube.com/watch?v=tZoqaQrca2M" target="_blank" rel="noopener noreferrer"
                            style={{ color: "blue", textDecoration: "none" }}>Koyuki</a>
                        <span> </span>
                        instead to cheer you up in its place!
                    </p>
                    <Image src={errorKoyuki}
                        style={{ minWidth: "256px", minHeight: "256px", maxWidth: "512px", maxHeight: "512px", width: "100%", height: "auto" }} />
                </Col>
            </Row>
        </Container>
    );
}
// ==============================================