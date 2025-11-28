import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await axios.post(
  "http://localhost:5000/api/auth/logout",
  {},
  { withCredentials: true }
);

        navigate("/");
      } catch (err) {
        console.error("Logout failed:", err);
        navigate("/");
      }
    };

    doLogout();
  }, [navigate]);

  return null;
}
