import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#0f1514",  // mbulon krejt ekranin
        display: "flex"
      }}
    >
      <Sidebar />

      <div className="flex-grow-1 p-4 text-white" style={{ background: "#0f1514" }}>
        <Outlet />
      </div>
    </div>
  );
}

