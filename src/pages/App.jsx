import {Route, Routes} from "react-router-dom";
import Login from './loginPage/Login.jsx'
import MainLayout from "../component/MainLayout.jsx";
import Signup from "./signup/Signup.jsx";
import ForgotPassword from "./loginPage/ForgotPassword.jsx";
import SendEmail from "./loginPage/SendEmail.jsx";
import ConfirmAuthCode from "./loginPage/ConfirmAuthCode.jsx";
import ResetPassword from "./loginPage/ResetPassword.jsx";
import WorkoutRoutine from "./workout/WorkoutRoutine.jsx";
import Home from "./Home.jsx";

export default function App() {

    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/forgotPassword" element={<ForgotPassword/>}/>
            <Route path="/forgotPassword/sendEmail" element={<SendEmail/>}/>
            <Route path="/forgotPassword/confirmAuthCode" element={<ConfirmAuthCode/>}/>
            <Route path="/forgotPassword/resetPassword" element={<ResetPassword/>}/>

            <Route path="/main" element={<MainLayout/>}>
                <Route path="home" element={<Home/>} />
                <Route path="workoutRoutine" element={<WorkoutRoutine/>} />
            </Route>
        </Routes>
    );
}
