
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees";
import Attendance from "../pages/Attendance";
import Leave from "../pages/Leave";
import Register from "../pages/Register";

import ProtectedRoutes from "./ProtectedRoutes";
import AdminRoute from "./AdminRoute";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoutes>
                        <Dashboard />
                    </ProtectedRoutes>
                }
            />

            <Route
                path="/employees"
                element={
                    <AdminRoute>
                        <Employees />
                    </AdminRoute>
                }
            />

            <Route
                path="/register"
                element={
                    <AdminRoute>
                        <Register />
                    </AdminRoute>
                }
            />

            <Route
                path="/attendance"
                element={
                    <ProtectedRoutes>
                        <Attendance />
                    </ProtectedRoutes>
                }
            />

            <Route
                path="/leave"
                element={
                    <ProtectedRoutes>
                        <Leave />
                    </ProtectedRoutes>
                }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}