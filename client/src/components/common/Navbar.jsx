import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (link) => {
    setMobileOpen(false);

    if (link.section) {
      if (location.pathname === "/") {
        const el = document.getElementById(link.section);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(link.section);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      return;
    }

    navigate(link.path);
  };

  const isActive = (link) => {
    if (link.section) return false;
    return location.pathname === link.path;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight whitespace-nowrap">
          Dev<span className="text-green-600">.</span>Folio
        </Link>

        {/* Nav Links (FIXED) */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
              className={`text-sm font-medium transition bg-transparent border-none cursor-pointer ${isActive(link)
                  ? "text-green-600 font-semibold"
                  : "text-gray-600 hover:text-green-600"
                }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">

          {!user ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 border border-green-600 px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="bg-green-600 text-white px-4 py-2 rounded-full text-sm border border-green-600 hover:bg-white hover:text-green-600 transition"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold"
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4">

          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
              className="text-sm text-left text-gray-600 hover:text-green-600"
            >
              {link.name}
            </button>
          ))}

          {!user ? (
            <div className="flex flex-col gap-3 pt-3 border-t">

              <Link
                to="/login"
                className="text-sm text-center border border-green-600 py-2 rounded-full text-gray-600 hover:bg-green-600 hover:text-white transition"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="bg-green-600 text-white text-center py-2 rounded-full border border-green-600 hover:bg-white hover:text-green-600 transition"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>

            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="text-left text-sm text-red-500 pt-3 border-t"
            >
              Logout
            </button>
          )}

        </div>
      )}
    </nav>
  );
};

export default Navbar;