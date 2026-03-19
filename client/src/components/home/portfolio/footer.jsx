import { useEffect, useState } from "react";
import { Github, Linkedin, Twitter, Instagram, Globe, Mail, Phone, MapPin } from "lucide-react";
import API from "../../../api/axiosInstance"; // ✅ adjust path as needed

const socialMeta = {
  github:    { Icon: Github,    label: "GitHub" },
  linkedin:  { Icon: Linkedin,  label: "LinkedIn" },
  twitter:   { Icon: Twitter,   label: "Twitter" },
  instagram: { Icon: Instagram, label: "Instagram" },
  website:   { Icon: Globe,     label: "Website" },
};

const navLinks = ["Home", "About", "Projects", "Blog", "Contact"];

const Footer = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // ✅ GET /api/profile  (public route)
    API.get("/profile")
      .then((res) => setProfile(res.data.data))
      .catch(() => {});
  }, []);

  const footer       = profile?.footer        || {};
  const social       = profile?.socialLinks   || {};
  const home         = profile?.home          || {};
  const siteTitle    = home.name || "DevFolio";
  const activeSocials = Object.entries(social).filter(([, url]) => !!url);

  return (
    <footer style={{ background:"#0c0c0c", color:"#ccc", fontFamily:"'Nunito',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Syne:wght@700;800&display=swap');

        /* Top tricolor stripe */
        .ft-stripe {
          height:4px;
          background:linear-gradient(to right, #FF9933 33.3%, #ffffff 33.3% 66.6%, #138808 66.6%);
        }

        .ft-top { padding:56px 0 40px; border-bottom:1px solid #1c1c1c; }
        .ft-bottom { padding:18px 0; text-align:center; font-size:12px; color:#4a4a4a; }

        .ft-brand { font-family:'Syne',sans-serif; font-weight:800; font-size:1.5rem; color:white; }
        .ft-brand .dot { color:#FF9933; }

        .ft-grad-line { width:40px; height:3px; border-radius:2px; margin:12px 0 16px; background:linear-gradient(90deg,#FF9933,#138808); }

        .ft-section-label { font-family:'Syne',sans-serif; font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:#FF9933; font-weight:800; margin-bottom:16px; }

        .ft-nav-link {
          display:block; font-size:13px; color:#777;
          text-decoration:none; padding:4px 0;
          font-weight:700;
          transition:color .2s, padding-left .2s;
        }
        .ft-nav-link:hover { color:#FF9933; padding-left:6px; }

        .ft-contact-row {
          display:flex; align-items:flex-start; gap:10px;
          font-size:13px; color:#777; margin-bottom:10px; line-height:1.5;
        }
        .ft-contact-row svg { color:#138808; flex-shrink:0; margin-top:2px; }

        .ft-social-btn {
          width:38px; height:38px; border-radius:9px;
          border:1.5px solid #252525;
          display:inline-flex; align-items:center; justify-content:center;
          color:#666; text-decoration:none;
          transition:border-color .2s, color .2s, background .2s, transform .15s;
        }
        .ft-social-btn:hover { border-color:#FF9933; color:#FF9933; background:rgba(255,153,51,.08); transform:translateY(-2px); }
      `}</style>

      {/* Tricolor top bar */}
      <div className="ft-stripe" />

      <div className="ft-top">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">

          {/* ── Brand + Social ── */}
          <div>
            <div className="ft-brand">
              {siteTitle}<span className="dot">.</span>
            </div>
            <div className="ft-grad-line" />
            <p style={{ fontSize:13, lineHeight:1.75, marginBottom:20, maxWidth:260 }}>
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

          {/* ── Quick Links ── */}
          <div>
            <p className="ft-section-label">Quick Links</p>
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="ft-nav-link">{link}</a>
            ))}
          </div>

          {/* ── Contact ── */}
          <div>
            <p className="ft-section-label">Contact</p>
            {footer.contactEmail && (
              <div className="ft-contact-row">
                <Mail size={14} />
                <span>{footer.contactEmail}</span>
              </div>
            )}
            {footer.contactPhone && (
              <div className="ft-contact-row">
                <Phone size={14} />
                <span>{footer.contactPhone}</span>
              </div>
            )}
            {footer.address && (
              <div className="ft-contact-row">
                <MapPin size={14} />
                <span>{footer.address}</span>
              </div>
            )}
            {!footer.contactEmail && !footer.contactPhone && !footer.address && (
              <p style={{ fontSize:13, color:"#444" }}>No contact info yet.</p>
            )}
          </div>

        </div>
      </div>

      <div className="ft-bottom">
        <div className="max-w-7xl mx-auto px-6">
          {footer.copyrightText || `© ${new Date().getFullYear()} ${siteTitle}. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
};

export default Footer;