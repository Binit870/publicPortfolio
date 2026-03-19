import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ArrowRight, Github, Linkedin, Twitter, Instagram, Globe } from "lucide-react";
import API from "../../../api/axiosInstance";

const socialMeta = {
  github:    { Icon: Github,    label: "GitHub" },
  linkedin:  { Icon: Linkedin,  label: "LinkedIn" },
  twitter:   { Icon: Twitter,   label: "Twitter" },
  instagram: { Icon: Instagram, label: "Instagram" },
  website:   { Icon: Globe,     label: "Website" },
};

const HeroSection = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/profile")
      .then((res) => setProfile(res.data.data))
      .catch(() => {});
  }, []);

  const home         = profile?.home        || {};
  const social       = profile?.socialLinks || {};
  const activeSocials = Object.entries(social).filter(([, url]) => !!url);

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white"
      style={{ fontFamily: "'Poppins', sans-serif", padding: "clamp(60px, 10vw, 112px) 0" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: .13;
          pointer-events: none;
        }

        .h-f1 { animation: hFade .65s ease both; }
        .h-f2 { animation: hFade .65s .12s ease both; }
        .h-f3 { animation: hFade .65s .24s ease both; }
        .h-f4 { animation: hFade .65s .36s ease both; }
        @keyframes hFade {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Buttons ── */
        .btn-saffron {
          display: inline-flex; align-items: center; gap: 8px;
          background: #FF9933; color: #fff;
          font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 12px;
          letter-spacing: .06em; text-transform: uppercase;
          padding: 12px 24px; border-radius: 9px; border: none; cursor: pointer;
          transition: background .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 4px 16px rgba(255,153,51,.3);
        }
        .btn-saffron:hover {
          background: #e07d1a;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(255,153,51,.38);
        }

        .btn-green-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: #138808;
          font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 12px;
          letter-spacing: .06em; text-transform: uppercase;
          padding: 11px 24px; border-radius: 9px; border: 2px solid #138808; cursor: pointer;
          transition: background .2s, color .2s, transform .15s;
        }
        .btn-green-outline:hover {
          background: #138808;
          color: white;
          transform: translateY(-2px);
        }

        /* ── Tricolor spinning ring ── */
        @keyframes triSpin { to { transform: rotate(360deg); } }

        .avatar-outer {
          position: relative;
          width: clamp(180px, 32vw, 280px);
          height: clamp(180px, 32vw, 280px);
          flex-shrink: 0;
        }
        .avatar-ring {
          position: absolute;
          inset: -7px;
          border-radius: 50%;
          background: conic-gradient(#FF9933 0deg 120deg, #ffffff 120deg 240deg, #138808 240deg 360deg);
          animation: triSpin 14s linear infinite;
        }
        .avatar-circle {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          overflow: hidden;
          border: 5px solid white;
          background: #f3faf3;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(48px, 8vw, 84px);
          z-index: 1;
        }
        .avatar-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
        }

        /* ── Social pills ── */
        .s-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 100px;
          border: 1.5px solid #e0ece0;
          font-size: 12px; font-weight: 600;
          font-family: 'Poppins', sans-serif; letter-spacing: .02em;
          color: #333; text-decoration: none;
          transition: border-color .2s, color .2s, background .2s, transform .15s;
        }
        .s-pill:hover {
          border-color: #FF9933;
          color: #FF9933;
          background: #fff8f0;
          transform: translateY(-2px);
        }

        /* ── Tagline chip ── */
        .hero-chip {
          display: inline-block;
          background: #fff3e6; color: #FF9933;
          border: 1px solid #ffd9a8; border-radius: 100px;
          font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
          padding: 4px 14px;
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      {/* Background blobs */}
      <div className="hero-blob" style={{ width: 500, height: 500, background: "#FF9933", top: -200, left: -200 }} />
      <div className="hero-blob" style={{ width: 380, height: 380, background: "#138808", bottom: -150, right: -130 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center relative z-10">

        {/* ── LEFT: Text content ── */}
        <div className="order-2 lg:order-1">

          {/* Tagline chip */}
          <div className="h-f1">
            <span className="hero-chip mb-4 sm:mb-5 inline-block">
              {home.tagline || "Welcome to my portfolio"}
            </span>
          </div>

          {/* Heading — Poppins 800 */}
          <h1
            className="h-f2 mb-4 sm:mb-5"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "#111",
              lineHeight: 1.15,
            }}
          >
            Hi, I'm{" "}
            <span style={{ color: "#FF9933" }}>{home.name || "Your Name"}</span>
          </h1>

          {/* Sub-title — Poppins 500 */}
          <p
            className="h-f3 mb-6 sm:mb-8 leading-relaxed"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)",
              color: "#555",
              maxWidth: 480,
            }}
          >
            {home.title || "Full-Stack Developer & Community Builder"}
          </p>

          {/* CTA buttons */}
          <div className="h-f3 flex flex-wrap gap-3 mb-8 sm:mb-10">
            {/* Explore My Work → /projects */}
            <button
              className="btn-saffron"
              onClick={() => navigate("/updates")}
            >
              Explore My Work <ArrowRight size={15} />
            </button>

            {/* Explore Events → /events */}
            <button
              className="btn-green-outline"
              onClick={() => navigate("/events")}
            >
              <CalendarDays size={15} /> Explore Events
            </button>
          </div>

          {/* Social links */}
          {activeSocials.length > 0 && (
            <div className="h-f4">
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "10px",
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                  color: "#aaa",
                  fontWeight: 700,
                  marginBottom: 10,
                }}
              >
                Find me on
              </p>
              <div className="flex flex-wrap gap-2">
                {activeSocials.map(([key, url]) => {
                  const meta = socialMeta[key];
                  if (!meta) return null;
                  const { Icon, label } = meta;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="s-pill"
                    >
                      <Icon size={13} /> {label}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Circular avatar ── */}
        <div className="order-1 lg:order-2 flex justify-center h-f2">
          <div className="avatar-outer">
            <div className="avatar-ring" />
            <div className="avatar-circle">
              {home.heroImage
                ? <img src={home.heroImage} alt={home.name || "Hero"} />
                : <span>👨‍💻</span>
              }
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;