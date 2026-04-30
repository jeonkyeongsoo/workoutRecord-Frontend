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
    Stack, Card, Divider, Badge, HoverCard
} from "@mantine/core";
import { CiCirclePlus } from "react-icons/ci";
import {useEffect, useReducer, useState} from "react";
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

const RoutineBasicForm = ({getSavedRoutines}) => {
    const [state, dispatch] = useReducer(routineReducer, initialState);

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
            await getSavedRoutines();
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

const WorkoutRoutineDetail = ({selectedTemplateId}) => {
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [selectedRoutineDraft, setSelectedRoutineDraft] = useState(null);

    useEffect(() => {
        if(!selectedTemplateId) return;

        async function getRoutineDetail() {
            const res = await api.get("/routine/view/detail", { params: {templateId: selectedTemplateId,}})

            const routineDetail = res.data[0];

            setSelectedRoutine(routineDetail);

            setSelectedRoutineDraft({
                ...routineDetail,
                exercises: routineDetail.exercises.map((exercise) => ({
                    ...exercise,
                    exerciseKey: "exercise-" + crypto.randomUUID(),
                    sets: exercise.sets.map((set, idx) => ({
                        ...set,
                        setNo: idx + 1,
                        exerciseSetKey: "set-" + crypto.randomUUID(),
                        })
                    )
                    })
                )
            })

        }

        getRoutineDetail();
    }, [selectedTemplateId])

    return (
        <>
            <Card withBorder radius="lg" p="md" shadow="xs">
                <Stack gap="md">

                    {/* 상단 */}
                    <div>
                        <Text size="sm" c="dimmed">
                            {selectedRoutineDraft?.exCategoryName}
                        </Text>
                        <Text fw={700} size="lg">
                            {selectedRoutineDraft?.templateName}
                        </Text>
                    </div>

                    <Divider />

                    {/* 운동 리스트 */}
                    {selectedRoutineDraft?.exercises?.map((exercise) => (
                        <Card key={exercise.templateItemId ?? exercise.exerciseKey} withBorder radius="md" p="sm">

                            <Stack gap="xs">
                                {/* 운동명 */}
                                <Group justify="space-between">
                                    <Autocomplete
                                        placeholder="운동 선택 및 작성"
                                        data={WORKOUT_ROUTINE_LIST[selectedRoutineDraft.exCategoryName] || []}
                                        value={exercise.exerciseItemName}
                                        onChange={(value) => setSelectedRoutineDraft({
                                            ...selectedRoutineDraft,
                                            exercises: selectedRoutineDraft.exercises.map((ex) =>
                                                ex.exerciseKey === exercise.exerciseKey ? {
                                                    ...ex,
                                                    exerciseItemName: value,
                                                } : ex
                                            )}
                                        )}
                                    />
                                    <Badge size="sm">
                                        {exercise.sets.length}세트
                                    </Badge>
                                    <Button
                                        color="red"
                                        variant="subtle"
                                        size="xs"
                                        onClick={() => setSelectedRoutineDraft({
                                            ...selectedRoutineDraft,
                                            exercises: selectedRoutineDraft.exercises.filter((ex) => ex.exerciseKey !== exercise.exerciseKey)
                                        })}
                                    >
                                        운동삭제
                                    </Button>
                                </Group>

                                {/* 세트 리스트 */}
                                {exercise.sets.map((set, idx) => (
                                    <Group
                                        key={set.templateSetId ?? set.exerciseSetKey}
                                        justify="space-between"
                                        align="center"
                                        wrap="nowrap"
                                    >
                                        {/* 세트 번호 */}
                                        <Text size="sm" c="dimmed" w={50}>
                                            {idx + 1}세트
                                        </Text>

                                        {/* 입력 영역 */}
                                        <Group gap="xs" wrap="nowrap">
                                            <NumberInput
                                                w={80}
                                                size="sm"
                                                step={2.5}
                                                min={0}
                                                suffix="kg"
                                                value={set.plannedWeightKg}
                                                onChange={(value) =>
                                                    setSelectedRoutineDraft({
                                                        ...selectedRoutineDraft,
                                                        exercises: selectedRoutineDraft.exercises.map((ex) => ({
                                                            ...ex,
                                                            sets: ex.sets.map((s) =>
                                                                s.exerciseSetKey === set.exerciseSetKey
                                                                    ? { ...s, plannedWeightKg: value }
                                                                    : s
                                                            ),
                                                        })),
                                                    })
                                                }
                                            />

                                            <NumberInput
                                                w={80}
                                                size="sm"
                                                suffix="회"
                                                min={1}
                                                value={set.plannedReps}
                                                onChange={(value) =>
                                                    setSelectedRoutineDraft({
                                                        ...selectedRoutineDraft,
                                                        exercises: selectedRoutineDraft.exercises.map((ex) => ({
                                                            ...ex,
                                                            sets: ex.sets.map((s) =>
                                                                s.exerciseSetKey === set.exerciseSetKey
                                                                    ? { ...s, plannedReps: value }
                                                                    : s
                                                            ),
                                                        })),
                                                    })
                                                }
                                            />
                                        </Group>

                                        {/* 삭제 버튼 */}
                                        <Button
                                            color="red"
                                            variant="subtle"
                                            size="xs"
                                            onClick={() => routineDetailXBtn(set.exerciseSetKey, selectedRoutineDraft, setSelectedRoutineDraft, exercise.exerciseKey)}
                                        >
                                            X
                                        </Button>
                                    </Group>
                                ))}
                            </Stack>
                            <Center mt="md">
                                <CiCirclePlus
                                    size={30}
                                    onClick={() => setSelectedRoutineDraft({
                                        ...selectedRoutineDraft,
                                        exercises: selectedRoutineDraft.exercises.map((ex) =>
                                            ex.templateItemId === exercise.templateItemId ? {
                                                ...ex,
                                                sets: [
                                                    ...ex.sets,
                                                    {
                                                        templateSetId: null,
                                                        setNo: ex.sets.length + 1,
                                                        plannedWeightKg: "",
                                                        plannedReps: "",
                                                        exerciseSetKey:  "newSet-" + crypto.randomUUID(),
                                                    }
                                                ]
                                            } : ex
                                        )}
                                    )}
                                />
                            </Center>
                        </Card>
                    ))}
                </Stack>
                <Center mt="md">
                    <CiCirclePlus
                        size={40}
                        onClick={() => setSelectedRoutineDraft({
                            ...selectedRoutineDraft,
                            exercises: [
                                ...selectedRoutineDraft.exercises,
                                {
                                    templateItemId: null,
                                    exerciseItemName: "",
                                    sortOrder: selectedRoutineDraft.exercises.length + 1,
                                    sets: [],
                                    exerciseKey: "newExercise-" + crypto.randomUUID(),
                                }
                            ]
                            }
                        )}
                    />
                </Center>
                <Button color="blue" mt="md" onClick={() => clickSelectedDetailSaveBtn(selectedRoutineDraft)}>저장</Button>
            </Card>
        </>
    )
}

function clickSelectedDetailSaveBtn(selectedRoutineDraft) {
    let isItemName = selectedRoutineDraft.exercises.some((ex) => ex.exerciseItemName === null || ex.exerciseItemName === "");
    let isWeight = selectedRoutineDraft.exercises.some((ex) => ex.sets.some((s) => s.plannedWeightKg === null || s.plannedWeightKg === ""));
    let isReps = selectedRoutineDraft.exercises.some((ex) => ex.sets.some((s) => s.plannedReps === null || s.plannedReps === ""));

    if(isItemName){
        alert("⚠️ 운동이름을 입력하세요!");
        return;
    }

    if(isWeight || isReps){
        alert("⚠️ 모든 세트의 무게와 횟수를 입력해주세요.");
        return;
    }

    const params = {
        templateId: selectedRoutineDraft.templateId,
        templateName: selectedRoutineDraft.templateName,
        exCategoryName: selectedRoutineDraft.exCategoryName,
        exercises: selectedRoutineDraft.exercises.map((ex, exIdx) => ({
            templateItemId: ex.templateItemId,
            exerciseItemName: ex.exerciseItemName,
            sortOrder: exIdx + 1,
            sets: ex.sets.map((s, sIdx) => ({
                templateSetId: s.templateSetId,
                setNo: sIdx + 1,
                plannedWeightKg: s.plannedWeightKg,
                plannedReps: s.plannedReps,
            }))
        }))
    }

    api.put("/routine/update/detail", params)
        .then((res) => {
            console.log(res);
            alert("루틴변경에 성공하였습니다!");
        })
}

function routineDetailXBtn(key, selectedRoutineDraft, setSelectedRoutineDraft, exerciseKey) {

    const newExercises = selectedRoutineDraft.exercises.map((ex) => {
        if(ex.exerciseKey === exerciseKey) {
            return{
                ...ex,
                sets: ex.sets.filter((s) => s.exerciseSetKey !== key)
            }
        }

        return ex;
    })

    setSelectedRoutineDraft({
        ...selectedRoutineDraft,
        exercises: newExercises,
    })
}

const WorkoutRoutineList = ({savedRoutines}) => {
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [isRoutineDetailOpen, setIsRoutineDetailOpen] = useState(false);

    if(savedRoutines.length > 0) {
        return(
            <>
                <Modal opened={isRoutineDetailOpen} onClose={() => setIsRoutineDetailOpen(false)} title="나만의 루틴 수정">
                    <WorkoutRoutineDetail
                        selectedTemplateId={selectedTemplateId}
                    />
                </Modal>

                {savedRoutines.map((routine) => (
                    <Card
                        mt="lg"
                        key={routine.id}
                        withBorder
                        radius="lg"
                        p="md"
                        shadow="xs"
                        className={classes.savedRoutineCard}
                        onClick={() => {setIsRoutineDetailOpen(true); setSelectedTemplateId(routine.templateId);}}
                    >
                        <div className={classes.savedRoutineContent}>
                            <Stack gap={6}>
                                <Group gap="xs">
                                    <Badge variant="light" radius="md">
                                        {routine.exCategoryName}
                                    </Badge>
                                </Group>

                                <Text fw={700} size="md">
                                    {routine.templateName}
                                </Text>

                                <Text size="xs" c="dimmed">
                                    총 {routine.exercises?.length ?? 0}개 운동
                                </Text>
                            </Stack>

                            <Stack gap={6} className={classes.savedExerciseList}>
                                {routine.exercises?.slice(0, 5).map((exercise) => (
                                    <Group key={exercise.sortOrder} gap="xs" wrap="nowrap">
                                        <Badge size="xs" variant="outline">
                                            {exercise.sortOrder}
                                        </Badge>
                                        <Text size="sm" lineClamp={1}>
                                            {exercise.exerciseItemName}
                                        </Text>
                                    </Group>
                                ))}

                                {(routine.exercises?.length ?? 0) > 5 && (
                                    <HoverCard width={220} shadow="md" openDelay={200}>
                                        <HoverCard.Target>
                                            <Text
                                                size="xs"
                                                c="dimmed"
                                                style={{ cursor: 'default' }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                외 {(routine.exercises?.length ?? 0) - 5}개 더보기
                                            </Text>
                                        </HoverCard.Target>

                                        <HoverCard.Dropdown>
                                            <Stack gap={6}>
                                                {routine.exercises?.slice(5).map((exercise) => (
                                                    <Group key={exercise.sortOrder} gap="xs" wrap="nowrap">
                                                        <Badge size="xs" variant="outline">
                                                            {exercise.sortOrder}
                                                        </Badge>
                                                        <Text size="sm">{exercise.exerciseItemName}</Text>
                                                    </Group>
                                                ))}
                                            </Stack>
                                        </HoverCard.Dropdown>
                                    </HoverCard>
                                )}
                            </Stack>
                        </div>
                    </Card>
                ))}
            </>
        )
    }

    return(
        <>
            <Text fw={700} size="xl">
                나만의 운동 루틴 만들기
            </Text>
            <Text mt="sm" c="dimmed">
                아직 저장된 루틴이 없습니다,
                나만의 루틴을 추가해보세요! <br/>
                생성한 루틴을 확인해보실 수 있습니다!
            </Text>
        </>
    )
}

export default function WorkoutRoutine() {
    const [savedRoutines, setSavedRoutines] = useState([]);

    async function getSavedRoutines() {
        const res = await api.get("/routine/view/list");
        setSavedRoutines(res.data);
    }

    useEffect(() => {
        getSavedRoutines();
    },[]);

    return (
        <Grid className={classes.pageGrid} gutter="xl">
            <Grid.Col span={{ base: 12, lg: 8 }}>
                <div className={classes.heroPanel}>
                    <WorkoutRoutineList
                        savedRoutines={savedRoutines}
                    />
                </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 4 }}>
                <div className={classes.formPanel}>
                    <RoutineBasicForm
                        getSavedRoutines={getSavedRoutines}
                    />
                </div>
            </Grid.Col>
        </Grid>
    );
}
