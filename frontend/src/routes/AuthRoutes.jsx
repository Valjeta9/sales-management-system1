import { Routes, Route } from "react-router-dom";

import Login from "../components/pages/auth/Login";
import ForgotPassword from "../components/pages/auth/ForgotPassword";
import UpdatePassword from "../components/pages/auth/UpdatePassword";
import Logout from "../components/pages/auth/Logout";  

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="update-password" element={<UpdatePassword />} />
      <Route path="logout" element={<Logout />} />     
    </Routes>
  );
}
