import { useState } from "react"
import QRCode from "react-qr-code";
import AlertBox from "./alertBox";
import Home from "./Home";

function App() {
  const [nanopath, setnanopath] = useState("")
  const [alertmessages, setalertmessages] = useState([])
  const copytoclipboard = () => {
    navigator.clipboard.writeText(nanopath)
      .then(() => {
        const id = Date.now();
        setalertmessages(prev => [...prev, { id: id, text: "Copied" }]);

        setTimeout(() => {
          setalertmessages(prev => prev.filter(msg => msg.id !== id));
        }, 2800)
      })
      .catch(error => console.error("Failed to copy", error));
  };
  return (
    <>
      <header className="header">
        <h1 className="title">Nano Path</h1>
        <p>your favorite url shortener</p>
      </header>
      <main className="main">
        <Home copytoclipboard={copytoclipboard} setnanopath={setnanopath} nanopath={nanopath} />
        <AlertBox alertmessages={alertmessages} />
      </main>
    </>
  )
}

export default App
