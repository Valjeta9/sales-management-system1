import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      const role = res.data.user.role;

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/"); 
      }
    } catch (err) {
      console.log("Login error:", err);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="auth-container d-flex justify-content-center align-items-center vh-100">
      <div className="auth-card p-4 rounded shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-4 text-success fw-bold">Customer Login</h2>

        <form onSubmit={handleLogin}>
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn btn-success w-100 mt-2">Login</button>

          <div className="text-center mt-3">
            <Link to="/auth/forgot-password" className="text-info">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
