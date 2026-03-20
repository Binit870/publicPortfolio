import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ArrowRight, Github, Linkedin, Twitter, Instagram, Globe, Sparkles } from "lucide-react";
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

  const home          = profile?.home        || {};
  const social        = profile?.socialLinks || {};
  const stats         = profile?.stats       || {};
  const activeSocials = Object.entries(social).filter(([, url]) => !!url);

  return (
    <section
      id="home"
      className="relative overflow-hidden hero-section"
      style={{ fontFamily: "'Outfit', sans-serif", background: "#f0ece6" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

        /* ── Animations ── */
        .h-f1 { animation: hFade .6s ease both; }
        .h-f2 { animation: hFade .6s .1s ease both; }
        .h-f3 { animation: hFade .6s .2s ease both; }
        .h-f4 { animation: hFade .6s .3s ease both; }
        .h-f5 { animation: hFade .6s .4s ease both; }
        .h-f6 { animation: hFade .6s .5s ease both; }
        @keyframes hFade {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        @keyframes spinRev  { to { transform: rotate(-360deg); } }
        @keyframes shapePulse {
          0%, 100% { opacity: 0.13; }
          50%       { opacity: 0.24; }
        }
        .shape-spin-cw  { animation: spinSlow 20s linear infinite; }
        .shape-spin-ccw { animation: spinRev  16s linear infinite; }
        .shape-pulse    { animation: shapePulse 5s ease-in-out infinite; }

        /* ── Section layout ── */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 80px 0 60px;
        }

        /* ── Blob ── */
        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Grid ── */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 48px;
          position: relative;
          z-index: 2;
        }

        /* ── Left col ── */
        .hero-left { max-width: 560px; }

        /* ── Chip ── */
        .hero-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fff8f0; color: #e07d1a;
          border: 1.5px solid #ffd9a8; border-radius: 100px;
          font-size: 12px; font-weight: 600; letter-spacing: .04em;
          padding: 5px 14px; font-family: 'Outfit', sans-serif;
          margin-bottom: 20px;
        }

        /* ── Heading ── */
        .hero-heading {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: clamp(2.2rem, 4.5vw, 3.8rem);
          color: #111;
          line-height: 1.1;
          margin-bottom: 14px;
        }
        .name-underline {
          position: relative; display: inline-block; color: #FF9933;
        }
        .name-underline::after {
          content: '';
          position: absolute; left: 0; bottom: 2px;
          width: 100%; height: 4px;
          background: linear-gradient(90deg, #FF9933, #ffbe76);
          border-radius: 4px;
        }

        /* ── Subtitle ── */
        .hero-subtitle {
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: clamp(1rem, 1.6vw, 1.15rem);
          color: #444;
          margin-bottom: 12px;
        }

        /* ── Description ── */
        .hero-desc {
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          font-size: clamp(0.88rem, 1.2vw, 0.98rem);
          color: #777;
          line-height: 1.75;
          margin-bottom: 28px;
          max-width: 460px;
        }

        /* ── Buttons ── */
        .hero-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 36px;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #FF9933; color: #fff;
          font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 14px;
          padding: 13px 26px; border-radius: 12px; border: none; cursor: pointer;
          transition: background .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 6px 20px rgba(255,153,51,.35);
        }
        .btn-primary:hover { background: #e07d1a; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(255,153,51,.4); }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: #FF9933;
          font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 14px;
          padding: 12px 26px; border-radius: 12px; border: 2px solid #FF9933; cursor: pointer;
          transition: background .2s, color .2s, transform .15s;
        }
        .btn-secondary:hover { background: #FF9933; color: white; transform: translateY(-2px); }

        /* ── Stats ── */
        .hero-stats {
          display: flex;
          gap: clamp(20px, 4vw, 48px);
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .stat-num {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1.6rem, 2.8vw, 2.1rem);
          font-weight: 800; color: #FF9933; line-height: 1;
        }
        .stat-label {
          font-family: 'Outfit', sans-serif;
          font-size: 12px; font-weight: 500; color: #999; margin-top: 3px;
        }
        .stat-divider {
          width: 1px; background: #ddd; align-self: stretch; margin: 4px 0;
        }

        /* ── Social pills ── */
        .hero-social-label {
          font-family: 'Outfit', sans-serif;
          font-size: 11px; letter-spacing: .14em;
          text-transform: uppercase; color: #bbb;
          font-weight: 600; margin-bottom: 10px;
        }
        .hero-socials { display: flex; flex-wrap: wrap; gap: 8px; }
        .s-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 100px;
          border: 1.5px solid #e0dbd4;
          font-size: 13px; font-weight: 600;
          font-family: 'Outfit', sans-serif;
          color: #444; text-decoration: none;
          transition: border-color .2s, color .2s, background .2s, transform .15s;
          background: white;
        }
        .s-pill:hover { border-color: #FF9933; color: #FF9933; background: #fff8f0; transform: translateY(-2px); }

        /* ── Avatar ── */
        .hero-right {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .avatar-wrap {
          position: relative;
          width: clamp(240px, 36vw, 400px);
          height: clamp(240px, 36vw, 400px);
          flex-shrink: 0;
        }
        .avatar-bg {
          position: absolute; inset: 0; border-radius: 50%;
          background: linear-gradient(135deg, #fff3e6 0%, #e8f5e9 100%);
        }
        .avatar-circle {
          position: absolute; inset: 12px; border-radius: 50%;
          overflow: hidden; background: #f9f5f0;
          display: flex; align-items: center; justify-content: center;
          font-size: clamp(56px, 9vw, 96px);
          box-shadow: 0 20px 60px rgba(0,0,0,.1);
        }
        .avatar-circle img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }

        /* ── Floating badges ── */
        .float-badge {
          position: absolute;
          display: inline-flex; align-items: center; gap: 7px;
          background: white; border-radius: 50px;
          padding: 8px 14px;
          box-shadow: 0 8px 30px rgba(0,0,0,.12);
          font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 12px; color: #333;
          white-space: nowrap;
          animation: badgeFloat 4s ease-in-out infinite;
        }
        .float-badge .dot {
          width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
        }

        /* ═══════════════════════════════════════
           TABLET  (≤ 1024px)
        ═══════════════════════════════════════ */
        @media (max-width: 1024px) {
          .hero-section { padding: 70px 0 50px; }
          .hero-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
            padding: 0 32px;
          }
          .float-badge { font-size: 11px; padding: 7px 12px; }
        }

        /* ═══════════════════════════════════════
           MOBILE  (≤ 768px) — stack vertically
        ═══════════════════════════════════════ */
        @media (max-width: 768px) {
          .hero-section {
            min-height: unset;
            padding: 80px 0 56px;
            align-items: flex-start;
          }
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 0;
            padding: 0 20px;
            text-align: center;
          }

          /* Avatar on top on mobile */
          .hero-right { order: -1; margin-bottom: 32px; }
          .hero-left  { max-width: 100%; }

          .avatar-wrap {
            width: clamp(200px, 60vw, 280px);
            height: clamp(200px, 60vw, 280px);
          }

          /* Badges repositioned for mobile */
          .badge-available { top: 2% !important; right: -2% !important; }
          .badge-exp       { bottom: 18% !important; right: -4% !important; }
          .badge-open      { bottom: 4% !important; left: -2% !important; }

          .hero-chip { margin-bottom: 14px; }
          .hero-heading { font-size: clamp(2rem, 8vw, 2.8rem); margin-bottom: 10px; }
          .hero-subtitle { font-size: 1rem; }
          .hero-desc { font-size: 0.9rem; max-width: 100%; }

          .hero-btns { justify-content: center; }
          .btn-primary, .btn-secondary { font-size: 13px; padding: 12px 22px; }

          .hero-stats { justify-content: center; gap: 20px; }
          .stat-divider { display: none; }

          .hero-socials { justify-content: center; }
          .hero-social-label { text-align: center; }
        }

        /* ═══════════════════════════════════════
           SMALL MOBILE  (≤ 480px)
        ═══════════════════════════════════════ */
        @media (max-width: 480px) {
          .hero-section { padding: 70px 0 48px; }
          .hero-grid { padding: 0 16px; }
          .avatar-wrap {
            width: 200px;
            height: 200px;
          }
          .float-badge { font-size: 10px; padding: 6px 10px; gap: 5px; }
          .float-badge .dot { width: 6px; height: 6px; }
          .hero-heading { font-size: clamp(1.7rem, 7vw, 2.2rem); }
          .btn-primary, .btn-secondary { width: 100%; justify-content: center; font-size: 13px; }
          .hero-btns { flex-direction: column; }
          .stat-num { font-size: 1.5rem; }
        }
      `}</style>

      {/* ── Background blobs ── */}
      <div className="hero-blob" style={{ width: 500, height: 500, top: "-15%", right: "-8%", background: "#e8d5b8", opacity: 0.9 }} />
      <div className="hero-blob" style={{ width: 300, height: 300, bottom: "5%", left: "-5%", background: "#c8dfc8", opacity: 0.7 }} />
      <div className="hero-blob" style={{ width: 200, height: 200, top: "20%", left: "30%", background: "#ddd0c0", opacity: 0.5 }} />

      {/* ── Decorative SVG shapes ── */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 800"
      >
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <circle key={`tl-${row}-${col}`} cx={40 + col * 22} cy={40 + row * 22} r="2.5" fill="#138808" opacity="0.2" />
          ))
        )}
        <g style={{ transformOrigin: "1340px 80px" }} className="shape-spin-cw">
          <circle cx="1340" cy="80" r="75" fill="none" stroke="#FF9933" strokeWidth="2" strokeDasharray="10 7" opacity="0.22" />
        </g>
        <circle cx="1340" cy="80" r="48" fill="none" stroke="#FF9933" strokeWidth="1.2" opacity="0.14" />
        <circle cx="1340" cy="80" r="10" fill="#FF9933" opacity="0.15" />
        <polygon className="shape-pulse" points="700,14 755,112 645,112" fill="none" stroke="#138808" strokeWidth="2" opacity="0.16" />
        <polygon points="700,34 740,100 660,100" fill="none" stroke="#138808" strokeWidth="1" opacity="0.09" />
        <g style={{ transformOrigin: "58px 400px" }} className="shape-spin-cw">
          <rect x="28" y="370" width="60" height="60" rx="6" fill="none" stroke="#FF9933" strokeWidth="2" opacity="0.22" />
        </g>
        <g style={{ transformOrigin: "58px 400px" }} className="shape-spin-ccw">
          <rect x="40" y="382" width="36" height="36" rx="4" fill="none" stroke="#FF9933" strokeWidth="1.2" opacity="0.13" />
        </g>
        <polygon className="shape-pulse" points="1400,340 1430,358 1430,394 1400,412 1370,394 1370,358" fill="none" stroke="#138808" strokeWidth="2" opacity="0.18" />
        <polygon points="1400,356 1422,368 1422,390 1400,402 1378,390 1378,368" fill="none" stroke="#138808" strokeWidth="1" opacity="0.1" />
        <g style={{ transformOrigin: "100px 720px" }} className="shape-spin-ccw">
          <circle cx="100" cy="720" r="65" fill="none" stroke="#138808" strokeWidth="2" strokeDasharray="8 6" opacity="0.2" />
        </g>
        <circle cx="100" cy="720" r="38" fill="none" stroke="#138808" strokeWidth="1" opacity="0.12" />
        <circle cx="100" cy="720" r="8" fill="#138808" opacity="0.12" />
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => (
            <circle key={`br-${row}-${col}`} cx={1265 + col * 22} cy={640 + row * 22} r="2.5" fill="#FF9933" opacity="0.18" />
          ))
        )}
        <path d="M380,770 Q460,742 540,770 Q620,798 700,770 Q780,742 860,770 Q940,798 1020,770 Q1100,742 1180,770" fill="none" stroke="#FF9933" strokeWidth="2.2" opacity="0.2" strokeLinecap="round" />
        <path d="M380,784 Q460,756 540,784 Q620,812 700,784 Q780,756 860,784 Q940,812 1020,784 Q1100,756 1180,784" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.1" strokeLinecap="round" />
        <g style={{ transformOrigin: "1100px 150px" }} className="shape-spin-cw">
          <rect x="1072" y="122" width="56" height="56" rx="8" fill="none" stroke="#FF9933" strokeWidth="1.8" opacity="0.16" />
        </g>
        {[
          { x: 240, y: 90, c: "#FF9933" }, { x: 1180, y: 200, c: "#138808" },
          { x: 50, y: 580, c: "#FF9933" }, { x: 1395, y: 550, c: "#FF9933" },
          { x: 720, y: 745, c: "#138808" }, { x: 400, y: 400, c: "#138808" },
        ].map((p, i) => (
          <g key={`plus-${i}`} opacity="0.22">
            <line x1={p.x - 10} y1={p.y} x2={p.x + 10} y2={p.y} stroke={p.c} strokeWidth="2.5" strokeLinecap="round" />
            <line x1={p.x} y1={p.y - 10} x2={p.x} y2={p.y + 10} stroke={p.c} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}
        <circle cx="360" cy="680" r="7" fill="#FF9933" opacity="0.18" />
        <circle cx="820" cy="55" r="6" fill="#138808" opacity="0.16" />
        <circle cx="1200" cy="490" r="9" fill="#FF9933" opacity="0.14" />
        <circle cx="195" cy="290" r="5" fill="#138808" opacity="0.17" />
        <circle cx="1050" cy="650" r="6" fill="#138808" opacity="0.15" />
      </svg>

      {/* ── Main content grid ── */}
      <div className="hero-grid">

        {/* LEFT */}
        <div className="hero-left">

          <div className="h-f1">
            <span className="hero-chip">
              <Sparkles size={13} />
              {home.tagline || "Welcome to my portfolio"}
            </span>
          </div>

          <h1 className="hero-heading h-f2">
            Hi, I'm{" "}
            <span className="name-underline">{home.name || "Your Name"}</span>
          </h1>

          <p className="hero-subtitle h-f3">
            {home.title || "Full-Stack Developer & Community Builder"}
          </p>

          {home.description && (
            <p className="hero-desc h-f3">{home.description}</p>
          )}

          <div className="hero-btns h-f4">
            <button className="btn-primary" onClick={() => navigate("/updates")}>
              Explore My Work <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" onClick={() => navigate("/events")}>
              <CalendarDays size={16} /> Explore Events
            </button>
          </div>

          <div className="hero-stats h-f5">
            {[
              { num: stats.projects || "50+", label: "Projects Done" },
              { num: stats.followers || "12K", label: "Followers" },
              { num: stats.events || "30+", label: "Events Hosted" },
            ].map((s, i) => (
              <>
                {i > 0 && <div key={`div-${i}`} className="stat-divider" />}
                <div key={i}>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </>
            ))}
          </div>

          {activeSocials.length > 0 && (
            <div className="h-f6">
              <p className="hero-social-label">Find me on</p>
              <div className="hero-socials">
                {activeSocials.map(([key, url]) => {
                  const meta = socialMeta[key];
                  if (!meta) return null;
                  const { Icon, label } = meta;
                  return (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="s-pill">
                      <Icon size={14} /> {label}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Avatar */}
        <div className="hero-right h-f2">
          <div className="avatar-wrap">
            <div className="avatar-bg" />
            <div className="avatar-circle">
              {home.heroImage
                ? <img src={home.heroImage} alt={home.name || "Hero"} />
                : <span>👨‍💻</span>
              }
            </div>

            <div className="float-badge badge-available" style={{ top: "10%", right: "-14%", animationDelay: "0s" }}>
              <span className="dot" style={{ background: "#4CAF50" }} />
              Available for Work
            </div>
            <div className="float-badge badge-exp" style={{ bottom: "20%", right: "-16%", animationDelay: "1.3s" }}>
              <span className="dot" style={{ background: "#FF9933" }} />
              {stats.experience || "5+"} Years Exp.
            </div>
            <div className="float-badge badge-open" style={{ bottom: "6%", left: "-10%", animationDelay: "2.1s" }}>
              <Sparkles size={13} style={{ color: "#FF9933" }} />
              Open Source
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
