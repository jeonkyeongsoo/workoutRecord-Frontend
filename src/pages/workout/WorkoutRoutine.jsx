import {
    Autocomplete,
    Button,
    Grid,
    Group,
    NumberInput,
    Select,
    Text,
    TextInput,
    Modal,
    Center,
    Stack, Card, Divider, Badge
} from "@mantine/core";
import { CiCirclePlus } from "react-icons/ci";
import { useReducer, useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import api from "../../api/api.js";
import classes from "../../css/workout/workoutRoutine/workoutRoutine.module.css";

const WORKOUT_ROUTINE_LIST = {
    가슴: [
        "벤치프레스",
        "인클라인 벤치프레스",
        "디클라인 벤치프레스",
        "체스트 플라이",
        "덤벨 프레스",
        "케이블 크로스오버",
        "푸시업",
    ],
    등: [
        "데드리프트",
        "바벨 로우",
        "덤벨 로우",
        "랫풀다운",
        "풀업",
        "시티드 로우",
        "티바 로우",
    ],
    어깨: [
        "숄더 프레스",
        "사이드 레터럴 레이즈",
        "프론트 레이즈",
        "벤트오버 레터럴 레이즈",
        "페이스 풀",
        "슈러그",
        "아놀드 프레스",
    ],
    하체: [
        "스쿼트",
        "레그 프레스",
        "런지",
        "레그 익스텐션",
        "레그 컬",
        "루마니안 데드리프트",
        "카프 레이즈",
    ],
    이두: [
        "바벨 컬",
        "덤벨 컬",
        "해머 컬",
        "프리처 컬",
        "컨센트레이션 컬",
        "케이블 컬",
    ],
    삼두: [
        "케이블 푸시다운",
        "스컬 크러셔",
        "딥스",
        "오버헤드 익스텐션",
        "클로즈 그립 벤치프레스",
        "킥백",
    ],
    복근: [
        "크런치",
        "레그 레이즈",
        "플랭크",
        "러시안 트위스트",
        "행잉 레그 레이즈",
        "케이블 크런치",
        "바이시클 크런치",
    ],
};

const bodyParts = Object.keys(WORKOUT_ROUTINE_LIST);

const initialState = {
    routineName: "",
    bodyPart: null,
    exercises: [],
};

function routineReducer(state, action) {
    switch (action.type) {
        case "CHANGE_ROUTINE_NAME":
            return {
                ...state,
                routineName: action.payload,
            };
        case "CHANGE_BODY_PART":
            return {
                ...state,
                bodyPart: action.payload,
            };
        case "ADD_EXERCISE":
            return {
                ...state,
                exercises: [
                    ...state.exercises,
                    action.payload.exerciseDraft,
                ],
            };
        case "REMOVE_EXERCISE":
            { const newExercises = state.exercises.filter((exercise) => exercise.id !== action.payload.id);
            return {
                ...state,
                exercises: newExercises,
            }}
        case "SUCCESS_REQUEST":
            return initialState;
        default:
            return state;
    }
}

const RoutineBasicForm = () => {
    const [state, dispatch] = useReducer(routineReducer, initialState);

    console.log(state);
    async function saveRoutine() {
        const params = {
            templateName: state.routineName,
            exCategoryName: state.bodyPart,
            exercises: state.exercises.map((exercise, idx) => ({
                exerciseItemName: exercise.name,
                sortOrder: idx + 1,
                sets: exercise.sets.map((set, idx) => ({
                    setNo: idx + 1,
                    plannedWeightKg: set.weight,
                    plannedReps: set.reps,
                }))
            })),
        }

        const res = await api.post('/routine/save', params);

        if(res.status === 200){
            alert("운동루틴 저장에 성공했습니다!");
            dispatch({type:"SUCCESS_REQUEST"});
        }
    }

    return (
        <>
            <TextInput
                label="나만의 운동"
                placeholder="나만의 운동 별칭을 만들어보세요."
                required
                classNames={classes}
                value={state.routineName}
                onChange={(event) =>
                    dispatch({ type: "CHANGE_ROUTINE_NAME", payload: event.target.value })
                }
            />
            <Select
                mt="md"
                comboboxProps={{ withinPortal: true }}
                data={bodyParts}
                required
                placeholder="부위를 선택해주세요."
                label="등록할 운동 루틴 부위를 선택하세요"
                classNames={classes}
                value={state.bodyPart}
                onChange={(value) =>
                    dispatch({ type: "CHANGE_BODY_PART", payload: value || null })
                }
            />
            <br />
            <ExerciseForm
                state={state}
                dispatch={dispatch}
                bodyParts={state.bodyPart}
            />

            {state.exercises.length > 0 && (
                <Button mt="md" color="blue" onClick={() => saveRoutine()}>나만의 루틴 저장</Button>
            )}
        </>
    );
};

const ExerciseForm = ({state, dispatch, bodyParts}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [exerciseDraft, setExerciseDraft] = useState(null);

    function handleOpenModal() {

        if(!state.routineName || !state.bodyPart) {
            alert("필수항목은 꼭 작성해주세요!");
            return;
        }

        setExerciseDraft(
            {
                id: `exercise-${crypto.randomUUID()}`,
                name: "",
                sets: [],
            }
        )
        setIsOpen(true);
    }

    function saveExercise (exerciseDraft) {
        dispatch({ type: "ADD_EXERCISE", payload: {exerciseDraft: exerciseDraft} });
    }

    function handleExerciseXButton (id) {
        dispatch({ type: "REMOVE_EXERCISE", payload: {id: id} });
    }

    return (
        <>
            <div className={classes.exerciseForm}>
                {state.exercises.length === 0 && (
                    <Text ta="center" mt="xl" c="dimmed">이곳에 나의 루틴을 만들어 보세요!</Text>
                )}
                <div className={classes.exerciseScrollArea}>
                    <Stack className={classes.exerciseContent} gap="md">
                        {state.exercises.map((exercise, exerciseIdx) => (
                            exercise?.sets?.length > 0 && (
                                <Card withBorder radius="lg" p="md" shadow="xs">
                                    <Stack gap="sm">
                                        <Group justify="space-between">
                                            <Group gap="xs">
                                                <Badge variant="light">{exerciseIdx + 1}</Badge>
                                                <Text fw={700}>{exercise.name}</Text>
                                            </Group>

                                            <Group gap={6}>
                                                <Text size="xs" c="dimmed">
                                                    총 {exercise.sets.length}세트
                                                </Text>

                                                <Text
                                                    size="xs"
                                                    c="red"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => {handleExerciseXButton(exercise.id)}}
                                                >
                                                    X
                                                </Text>
                                            </Group>
                                        </Group>

                                        <Divider />

                                        <Stack gap={6}>
                                            {exercise.sets.map((set, idx) => (
                                                <Group key={idx} justify="space-between" wrap="nowrap">
                                                    <Text size="sm" c="dimmed">
                                                        {idx + 1}세트
                                                    </Text>

                                                    <Group gap="xl" wrap="nowrap">
                                                        <Text size="sm">
                                                            무게 <b>{set.weight}</b>kg
                                                        </Text>
                                                        <Text size="sm">
                                                            횟수 <b>{set.reps}</b>회
                                                        </Text>
                                                    </Group>
                                                </Group>
                                            ))}
                                        </Stack>
                                    </Stack>
                                </Card>
                            )
                        ))}
                    </Stack>
                </div>
                <Button className={classes.addExerciseBtn} onClick={() => handleOpenModal() }>
                    나만의 루틴을 추가해보세요
                </Button>
            </div>

            <Modal opened={isOpen} onClose={() => setIsOpen(false)} title="루틴 추가" size={560}>
                <ExerciseModal
                    exerciseDraft={exerciseDraft}
                    setExerciseDraft={setExerciseDraft}
                    bodyParts={bodyParts}
                    saveExercise={saveExercise}
                    setIsOpen={setIsOpen}
                />
            </Modal>
        </>
    )
}

const ExerciseModal = ({exerciseDraft, setExerciseDraft, bodyParts, saveExercise, setIsOpen}) => {

    function handleXButton (id) {

        const newSets = exerciseDraft.sets.filter((set) => set.id !== id);

        setExerciseDraft({
            ...exerciseDraft,
            sets: newSets,
        })
    }

    function handleSaveButton () {

        if(!exerciseDraft.name) {
            alert("운동을 작성하거나 선택해주세요!");
            return;
        }

        let flag = false;
        exerciseDraft.sets.map((set) => {
            if(set.weight == null || set.reps == null) {
                flag = true;
            }
        })

        if(flag) {
            alert("무게나 횟수적고 저장버튼을 눌러주세요!");
            return;
        }

        saveExercise(exerciseDraft);
        setIsOpen(false);

    }

    return (
        <>
            <Center mt="md">
                <Autocomplete
                    data={WORKOUT_ROUTINE_LIST[bodyParts]}
                    label="내가 할 운동"
                    required
                    w="50%"
                    placeholder="운동을 작성하거나 고르세요!"
                    value={exerciseDraft.name}
                    onChange={(value) => setExerciseDraft({...exerciseDraft, name: value})}
                />
            </Center>

            <Stack mt="md">
                {exerciseDraft.sets.length === 0 ? (
                    <Text c="dimmed" size="sm" mr="md" ta="center">
                        직접 세트수와 무게 횟수를 생성해보세요!
                    </Text>
                ) : (
                    exerciseDraft.sets.map((renderSet, index) => (
                        <Group key={renderSet.id} className={classes.modalSetRow}>
                            <Text size="sm">{index + 1} 세트</Text>
                            <NumberInput
                                placeholder="무게"
                                suffix="kg"
                                value={renderSet.weight}
                                min={0}
                                step={2.5}
                                onChange={(value) => setExerciseDraft({
                                    ...exerciseDraft,
                                    sets: exerciseDraft.sets.map((set) =>
                                        set.id === renderSet.id ? { ...set, weight: value } : set
                                    ),
                                })}
                            />
                            <NumberInput
                                placeholder="횟수"
                                suffix="개"
                                value={renderSet.reps}
                                onChange={(value) => setExerciseDraft({
                                    ...exerciseDraft,
                                    sets: exerciseDraft.sets.map((set) =>
                                        set.id === renderSet.id ? { ...set, reps: value } : set
                                    ),
                                })}
                            />
                            <Button color="red" onClick={() => handleXButton(renderSet.id)}>X</Button>
                        </Group>
                    ))
                )}

                <Center>
                    <CiCirclePlus
                        size={50}
                        onClick={() => setExerciseDraft({
                            ...exerciseDraft,
                            sets: [
                                ...exerciseDraft.sets,
                                {
                                    id: `set-${crypto.randomUUID()}`,
                                    weight: "",
                                    reps: "",
                                }
                            ]
                        })}
                    />
                </Center>
                <Center mt="md">
                    <Button mr="sm" onClick={() => handleSaveButton()}>
                        저장
                    </Button>
                </Center>
            </Stack>
        </>
    )
}

const WorkoutRoutineList = () => {
    const [savedRoutines, setSavedRoutines] = useState([]);
    const [selectedRoutine, setSelectedRoutine] = useState("전체");
    const [selectedRoutineId, setSelectedRoutineId] = useState(null);

    const res = api.get("/routine/view/list");

    return(
        <>

        </>
    )
}

export default function WorkoutRoutine() {
    return (
        <Grid className={classes.pageGrid} gutter="xl">
            <Grid.Col span={{ base: 12, lg: 8 }}>
                <div className={classes.heroPanel}>
                    <Text fw={700} size="xl">
                        나만의 운동 루틴 만들기
                    </Text>
                    <Text mt="sm" c="dimmed">
                        모바일에서는 입력 영역이 한 줄로 쌓이도록 조정해서 세트별 무게와 횟수를
                        더 편하게 입력할 수 있습니다.
                    </Text>
                    <WorkoutRoutineList />
                </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 4 }}>
                <div className={classes.formPanel}>
                    <RoutineBasicForm />
                </div>
            </Grid.Col>
        </Grid>
    );
}
