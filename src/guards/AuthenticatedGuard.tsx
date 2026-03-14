import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthenticatedGuard = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Récupérer le rôle de l'utilisateur
      const user = JSON.parse(localStorage.getItem("optirisk_user") || '{}');
      if (user && user.role) {
        if (user.role === 'admin') {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);
  return children;
};

export default AuthenticatedGuard;
