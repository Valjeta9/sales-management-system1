import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="d-flex flex-column vh-100 bg-dark text-white p-3" style={{ width: "250px" }}>

      <h3 className="text-center mb-4 text-success">SmartSales</h3>

      <NavLink to="/admin/dashboard" className="text-white text-decoration-none py-2 px-3 rounded mb-2 sidebar-link">
        Dashboard
      </NavLink>

      <NavLink to="/admin/products" className="text-white text-decoration-none py-2 px-3 rounded mb-2 sidebar-link">
        Products
      </NavLink>

      <NavLink to="/admin/inventory" className="text-white text-decoration-none py-2 px-3 rounded mb-2 sidebar-link">
        Inventory
      </NavLink>

      <NavLink to="/admin/sales" className="text-white text-decoration-none py-2 px-3 rounded mb-2 sidebar-link">
        Sales
      </NavLink>

      <NavLink to="/admin/customers" className="text-white text-decoration-none py-2 px-3 rounded mb-2 sidebar-link">
        Customers
      </NavLink>

      <NavLink to="/admin/analytics" className="text-white text-decoration-none py-2 px-3 rounded mb-2 sidebar-link">
        Analytics
      </NavLink>

      <NavLink to="/admin/users" className="text-white text-decoration-none py-2 px-3 rounded mb-2 sidebar-link">
        Users
      </NavLink>

      <NavLink to="/admin/settings" className="text-white text-decoration-none py-2 px-3 rounded mb-2 sidebar-link">
        Settings
      </NavLink>
    </div>
  );
}
