import { IconArrowLeft } from '@tabler/icons-react';
import {Anchor, Box, Button, Center, Container, Group, Paper, Text, TextInput, Title} from "@mantine/core";
import classes from "../../css/loginPage/sendEmail.module.css";
import {useNavigate, Link, useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import api from "../../api/api.js";

export default function SendEmail () {
    const loginId = sessionStorage.getItem("loginId");
    const [email, setEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const session = searchParams.get("session");
    const alertShown = useRef(false);

    useEffect(() => {
        if(!session && !alertShown.current) {
            alertShown.current = true;
            alert("잘못된 접근입니다.");
            navigate("/");
        }
    },[]);

    const clickNext = async () => {
        setErrorMsg("");

        if(!email || email === ""){
            setErrorMsg("이메일을 입력하세요.");
            return;
        }
        let emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailReg.test(email)){
           setErrorMsg("이메일을 다시 입력하세요.");
           return;
        }

        try{
            const res = await api.post("/sendMail", {email: email, type: "resetPassword", loginId: loginId}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(res.statusText === "OK") {
                sessionStorage.setItem("email", email);
                navigate("/forgotPassword/confirmAuthCode?session=" + session);
            }

        } catch (err) {
            const errMsg = err?.response?.data;
            setErrorMsg(errMsg);
        }
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter") {
            clickNext();
        }
    }

    return (
        <>
            <div className={classes.container}>
                <Container size={460} my={100} >
                    <Title className={classes.title} ta="center">
                        비밀번호를 잊어버렸나요?
                    </Title>
                    <Text c="dimmed" fz="sm" ta="center" my="md">
                        이메일을 입력하세요.
                    </Text>

                    <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                        <TextInput label="이메일" placeholder="본인확인 이메일" required onKeyDown={handleKeyDown} value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <Text c="dimmed" fz="sm" ta="center" mt="md" c="red">
                            {errorMsg}
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