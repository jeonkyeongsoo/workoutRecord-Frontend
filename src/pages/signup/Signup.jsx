import classes from "../../css/signup/signup.module.css";
import {Anchor, Button, Checkbox, Paper, PasswordInput, Text, TextInput, Title} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import api from "../../api/api.js";

export default function Signup() {
    const navigate = useNavigate();
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [birth, setBirth] = useState('');
    const [phone, setPhone] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const formatBirth = (value) => {
        const digits = value.replace(/\D/g, ''); // 숫자만 추출
        if (digits.length <= 4) return digits;
        if (digits.length <= 6) return `${digits.slice(0,4)} - ${digits.slice(4)}`;
        return `${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6,8)}`;
    }

    const submitSignup = async () => {

        let flag = false;
        let isMsg = validation(loginId, password, email, name, birth, phone);
        if(!isMsg) {
            flag = true;
            setErrorMsg('');
        } else {
            setErrorMsg(isMsg);
        }
        try{
            if(flag) {
                const params = {loginId, password, email, name, birth, phone};
                const res = await api.post('/signup', params);

                if(res.data.result === "success") {
                    alert("회원가입이 성공적으로 완료되었습니다.");
                    navigate("/");
                }

            }
        } catch (err) {
            const errorMsg = err?.response?.data;
            setErrorMsg(errorMsg?.msg);
        }


    }

    return (
        <>
            <div className={classes.wrapper}>
                <Paper className={classes.form}>
                    <Title order={2} className={classes.title}>
                        WORKOUT RECORD
                    </Title>

                    <TextInput label="아이디" placeholder="아이디" size="md" required radius="md" value={loginId} onChange={(e) => setLoginId(e.target.value)}/>
                    <PasswordInput label="비밀번호" placeholder="비밀번호" mt="md" size="md" required radius="md" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <Text size="xs" c="dimmed">대소문자, 숫자, 특수문자 1개 이상 8자리 이상으로 입력하세요.</Text>
                    <TextInput label="이메일" placeholder="이메일" mt="md" size="md" radius="md" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <TextInput label="이름" placeholder="이름" mt="md" size="md" required radius="md" value={name} onChange={(e) => setName(e.target.value)} />
                    <TextInput label="생년월일" placeholder="생년월일 8자리" mt="md" size="md" required radius="md" value={birth} onChange={(e) => setBirth(formatBirth(e.currentTarget.value))}/>
                    <TextInput label="휴대폰 번호" placeholder="휴대폰 번호" mt="md" size="md" radius="md" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                    <Button fullWidth="xl" mt="xl" size="md" radius="md" onClick={submitSignup}>
                        회원가입
                    </Button>

                    <Text ta="center" mt="md" style={{color: "red"}}>
                        {errorMsg}
                    </Text>

                </Paper>
            </div>
        </>
    )
}

const validation = (loginId, password, email, name, birth, phone) => {

    let msg = "";
    if(!loginId || !password || !name || !birth || !email) {
        msg = "필수항목을 입력하세요.";
        return msg;
    }

    let passwordReg = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\]).{8,}$/;
    if(!passwordReg.test(password)){
        msg = "비밀번호를 다시 입력하세요.";
        return msg;
    }

    let emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(email && !emailReg.test(email)){
        msg = "이메일을 다시 입력하세요.";
        return msg;
    }

    let birthReg = /^\d{4}-\d{2}-\d{2}$/;
    if(!birthReg.test(birth)){
        msg = "생년월일을 다시 입력하세요.";
        return msg;
    }

    let phoneReg = /^010\d{8}$/;
    if(phone && !phoneReg.test(phone)){
        msg = "휴대폰 번호를 다시 입력하세요.";
        return msg;
    }


}