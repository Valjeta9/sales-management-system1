import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true })
      .catch(() => {});
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password },
      { withCredentials: true }
    )
    .then(res => {
      if (res.data.message === "Success") {
        const role = res.data.user.role;

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    })
    .catch(err => {
      if (err.response?.status === 401) {
        setErrorMessage("Invalid email or password");
      } else if (err.response?.status === 403) {
        setErrorMessage("Account disabled");
      } else {
        setErrorMessage("Unexpected error");
      }
    });
  };

  return (
    <div className="auth-container d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 rounded shadow-lg bg-white" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Login</h3>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email:</label>
            <input name="email" className="form-control" required />
          </div>

          <div className="mb-3">
            <label>Password:</label>
            <input name="password" type="password" className="form-control" required />
          </div>

          <button className="btn btn-success w-100 mt-2" style={{ height: "45px" }}>
            LOGIN
          </button>

          <p className="text-center mt-3">
            <Link to="/auth/forgot-password">Forgot Password?</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
