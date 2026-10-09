
import {
    Avatar,
    Card,
    CardContent,
    Chip,
    Typography,
} from "@mui/material";

export default function RecentEmployees({
    employees = [],
    title = "Recent Employees",
    emptyMessage = "No employees found.",
}) {
    return (
        <Card className="dashboard-table-card">
            <CardContent>
                <Typography variant="h6" mb={1}>
                    {title}
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={2}>
                    Recently added employee records
                </Typography>

                {employees.length === 0 ? (
                    <Typography color="text.secondary">{emptyMessage}</Typography>
                ) : (
                    <div className="table-responsive">
                        <table className="table dashboard-table">
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Department</th>
                                    <th>Designation</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee.employeeId}>
                                        <td>
                                            <div className="employee-cell">
                                                <Avatar>
                                                    {employee.name?.charAt(0)?.toUpperCase() || "E"}
                                                </Avatar>
                                                <span>{employee.name}</span>
                                            </div>
                                        </td>

                                        <td>{employee.department}</td>
                                        <td>{employee.designation}</td>

                                        <td>
                                            <Chip
                                                label={employee.status}
                                                size="small"
                                                color={employee.status === "Active" ? "success" : "default"}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}