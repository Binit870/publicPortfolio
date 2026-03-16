import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { name: "Home", path: "/", section: null },
  { name: "About", path: "/", section: "about" },
  { name: "Gallery", path: "/gallery", section: null },
  { name: "Events", path: "/", section: "events" },
  { name: "Updates", path: "/updates", section: null },
  { name: "Contact", path: "/contact", section: null },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (link) => {
    setMobileOpen(false);

    // if link has a section (About, Events) — needs to scroll to section on home
    if (link.section) {
      if (location.pathname === "/") {
        // already on home — just scroll
        const el = document.getElementById(link.section);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        // on another page — go home first, then scroll after page loads
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(link.section);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      return;
    }

    // normal page navigation
    navigate(link.path);
  };

  const isActive = (link) => {
    if (link.section) return false;
    return location.pathname === link.path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

        <Link to="/" className="text-xl font-bold font-poppins tracking-tight">
          Dev<span className="text-primary">.</span>Folio
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
              className={`text-sm font-medium transition-smooth bg-transparent border-none cursor-pointer ${
                isActive(link)
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
              className={`text-sm font-medium py-1 transition-smooth text-left bg-transparent border-none cursor-pointer ${
                isActive(link)
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;