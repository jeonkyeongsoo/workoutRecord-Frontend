import {useEffect, useState} from "react";
import api from "../../api/api.js";
import classes from "../../css/loginPage/login.module.css";
import {useNavigate, Link} from "react-router-dom";
import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from '@mantine/core';

export default function LoginForm() {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const rememberMe = localStorage.getItem('loginId');
        if(rememberMe) {
            setLoginId(rememberMe);
            setRememberMe(true);
        }
    }, []);

    const submitLogin = async (e) => {
        e.preventDefault();

        if(loading) return;

        setErrorMsg('');

        let flag = false;
        const validateErrMsg = validation(loginId, password);
        if(!validateErrMsg) {
           flag = true;
        } else {
            setErrorMsg(validateErrMsg);
        }

        const formData = new FormData();
        formData.append('loginId', loginId);
        formData.append('password', password);

        try{
            setLoading(true);
            if(flag) {
                const res = await api.post('/login', formData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                if(rememberMe) {
                    localStorage.setItem('loginId', loginId);
                } else{
                    localStorage.removeItem('loginId');
                }

                if(res.data.result === "success"){
                    navigate("/main");
                }
            }

        } catch (err) {
            const errorMessage = err.response?.data?.msg || "로그인에 실패했습니다.";
            setErrorMsg(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className={classes.loginPage}>
                <Container size={420} my={180}>
                    <Title ta="center" className={classes.title}>
                        WORKOUT RECORD
                    </Title>

                    <Text className={classes.subtitle}>
                        아직 계정이 없으신가요? <Anchor component={Link} to="/signup" size="sm">회원가입</Anchor>
                    </Text>

                    <form className="loginForm" onSubmit={submitLogin}>
                        <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
                            <TextInput label="아이디" placeholder="아이디를 입력하세요." required radius="md" value={loginId} onChange={(e) => setLoginId(e.target.value)}/>
                            <PasswordInput label="비밀번호" placeholder="비밀번호를 입력하세요." required mt="md" radius="md" value={password} onChange={(e) => setPassword(e.target.value)}cd />

                            <Group justify="space-between" mt="lg">
                                <Checkbox label="아이디 저장" className="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.currentTarget.checked)}/>
                                <Anchor component={Link} to="/forgotPassword" size="sm" >
                                    비밀번호를 잊어버렸나요?
                                </Anchor>
                            </Group>
                            <Button fullWidth mt="xl" radius="md" type="submit">
                                로그인
                            </Button>
                        </Paper>
                    </form>
                    <Text className="errorMsg" ta="center" mt="md" c="red">
                        {errorMsg}
                    </Text>
                </Container>
            </div>
        </>
    )
}

const validation = (loginId, password) => {
    const trimmedLoginId = loginId.trim();
    const trimmedPassword = password.trim();
    let msg = ""

    let reg = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\]).{8,}$/;

    if(!trimmedLoginId) {
        msg = "아이디를 입력하세요.";
        return msg;
    }

    if(!trimmedPassword){
        msg = "비밀번호를 입력하세요.";
        return msg;
    }

    if(!reg.test(trimmedPassword)) {
        msg = "비밀번호를 다시 입력하세요.";
        return msg;
    }
}



