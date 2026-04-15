import {useNavigate} from "react-router-dom";
import "../css/sidebar.css";
import calendarImg from "../images/calendar.png";
import memoImg from "../images/memo.png";
import routineImg from "../images/routine.jpg";
import weightImg from "../images/weight.png";

export default function sidebar () {
    const navigate = useNavigate();

    return (
        <aside className="sidebar">
            <button className="sidebar-btn" onClick={() => navigate("")}>
                <img src={calendarImg} alt="calendarImg" className="sidebar-btn-img"/>
            </button>
            <button className="sidebar-btn" onClick={() => navigate("")}>
                <img src={memoImg} alt="calendarImg" className="sidebar-btn-img"/>
            </button>
            <button className="sidebar-btn" onClick={() => navigate("")}>
                <img src={routineImg} alt="calendarImg" className="sidebar-btn-img"/>
            </button>
            <button className="sidebar-btn" onClick={() => navigate("")}>
                <img src={weightImg} alt="calendarImg" className="sidebar-btn-img"/>
            </button>
        </aside>
    )
}