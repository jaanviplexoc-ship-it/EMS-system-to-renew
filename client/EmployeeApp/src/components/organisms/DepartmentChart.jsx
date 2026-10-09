
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function DepartmentChart({ data = [] }) {
    const maxEmployees = Math.max(
        1,
        ...data.map((item) => item.employees ?? 0)
    );

    return (
        <Card className="dashboard-table-card">
            <CardContent>
                <Typography variant="h6" mb={1}>
                    Department Distribution
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={3}>
                    Active employees by department
                </Typography>

                {data.length === 0 ? (
                    <Typography color="text.secondary">
                        No department data available.
                    </Typography>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {data.map((department) => (
                            <Box key={department.name}>
                                <Box display="flex" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="body2">{department.name}</Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {department.employees}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        height: 8,
                                        borderRadius: 8,
                                        bgcolor: "#eeeef4",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: "100%",
                                            width: `${(department.employees / maxEmployees) * 100}%`,
                                            bgcolor: "#8b7de0",
                                            borderRadius: 8,
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