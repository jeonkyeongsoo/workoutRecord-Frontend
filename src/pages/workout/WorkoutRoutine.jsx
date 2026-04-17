import {Autocomplete, Container, Grid, Select, TextInput} from "@mantine/core";
import classes from "../../css/workout/workoutRoutine/workoutRoutine.module.css";
import { CiCirclePlus } from "react-icons/ci";
import {useState} from "react";

const WORKOUT_ROUTINE_LIST = {
    가슴: ['벤치프레스', '인클라인 벤치프레스', '디클라인 벤치프레스', '덤벨 플라이', '펙덱 플라이', '케이블 크로스오버', '푸쉬업'],
    등: ['데드리프트', '바벨로우', '덤벨로우', '랫풀다운', '풀업', '시티드 로우', '티바로우'],
    어깨: ['오버헤드 프레스', '사이드 레터럴 레이즈', '프론트 레이즈', '벤트오버 레터럴 레이즈', '페이스풀', '슈러그', '아놀드 프레스'],
    하체: ['스쿼트', '레그프레스', '런지', '레그 익스텐션', '레그컬', '루마니안 데드리프트', '카프 레이즈'],
    이두: ['바벨 컬', '덤벨 컬', '해머 컬', '프리처 컬', '컨센트레이션 컬', '케이블 컬'],
    삼두: ['케이블 푸쉬다운', '라잉 트라이셉스 익스텐션', '딥스', '오버헤드 익스텐션', '클로즈 그립 벤치프레스', '킥백'],
    복근: ['크런치', '레그 레이즈', '플랭크', '러시안 트위스트', '행잉 레그 레이즈', '케이블 크런치', '바이시클 크런치'],
};

const body_parts = Object.keys(WORKOUT_ROUTINE_LIST);

export default function WorkoutRoutine() {
    const [workoutRoutine, setWorkoutRoutine] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    return(
        <>
            <Grid>
                <Grid.Col span={8}>  {/* 왼쪽 */}
                    <div>
                        자주하는 운동을 등록해보세요!
                    </div>
                </Grid.Col>
                <Grid.Col span={4} >  {/* 오른쪽 */}
                    <div>
                        <TextInput label="나만의 운동" placeholder="나만의 별칭으로 만들어보아요." className={classes}/>

                        <Select
                            mt="md"
                            comboboxProps={{withinPortal: true}}
                            data={body_parts}
                            placeholder="하나를 선택해주세요."
                            label="등록할 운동루틴을 선택하세요!"
                            className={classes}
                            onChange={(value) => setWorkoutRoutine(WORKOUT_ROUTINE_LIST[value])}
                        />

                        <br/>
                        <div>

                        </div>
                        <CiCirclePlus size={50} onClick={() => setIsOpen(!isOpen)} style={{cursor: "pointer"}}/>

                        {isOpen && (
                            <>
                                <Container size={460} my={100} >
                                    <Autocomplete
                                        label="운동선택"
                                        placeholder="운동을 선택하거나 입력하세요!"
                                        data={WORKOUT_ROUTINE_LIST[workoutRoutine]}
                                        searchable
                                    />

                                </Container>
                            </>
                        )}
                    </div>
                </Grid.Col>
            </Grid>
        </>
    )
}