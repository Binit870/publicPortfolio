import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "../pages/superadmin/SuperAdminSidebar";

export default function SuperAdminLayout() {

  return (

    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <SuperAdminSidebar />

      {/* Page Content */}
      <div className="flex-1 p-8">

        <Outlet />

      </div>

    </div>

  );

}