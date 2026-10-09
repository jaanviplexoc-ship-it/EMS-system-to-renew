
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoutes({ children }) {
    const { token, logout } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);

        if (!decoded.exp || decoded.exp * 1000 <= Date.now()) {
            logout();
            return <Navigate to="/login" replace />;
        }
    } catch {
        logout();
        return <Navigate to="/login" replace />;
    }

    return children;
}