import { useState } from "react"
import QRCode from "react-qr-code";

function App() {
  const [url, seturl] = useState("")
  const [nanopath, setnanopath] = useState("")
  const [ishandling, setishandling] = useState(false)
  const handleapi = async () => {
    if (!url.trim()) return;
    setishandling(true);
    try {
      const response = await fetch(`https://nano-path.onrender.com/url?url=${url}`, {
        method: "POST",
      });
      const data = await response.json();
      setnanopath(`https://nano-path.onrender.com/url?id=${data.id}`);
      console.log(data);
    } catch (e) {
      console.error(e);
    } finally {
      setishandling(false);
    }
  }
  return (
    <>
      <header className="header">
        <h1 className="title">Nano Path</h1>
        <p>your favorite url shortener</p>
      </header>
      <main className="main">
        <div className="input-container">
          <input
            type="text"
            className="url-input"
            onChange={(e) => seturl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleapi()
              }
            }}
          />
          <button
            className="generate-btn"
            onClick={handleapi}
            disabled={ishandling}
          >
            {ishandling ? "Generating..." : "Get Nano Path"}
          </button>
        </div>
        {nanopath && (
          <div className="result-container">
            <p className="result-link">
              <a href={nanopath}>{nanopath}</a>
            </p>
          </div>
        )}
        {nanopath && <div className="qrBox">
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={nanopath}
            viewBox={`0 0 256 256`}
          />
        </div>}
      </main>
    </>
  )
}

export default App
