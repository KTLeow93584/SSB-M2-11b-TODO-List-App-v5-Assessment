// ==============================================
import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import './SearchBar.css';
// ==============================================
export default function SearchBar({ id = "query-item-name", placeholder = "Enter keyword", minWidth = 30, searchFilterCallback = null }) {
    const [keyword, setKeyword] = useState("");

    return (
        <div className="d-flex justify-content-center mb-3" style={{ width: "100vw" }}>
            <div className="d-flex justify-content-center rounded me-3 secondary-container" style={{ width: "50%" }}>
                <Form.Control
                    type="name" id={id} value={keyword} placeholder={placeholder}
                    className="search-bar"
                    style={{ minWidth: `${minWidth}%`, backgroundColor: "transparent", border: "none" }}
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