// ==============================================
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './Footer.css';
// ==============================================
export default function Footer({ foundingName }) {
    return (
        <Container fluid className="w-100 footer-container d-flex justify-content-center py-3">
            <p className="fs-6 text-non-links m-0 p-0">© 2024-2024, {foundingName}.org</p>
        </Container>
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