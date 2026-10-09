
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Button,
    Card,
    CircularProgress,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import MainLayout from "../components/molecules/MainLayout";
import DashboardStatCard from "../components/atoms/DashboardStatCard";
import EmployeeTable from "../components/molecules/EmployeeTable";
import {
    getEmployees,
} from "../services/employeeApi";
import { getDepartments } from "../services/departmentApi";
import { getDesignations } from "../services/designationApi";
import { useAuth } from "../context/AuthContext";
import "../styles/employees.css";

export default function Employees() {
    const { role } = useAuth();

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError("");

                const [employeeResponse, departmentResponse, designationResponse] =
                    await Promise.all([
                        getEmployees(),
                        getDepartments(),
                        getDesignations(),
                    ]);

                setEmployees(employeeResponse.data);
                setDepartments(departmentResponse.data);
                setDesignations(designationResponse.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load employees. Please try again."
                );
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const filteredEmployees = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        return employees.filter((employee) => {
            const fullName =
                `${employee.firstName} ${employee.lastName}`.toLowerCase();

            const matchesSearch =
                fullName.includes(searchText) ||
                employee.email?.toLowerCase().includes(searchText) ||
                employee.employeeCode?.toLowerCase().includes(searchText);

            const matchesStatus =
                statusFilter === "All" || employee.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [employees, search, statusFilter]);

    const activeCount = employees.filter(
        (employee) => employee.status === "Active"
    ).length;

    const inactiveCount = employees.length - activeCount;

    return (
        <MainLayout>
            <div className="employees-page">
                <div className="employees-header">
                    <div>
                        <Typography className="employees-title">Employees</Typography>
                        <Typography className="employees-subtitle">
                            Manage employee records
                        </Typography>
                    </div>

                    {role === "Admin" && (
                        <Button
                            variant="contained"
                            startIcon={<PersonAddOutlinedIcon />}
                            onClick={() => (window.location.href = "/register")}
                        >
                            Add Employee
                        </Button>
                    )}
                </div>

                <div className="row g-3 employees-stats">
                    <div className="col-12 col-md-4">
                        <DashboardStatCard
                            title="Total Employees"
                            value={employees.length}
                            subtitle="All employee records"
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <DashboardStatCard
                            title="Active Employees"
                            value={activeCount}
                            subtitle="Currently active"
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <DashboardStatCard
                            title="Inactive Employees"
                            value={inactiveCount}
                            subtitle="Not currently active"
                        />
                    </div>
                </div>

                <Card className="employees-table-card">
                    <div className="employee-table-header">
                        <Typography className="employee-table-title">
                            Employee List ({filteredEmployees.length})
                        </Typography>

                        <div className="employee-table-actions">
                            <TextField
                                size="small"
                                label="Search employees"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />

                            <TextField
                                size="small"
                                select
                                label="Status"
                                value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value)}
                                sx={{ minWidth: 130 }}
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </TextField>
                        </div>
                    </div>

                    {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}

                    {loading ? (
                        <div className="p-5 text-center">
                            <CircularProgress />
                        </div>
                    ) : (
                        <EmployeeTable
                            employees={filteredEmployees}
                            departments={departments}
                            designations={designations}
                        />
                    )}
                </Card>
            </div>
        </MainLayout>
    );
}