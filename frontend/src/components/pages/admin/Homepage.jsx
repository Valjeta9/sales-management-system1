import { Link } from "react-router-dom";

export default function Homepage() {
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

      <Link 
        to="/auth/login"
        style={{
          textDecoration: "none"
        }}
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
    </div>
  );
}
