import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  const [message, setMessage] = useState("");

  // Testim i backend-it
  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* ADMIN PANEL */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* HOMEPAGE */}
        <Route
          path="/"
          element={
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h1>Frontend is running with React + Vite ⚡</h1>
              <p style={{ fontSize: "20px" }}>{message}</p>
            </div>
          }
        />

        {/* ERROR PAGE */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
