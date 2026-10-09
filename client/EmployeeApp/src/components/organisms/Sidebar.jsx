
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined"; import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const drawerWidth = 250;

export default function Sidebar({ mobileOpen, onClose }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { role } = useAuth();

  const links = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: <DashboardOutlinedIcon />,
    },
    ...(role === "Admin"
      ? [{
        label: "Employees",
        to: "/employees",
        icon: <PeopleAltOutlinedIcon />,
      }]
      : []),
    {
      label: "Attendance",
      to: "/attendance",
      icon: <AccessTimeOutlinedIcon />,
    },
    {
      label: "Leave",
      to: "/leave",
      icon: <EventNoteOutlinedIcon />,
    },
  ];

  const drawerContent = (
    <Box className="sidebar-content">
      <Box className="sidebar-brand">
        <Box className="sidebar-brand-mark">E</Box>
        <Box>
          <Typography className="sidebar-brand-title">EMS Portal</Typography>
          <Typography className="sidebar-brand-subtitle">
            Employee workspace
          </Typography>
        </Box>
      </Box>

      <Typography className="sidebar-section-label">
        WORKSPACE
      </Typography>

      <List className="sidebar-navigation">
        {links.map((link) => (
          <ListItemButton
            key={link.to}
            component={NavLink}
            to={link.to}
            onClick={onClose}
            className="sidebar-link"
          >
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>

      <Box className="sidebar-footer">
        <Typography variant="caption">
          Employee Management System
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onClose}
      sx={{
        width: isMobile ? undefined : drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid #e8eaf0",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}