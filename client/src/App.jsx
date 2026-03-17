import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import SuperAdminRoute from "./routes/SuperAdminRoute";

import HomePage from "./pages/public/HomePage";
import EventDetailPage from "./pages/public/EventDetailPage";
import GalleryPage from "./pages/public/GalleryPage";
import UpdatesPage from "./pages/public/UpdatesPage";
import UpdateDetailPage from "./pages/public/UpdateDetailPage";
import ContactPage from "./pages/public/ContactPage";
import EventsPage from "./pages/public/EventsPage";
import NotFoundPage from "./pages/public/NotFoundPage";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import AdminManagePage from "./pages/superadmin/AdminManagePage";
import AdminPermissionPage from "./pages/superadmin/AdminPermissionsPage";
import SuperAdminLayout from "./layouts/SuperAdminLayout";

import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboardPage";
import AdminLayout from "./layouts/AdminLayout";
import MessagesAdminPage from "./pages/admin/MessagesAdminPage";
import UpdatesAdminPage from "./pages/admin/UpdatesAdminPage";
import UpdateFormPage from "./pages/admin/UpdateFormPage";

import Navbar from "./components/common/Navbar";
import ScrollToTop from "./components/common/ScrollToTop";
import "./index.css";


function Layout() {

  const location = useLocation();

  // hide navbar for auth and superadmin routes
  const hideNavbar =
    location.pathname.startsWith("/superadmin") ||
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      <ScrollToTop />

      {!hideNavbar && <Navbar />}

      <Routes>

        {/* AUTH ROUTES */}

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />


        {/* PUBLIC + USER PROTECTED ROUTES */}

        <Route path="/" element={<HomePage />} />
        <Route element={<ProtectedRoute />}>

          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/updates/:slug" element={<UpdateDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />

        </Route>
        {/* ADMIN ROUTES */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/messages" element={<MessagesAdminPage />} />
            <Route path="/admin/updates" element={<UpdatesAdminPage />} />
            <Route path="/admin/updates/new" element={<UpdateFormPage />} />
            <Route path="/admin/updates/edit/:id" element={<UpdateFormPage />} />
            {/* <Route path="/admin/events" element={<AdminEvents />} /> */}

          </Route>
        </Route>

        {/* SUPERADMIN ROUTES */}

        <Route element={<SuperAdminRoute />}>
          <Route element={<SuperAdminLayout />}>

            <Route
              path="/superadmin/dashboard"
              element={<SuperAdminDashboard />}
            />

            <Route
              path="/superadmin/manage-admins"
              element={<SuperAdminDashboard />}
            />

            <Route
              path="/superadmin/admins/create"
              element={<AdminManagePage mode="create" />}
            />

            <Route
              path="/superadmin/admins/toggle"
              element={<AdminManagePage mode="toggle" />}
            />

            <Route
              path="/superadmin/admins/delete"
              element={<AdminManagePage mode="delete" />}
            />
            <Route
              path="/superadmin/admin-permissions"
              element={<AdminPermissionPage />}
            />
          </Route>

        </Route>


        {/* 404 */}

        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </>
  );
}


function App() {

  return (

    <AuthProvider>

      <BrowserRouter>

        <Layout />

      </BrowserRouter>

    </AuthProvider>

  );

}

export default App;