import { Navigate, Outlet } from "react-router-dom";

const GuestGuard = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("optirisk_user") || "{}");

  if (token) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestGuard;