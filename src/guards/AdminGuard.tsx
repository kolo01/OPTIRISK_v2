import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { profileService } from "../services/profileService";

type GuardStatus = "loading" | "allowed" | "denied";

const isAdmin = (roleOrRoles: string | string[] | undefined | null): boolean => {
  if (!roleOrRoles) return false;
  if (Array.isArray(roleOrRoles)) {
    return roleOrRoles.some((r) => String(r).toLowerCase() === "admin");
  }
  return String(roleOrRoles).toLowerCase() === "admin";
};

const AdminGuard = () => {
  const location = useLocation();
  const [status, setStatus] = useState<GuardStatus>("loading");

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("denied");
        return;
      }

      try {
        const res: any = await profileService.getProfile();
        if (!mounted) return;

        const roleOrRoles = res?.data?.role ?? res?.data?.roles;
        const allowed = isAdmin(roleOrRoles);

        if (res?.data) {
          localStorage.setItem("optirisk_user", JSON.stringify(res.data));
        }

        setStatus(allowed ? "allowed" : "denied");
      } catch {
        if (!mounted) return;

        localStorage.removeItem("token");
        localStorage.removeItem("optirisk_user");

        setStatus("denied");
      }
    };

    verify();

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "loading") {
    return <div>Vérification...</div>;
  }

  if (status === "denied") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default AdminGuard;