import {useNavigate} from "react-router-dom";
import classes from "../css/sidebar.module.css";
import {
    IconHome2,
    IconGauge,
    IconDeviceDesktopAnalytics,
    IconCalendarStats,
    IconUser,
    IconFingerprint,
    IconSettings,
    IconSwitchHorizontal,
    IconLogout
} from "@tabler/icons-react";
import {CiDumbbell, CiStickyNote} from "react-icons/ci";
import { MantineLogo } from '@mantinex/mantine-logo';
import {Center, Stack, Tooltip, UnstyledButton} from "@mantine/core";
import {useState} from "react";
import api from "../api/api.js";

function NavbarLink({icon: Icon, label, active, onClick, path}){
    const navigate = useNavigate();
    return (
        <Tooltip label={label} position="right" transitionProps={{duration: 0}}>
            <UnstyledButton
                onClick={() => {
                    onClick();
                    navigate(path);
                }}
                className={classes.link}
                data-active={active || undefined}
                aria-label={label}
            >
                <Icon size={25} stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    )
}

const mockdata = [
    {icon: IconHome2, label: "Home", path: "/main/home"},
    {icon: IconCalendarStats, label: "캘린더", path: ""},
    {icon: CiStickyNote , label: "운동루틴", path: "/main/workoutRoutine"},
    {icon: IconGauge, label: "Dashboard", path: ""},
    {icon: IconUser, label: "사용자"},
    {icon: IconFingerprint, label: "Security"},
    {icon: IconSettings, label: "Settings"},
];

export default function sidebar () {
    const [active, setActive] = useState(0);
    const navigate = useNavigate();

    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ));

    const logout = () => {
        api.post("/logout")
            .then(res => {
                console.log(res);
                if(res.status === 200){
                    sessionStorage.removeItem("loginId");
                    navigate("/");
                    alert(res.data.message);
                }
            })
    }

    return (
        <>
            <nav className={classes.navbar}>
                <Center mt="md">
                    <CiDumbbell size={40} color="var(--mantine-color-blue-5)"/>
                </Center>

                <div className={classes.navbarMain}>
                    <Stack justify="center" gap={0}>
                        {links}
                    </Stack>
                </div>

                <Stack justify="center" gap={0}>
                    <NavbarLink icon={IconSwitchHorizontal} label="Change Account" />
                    <NavbarLink icon={IconLogout} label="Logout" onClick={logout}/>
                </Stack>
            </nav>
        </>
    )
}