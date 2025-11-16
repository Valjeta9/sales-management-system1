import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/pages/admin/AdminLayout";
import Dashboard from "../components/pages/admin/Dashboard";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
