
import { useState } from "react";
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";

import Sidebar from "../organisms/Sidebar";
import { useAuth } from "../../context/AuthContext";
import "../../styles/layout.css";

export default function MainLayout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);

    const { user, role, logout } = useAuth();
    const navigate = useNavigate();

    const displayName = user?.name || user?.email || "User";
    const initial = displayName.charAt(0).toUpperCase();

    function handleLogout() {
        setMenuAnchor(null);
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <Box className="main-layout">
            <Sidebar
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            <Box component="main" className="main-content">
                <Box component="header" className="app-topbar">
                    <Box className="topbar-left">
                        <IconButton
                            className="mobile-menu-button"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open navigation"
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography className="topbar-brand">
                            Employee Management System
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={(event) => setMenuAnchor(event.currentTarget)}
                        aria-label="Open profile menu"
                        aria-controls={menuAnchor ? "profile-menu" : undefined}
                        aria-haspopup="true"
                    >
                        <Avatar className="profile-avatar">{initial}</Avatar>
                    </IconButton>

                    <Menu
                        id="profile-menu"
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={() => setMenuAnchor(null)}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <Box className="profile-menu-user">
                            <Avatar>{initial}</Avatar>
                            <Box>
                                <Typography fontWeight={600}>{displayName}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {role}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider />

                        <MenuItem onClick={handleLogout}>
                            <LogoutOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>

                <Box className="page-content">{children}</Box>
            </Box>
        </Box>
    );
}