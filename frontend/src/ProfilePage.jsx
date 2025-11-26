import { Link, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "./App"
export default function ProfilePage() {
    const { setalert, email, setemail } = useContext(AppContext)
    const [notes, setnotes] = useState([])
    const logoutHandler = () => {
        localStorage.setItem("token", null)
        setemail("")
        navigator("/")
    }
    const navigator = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch("https://nano-path.onrender.com/data", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (!data) {
                    console.warn("Error while fetching data")
                    return;
                }
                setemail(data.email)
                setnotes(data.notes)
            })
            .catch(err => console.error("Fetch error:", err));
    }, []);
    return (
        <section className="profilePage">
            <div className="wrapper">
                <img src={`/banner-img-1.jpg`} alt="" />
                <div className="profileIcon">
                    <p>{email ? email[0] : ""}</p>
                </div>
            </div>
            <div className="child">
                <h3>Baisc Info</h3>
                <div className="content">
                    <p>Email: {email}</p>
                    <p>Notes Saved: {notes.length}</p>
                    <p>Files Saved: 0</p>
                    <p>Bookmarks Saved: 0</p>
                </div>
            </div>
            <div className="container">

                <div className="child">
                    <h3>Notes Saved</h3>
                    <div className="content">
                        {
                            notes && notes.length > 0 ? notes.map((note, index) => (
                                <div className="LinkBox" key={index}>
                                    <p>{note.id}</p>
                                    <Link to={`/note/${note.id}`}><button>Open</button></Link>
                                </div>
                            )) : (
                                <div className="noContent">
                                    <p>You Haven't Saved Any Notes Yet</p>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="child">
                    <h3>Files Saved</h3>
                    <div className="content">
                        <div className="noContent">
                            <p>You Haven't Saved Any File Yet</p>
                        </div>
                    </div>
                </div>
                <div className="child">
                    <h3>Bookmarks</h3>
                    <div className="content">
                        <div className="noContent">
                            <p>You Haven't Bookmarked Anything Yet</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="backBtnBox">
                <button className="backBtn" onClick={() => navigator(-1)}>
                    <span>Back</span>
                </button>
            </div>
            <div className="logoutBtnBox">
                <button className="logoutBtn" onClick={logoutHandler}>
                    <span>LogOut</span>
                </button>
            </div>
        </section>
    )
}