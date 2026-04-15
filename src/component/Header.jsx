import "../css/header.css";
import logoImg from "../images/healthcare-logo.png"

export default function Header() {
    return(
        <header className="header">
            <div className="header-left">
                <img src={logoImg} alt="logo" className="logoImg"/>
                <h1>Healthcare Manager</h1>
                <span className="today">
                    {new Date().toLocaleDateString()}
                </span>
            </div>

            <div className="header-right">

            </div>

            <div className="profile">
                <span>👤</span>
            </div>
        </header>
    )
}