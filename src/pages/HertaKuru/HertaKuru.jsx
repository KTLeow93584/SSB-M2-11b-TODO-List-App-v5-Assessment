// ==============================================
import { useState } from 'react';
import useLocalStorage from 'use-local-storage';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import './HertaKuru.css';
// ==============================================
export default function HertaKuru() {
    const [squishedTimes, setSquishedTimes] = useLocalStorage("kuru-count", 0);
    const [kuruImgList, setKuruImgList] = useState([]);

    const audioList = [
        "../../assets/kuru-kuru/kuru-1.mp3",
        "../../assets/kuru-kuru/kuru-2.mp3",
        "../../assets/kuru-kuru/kuru-3.mp3"
    ];

    const imgList = [
        "../../assets/kuru-kuru/herta1.webp",
        "../../assets/kuru-kuru/herta2.webp"
    ];

    const playKuru = () => {
        const resultAudio = (squishedTimes % 100 === 99 && squishedTimes > 0) ? (audioList.length - 1) :
            (Math.floor(Math.random() * (audioList.length - 1)));
        const audioURL = new URL(audioList[resultAudio], import.meta.url);
        new Audio(audioURL).play();

        const id = new Date().toISOString();
        const resultImg = Math.floor(Math.random() * (imgList.length));

        kuruImgList.push({
            id: id,
            htmlElement: (
                <Image key={`kuru-${id}`} src={new URL(imgList[resultImg], import.meta.url)}
                    className="herta-img"
                    onAnimationEnd={() => {
                        // Debug
                        //console.log("[On Animation End] ID: " + (id));

                        const indexInArray = kuruImgList.findIndex((imgComponent) => imgComponent.id === id)
                        kuruImgList.splice(indexInArray, 1);
                    }} />
            )
        });
        // Debug
        //console.log("[On Trigger Kuru] Tapped.", kuruImgList);
        setKuruImgList(kuruImgList);

        setSquishedTimes((prevSquishedTimes) => prevSquishedTimes + 1);
    };

    return (
        <Container fluid className="primary-container m-0 p-0" style={{ flex: 1, overflowX: "hidden", position: "relative" }}>
            <Row className="d-flex flex-column align-items-center herta-container m-0 p-0">
                <Col className="col-12" style={{ zIndex: 2, position: "relative" }}>
                    <h1 className="text-light text-center m-0 p-0">Kuru Kuru~</h1>

                    <hr className="horizontal-line-text herta-horizontal-line mx-5" style={{ border: "dashed" }} />

                    <h2 className="text-light text-center m-0 p-0">
                        The webpage dedicated for Herta, the cutest genius Honkai Star Rail Character to ever exist.
                    </h2>
                </Col>
                <Col className="col-12 mt-5" style={{ zIndex: 2, position: "relative" }}>
                    <p className="fs-6 text-light fw-bold text-center m-0 p-0 mb-5">
                        The kuru~ has been squished
                    </p>
                    <p className="fs-1 fw-bold text-center m-0 p-0 mb-5" style={{ color: "#444444" }}>
                        {squishedTimes}
                    </p>
                    <p className="fs-6 text-light fw-bold text-center m-0 p-0">
                        times
                    </p>
                </Col>

                <Col className="col-12 mt-3" style={{ zIndex: 2, position: "relative" }}>
                    <div className="d-flex justify-content-center">
                        <Button variant="primary" className="fs-6 fw-bold" onClick={playKuru}>
                            Squish the kuru~!
                        </Button>
                    </div>
                    <hr className="horizontal-line-text herta-horizontal-line mx-5" style={{ border: "dashed" }} />
                </Col>

                <Col className="col-12 mt-3" style={{ zIndex: 1, position: "relative" }}>
                    {
                        kuruImgList.length > 0 ? kuruImgList.map((img) => img.htmlElement) : null
                    }
                    <div>
                        <Image src={new URL("../../assets/kuru-kuru/herta1.webp", import.meta.url)}
                            className="herta-img-sample-preload" />
                        <Image src={new URL("../../assets/kuru-kuru/herta2.webp", import.meta.url)}
                            className="herta-img-sample-preload" />
                    </div>
                </Col>
            </Row>
            <Row className="d-flex align-items-center primary-container mx-0 mb-0 mt-3 p-0" style={{ position: "relative" }}>
                <Col className="col-6 mb-3 mx-auto">
                    <Image src={new URL("../../assets/kuru-kuru/card.webp", import.meta.url)}
                        style={{ width: "100%", height: "auto" }} />
                </Col>
                <Col className="col-6 mb-3 mx-auto">
                    <p className="text-non-links">Herta gif created by</p>
                    <p>
                        <i className="text-non-links fw-bold bi bi-twitter-x me-2"></i>
                        <a className="text-links fw-bold"
                            href="https://twitter.com/Seseren_kr" target="_blank" rel="noopener noreferrer">
                            Seseren_kr
                        </a>
                    </p>
                    <p className="text-non-links">Original Reference from CaliphDev</p>
                    <p>
                        <i className="text-non-links fw-bold bi bi-box-arrow-up-right me-2"></i>
                        <a className="text-links fw-bold"
                            href="https://herta.eu.org/" target="_blank" rel="noopener noreferrer">
                            CaliphDev&apos;s Kuru-Kuru Page
                        </a>
                    </p>
                </Col>
            </Row>
        </Container>
    );
}
// ==============================================