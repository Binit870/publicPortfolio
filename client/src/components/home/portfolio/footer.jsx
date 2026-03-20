import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Github, Linkedin, Twitter, Instagram, Globe, Mail, Phone, MapPin } from "lucide-react";
import API from "../../../api/axiosInstance";

const socialMeta = {
  github:    { Icon: Github,    label: "GitHub" },
  linkedin:  { Icon: Linkedin,  label: "LinkedIn" },
  twitter:   { Icon: Twitter,   label: "Twitter" },
  instagram: { Icon: Instagram, label: "Instagram" },
  website:   { Icon: Globe,     label: "Website" },
};

const navLinks = [
  { label: "Home",    path: "/"        },
  { label: "Events",  path: "/events"  },
  { label: "Gallery", path: "/gallery" },
  { label: "Updates", path: "/updates" },
  { label: "Contact", path: "/contact" },
];

const Footer = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/profile")
      .then((res) => setProfile(res.data.data))
      .catch(() => {});
  }, []);

  const footer        = profile?.footer      || {};
  const social        = profile?.socialLinks || {};
  const home          = profile?.home        || {};
  const siteTitle     = home.name || "DevFolio";
  const activeSocials = Object.entries(social).filter(([, url]) => !!url);

  return (
    <footer className="bg-white text-gray-800 font-[Poppins]">

      {/* Tricolor stripe */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-700" />

      {/* Top section */}
      <div className="py-14 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <div className="text-2xl font-extrabold text-green-700">
              {siteTitle}<span className="text-orange-500">.</span>
            </div>

            <div className="w-11 h-[3px] rounded bg-gradient-to-r from-orange-500 to-green-700 my-4" />

            <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-xs">
              {home.tagline || "Full-stack developer and community builder crafting purposeful digital experiences."}
            </p>

            {activeSocials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeSocials.map(([key, url]) => {
                  const meta = socialMeta[key];
                  if (!meta) return null;
                  const { Icon } = meta;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-green-700 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-50 transition-all"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-5 flex items-center gap-2">
              Quick Links
              <span className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent" />
            </p>

            <div className="space-y-2">
              {navLinks.map(({ label, path }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="flex items-center gap-2 text-sm text-green-800 hover:text-orange-500 transition-all group"
                >
                  <span className="w-1 h-1 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-5 flex items-center gap-2">
              Contact
              <span className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent" />
            </p>

            {footer.contactEmail && (
              <div className="flex gap-3 mb-3 text-sm text-gray-700">
                <div className="w-8 h-8 flex items-center justify-center rounded-md bg-green-100 text-green-700 border border-green-200">
                  <Mail size={14} />
                </div>
                <span>{footer.contactEmail}</span>
              </div>
            )}

            {footer.contactPhone && (
              <div className="flex gap-3 mb-3 text-sm text-gray-700">
                <div className="w-8 h-8 flex items-center justify-center rounded-md bg-green-100 text-green-700 border border-green-200">
                  <Phone size={14} />
                </div>
                <span>{footer.contactPhone}</span>
              </div>
            )}

            {footer.address && (
              <div className="flex gap-3 mb-3 text-sm text-gray-700">
                <div className="w-8 h-8 flex items-center justify-center rounded-md bg-green-100 text-green-700 border border-green-200">
                  <MapPin size={14} />
                </div>
                <span>{footer.address}</span>
              </div>
            )}

            {!footer.contactEmail && !footer.contactPhone && !footer.address && (
              <p className="text-sm text-gray-400">No contact info yet.</p>
            )}
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 py-5 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-6">
          {footer.copyrightText || `© ${new Date().getFullYear()} ${siteTitle}. All rights reserved.`}
        </div>
      </div>

    </footer>
  );
};

export default Footer;