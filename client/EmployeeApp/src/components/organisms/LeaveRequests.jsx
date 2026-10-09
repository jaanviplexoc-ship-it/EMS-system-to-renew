
import {
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LeaveRequests({ requests = [] }) {
    const { role } = useAuth();
    const navigate = useNavigate();

    return (
        <Card className="dashboard-table-card">
            <CardContent>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                >
                    <Typography variant="h6">Leave Requests</Typography>

                    <Button size="small" onClick={() => navigate("/leave")}>
                        View all
                    </Button>
                </Stack>

                <Typography variant="body2" color="text.secondary" mb={2}>
                    {role === "Admin"
                        ? "Latest employee leave applications"
                        : "Your latest leave applications"}
                </Typography>

                {requests.length === 0 ? (
                    <Typography color="text.secondary">
                        No leave requests found.
                    </Typography>
                ) : (
                    <Stack gap={1.5}>
                        {requests.slice(0, 5).map((request) => (
                            <Stack
                                key={request.leaveRequestId}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                gap={1}
                                sx={{ py: 1, borderBottom: "1px solid #eee" }}
                            >
                                <div>
                                    <Typography fontWeight={600} fontSize={14}>
                                        {role === "Admin"
                                            ? request.employeeName
                                            : request.leaveType}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        {request.leaveType} ·{" "}
                                        {new Date(request.startDate).toLocaleDateString()}
                                    </Typography>
                                </div>

                                <Chip
                                    size="small"
                                    label={request.status}
                                    color={
                                        request.status === "Approved"
                                            ? "success"
                                            : request.status === "Rejected"
                                                ? "error"
                                                : "warning"
                                    }
                                />
                            </Stack>
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}