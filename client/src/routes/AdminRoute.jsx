import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROUTE_PERMISSIONS = {
  "/admin/messages": "manageMessages",
  "/admin/contact":  "manageSettings",
  "/admin/events":   "manageEvents",
  "/admin/gallery":  "manageGallery",
  "/admin/updates":  "manageUpdates",
  "/admin/profile":  "manageProfile",
  "/admin/settings": "manageSettings",
};

export default function AdminRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // superadmin can access all admin routes too
  if (user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/login" replace />;
  }

  // superadmin bypasses all permission checks
  if (user.role === "superadmin") return <Outlet />;

  // check permission for this specific route
  const requiredPermission = Object.entries(ROUTE_PERMISSIONS).find(
    ([path]) => location.pathname.startsWith(path)
  )?.[1];

  if (requiredPermission && !user.permissions?.[requiredPermission]) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}