
import {
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

export default function EmployeeTable({ employees, departments, designations }) {
    function findName(items, id, idField, nameField) {
        return items.find((item) => item[idField] === id)?.[nameField] || "—";
    }

    if (employees.length === 0) {
        return <p className="p-4 text-secondary">No employees found.</p>;
    }

    return (
        <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Designation</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Joining date</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {employees.map((employee) => {
                        const name = `${employee.firstName} ${employee.lastName}`;

                        return (
                            <TableRow key={employee.employeeId} hover>
                                <TableCell>
                                    <div className="employee-name-cell">
                                        <Avatar>{name.charAt(0).toUpperCase()}</Avatar>
                                        <div>
                                            <strong>{name}</strong>
                                            <small>{employee.employeeCode}</small>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    {findName(
                                        departments,
                                        employee.departmentId,
                                        "departmentId",
                                        "departmentName"
                                    )}
                                </TableCell>

                                <TableCell>
                                    {findName(
                                        designations,
                                        employee.designationId,
                                        "designationId",
                                        "designationName"
                                    )}
                                </TableCell>

                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.phone}</TableCell>

                                <TableCell>
                                    <Chip
                                        size="small"
                                        label={employee.status}
                                        color={employee.status === "Active" ? "success" : "default"}
                                    />
                                </TableCell>

                                <TableCell>
                                    {employee.joiningDate
                                        ? new Date(employee.joiningDate).toLocaleDateString()
                                        : "—"}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}