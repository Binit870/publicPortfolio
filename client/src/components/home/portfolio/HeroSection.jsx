import { useEffect, useState } from "react";
import { Download, ArrowRight, Github, Linkedin, Twitter, Instagram, Globe } from "lucide-react";
import API from "../../../api/axiosInstance"; // ✅ adjust path as needed

const socialMeta = {
  github:    { Icon: Github,    label: "GitHub" },
  linkedin:  { Icon: Linkedin,  label: "LinkedIn" },
  twitter:   { Icon: Twitter,   label: "Twitter" },
  instagram: { Icon: Instagram, label: "Instagram" },
  website:   { Icon: Globe,     label: "Website" },
};

const HeroSection = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // ✅ GET /api/profile  (public route)
    API.get("/profile")
      .then((res) => setProfile(res.data.data))
      .catch(() => {});
  }, []);

  const home   = profile?.home        || {};
  const social = profile?.socialLinks || {};

  const activeSocials = Object.entries(social).filter(([, url]) => !!url);

  return (
    <section
      id="home"
      className="relative py-28 overflow-hidden bg-white"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Syne:wght@700;800&display=swap');

        /* Blobs */
        .hero-blob { position:absolute; border-radius:50%; filter:blur(80px); opacity:.13; pointer-events:none; }

        /* Fade-up stagger */
        .h-f1 { animation: hFade .65s ease both; }
        .h-f2 { animation: hFade .65s .12s ease both; }
        .h-f3 { animation: hFade .65s .24s ease both; }
        .h-f4 { animation: hFade .65s .36s ease both; }
        @keyframes hFade { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }

        /* Buttons */
        .btn-saffron {
          display:inline-flex; align-items:center; gap:8px;
          background:#FF9933; color:#fff;
          font-family:'Syne',sans-serif; font-weight:800; font-size:12px;
          letter-spacing:.08em; text-transform:uppercase;
          padding:12px 24px; border-radius:9px; border:none; cursor:pointer;
          transition:background .2s, transform .15s, box-shadow .2s;
          box-shadow:0 4px 16px rgba(255,153,51,.3);
        }
        .btn-saffron:hover { background:#e07d1a; transform:translateY(-2px); box-shadow:0 8px 22px rgba(255,153,51,.38); }

        .btn-green-outline {
          display:inline-flex; align-items:center; gap:8px;
          background:transparent; color:#138808;
          font-family:'Syne',sans-serif; font-weight:800; font-size:12px;
          letter-spacing:.08em; text-transform:uppercase;
          padding:11px 24px; border-radius:9px; border:2px solid #138808; cursor:pointer;
          transition:background .2s, color .2s, transform .15s;
        }
        .btn-green-outline:hover { background:#138808; color:white; transform:translateY(-2px); }

        /* Avatar ring — tricolor spin */
        .avatar-wrap { position:relative; width:230px; height:230px; flex-shrink:0; }
        .avatar-wrap::before {
          content:'';
          position:absolute; inset:-7px; border-radius:50%;
          background: conic-gradient(#FF9933 0deg 120deg, #ffffff 120deg 240deg, #138808 240deg 360deg);
          animation: triSpin 14s linear infinite;
        }
        @keyframes triSpin { to { transform:rotate(360deg); } }
        .avatar-inner {
          position:relative; z-index:1;
          width:100%; height:100%;
          border-radius:50%; overflow:hidden;
          border:5px solid white;
          background:#f3faf3;
          display:flex; align-items:center; justify-content:center;
          font-size:84px;
        }

        /* Social pills */
        .s-pill {
          display:inline-flex; align-items:center; gap:6px;
          padding:6px 14px; border-radius:100px;
          border:1.5px solid #e0ece0;
          font-size:12px; font-weight:700;
          font-family:'Syne',sans-serif; letter-spacing:.03em;
          color:#333; text-decoration:none;
          transition:border-color .2s, color .2s, background .2s, transform .15s;
        }
        .s-pill:hover { border-color:#FF9933; color:#FF9933; background:#fff8f0; transform:translateY(-2px); }

        /* Chip */
        .hero-chip {
          display:inline-block;
          background:#fff3e6; color:#FF9933;
          border:1px solid #ffd9a8; border-radius:100px;
          font-size:11px; font-weight:800; letter-spacing:.12em; text-transform:uppercase;
          padding:4px 14px; font-family:'Syne',sans-serif;
        }
      `}</style>

      {/* Background blobs */}
      <div className="hero-blob" style={{ width:500, height:500, background:"#FF9933", top:-200, left:-200 }} />
      <div className="hero-blob" style={{ width:380, height:380, background:"#138808", bottom:-150, right:-130 }} />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center relative z-10">

        {/* ── LEFT ── */}
        <div>
          <div className="h-f1">
            <span className="hero-chip mb-5 inline-block">
              {home.tagline || "Welcome to my portfolio"}
            </span>
          </div>

          <h1
            className="h-f2 mb-5 leading-tight"
            style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(2rem,4vw,3rem)", color:"#111", lineHeight:1.15 }}
          >
            Hi, I'm{" "}
            <span style={{ color:"#FF9933" }}>{home.name || "Your Name"}</span>
          </h1>

          <p className="h-f3 mb-8 leading-relaxed" style={{ fontSize:"1.05rem", color:"#555", maxWidth:480 }}>
            {home.title || "Full-Stack Developer & Community Builder"}
          </p>

          <div className="h-f3 flex flex-wrap gap-3 mb-10">
            <button className="btn-saffron">
              Explore My Work <ArrowRight size={15} />
            </button>
            <button className="btn-green-outline">
              <Download size={15} /> Download CV
            </button>
          </div>

          {/* ── Social Links ── */}
          {activeSocials.length > 0 && (
            <div className="h-f4">
              <p style={{ fontSize:"10px", letterSpacing:".15em", textTransform:"uppercase", color:"#aaa", fontWeight:800, marginBottom:10, fontFamily:"'Syne',sans-serif" }}>
                Find me on
              </p>
              <div className="flex flex-wrap gap-2">
                {activeSocials.map(([key, url]) => {
                  const meta = socialMeta[key];
                  if (!meta) return null;
                  const { Icon, label } = meta;
                  return (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="s-pill">
                      <Icon size={13} /> {label}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT ── */}
        <div className="flex justify-center h-f2">
          <div className="avatar-wrap">
            <div className="avatar-inner">
              {home.heroImage
                ? <img src={home.heroImage} alt={home.name || "Hero"} className="w-full h-full object-cover" />
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