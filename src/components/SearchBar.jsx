// ==============================================
import { useEffect, useRef, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { ModeContextGet } from '../contexts/ModeContext.jsx';
// ==============================================
export default function SearchBar({ id = "query-item-name", placeholder = "Enter keyword", minWidth = 30,
    isPrimaryInputFocus = false, searchFilterCallback = null }) {
    // ===========================
    const modeContext = ModeContextGet();
    const useDarkMode = modeContext.useDarkMode;
    // ===========================
    const [keyword, setKeyword] = useState("");
    // ===========================
    const startingInputRef = useRef();
    useEffect(() => {
        if (startingInputRef && startingInputRef.current)
            startingInputRef.current.focus();
    }, []);
    // ===========================
    return (
        <div
            className="d-flex justify-content-center mb-3"
            style={{ width: "100vw" }}
            data-bs-theme={`${useDarkMode ? "dark" : "light"}`}>
            <div className="d-flex justify-content-center rounded me-3 secondary-container" style={{ width: "50%" }}>
                <Form.Control ref={isPrimaryInputFocus ? startingInputRef : null}
                    type="name" id={id} value={keyword} placeholder={placeholder}
                    className="input-bar-no-shadow "
                    style={{ minWidth: `${minWidth}%`, border: "none" }}
                    onChange={(event) => {
                        const newKeyword = event.target.value;
                        setKeyword(newKeyword);

                        if (searchFilterCallback)
                            searchFilterCallback(newKeyword);
                    }}
                />
                {
                    keyword ? (
                        <Button onClick={() => {
                            setKeyword("");
                            if (searchFilterCallback)
                                searchFilterCallback("");
                        }}
                            className="d-flex align-items-center justify-content-center"
                            style={{ height: "40px", backgroundColor: "transparent", border: "none" }}>
                            <FontAwesomeIcon
                                className={"text-center text-links-button px-3"}
                                icon={faTimes} />
                        </Button>
                    ) : null
                }

            </div>
        </div>
    );
}
// ==============================================