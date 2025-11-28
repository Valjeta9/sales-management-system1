import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allow, setAllow] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/auth/me",
          { withCredentials: true }
        );

        if (res.data.role === "admin") {
          setAllow(true);
        }
        setLoading(false);
      } catch {

        try {
          await axios.post(
            "http://localhost:5000/api/auth/refresh",
            {},
            { withCredentials: true }
          );

          const res2 = await axios.get(
            "http://localhost:5000/api/auth/me",
            { withCredentials: true }
          );

          if (res2.data.role === "admin") {
            setAllow(true);
          }
          setLoading(false);
        } catch  {
          setAllow(false);
          setLoading(false);
        }
      }
    };

    checkAccess();
  }, []);

  if (loading) return <div>Loading...</div>;

  return allow ? children : <Navigate to="/auth/login" />;
}
