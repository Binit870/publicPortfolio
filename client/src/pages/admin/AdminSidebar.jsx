import { useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Phone,
  CalendarDays,
  Images,
  FileText,
  UserCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const perms = user?.permissions || {};
  const isSuperAdmin = user?.role === "superadmin";

  // superadmin always returns true
  const can = (key) => isSuperAdmin || perms[key] === true;

  const isActive = (path) => location.pathname.startsWith(path);

  const navBtn = (path, icon, label) => (
    <button
      onClick={() => { navigate(path); setMobileOpen(false); }}
      className={`flex items-center gap-3 w-full p-2 rounded-lg transition ${
        isActive(path)
          ? "bg-primary/10 text-primary font-semibold"
          : "hover:bg-gray-100"
      }`}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </button>
  );

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <h1 className="font-bold text-primary">Admin</h1>
        <button onClick={() => setMobileOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`
        fixed md:static z-50 top-0 left-0 h-screen bg-white border-r flex flex-col
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        {/* HEADER */}
        <div className="p-4 flex items-center justify-between border-b">
          {!collapsed && (
            <h1 className="font-bold text-lg text-primary">Admin Panel</h1>
          )}
          <div className="flex gap-2">
            <button onClick={() => setCollapsed(!collapsed)}>
              <Menu size={20} />
            </button>
            <button className="md:hidden" onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* LINKS */}
        <div className="flex-1 p-3 space-y-1 overflow-y-auto">

          {/* Dashboard — always visible */}
          {navBtn("/admin/dashboard", <LayoutDashboard size={20} />, "Dashboard")}

          {/* manageMessages */}
          {can("manageMessages") &&
            navBtn("/admin/messages", <MessageSquare size={20} />, "Messages")}

          {/* manageSettings — contact page lives under settings permission */}
          {can("manageSettings") &&
            navBtn("/admin/contact", <Phone size={20} />, "Contact Page")}

          {/* manageEvents */}
          {can("manageEvents") &&
            navBtn("/admin/events", <CalendarDays size={20} />, "Events")}

          {/* manageGallery */}
          {can("manageGallery") &&
            navBtn("/admin/gallery", <Images size={20} />, "Gallery")}

          {/* manageUpdates */}
          {can("manageUpdates") &&
            navBtn("/admin/updates", <FileText size={20} />, "Updates")}

          {/* manageProfile */}
          {can("manageProfile") &&
            navBtn("/admin/profile", <UserCircle size={20} />, "Profile")}

        </div>

        {/* User info strip */}
        {!collapsed && user && (
          <div className="px-4 py-3 border-t border-b bg-gray-50">
            <p className="text-xs font-semibold text-foreground truncate">
              {user.name}
            </p>
            <p className="text-[10px] text-muted-foreground truncate capitalize">
              {user.role}
            </p>
          </div>
        )}

        {/* LOGOUT */}
        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}
