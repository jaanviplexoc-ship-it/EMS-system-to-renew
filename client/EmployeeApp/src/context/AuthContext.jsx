
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [token, setTokenState] = useState(
        () => localStorage.getItem("token") || ""
    );

    const [role, setRoleState] = useState(
        () => localStorage.getItem("role") || ""
    );

    const [user, setUserState] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    });

    function setToken(value) {
        setTokenState(value || "");

        if (value) {
            localStorage.setItem("token", value);
        } else {
            localStorage.removeItem("token");
        }
    }

    function setRole(value) {
        setRoleState(value || "");

        if (value) {
            localStorage.setItem("role", value);
        } else {
            localStorage.removeItem("role");
        }
    }

    function setUser(value) {
        setUserState(value || null);

        if (value) {
            localStorage.setItem("user", JSON.stringify(value));
        } else {
            localStorage.removeItem("user");
        }
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        setTokenState("");
        setRoleState("");
        setUserState(null);
    }

    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider
            value={{
                token,
                setToken,
                role,
                setRole,
                user,
                setUser,
                logout,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}