// ==============================================
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './Footer.css';
// ==============================================
export default function Footer({ foundingName }) {
    return (
        <Container fluid className="w-100 footer-container py-3">
            <Row>
                <Col className="col-12">
                    <p className="fs-6 text-non-links m-0 p-0">
                        © 2024-2024, {foundingName}.org by
                        <span> </span>
                        <a className="text-links fw-bold" href="https://www.linkedin.com/in/kazcade/" target="_blank" rel="noopener noreferrer">
                            Leow Kean Tat (Kaz)/Project Kazcade
                        </a>.
                        This mock website incorporates elements from the following:
                    </p>
                </Col>
                <Col className="col-12 d-flex justify-content-center">
                    <span className="fw-bold me-3"> •
                        <span> </span>
                        <a className="text-links fw-bold me-3" href="https://cicerakes.github.io/Game-Time-Master/" target="_blank" rel="noopener noreferrer">
                            Game Time Master by CiceRakes
                        </a>
                    </span>
                    <span className="fw-bold me-3"> •
                        <span> </span>
                        <a className="text-links" href="https://www.dlsite.com/index.html?locale=en_US" target="_blank" rel="noopener noreferrer">
                            DLSite
                        </a>
                    </span>
                    <span className="fw-bold"> •
                        <span> </span>
                        <a className="text-links" href="https://herta.eu.org/" target="_blank" rel="noopener noreferrer">
                            Herta - Kuru Kuru by CaliphDev
                        </a>
                    </span>

                </Col>
            </Row>
        </Container >
    );
}

function GlossaryLink({ title, addNewLine = true, link = "#" }) {
    return (
        <>
            <a href={link} className="text-links" target="_blank" rel="noopener noreferrer">{title}</a>
            {(addNewLine === true ? <br /> : "")}
        </>
    );
}
// ==============================================