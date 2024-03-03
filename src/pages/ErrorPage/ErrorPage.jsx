// ==============================================
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
// ==============================================
export default function ErrorPage() {
    return (
        <Container fluid className="w-100 d-flex flex-column align-items-center justify-content-end" style={{ flex: 1 }}>
            <Image src={new URL("../../assets/error-page/blue-archive-koyuki.webp", import.meta.url)}
                style={{ minWidth: "256px", minHeight: "256px", maxWidth: "256px", maxHeight: "256px", width: "100%", height: "auto" }} />
        </Container>
    );
}
// ==============================================