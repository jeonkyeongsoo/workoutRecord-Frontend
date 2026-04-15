import { IconArrowLeft } from '@tabler/icons-react';
import {Anchor, Box, Button, Center, Container, Group, Paper, Text, TextInput, Title} from "@mantine/core";
import classes from "../../css/loginPage/forgotPassword.module.css";
import {useNavigate, Link} from "react-router-dom";
import {useState} from "react";
import api from "../../api/api.js";

export default function ForgotPassword() {
    const [loginId, setLoginId] = useState('');
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');

    const confirmUserByLoginId = () => {
        setErrorMsg('');

        if(!loginId || loginId.trim() === "") {
            setErrorMsg("아이디를 입력하세요.");
            return;
        }

        api.post('/forgotPassword/confirmUserByLoginId', {loginId})
            .then(res => {

                console.log(res);
                if(res.statusText === "OK") {
                    navigate("/forgotPassword/sendEmail");
                }
            })
            .catch((err) => {
                const errMsg = err?.response?.data;
                setErrorMsg(errMsg);
                console.log(errMsg);
            })
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter") {
            confirmUserByLoginId();
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
                        아이디를 입력하세요.
                    </Text>

                    <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                        <TextInput label="아이디" placeholder="아이디" required onKeyDown={handleKeyDown} value={loginId} onChange={(e) => setLoginId(e.target.value)}/>
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
                            <Button className={classes.control} onClick={confirmUserByLoginId}>다음</Button>
                        </Group>
                    </Paper>
                </Container>
            </div>
        </>
    )
}