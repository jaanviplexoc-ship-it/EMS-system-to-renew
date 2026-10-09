import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function SidebarItem({ to, icon, text }) {
    return (
        <>
            <ListItemButton
                component={NavLink}
                to={to}>

                <ListItemIcon>
                    {icon}
                </ListItemIcon>

                <ListItemText primary={text} />
            </ListItemButton>

        </>

    );
}