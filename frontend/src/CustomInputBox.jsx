import { useOutletContext } from "react-router-dom";
import { useEffect, useRef } from "react";
export default function CustomInputBox() {
    const { seturl, ishandling, setcustomid, customidhandleapi } = useOutletContext()
    const idInput = useRef()
    const urlInput = useRef()
    useEffect(() => {
        setcustomid(idInput.current?.value.trim())
        seturl(urlInput.current?.value.trim())
    }, [])
    return (
        <div className="custom-input-container">
            <div className="input-group">
                <input
                    type="text"
                    className="url-input"
                    placeholder="custom id: 12345"
                    onChange={(e) => setcustomid(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") customidhandleapi();
                    }}
                    ref={idInput}
                />
                <input
                    type="text"
                    className="url-input"
                    placeholder="url: reddit.com"
                    onChange={(e) => seturl(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") customidhandleapi();
                    }}
                    ref={urlInput}
                />
            </div>

            <button
                className="generate-btn"
                disabled={ishandling}
                onClick={customidhandleapi}
            >
                {ishandling ? "Generating..." : "Get Nano Path"}
            </button>
        </div>
    );
}
