import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const AdminRedirect = ({ children }) => {
  const { user, profile, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && profile?.is_admin) {
      navigate("/admin/orders", { replace: true });
    }
  }, [loading, user, profile, navigate]);

  // If admin, render nothing while redirecting
  if (!loading && user && profile?.is_admin) return null;

  return children;
};

export default AdminRedirect;
