import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { profileService } from "../services/profileService";

type GuardStatus = "loading" | "allowed" | "denied";

const isAdmin = (roleOrRoles: string | string[] | undefined | null) => {
  if (!roleOrRoles) return false;
  if (Array.isArray(roleOrRoles)) {
    return roleOrRoles.some((r) => String(r).toLowerCase() === "admin");
  }
  return String(roleOrRoles).toLowerCase() === "admin";
};

const AdminGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const location = useLocation();
  const [status, setStatus] = useState<GuardStatus>("loading");

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const rawUser: any = await profileService.getProfile();
        const roleOrRoles = rawUser?.data?.role ?? rawUser?.data?.roles;
        if (!mounted) return;
        setStatus(isAdmin(roleOrRoles) ? "allowed" : "denied");
      } catch {
        if (!mounted) return;
        setStatus("denied");
      }
    };

    check();
    return () => {
      mounted = false;
    };
  }, []);

  if (status === "loading") {
    return <div className="p-4 text-slate-300">Vérification des droits...</div>;
  }

  if (status === "denied") {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return children;
};

export default AdminGuard;