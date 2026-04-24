import { useState } from "react";
import { Drawer } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import "../css/mainLayout.css";

export default function MainLayout() {
    const [mobileNavOpened, setMobileNavOpened] = useState(false);

    return (
        <div className="layout">
            <Header
                mobileNavOpened={mobileNavOpened}
                onToggleMobileNav={() => setMobileNavOpened((opened) => !opened)}
            />

            <div className="body-area">
                <aside className="desktop-sidebar">
                    <Sidebar />
                </aside>

                <Drawer
                    opened={mobileNavOpened}
                    onClose={() => setMobileNavOpened(false)}
                    title="메뉴"
                    padding="md"
                    size="260px"
                    classNames={{ body: "mobile-drawer-body" }}
                >
                    <Sidebar mobile onNavigate={() => setMobileNavOpened(false)} />
                </Drawer>

                <main className="content-page">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
