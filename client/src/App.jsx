import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import HomePage from "./pages/public/HomePage";
import EventDetailPage from "./pages/public/EventDetailPage";
import GalleryPage from "./pages/public/GalleryPage";
import UpdatesPage from "./pages/public/UpdatesPage";
import UpdateDetailPage from "./pages/public/UpdateDetailPage";
import ContactPage from "./pages/public/ContactPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import EventsPage from "./pages/public/EventsPage";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import Navbar from "./components/common/Navbar";
import ScrollToTop from "./components/common/ScrollToTop";

import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import SuperAdminRoute from "./routes/SuperAdminRoute";

import "./index.css";


function Layout() {

  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      <ScrollToTop />

      {!hideNavbar && <Navbar />}

      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>

          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/updates/:slug" element={<UpdateDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />

        </Route>
        <Route element={<SuperAdminRoute />}>
          <Route
            path="/superadmin/dashboard"
            element={<SuperAdminDashboard />}
          />
        </Route>

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