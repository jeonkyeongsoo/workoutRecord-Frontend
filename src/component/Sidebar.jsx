import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Center, Group, Stack, Text, Tooltip, UnstyledButton } from "@mantine/core";
import {
    IconCalendarStats,
    IconFingerprint,
    IconGauge,
    IconHome2,
    IconLogout,
    IconSettings,
    IconSwitchHorizontal,
    IconUser,
} from "@tabler/icons-react";
import { CiDumbbell, CiStickyNote } from "react-icons/ci";
import classes from "../css/sidebar.module.css";
import api from "../api/api.js";

function NavbarLink({ icon, label, active, onClick, path, mobile = false }) {
    const navigate = useNavigate();
    const LinkIcon = icon;
    const button = (
        <UnstyledButton
            onClick={() => {
                onClick?.();
                if (path) {
                    navigate(path);
                }
            }}
            className={`${classes.link} ${mobile ? classes.mobileLink : ""}`}
            data-active={active || undefined}
            aria-label={label}
        >
            <Group gap="sm" wrap="nowrap">
                <LinkIcon size={22} stroke={1.5} />
                {mobile && <Text size="sm">{label}</Text>}
            </Group>
        </UnstyledButton>
    );

    if (mobile) {
        return button;
    }

    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            {button}
        </Tooltip>
    );
}

const navItems = [
    { icon: IconHome2, label: "홈", path: "/main/home" },
    { icon: IconCalendarStats, label: "캘린더", path: "" },
    { icon: CiStickyNote, label: "운동루틴", path: "/main/workoutRoutine" },
    { icon: IconGauge, label: "대시보드", path: "" },
    { icon: IconUser, label: "사용자", path: "" },
    { icon: IconFingerprint, label: "보안", path: "" },
    { icon: IconSettings, label: "설정", path: "" },
];

export default function Sidebar({ mobile = false, onNavigate }) {
    const [active, setActive] = useState(0);
    const navigate = useNavigate();

    const handleNavClick = (index) => {
        setActive(index);
        onNavigate?.();
    };

    const logout = () => {
        api.post("/logout").then((res) => {
            if (res.status === 200) {
                sessionStorage.removeItem("loginId");
                onNavigate?.();
                navigate("/");
                alert(res.data.message);
            }
        });
    };

    return (
        <nav className={`${classes.navbar} ${mobile ? classes.mobileNavbar : ""}`}>
            <Center mt={mobile ? 0 : "md"} mb={mobile ? "lg" : 0}>
                <CiDumbbell size={40} color="var(--mantine-color-blue-5)" />
            </Center>

            <div className={classes.navbarMain}>
                <Stack justify="center" gap={mobile ? "xs" : 0}>
                    {navItems.map((link, index) => (
                        <NavbarLink
                            {...link}
                            key={link.label}
                            active={index === active}
                            mobile={mobile}
                            onClick={() => handleNavClick(index)}
                        />
                    ))}
                </Stack>
            </div>

            <Stack justify="center" gap={mobile ? "xs" : 0}>
                <NavbarLink
                    icon={IconSwitchHorizontal}
                    label="계정 전환"
                    mobile={mobile}
                    onClick={onNavigate}
                />
                <NavbarLink
                    icon={IconLogout}
                    label="로그아웃"
                    mobile={mobile}
                    onClick={logout}
                />
            </Stack>
        </nav>
    );
}
