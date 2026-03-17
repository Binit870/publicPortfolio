import { Outlet } from "react-router-dom";
import AdminSidebar from "../pages/admin/AdminSidebar";

export default function AdminLayout() {

  return (

    <div className="flex flex-col md:flex-row h-screen bg-gray-50">

      {/* Sidebar / Navbar */}
      <AdminSidebar />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>

    </div>

  );

}