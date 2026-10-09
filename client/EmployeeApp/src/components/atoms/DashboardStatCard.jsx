
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function DashboardStatCard({
    title,
    value = 0,
    subtitle = "",
    icon,
}) {
    return (
        <Card className="dashboard-stat-card">
            <CardContent>
                <Box className="stat-card-top">
                    <Box>
                        <Typography className="stat-title">{title}</Typography>
                        <Typography className="stat-value">{value}</Typography>
                        <Typography className="stat-subtitle">{subtitle}</Typography>
                    </Box>

                    {icon && <Box className="stat-icon">{icon}</Box>}
                </Box>
            </CardContent>
        </Card>
    );
}