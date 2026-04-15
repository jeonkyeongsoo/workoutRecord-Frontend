import {Route, Routes} from "react-router-dom";
import Login from './loginPage/Login.jsx'
import MainLayout from "../component/MainLayout.jsx";
import Signup from "./signup/Signup.jsx";
import ForgotPassword from "./loginPage/ForgotPassword.jsx";
import SendEmail from "./loginPage/SendEmail.jsx";
import ConfirmAuthCode from "./loginPage/ConfirmAuthCode.jsx";

export default function App() {

    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/forgotPassword" element={<ForgotPassword/>}/>
            <Route path="/forgotPassword/sendEmail" element={<SendEmail/>}/>
            <Route path="/forgotPassword/confirmAuthCode" element={<ConfirmAuthCode/>}/>

            <Route path="/main" element={<MainLayout/>}>
                {/*<Route path="workout-calendar" element={</>}/>*/}
            </Route>
        </Routes>
    );
}
