import classes from "../../css/calendar/calendar.module.css";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {useEffect, useState} from "react";
import api from "../../api/api.js";
import {
    Badge,
    Button,
    Card,
    Divider,
    Group,
    Input,
    Modal,
    SegmentedControl,
    Stack,
    Text,
    TextInput
} from "@mantine/core";

export default function Calendar() {
    const [workoutEvents, setWorkoutEvents] = useState([])

    async function getWorkoutEvents() {

        const res = await api.get("/calendar/workout/list");

        const workoutEvents = res.data.map((item) => ({
            id: String(item.scheduleId),
            title: item.scheduleName,
            date: item.scheduleDate,
            className: item.scheduleStatus,
            extendedProps: {
                templateId: item.templateId,
                scheduleStatus: item.scheduleStatus,
                memo: item.memo,
            }
        }))

        setWorkoutEvents(workoutEvents);
    }

    useEffect(() => {
        getWorkoutEvents();
    },[])

    return (
        <FullCalendarUI
            workoutEvents={workoutEvents}
            refreshEvents={getWorkoutEvents}
        />
    )
}

const RoutineCardList = ({setTitle, setTemplateId}) => {
    const [routineList, setRoutineList] = useState(null);
    const [selectedRoutineId, setSelectedRoutineId] = useState(null);

    async function getRoutineList() {
        const res = await api.get("/routine/calendarList");
        setRoutineList(res.data);
    }

    useEffect(() => {
        getRoutineList();
    },[])

    return(
        <>
            {routineList && routineList.map((item) => (
                <Card
                    key={item.templateId}
                    className={`${classes.routineCard} ${
                        selectedRoutineId === item.templateId ? classes.selectedCard : ""
                    }`}
                    withBorder
                    radius="lg"
                    padding="md"
                    onClick={() => {setTitle(item.templateName); setSelectedRoutineId(item.templateId); setTemplateId(item.templateId);}}
                >
                    <div className={classes.routineRow}>
                        <div className={classes.routineMain}>
                            <Text fw={800} size="lg" lineClamp={1}>
                                {item.templateName}
                            </Text>

                            <Badge variant="light" radius="md">
                                {item.exCategoryName}
                            </Badge>
                        </div>

                        <Text className={classes.routineCount} size="sm" fw={700}>
                            운동개수: {item.exercises?.length ?? 0}
                        </Text>
                    </div>
                </Card>
            ))}
        </>
    )
}

const CustomScheduleForm = ({setTitle, setTemplateId}) => {
    setTemplateId(null);
    return (
        <div className={classes.customForm}>
            <TextInput
                label="운동 제목"
                placeholder="오늘 할 운동을 입력하세요"
                radius="xl"
                size="md"
                onChange={(e) => setTitle(e.target.value)}
            />
        </div>
    )
}

const DateModal = ({opened, onClose, selectedDate, refreshEvents}) => {
    const [scheduleMode, setScheduleMode] = useState("ROUTINE");
    const [status, setStatus] = useState("PLANNED");
    const [title, setTitle] = useState("");
    const [memo, setMemo] = useState("");
    const [templateId, setTemplateId] = useState(null);

    const handleClose = () => {
        onClose(false);
        setScheduleMode("ROUTINE");
        setTemplateId(null);
        setTitle("");
        setMemo("");
        setStatus("PLANNED");
    }

    async function saveWorkout() {

        if(title === "") {
            alert("제목을 고르시거나 작성해주세요!");
            return;
        }

        const params = {
            title: title,
            templateId: templateId,
            workoutDate: selectedDate,
            memo: memo,
            status: status,
        }
        const res = await api.post("/calendar/workout/save", params);

        handleClose();
        refreshEvents();
        alert("저장 성공");
    }

    return(
        <>
            <Modal
                opened={opened}
                onClose={handleClose}
                title={`${formatDate(selectedDate)} 운동루틴`}
                centered
                size="lg"
            >
                <Stack gap="md">
                    <SegmentedControl
                        fullWidth
                        value={scheduleMode}
                        onChange={setScheduleMode}
                        data={[
                            { label: "루틴 선택", value: "ROUTINE" },
                            { label: "직접 작성", value: "CUSTOM" },
                        ]}
                    />

                    <div className={classes.modalContent}>
                        {scheduleMode === "ROUTINE" && <RoutineCardList
                            setTitle={setTitle}
                            setTemplateId={setTemplateId}
                        />}
                        {scheduleMode === "CUSTOM" && <CustomScheduleForm
                            setTitle={setTitle}
                            setTemplateId={setTemplateId}
                        />}
                    </div>

                    <TextInput
                        label="메모"
                        placeholder="오늘 운동에 대한 메모를 입력하세요"
                        radius="md"
                        onChange={(e) => setMemo(e.target.value)}
                    />

                    <SegmentedControl
                        fullWidth
                        value={status}
                        onChange={setStatus}
                        data={[
                            { label: "예정", value: "PLANNED" },
                            { label: "완료", value: "FINISHED" },
                        ]}
                    />

                    <Group justify="flex-end" mt="sm">
                        <Button variant="light" color="gray" onClick={handleClose}>
                            취소
                        </Button>

                        <Button onClick={() => saveWorkout()}>
                            저장하기
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    )
}

const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

const FullCalendarUI = ({workoutEvents, refreshEvents}) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [dateOpened, setDateOpened] = useState(false);
    const [exOpen, setExOpen] = useState(false);
    const [detail, setDetail] = useState(null);

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
                            left: "prev next",
                            center: "title",
                            right: "today",
                        }}
                        buttonText={{
                            today: "오늘",
                        }}
                        dayMaxEvents={5}
                        dateClick={(info) => {
                            setSelectedDate(info.dateStr);
                            setDateOpened(true);
                        }}
                        eventClick={(info) => {
                            setDetail(info.event);
                            setExOpen(true);
                        }}
                    />
                </div>
            </div>

            <DateModal
                opened={dateOpened}
                onClose={() => setDateOpened(false)}
                selectedDate={selectedDate}
                refreshEvents={refreshEvents}
            />

            <WorkoutDetailModal
                opened={exOpen}
                onClose={() => setExOpen(false)}
                detail={detail}
                refreshEvents={refreshEvents}
            />
        </>
    )
}

const WorkoutDetailModal = ({opened, onClose, detail, refreshEvents}) => {
    const [detailMemo, setDetailMemo] = useState("");
    const [detailStatus, setDetailStatus] = useState(detail?.extendedProps?.scheduleStatus || "PLANNED");
    const [detailTitle, setDetailTitle] = useState("");

    useEffect(() => {
        setDetailMemo(detail?.extendedProps?.memo || "");
        setDetailTitle(detail?.title || "");
        setDetailStatus(detail?.extendedProps?.scheduleStatus || "PLANNED");
    },[detail])

    if (!detail) return null;
    const scheduleId = detail.id;

     async function deleteWorkoutDetail() {
         await api.delete(`/calendar/workout/delete/${scheduleId}`);
         alert("삭제를 완료했습니다.");
         onClose();
         refreshEvents();
     }

     async function updateWorkoutDetail() {
         const params = {
             scheduleId: scheduleId,
             title: detailTitle,
             memo: detailMemo,
             status: detailStatus,
         }

         const res = await api.put("/calendar/workout/update", params);

         if(res.status === 200){
             refreshEvents();
         }
     }

    return(
        <>
            <Modal
                opened={opened}
                onClose={onClose}
                centered
                size="md"
                title="운동 상세"
            >
                <Stack gap="md">
                    <Group justify="space-between" align="flex-start">
                        <div>
                            <Text size="xs" c="dimmed" fw={700}>
                                운동 일정
                            </Text>


                            <TextInput
                                variant="unstyled"
                                value={detailTitle}
                                onChange={(e) => setDetailTitle(e.target.value)}
                                classNames={{
                                    input: classes.detailTitleInput,
                                }}
                            />

                        </div>

                        <Badge
                            size="lg"
                            radius="md"
                            color={detailStatus === "FINISHED" ? "green" : "blue"}
                            variant="light"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setDetailStatus((prev) => prev === "PLANNED" ? "FINISHED" : "PLANNED")
                            }}
                        >
                            {detailStatus === "FINISHED" ? "완료" : "예정"}
                        </Badge>
                    </Group>

                    <Divider />

                    <Card withBorder radius="lg" padding="md" className={classes.detailMemoCard}>
                        <Text size="sm" c="dimmed" fw={700} mb={6}>
                            메모
                        </Text>

                        <TextInput
                            variant="unstyled"
                            value={detailMemo}
                            onChange={(e) => setDetailMemo(e.target.value)}
                            className={{
                                input: classes.detailMemoInput
                            }}
                        />
                    </Card>

                    <Group justify="flex-end" mt="sm">
                        <Button variant="light" color="gray" onClick={() => deleteWorkoutDetail()}>
                            삭제
                        </Button>

                        <Button onClick={() => updateWorkoutDetail()}>
                            수정하기
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    )
}