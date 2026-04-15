import Sidebar from "./Sidebar.jsx";
import {Outlet} from "react-router-dom";
import Header from "./Header.jsx";
import "../css/mainLayout.css";

export default function MainLayout() {

    return (
        <div className="layout">
            <Header />

            <div className="body-area">
                <Sidebar />

                <div className="content-page">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}