import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/pages/admin/AdminLayout";
import Dashboard from "../components/pages/admin/Dashboard";
import Products from "../components/pages/admin/Products";
import Users from "../components/pages/admin/Users";
import Sales from "../components/pages/admin/Sales";
import Analytics from "../components/pages/admin/Analytics";
import Settings from "../components/pages/admin/Settings";

export default function AdminRoutes({ theme, setTheme }) {
  return (
    <Routes>

      <Route 
        path="/" 
        element={<AdminLayout theme={theme} setTheme={setTheme} />} 
      >

        {/* TË GJITHA FAQET E ADMINIT HYJNË KËTU */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="users" element={<Users />} />
        <Route path="sales" element={<Sales />} />
        <Route path="analytics" element={<Analytics />} />
       <Route
  path="settings"
  element={<Settings theme={theme} setTheme={setTheme} />}
/>


      </Route>
    </Routes>
  );
}
