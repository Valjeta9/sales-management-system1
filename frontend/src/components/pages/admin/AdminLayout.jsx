import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout({ theme, setTheme }) {

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
