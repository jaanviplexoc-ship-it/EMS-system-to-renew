
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventNoteIcon from "@mui/icons-material/EventNote";

import MainLayout from "../components/molecules/MainLayout";
import DashboardHeader from "../components/molecules/DashboardHeader";
import DashboardStatCard from "../components/atoms/DashboardStatCard";
import AttendanceChart from "../components/organisms/AttendanceChart";
import DepartmentChart from "../components/organisms/DepartmentChart";
import RecentEmployees from "../components/organisms/RecentEmployees";
import LeaveRequests from "../components/organisms/LeaveRequests";
import { getDashboard } from "../services/dashboardApi";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { role } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const response = await getDashboard();
        setDashboard(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <DashboardHeader />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {dashboard && (
        <>
          <Box className="dashboard-section">
            <Typography variant="h6" className="section-main-title">
              Overview
            </Typography>

            <div className="row g-3">
              <div className="col-12 col-md-6 col-xl-3">
                <DashboardStatCard
                  title="Total Employees"
                  value={dashboard.totalEmployees ?? 0}
                  subtitle="Active employees"
                  icon={<PeopleIcon />}
                />
              </div>

              <div className="col-12 col-md-6 col-xl-3">
                <DashboardStatCard
                  title="Departments"
                  value={dashboard.totalDepartments ?? 0}
                  subtitle="Active departments"
                  icon={<BusinessIcon />}
                />
              </div>

              <div className="col-12 col-md-6 col-xl-3">
                <DashboardStatCard
                  title={role === "Admin" ? "Present Today" : "My Attendance"}
                  value={
                    role === "Admin"
                      ? dashboard.presentToday ?? 0
                      : dashboard.myAttendance?.filter(
                        (item) =>
                          item.attendanceDate?.slice(0, 10) ===
                          new Date().toISOString().slice(0, 10)
                      ).length ?? 0
                  }
                  subtitle={
                    role === "Admin"
                      ? `${dashboard.absentToday ?? 0} not marked`
                      : "Today's attendance record"
                  }
                  icon={<EventAvailableIcon />}
                />
              </div>

              <div className="col-12 col-md-6 col-xl-3">
                <DashboardStatCard
                  title={role === "Admin" ? "Pending Leaves" : "My Leave Requests"}
                  value={
                    role === "Admin"
                      ? dashboard.pendingLeaves ?? 0
                      : dashboard.myLeaveRequests?.filter(
                        (item) => item.status === "Pending"
                      ).length ?? 0
                  }
                  subtitle={
                    role === "Admin"
                      ? "Awaiting review"
                      : "Awaiting approval"
                  }
                  icon={<EventNoteIcon />}
                />
              </div>
            </div>
          </Box>

          <Box className="dashboard-section">
            <Typography variant="h6" className="section-main-title">
              Analytics
            </Typography>

            <div className="row g-3">
              <div className="col-12 col-xl-8">
                <AttendanceChart data={dashboard.attendanceTrend ?? []} />
              </div>

              <div className="col-12 col-xl-4">
                <DepartmentChart data={dashboard.departmentSummary ?? []} />
              </div>
            </div>
          </Box>

          <Box className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-8">
                {role === "Admin" ? (
                  <RecentEmployees employees={dashboard.recentEmployees ?? []} />
                ) : (
                  <RecentEmployees
                    employees={[]}
                    title="Recent Employees"
                    emptyMessage="Employee directory details are available to Admin."
                  />
                )}
              </div>

              <div className="col-12 col-xl-4">
                {role === "Admin" ? (
                  <LeaveRequests requests={dashboard.leaveRequests ?? []} />
                ) : (
                  <LeaveRequests requests={dashboard.myLeaveRequests ?? []} />
                )}
              </div>
            </div>
          </Box>

          {role === "Employee" && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  My Recent Attendance
                </Typography>

                {(dashboard.myAttendance ?? []).length === 0 ? (
                  <Typography color="text.secondary">
                    No attendance records yet.
                  </Typography>
                ) : (
                  dashboard.myAttendance.slice(0, 5).map((item) => (
                    <Box
                      key={item.attendanceId}
                      display="flex"
                      justifyContent="space-between"
                      py={1}
                      borderBottom="1px solid #eee"
                    >
                      <Typography>
                        {new Date(item.attendanceDate).toLocaleDateString()}
                      </Typography>
                      <Typography color="text.secondary">
                        {item.checkIn
                          ? new Date(item.checkIn).toLocaleTimeString()
                          : "Not checked in"}
                      </Typography>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </MainLayout>
  );
}