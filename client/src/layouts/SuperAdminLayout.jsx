import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "../pages/superadmin/SuperAdminSidebar";

export default function SuperAdminLayout() {

  return (

    <div className="flex flex-col md:flex-row h-screen bg-gray-50">

      {/* Sidebar / Navbar */}
      <SuperAdminSidebar />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>

    </div>

  );

}