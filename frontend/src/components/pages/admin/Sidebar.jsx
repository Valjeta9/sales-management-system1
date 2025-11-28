import { NavLink } from "react-router-dom";

export default function Sidebar({ theme }) {
  const isLight = theme === "light";

  return (
    <div
      className={
        "sidebar d-flex flex-column vh-100 p-3 " +
        (isLight ? "sidebar-light" : "sidebar-dark")
      }
      style={{ width: "250px" }}
    >
      <h3 className="text-center mb-4 text-success">SmartSales</h3>

      <NavLink to="/admin/dashboard" className="sidebar-link">Dashboard</NavLink>
      <NavLink to="/admin/products" className="sidebar-link">Products</NavLink>
      <NavLink to="/admin/inventory" className="sidebar-link">Inventory</NavLink>
      <NavLink to="/admin/sales" className="sidebar-link">Sales</NavLink>
      <NavLink to="/admin/customers" className="sidebar-link">Customers</NavLink>
      <NavLink to="/admin/analytics" className="sidebar-link">Analytics</NavLink>
      <NavLink to="/admin/users" className="sidebar-link">Users</NavLink>
      <NavLink to="/admin/settings" className="sidebar-link">Settings</NavLink>

      <hr className="my-3" />

     <NavLink to="/auth/logout" className="sidebar-link text-danger fw-bold">
  Logout
</NavLink>


    </div>
  );
}
