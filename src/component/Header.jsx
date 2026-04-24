import { Burger } from "@mantine/core";
import "../css/header.css";
import logoImg from "../images/healthcare-logo.png";

export default function Header({ mobileNavOpened = false, onToggleMobileNav }) {
    return (
        <header className="header">
            <div className="header-left">
                <Burger
                    opened={mobileNavOpened}
                    onClick={onToggleMobileNav}
                    hiddenFrom="sm"
                    size="sm"
                    color="#f9fafb"
                    aria-label="Toggle navigation"
                />
                <img src={logoImg} alt="logo" className="logoImg" />
                <div className="header-title-block">
                    <h1>Healthcare Manager</h1>
                    <span className="today">{new Date().toLocaleDateString()}</span>
                </div>
            </div>

            <div className="header-right" />

            <div className="profile">
                <span>U</span>
            </div>
        </header>
    );
}
