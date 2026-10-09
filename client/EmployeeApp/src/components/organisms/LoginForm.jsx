
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, MenuItem, TextField } from "@mui/material";
import { jwtDecode } from "jwt-decode";

import LoginFields from "../molecules/LoginFields";
import PrimaryButton from "../atoms/PrimaryButton";
import { authApi } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("Employee");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setToken, setRole, setUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await authApi({
        email: email.trim(),
        password,
      });

      const token = response.data?.token;

      if (!token) {
        setError("The server did not return a token.");
        return;
      }

      const decoded = jwtDecode(token);

      const actualRole =
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      const expiration = decoded.exp;

      if (!actualRole || !expiration || expiration * 1000 <= Date.now()) {
        setError("The server returned an invalid or expired token.");
        return;
      }

      // The dropdown checks the role; it does not assign the role.
      if (actualRole !== selectedRole) {
        setError(
          `This account has the ${actualRole} role. Select that role to continue.`
        );
        return;
      }

      const user = {
        email: decoded.email || email.trim(),
        name:
          decoded.name ||
          decoded.unique_name ||
          email.trim(),
        employeeId: decoded.EmployeeId || decoded.employeeId || null,
      };

      setToken(token);
      setRole(actualRole);
      setUser(user);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      logout();

      setError(
        err.response?.status === 401
          ? "Invalid email or password."
          : err.response?.data?.message ||
          "Unable to log in. Please check the API connection."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <LoginFields
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
      />

      <TextField
        select
        fullWidth
        label="Login as"
        value={selectedRole}
        onChange={(event) => setSelectedRole(event.target.value)}
        margin="normal"
      >
        <MenuItem value="Admin">Admin</MenuItem>
        <MenuItem value="Employee">Employee</MenuItem>
      </TextField>

      <div className="login-button">
        <PrimaryButton
          type="submit"
          disabled={loading}
          label={loading ? "Signing in..." : "Login"}
        />
      </div>
    </form>
  );
}