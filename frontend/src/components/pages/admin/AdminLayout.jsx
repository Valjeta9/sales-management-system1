import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

export default function AdminLayout({ theme, setTheme }) {
  const [loading, setLoading] = useState(true);
  const [allow, setAllow] = useState(false);
  const location = useLocation();   

  useEffect(() => {
    const verify = async () => {
      try {
        // 1️⃣ Provo accessToken
        const me = await axios.get(
          "http://localhost:5000/api/auth/me",
          { withCredentials: true }
        );

        if (me.data.role === "admin") {
          setAllow(true);
          setLoading(false);
          return;
        }

        setAllow(false);
        setLoading(false);

      } catch {
        try {
          await axios.post(
            "http://localhost:5000/api/auth/refresh",
            {},
            { withCredentials: true }
          );

          const me2 = await axios.get(
            "http://localhost:5000/api/auth/me",
            { withCredentials: true }
          );

          if (me2.data.role === "admin") {
            setAllow(true);
            setLoading(false);
            return;
          }

          setAllow(false);
          setLoading(false);

        } catch {
          setAllow(false);
          setLoading(false);
        }
      }
    };

    verify();

  }, [location.pathname]);  

  if (loading) return <h2>Loading...</h2>;
  if (!allow) return <Navigate to="/auth/login" />;

  return (
    <div
      className={
        "d-flex " + (theme === "light" ? "light-theme" : "dark-theme")
      }
      style={{ minHeight: "100vh" }}
    >
      <Sidebar theme={theme} setTheme={setTheme} />
      <div className="content-area flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}
