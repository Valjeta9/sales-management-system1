import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/pages/admin/AdminLayout";
import Dashboard from "../components/pages/admin/Dashboard";
import Products from "../components/pages/admin/Products"; 

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
      </Route>
    </Routes>
  );
}
