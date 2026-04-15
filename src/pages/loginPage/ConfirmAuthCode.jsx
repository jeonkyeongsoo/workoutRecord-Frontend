import classes from "../../css/loginPage/confirmAuthCode.module.css";
import {Anchor, Box, Button, Center, Container, Group, Paper, PinInput, Text, TextInput, Title} from "@mantine/core";
import {IconArrowLeft} from "@tabler/icons-react";
import {Link} from "react-router-dom";
import api from "../../api/api.js";
import {useState} from "react";

export default function ConfirmAuthCode() {
    const [errorMsg, setErrorMsg] = useState("");

    const handleverifyCode = (value) => {

        const email = sessionStorage.getItem("email");

        api.post("/verifyCode", {email: email, authCode: value})
            .then((res) => {
                console.log(res);
                sessionStorage.removeItem("email");
            })
            .catch((err) => {
                const errMsg = err?.response?.data;
                setErrorMsg(errMsg);
                console.log(errMsg);
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
                        인증코드를 입력하세요.
                    </Text>

                    <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                        <PinInput length={6} type="number" mask placeholder="" oneTimeCode size="lg" onComplete={(value) => console.log(value)}/>
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
                        </Group>
                    </Paper>
                </Container>
            </div>
        </>
    )
}