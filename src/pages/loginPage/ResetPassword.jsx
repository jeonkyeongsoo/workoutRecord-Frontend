import classes from "../../css/loginPage/sendEmail.module.css";
import {Anchor, Box, Button, Center, Container, Group, Paper, Text, Title, PasswordInput} from "@mantine/core";
import {IconArrowLeft} from "@tabler/icons-react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import api from "../../api/api.js";

export default function ResetPassword() {
    const loginId = sessionStorage.getItem("loginId");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const session = searchParams.get("session");
    const alertShown = useRef(false);

    /*useEffect(() => {
        if(!session && !alertShown.current) {
            alertShown.current = true;
            alert("잘못된 접근입니다.");
            navigate("/");
        }
    },[]);*/

    // 브라우저 뒤로가기 누를시에 비밀번호 찾기 처음 페이지로 보내버림.
    useEffect(() => {
        // 현재 페이지를 히스토리에 추가해서 뒤로가기 감지 가능하게
        window.history.pushState(null, '', window.location.href);

        // 브라우저 뒤로가기 감지
        const handlePopState = () => {
            navigate("/forgotPassword");
        }

        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        }
    }, []); // [] 의존성 배열 -> 마운트 될 때 딱 한번만 실행

    const clickNext = () => {
        setErrorMsg("");

        if(!password || password === "" || !confirmPassword || confirmPassword === ""){
            setErrorMsg("필수항목을 채우세요.");
            return;
        }

        let passwordReg = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\]).{8,}$/;
        if(!passwordReg.test(password) || !passwordReg.test(confirmPassword)){
            setErrorMsg("비밀번호를 다시 입력하세요.");
            return;
        }

        if(password !== confirmPassword){
            setErrorMsg("비밀번호가 일치하지 않습니다. 다시 한번 확인하세요.");
            return;
        }

        api.post("/resetPassword", {loginId: loginId, password: password})
            .then((res) => {
                if(res.statusText === "OK") {
                    sessionStorage.removeItem("loginId");
                    navigate("/");
                }
            })
            .catch((err) => {
                const errMsg = err?.response?.data;
                setErrorMsg(errMsg);
            })
    }

    return (
        <>
            <div className={classes.container}>
                <Container size={460} my={100} >
                    <Title className={classes.title} ta="center">
                        비밀번호를 잊어버렸나요?
                    </Title>
                    <Text c="dimmed" fz="sm" ta="center" my="md">
                        비밀번호를 입력하세요.
                    </Text>

                    <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                        <PasswordInput type="password" label="비밀번호" placeholder="비밀번호" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <br/>
                        <PasswordInput label="비밀번호 확인" placeholder="비밀번호 확인" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                        <Text c="dimmed" fz="sm" ta="center" mt="md" c="red">
                            {errorMsg }
                        </Text>

                        <br/><br/>
                        <Group justify="space-between" mt="lg" className={classes.controls}>
                            <Anchor c="dimmed" size="sm" className={classes.control}>
                                <Center inline>
                                    <IconArrowLeft size={20} stroke={1.5} />
                                    <Box ml={5}><Anchor component={Link} to="/">로그인으로 돌아가기</Anchor></Box>
                                </Center>
                            </Anchor>
                            <Button className={classes.control} onClick={clickNext}>다음</Button>
                        </Group>
                    </Paper>
                </Container>
            </div>
        </>
    )
}