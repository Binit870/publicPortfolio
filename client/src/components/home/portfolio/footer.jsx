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

// Matches the app's React Router routes exactly
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
    <footer style={{ background: "#0d1a0d", color: "#ccc", fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        .ft-stripe {
          height: 4px;
          background: linear-gradient(to right, #FF9933 33.3%, #ffffff 33.3% 66.6%, #138808 66.6%);
        }

        .ft-top    { padding: 60px 0 44px; border-bottom: 1px solid #1a2e1a; }
        .ft-bottom { padding: 18px 0; text-align: center; font-size: 12px; color: #3a5a3a; font-family: 'Poppins', sans-serif; font-weight: 500; }

        .ft-brand { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 1.6rem; color: white; letter-spacing: -.01em; }
        .ft-brand .dot { color: #FF9933; }

        .ft-grad-line { width: 44px; height: 3px; border-radius: 2px; margin: 14px 0 18px; background: linear-gradient(90deg, #FF9933, #138808); }

        .ft-section-label {
          font-family: 'Poppins', sans-serif;
          font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
          color: #FF9933; font-weight: 700; margin-bottom: 18px;
          display: flex; align-items: center; gap: 8px;
        }
        .ft-section-label::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(to right, #FF993340, transparent);
        }

        .ft-nav-btn {
          display: flex; align-items: center; gap: 7px;
          font-size: 13px; font-weight: 500;
          color: #6a8a6a; background: none; border: none;
          padding: 5px 0; cursor: pointer; width: 100%; text-align: left;
          font-family: 'Poppins', sans-serif;
          transition: color .2s, gap .2s;
        }
        .ft-nav-btn::before {
          content: '';
          width: 4px; height: 4px; border-radius: 50%;
          background: #FF9933; opacity: 0;
          transition: opacity .2s; flex-shrink: 0;
        }
        .ft-nav-btn:hover { color: #FF9933; gap: 10px; }
        .ft-nav-btn:hover::before { opacity: 1; }

        .ft-contact-row {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13px; font-weight: 400;
          color: #6a8a6a; margin-bottom: 12px; line-height: 1.6;
          font-family: 'Poppins', sans-serif;
        }
        .ft-contact-icon {
          width: 28px; height: 28px; border-radius: 7px;
          background: rgba(19,136,8,.12); border: 1px solid rgba(19,136,8,.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: #138808;
        }

        .ft-social-btn {
          width: 38px; height: 38px; border-radius: 9px;
          border: 1.5px solid #1e3a1e; background: rgba(255,255,255,.02);
          display: inline-flex; align-items: center; justify-content: center;
          color: #4a6a4a; text-decoration: none;
          transition: border-color .2s, color .2s, background .2s, transform .15s;
        }
        .ft-social-btn:hover { border-color: #FF9933; color: #FF9933; background: rgba(255,153,51,.08); transform: translateY(-2px); }

        .ft-divider { height: 1px; background: linear-gradient(to right, transparent, #1e3a1e 30%, #1e3a1e 70%, transparent); }
      `}</style>

      {/* Tricolor top bar */}
      <div className="ft-stripe" />

      <div className="ft-top">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">

          {/* ── Brand + tagline + social ── */}
          <div>
            <div className="ft-brand">
              {siteTitle}<span className="dot">.</span>
            </div>
            <div className="ft-grad-line" />
            <p style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 22, maxWidth: 260, color: "#6a8a6a", fontWeight: 400 }}>
              {home.tagline || "Full-stack developer and community builder crafting purposeful digital experiences."}
            </p>
            {activeSocials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeSocials.map(([key, url]) => {
                  const meta = socialMeta[key];
                  if (!meta) return null;
                  const { Icon } = meta;
                  return (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="ft-social-btn" title={key}>
                      <Icon size={15} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Quick Links — React Router navigation ── */}
          <div>
            <p className="ft-section-label">Quick Links</p>
            {navLinks.map(({ label, path }) => (
              <button
                key={path}
                className="ft-nav-btn"
                onClick={() => navigate(path)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Contact ── */}
          <div>
            <p className="ft-section-label">Contact</p>
            {footer.contactEmail && (
              <div className="ft-contact-row">
                <div className="ft-contact-icon"><Mail size={13} /></div>
                <span>{footer.contactEmail}</span>
              </div>
            )}
            {footer.contactPhone && (
              <div className="ft-contact-row">
                <div className="ft-contact-icon"><Phone size={13} /></div>
                <span>{footer.contactPhone}</span>
              </div>
            )}
            {footer.address && (
              <div className="ft-contact-row">
                <div className="ft-contact-icon"><MapPin size={13} /></div>
                <span>{footer.address}</span>
              </div>
            )}
            {!footer.contactEmail && !footer.contactPhone && !footer.address && (
              <p style={{ fontSize: 13, color: "#2e4a2e" }}>No contact info yet.</p>
            )}
          </div>

        </div>
      </div>

      {/* Bottom divider + copyright */}
      <div className="ft-divider" />
      <div className="ft-bottom">
        <div className="max-w-7xl mx-auto px-6">
          {footer.copyrightText || `© ${new Date().getFullYear()} ${siteTitle}. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
};

export default Footer;