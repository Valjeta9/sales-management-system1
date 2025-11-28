import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Homepage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false));
  }, []);

  const handleLogout = async () => {
    await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      { withCredentials: true }
    );

    setLoggedIn(false);
    navigate("/auth/login");
  };

  return (
    <div 
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        background: "#f5f5f5"
      }}
    >
      <h1 style={{ marginLeft: "20px" }}>Homepage</h1>

      {loggedIn ? (
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      ) : (
        <Link 
          to="/auth/login"
          style={{ textDecoration: "none" }}
        >
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Login
          </button>
        </Link>
      )}
    </div>
  );
}
