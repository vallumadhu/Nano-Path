import { Link } from "react-router-dom"
import { useState } from "react"
export default function Header() {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <header className="header">
            <nav className="nav">
                <div className="nav-left">
                    <Link to="" className="nav-link"><p>Home</p></Link>
                    <Link to="/custom-id" className="nav-link"><p>Custom ID</p></Link>
                </div>

                <div className="nav-center">
                    <Link to="/" className="brand">
                        <h1 className="title">Nano Path</h1>
                    </Link>
                    <p className="subtitle">Your favorite URL shortener</p>
                </div>

                <div className="nav-right">
                    <Link to="/about" className="nav-link"><p>About</p></Link>
                    <Link to="/login">
                        <button className="login-btn">Login</button>
                    </Link>
                </div>

            </nav>
            <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>
                ☰
            </button>
            <div className={`sideBar ${showMenu ? "sideBarshow" : "sideBarhide"}`}>
                <nav>
                    <Link to="" className="nav-link"><p>Home</p></Link>
                    <Link to="/custom-id" className="nav-link"><p>Custom ID</p></Link>
                    <Link to="/about" className="nav-link"><p>About</p></Link>
                </nav>
            </div>
        </header>

    )
}