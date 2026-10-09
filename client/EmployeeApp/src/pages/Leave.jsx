
import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";

import MainLayout from "../components/molecules/MainLayout";
import {
    createLeaveRequest,
    getLeaveRequests,
    updateLeaveStatus,
} from "../services/leaveApi";
import { useAuth } from "../context/AuthContext";

const initialForm = {
    leaveType: "Casual",
    startDate: "",
    endDate: "",
    reason: "",
};

export default function Leave() {
    const { role } = useAuth();
    const isAdmin = role === "Admin";

    const [requests, setRequests] = useState([]);
    const [formData, setFormData] = useState(initialForm);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    async function loadRequests() {
        try {
            setLoading(true);
            setError("");

            const response = await getLeaveRequests();
            setRequests(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load leave requests."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRequests();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        if (formData.endDate < formData.startDate) {
            setError("End date cannot be before start date.");
            return;
        }

        try {
            setSaving(true);

            await createLeaveRequest(formData);

            setDialogOpen(false);
            setFormData(initialForm);
            setMessage("Leave request submitted successfully.");

            await loadRequests();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to submit leave request."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleReview(id, status) {
        try {
            setError("");
            setMessage("");

            await updateLeaveStatus(id, status);

            setMessage(`Leave request ${status.toLowerCase()} successfully.`);
            await loadRequests();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update the leave request."
            );
        }
    }

    const filteredRequests = requests.filter(
        (request) =>
            statusFilter === "All" || request.status === statusFilter
    );

    const pendingCount = requests.filter(
        (request) => request.status === "Pending"
    ).length;

    const approvedCount = requests.filter(
        (request) => request.status === "Approved"
    ).length;

    const rejectedCount = requests.filter(
        (request) => request.status === "Rejected"
    ).length;

    return (
        <MainLayout>
            <div className="page-heading d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <Typography variant="h4" fontWeight={700}>
                        Leave Management
                    </Typography>

                    <Typography color="text.secondary" mt={1}>
                        {isAdmin
                            ? "Review employee leave applications."
                            : "Submit and track your leave requests."}
                    </Typography>
                </div>

                {!isAdmin && (
                    <Button variant="contained" onClick={() => setDialogOpen(true)}>
                        Apply for Leave
                    </Button>
                )}
            </div>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <Card sx={{ p: 2.5, borderRadius: 3 }}>
                        <Typography color="text.secondary">Pending</Typography>
                        <Typography variant="h4" fontWeight={700}>
                            {pendingCount}
                        </Typography>
                    </Card>
                </div>

                <div className="col-12 col-md-4">
                    <Card sx={{ p: 2.5, borderRadius: 3 }}>
                        <Typography color="text.secondary">Approved</Typography>
                        <Typography variant="h4" fontWeight={700}>
                            {approvedCount}
                        </Typography>
                    </Card>
                </div>

                <div className="col-12 col-md-4">
                    <Card sx={{ p: 2.5, borderRadius: 3 }}>
                        <Typography color="text.secondary">Rejected</Typography>
                        <Typography variant="h4" fontWeight={700}>
                            {rejectedCount}
                        </Typography>
                    </Card>
                </div>
            </div>

            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3 border-bottom">
                    <div>
                        <Typography variant="h6">Leave Requests</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {filteredRequests.length} request(s)
                        </Typography>
                    </div>

                    <TextField
                        select
                        size="small"
                        label="Filter status"
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="All">All statuses</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                    </TextField>
                </div>

                {loading ? (
                    <div className="text-center p-5">
                        <CircularProgress />
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="p-5 text-center text-secondary">
                        No leave requests found.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead>
                                <tr>
                                    {isAdmin && <th>Employee</th>}
                                    <th>Leave type</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    {isAdmin && <th>Action</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRequests.map((request) => (
                                    <tr key={request.leaveRequestId}>
                                        {isAdmin && (
                                            <td>
                                                <strong>{request.employeeName}</strong>
                                                <div className="text-secondary small">
                                                    {request.employeeCode}
                                                </div>
                                            </td>
                                        )}

                                        <td>{request.leaveType}</td>

                                        <td>
                                            {new Date(request.startDate).toLocaleDateString()}
                                        </td>

                                        <td>
                                            {new Date(request.endDate).toLocaleDateString()}
                                        </td>

                                        <td style={{ minWidth: 180, whiteSpace: "normal" }}>
                                            {request.reason}
                                        </td>

                                        <td>
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
                                        </td>

                                        {isAdmin && (
                                            <td>
                                                {request.status === "Pending" ? (
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            size="small"
                                                            color="success"
                                                            onClick={() =>
                                                                handleReview(
                                                                    request.leaveRequestId,
                                                                    "Approved"
                                                                )
                                                            }
                                                        >
                                                            Approve
                                                        </Button>

                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            onClick={() =>
                                                                handleReview(
                                                                    request.leaveRequestId,
                                                                    "Rejected"
                                                                )
                                                            }
                                                        >
                                                            Reject
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <Dialog
                open={dialogOpen}
                onClose={() => !saving && setDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Apply for Leave</DialogTitle>

                    <DialogContent>
                        <div className="d-flex flex-column gap-3 pt-2">
                            <TextField
                                select
                                fullWidth
                                required
                                label="Leave type"
                                name="leaveType"
                                value={formData.leaveType}
                                onChange={handleChange}
                            >
                                <MenuItem value="Casual">Casual</MenuItem>
                                <MenuItem value="Sick">Sick</MenuItem>
                                <MenuItem value="Annual">Annual</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>

                            <TextField
                                fullWidth
                                required
                                type="date"
                                label="Start date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                slotProps={{ inputLabel: { shrink: true } }}
                                inputProps={{ min: new Date().toLocaleDateString("en-CA") }}
                            />

                            <TextField
                                fullWidth
                                required
                                type="date"
                                label="End date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                slotProps={{ inputLabel: { shrink: true } }}
                                inputProps={{
                                    min: formData.startDate || new Date().toLocaleDateString("en-CA"),
                                }}
                            />

                            <TextField
                                fullWidth
                                required
                                multiline
                                minRows={3}
                                label="Reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                inputProps={{ maxLength: 500 }}
                            />
                        </div>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button
                            onClick={() => setDialogOpen(false)}
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" variant="contained" disabled={saving}>
                            {saving ? "Submitting..." : "Submit Request"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </MainLayout>
    );
}