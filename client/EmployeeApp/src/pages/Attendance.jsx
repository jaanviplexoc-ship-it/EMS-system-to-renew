
import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Chip,
    CircularProgress,
    TextField,
    Typography,
} from "@mui/material";
import MainLayout from "../components/molecules/MainLayout";
import { getAttendance, checkIn, checkOut } from "../services/attendanceApi";
import { useAuth } from "../context/AuthContext";

function getLocalDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatTime(value) {
    if (!value) return "—";

    return new Date(value).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function Attendance() {
    const { role } = useAuth();
    const isAdmin = role === "Admin";

    const [date, setDate] = useState(getLocalDate());
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [working, setWorking] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function loadAttendance(selectedDate = date) {
        try {
            setLoading(true);
            setError("");

            const response = await getAttendance(selectedDate);
            setRecords(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load attendance records."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAttendance(date);
        // Initial load only; date changes are handled by the form button.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleAttendanceAction(action) {
        try {
            setWorking(true);
            setError("");
            setMessage("");

            if (action === "check-in") {
                await checkIn();
                setMessage("Check-in completed successfully.");
            } else {
                await checkOut();
                setMessage("Check-out completed successfully.");
            }

            await loadAttendance(date);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update attendance."
            );
        } finally {
            setWorking(false);
        }
    }

    const todayRecord = records.find(
        (record) => record.attendanceDate?.slice(0, 10) === getLocalDate()
    );

    return (
        <MainLayout>
            <div className="page-heading">
                <Typography variant="h4" fontWeight={700}>
                    Attendance
                </Typography>

                <Typography color="text.secondary" mt={1} mb={3}>
                    {isAdmin
                        ? "View employee attendance records."
                        : "Manage your daily check-in and check-out."}
                </Typography>
            </div>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

            {!isAdmin && (
                <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                    <Typography variant="h6" mb={1}>
                        Today's Attendance
                    </Typography>

                    <Typography color="text.secondary" mb={2}>
                        Check in when you start work and check out when you finish.
                    </Typography>

                    <Typography mb={2}>
                        Check-in: <strong>{formatTime(todayRecord?.checkIn)}</strong>
                        {" · "}
                        Check-out: <strong>{formatTime(todayRecord?.checkOut)}</strong>
                    </Typography>

                    <div className="d-flex flex-wrap gap-2">
                        <Button
                            variant="contained"
                            disabled={working || Boolean(todayRecord)}
                            onClick={() => handleAttendanceAction("check-in")}
                        >
                            {working ? "Please wait..." : "Check In"}
                        </Button>

                        <Button
                            variant="outlined"
                            disabled={
                                working ||
                                !todayRecord?.checkIn ||
                                Boolean(todayRecord?.checkOut)
                            }
                            onClick={() => handleAttendanceAction("check-out")}
                        >
                            Check Out
                        </Button>
                    </div>
                </Card>
            )}

            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3 border-bottom">
                    <div>
                        <Typography variant="h6">Attendance Records</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {records.length} record(s)
                        </Typography>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <TextField
                            size="small"
                            type="date"
                            label="Date"
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />

                        <Button
                            variant="outlined"
                            onClick={() => loadAttendance(date)}
                            disabled={loading}
                        >
                            Apply
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center p-5">
                        <CircularProgress />
                    </div>
                ) : records.length === 0 ? (
                    <div className="p-5 text-center text-secondary">
                        No attendance records found for this date.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead>
                                <tr>
                                    {isAdmin && <th>Employee</th>}
                                    <th>Date</th>
                                    <th>Check-in</th>
                                    <th>Check-out</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {records.map((record) => (
                                    <tr key={record.attendanceId}>
                                        {isAdmin && (
                                            <td>
                                                <strong>{record.employeeName}</strong>
                                                <div className="text-secondary small">
                                                    {record.employeeCode}
                                                </div>
                                            </td>
                                        )}

                                        <td>
                                            {new Date(record.attendanceDate).toLocaleDateString()}
                                        </td>

                                        <td>{formatTime(record.checkIn)}</td>
                                        <td>{formatTime(record.checkOut)}</td>

                                        <td>
                                            <Chip
                                                size="small"
                                                label={record.checkOut ? "Completed" : record.checkIn ? "In progress" : record.status}
                                                color={record.checkOut ? "success" : "primary"}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </MainLayout>
    );
}