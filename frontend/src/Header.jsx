import { Link } from "react-router-dom"
export default function Header() {
    return (
        <header className="header">
            <nav className="nav">
                <div className="nav-left">
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
        </header>

    )
}