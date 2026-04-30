import classes from "../../css/calendar/calendar.module.css";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';


const workoutEvents = [
    {
        title: "가슴 루틴",
        date: "2026-04-30",
        className: "workout-strength",
    },
    {
        title: "하체 루틴",
        date: "2026-05-01",
        className: "workout-leg",
    },
    {
        title: "유산소",
        date: "2026-05-02",
        className: "workout-cardio",
    },
];


export default function Calendar() {
    return (
        <>
            <div className={classes.calendarPage}>
                <div className={classes.calendarHeader}>
                    <div>
                        <h2>운동 캘린더</h2>
                        <p>날짜별 운동 루틴과 기록을 확인해보세요</p>
                    </div>
                </div>

                <div className={classes.calendarPanel}>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale="ko"
                        height="auto"
                        events={workoutEvents}
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "",
                        }}
                        buttonText={{
                            today: "오늘",
                        }}
                        dayMaxEvents={3}
                        dateClick={(info) => {
                            console.log("날짜 클릭:", info.dateStr);
                        }}
                        eventClick={(info) => {
                            console.log("운동 클릭:", info.event.title);
                        }}
                    />
                </div>
            </div>
        </>
    )
}