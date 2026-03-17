import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Menu
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SuperAdminSidebar() {

  const [collapsed, setCollapsed] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [permissionOpen, setPermissionOpen] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (

    <div
      className={`h-screen bg-white border-r flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >

      {/* HEADER */}

      <div className="p-4 flex items-center justify-between border-b">

        {!collapsed && (
          <h1 className="font-bold text-lg text-green-700">
            SuperAdmin Panel
          </h1>
        )}

        <button onClick={() => setCollapsed(!collapsed)}>
          <Menu size={20} />
        </button>

      </div>


      {/* LINKS */}

      <div className="flex-1 p-3 space-y-2">

        {/* DASHBOARD */}

        <button
          onClick={() => navigate("/superadmin/dashboard")}
          className="flex items-center gap-3 w-full p-2 rounded hover:bg-gray-100"
        >
          <LayoutDashboard size={20} />
          {!collapsed && <span>Dashboard</span>}
        </button>


        {/* MANAGE ADMINS */}

        <div>

          <button
            onClick={() => setManageOpen(!manageOpen)}
            className="flex items-center justify-between w-full p-2 rounded hover:bg-gray-100"
          >

            <div className="flex items-center gap-3">
              <Users size={20} />
              {!collapsed && <span>Manage Admins</span>}
            </div>

            {!collapsed && <ChevronDown size={16} />}

          </button>

          {manageOpen && !collapsed && (

            <div className="ml-8 mt-2 space-y-2 text-sm">

              <button
                onClick={() => navigate("/superadmin/admins/create")}
                className="block hover:text-green-600"
              >
                Create
              </button>

              <button
                onClick={() => navigate("/superadmin/admins/toggle")}
                className="block hover:text-green-600"
              >
                Toggle Status
              </button>

              <button
                onClick={() => navigate("/superadmin/admins/delete")}
                className="block hover:text-green-600"
              >
                Delete
              </button>

            </div>

          )}

        </div>


        {/* PERMISSIONS */}

        <div>

          <button
            onClick={() => setPermissionOpen(!permissionOpen)}
            className="flex items-center justify-between w-full p-2 rounded hover:bg-gray-100"
          >

            <div className="flex items-center gap-3">
              <ShieldCheck size={20} />
              {!collapsed && <span>Permissions</span>}
            </div>

            {!collapsed && <ChevronDown size={16} />}

          </button>

          {permissionOpen && !collapsed && (

            <div className="ml-8 mt-2 space-y-2 text-sm">

              <button className="block hover:text-green-600">
                Admin Permissions
              </button>

              <button className="block hover:text-green-600">
                Role Settings
              </button>

            </div>

          )}

        </div>

      </div>


      {/* LOGOUT */}

      <div className="p-3 border-t">

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-2 text-red-600 hover:bg-red-50 rounded"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>

      </div>

    </div>

  );

}