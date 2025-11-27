import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminRoutes from "./routes/AdminRoutes";
import AuthRoutes from "./routes/AuthRoutes";   // ✔️ KORREKT
import Homepage from "./components/pages/admin/Homepage";


function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route path="/auth/*" element={<AuthRoutes />} />

        {/* ADMIN PANEL */}
        <Route
          path="/admin/*"
          element={<AdminRoutes theme={theme} setTheme={setTheme} />}
        />

        {/* HOMEPAGE */}
        <Route path="/" element={<Homepage />} />

        {/* 404 */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
