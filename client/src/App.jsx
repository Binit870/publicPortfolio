import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/public/HomePage";
import EventDetailPage from "./pages/public/EventDetailPage";
import GalleryPage from "./pages/public/GalleryPage";
import UpdatesPage from "./pages/public/UpdatesPage";
import UpdateDetailPage from "./pages/public/UpdateDetailPage";
import ContactPage from "./pages/public/ContactPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import Navbar from "./components/common/Navbar";
import ScrollToTop from "./components/common/ScrollToTop";
import EventsPage from "./pages/public/EventsPage";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/updates" element={<UpdatesPage />} />
        <Route path="/updates/:slug" element={<UpdateDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;