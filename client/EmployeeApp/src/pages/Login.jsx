import LoginForm from "../components/organisms/LoginForm";
import "../styles/login.css";

function Login() {
  return (
    <div className="login-page">

      {/* Login Card */}
      <div className="login-card">

        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login to your Employee Management System</p>
        </div>
        <LoginForm />
      </div>

    </div>
  );
}

export default Login;