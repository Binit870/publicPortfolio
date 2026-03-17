import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SuperAdminSidebar() {

  const [collapsed, setCollapsed] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <h1 className="font-bold text-green-700">SuperAdmin</h1>
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
      <div
        className={`
        fixed md:static z-50 top-0 left-0 h-screen bg-white border-r flex flex-col
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >

        {/* HEADER */}
        <div className="p-4 flex items-center justify-between border-b">
          {!collapsed && (
            <h1 className="font-bold text-lg text-green-700">
              SuperAdmin Panel
            </h1>
          )}

          <div className="flex gap-2">
            <button onClick={() => setCollapsed(!collapsed)}>
              <Menu size={20} />
            </button>

            <button
              className="md:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* LINKS */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">

          <button
            onClick={() => navigate("/superadmin/dashboard")}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <LayoutDashboard size={20} />
            {!collapsed && <span>Dashboard</span>}
          </button>

          {/* MANAGE ADMINS */}
          <div>
            <button
              onClick={() => setManageOpen(!manageOpen)}
              className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3">
                <Users size={20} />
                {!collapsed && <span>Manage Admins</span>}
              </div>

              {!collapsed && (
                <ChevronDown
                  size={16}
                  className={`transition ${manageOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {manageOpen && !collapsed && (
              <div className="ml-8 mt-2 space-y-2 text-sm">
                {["create", "toggle", "delete"].map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      navigate(`/superadmin/admins/${type}`)
                    }
                    className="block hover:text-green-600 capitalize"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PERMISSIONS */}
          <button
            onClick={() => navigate("/superadmin/admin-permissions")}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <ShieldCheck size={20} />
            {!collapsed && <span>Permissions</span>}
          </button>

        </div>

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
