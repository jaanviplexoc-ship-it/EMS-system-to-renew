
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function AttendanceChart({ data = [] }) {
    const maxValue = Math.max(
        1,
        ...data.map((item) => Math.max(item.present ?? 0, item.absent ?? 0))
    );

    return (
        <Card className="dashboard-table-card">
            <CardContent>
                <Typography variant="h6" mb={1}>
                    Attendance Trend
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={3}>
                    Present and not-marked counts for the last seven days
                </Typography>

                {data.length === 0 ? (
                    <Typography color="text.secondary">
                        No attendance trend available.
                    </Typography>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {data.map((item) => (
                            <Box key={item.day}>
                                <Box display="flex" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="body2">{item.day}</Typography>
                                    <Typography variant="body2">
                                        {item.present} present · {item.absent} not marked
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        width: "100%",
                                        height: 12,
                                        borderRadius: 10,
                                        overflow: "hidden",
                                        bgcolor: "#ececf2",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: `${(item.present / maxValue) * 100}%`,
                                            bgcolor: "#6654c0",
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            flex: 1,
                                            bgcolor: "#e4e6ed",
                                        }}
                                    />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}