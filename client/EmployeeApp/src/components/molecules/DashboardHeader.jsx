
import { Box, Typography } from "@mui/material";

export default function DashboardHeader() {
    return (
        <Box className="dashboard-header">
            <Box>
                <Typography variant="h4" className="dashboard-title">
                    Dashboard
                </Typography>

                <Typography className="dashboard-subtitle">
                    Welcome back! Here's what's happening today.
                </Typography>
            </Box>
        </Box>
    );
}