import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import API from "../../../api/axiosInstance";

const AboutPreview = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get("/profile")
      .then((res) => setProfile(res.data.data))
      .catch(() => {});
  }, []);

  const about        = profile?.about || {};
  const home         = profile?.home  || {};
  const shortIntro   = home?.aboutPreview?.shortIntro || about.biography || "";
  const name         = about.name  || home.name  || "Developer";
  const title        = about.title || home.title || "";
  const profileImage = about.profileImage || null;

  return (
    <section
      id="about"
      className="ap-section"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        /* ── Section base ── */
        .ap-section {
          position: relative;
          overflow: hidden;
          background: #e8e2da;
          padding: clamp(60px, 10vw, 100px) 0;
        }

        /* ── Background blobs ── */
        .ap-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        /* ── SVG shapes animations ── */
        @keyframes apSpinCw  { to { transform: rotate(360deg); } }
        @keyframes apSpinCcw { to { transform: rotate(-360deg); } }
        @keyframes apPulse {
          0%, 100% { opacity: 0.12; }
          50%       { opacity: 0.22; }
        }
        .ap-spin-cw  { animation: apSpinCw  20s linear infinite; }
        .ap-spin-ccw { animation: apSpinCcw 16s linear infinite; }
        .ap-pulse    { animation: apPulse    5s ease-in-out infinite; }

        /* ── Card ── */
        .ap-card {
          position: relative;
          z-index: 2;
          background: white;
          border-radius: 24px;
          padding: clamp(24px, 5vw, 48px);
          box-shadow: 0 8px 40px rgba(0,0,0,.10);
          border: 1px solid rgba(255,153,51,.15);
        }

        /* ── Card inner layout ── */
        .ap-inner {
          display: flex;
          flex-direction: row;
          gap: clamp(32px, 6vw, 64px);
          align-items: center;
        }

        /* ── Image frame wrapper ── */
        .ap-img-wrap {
          position: relative;
          width: clamp(180px, 26vw, 280px);
          flex-shrink: 0;
          padding-bottom: 14px;
          padding-left: 14px;
        }
        .ap-img-wrap::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: calc(100% - 14px);
          height: calc(100% - 14px);
          border-radius: 16px;
          border: 3px solid #FF9933;
          z-index: 0;
        }
        .ap-img-wrap::after {
          content: '';
          position: absolute;
          top: -12px; right: -12px;
          width: 52%; height: 52%;
          border-radius: 12px;
          border: 3px solid #138808;
          z-index: 0;
        }

        /* Portrait image box — 3:4 */
        .ap-img-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          aspect-ratio: 3 / 4;
          border-radius: 16px;
          overflow: hidden;
          background: #f0faf0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(48px, 6vw, 80px);
        }
        .ap-img-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ── Image container (centering wrapper) ── */
        .ap-img-col {
          display: flex;
          justify-content: center;
          flex-shrink: 0;
        }

        /* ── Text column ── */
        .ap-text-col { flex: 1; min-width: 0; }

        /* ── Chip ── */
        .ap-chip {
          display: inline-block;
          background: #fff3e6; color: #FF9933;
          border: 1px solid #ffd9a8; border-radius: 100px;
          font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
          padding: 4px 14px;
          font-family: 'Poppins', sans-serif;
          margin-bottom: 16px;
        }

        /* ── Gradient accent line ── */
        .ap-grad-line {
          width: 52px; height: 4px; border-radius: 2px;
          margin: 14px 0 22px;
          background: linear-gradient(90deg, #FF9933, #138808);
        }

        /* ── Heading ── */
        .ap-heading {
          font-family: 'Poppins', sans-serif;
          font-weight: 800;
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          color: #111;
          line-height: 1.2;
          margin: 0 0 4px;
        }

        /* ── Bio ── */
        .ap-bio {
          font-family: 'Poppins', sans-serif;
          font-weight: 400;
          color: #666;
          line-height: 1.85;
          margin-bottom: 24px;
          max-width: 540px;
          font-size: clamp(0.88rem, 1.4vw, 0.97rem);
        }

        /* ── Skill tags row ── */
        .ap-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 32px;
        }
        .skill-tag {
          display: inline-block;
          background: #edf7ed; color: #138808;
          border: 1.5px solid #c0e0bc;
          padding: 5px 13px; border-radius: 100px;
          font-size: 12px; font-weight: 600;
          font-family: 'Poppins', sans-serif;
          letter-spacing: .01em;
          transition: background .2s, color .2s, border-color .2s;
        }
        .skill-tag:hover { background: #138808; color: white; border-color: #138808; }

        /* ── Read More button ── */
        .btn-ap {
          display: inline-flex; align-items: center; gap: 8px;
          background: #FF9933; color: white;
          font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: 12px; letter-spacing: .06em; text-transform: uppercase;
          padding: 11px 22px; border-radius: 9px; border: none; cursor: pointer;
          transition: background .2s, transform .15s;
          box-shadow: 0 4px 14px rgba(255,153,51,.25);
        }
        .btn-ap:hover { background: #e07d1a; transform: translateY(-1px); }

        /* ═══════════════════════════════
           TABLET  (≤ 900px)
        ═══════════════════════════════ */
        @media (max-width: 900px) {
          .ap-inner {
            gap: 32px;
          }
          .ap-img-wrap {
            width: clamp(160px, 30vw, 220px);
          }
        }

        /* ═══════════════════════════════
           MOBILE  (≤ 680px) — stack vertically
        ═══════════════════════════════ */
        @media (max-width: 680px) {
          .ap-section { padding: 60px 0; }
          .ap-inner {
            flex-direction: column;
            align-items: center;
            gap: 28px;
            text-align: center;
          }
          .ap-img-col { width: 100%; }
          .ap-img-wrap {
            width: clamp(160px, 55vw, 220px);
            margin: 0 auto;
          }
          .ap-text-col { width: 100%; }
          .ap-grad-line { margin-left: auto; margin-right: auto; }
          .ap-bio { max-width: 100%; }
          .ap-skills { justify-content: center; }
          .ap-chip { display: block; width: fit-content; margin-left: auto; margin-right: auto; margin-bottom: 16px; }
          .btn-ap { width: 100%; justify-content: center; }
        }

        /* ═══════════════════════════════
           SMALL MOBILE  (≤ 420px)
        ═══════════════════════════════ */
        @media (max-width: 420px) {
          .ap-card { padding: 20px 16px; border-radius: 18px; }
          .ap-img-wrap { width: 160px; }
          .ap-heading { font-size: 1.4rem; }
        }
      `}</style>

      {/* ── Background blobs ── */}
      <div className="ap-blob" style={{ width: 400, height: 400, top: "-10%", right: "-6%", background: "#d4c9b8", opacity: 0.8 }} />
      <div className="ap-blob" style={{ width: 280, height: 280, bottom: "0%", left: "-4%", background: "#b8d4b8", opacity: 0.7 }} />
      <div className="ap-blob" style={{ width: 180, height: 180, top: "40%", left: "40%", background: "#ccc4b8", opacity: 0.5 }} />

      {/* ── Decorative SVG shapes ── */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 600"
      >
        {/* Top-left dot grid */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => (
            <circle key={`tl-${row}-${col}`} cx={36 + col * 20} cy={36 + row * 20} r="2.4" fill="#138808" opacity="0.2" />
          ))
        )}

        {/* Top-right spinning dashed ring */}
        <g style={{ transformOrigin: "1360px 70px" }} className="ap-spin-cw">
          <circle cx="1360" cy="70" r="65" fill="none" stroke="#FF9933" strokeWidth="1.8" strokeDasharray="9 6" opacity="0.22" />
        </g>
        <circle cx="1360" cy="70" r="40" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.13" />
        <circle cx="1360" cy="70" r="8" fill="#FF9933" opacity="0.14" />

        {/* Top-center triangle */}
        <polygon className="ap-pulse" points="720,10 768,95 672,95" fill="none" stroke="#138808" strokeWidth="2" opacity="0.15" />
        <polygon points="720,28 755,85 685,85" fill="none" stroke="#138808" strokeWidth="1" opacity="0.08" />

        {/* Left-mid rotating square */}
        <g style={{ transformOrigin: "52px 300px" }} className="ap-spin-cw">
          <rect x="24" y="272" width="56" height="56" rx="6" fill="none" stroke="#FF9933" strokeWidth="1.8" opacity="0.2" />
        </g>
        <g style={{ transformOrigin: "52px 300px" }} className="ap-spin-ccw">
          <rect x="36" y="284" width="32" height="32" rx="4" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.12" />
        </g>

        {/* Right-mid hexagon */}
        <polygon
          className="ap-pulse"
          points="1400,260 1426,276 1426,308 1400,324 1374,308 1374,276"
          fill="none" stroke="#138808" strokeWidth="2" opacity="0.17"
        />
        <polygon
          points="1400,274 1418,284 1418,306 1400,316 1382,306 1382,284"
          fill="none" stroke="#138808" strokeWidth="1" opacity="0.09"
        />

        {/* Bottom-left spinning ring */}
        <g style={{ transformOrigin: "90px 540px" }} className="ap-spin-ccw">
          <circle cx="90" cy="540" r="55" fill="none" stroke="#138808" strokeWidth="1.8" strokeDasharray="7 5" opacity="0.2" />
        </g>
        <circle cx="90" cy="540" r="32" fill="none" stroke="#138808" strokeWidth="1" opacity="0.11" />
        <circle cx="90" cy="540" r="7" fill="#138808" opacity="0.12" />

        {/* Bottom-right dot grid */}
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 4 }).map((_, col) => (
            <circle key={`br-${row}-${col}`} cx={1280 + col * 20} cy={470 + row * 20} r="2.4" fill="#FF9933" opacity="0.18" />
          ))
        )}

        {/* Bottom wavy lines */}
        <path d="M320,572 Q400,548 480,572 Q560,596 640,572 Q720,548 800,572 Q880,596 960,572 Q1040,548 1120,572" fill="none" stroke="#FF9933" strokeWidth="2" opacity="0.18" strokeLinecap="round" />
        <path d="M320,584 Q400,560 480,584 Q560,608 640,584 Q720,560 800,584 Q880,608 960,584 Q1040,560 1120,584" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.09" strokeLinecap="round" />

        {/* Mid-right rotating square */}
        <g style={{ transformOrigin: "1120px 130px" }} className="ap-spin-cw">
          <rect x="1096" y="106" width="48" height="48" rx="7" fill="none" stroke="#FF9933" strokeWidth="1.6" opacity="0.15" />
        </g>

        {/* Scattered plus signs */}
        {[
          { x: 220,  y: 70,  c: "#FF9933" },
          { x: 1200, y: 180, c: "#138808" },
          { x: 44,   y: 460, c: "#FF9933" },
          { x: 1390, y: 420, c: "#FF9933" },
          { x: 700,  y: 565, c: "#138808" },
          { x: 380,  y: 300, c: "#138808" },
        ].map((p, i) => (
          <g key={`plus-${i}`} opacity="0.2">
            <line x1={p.x - 9} y1={p.y} x2={p.x + 9} y2={p.y} stroke={p.c} strokeWidth="2.5" strokeLinecap="round" />
            <line x1={p.x} y1={p.y - 9} x2={p.x} y2={p.y + 9} stroke={p.c} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}

        {/* Accent circles */}
        <circle cx="340" cy="510" r="6" fill="#FF9933" opacity="0.17" />
        <circle cx="800" cy="44"  r="5" fill="#138808" opacity="0.15" />
        <circle cx="1190" cy="380" r="8" fill="#FF9933" opacity="0.13" />
        <circle cx="180"  cy="220" r="4" fill="#138808" opacity="0.16" />
        <circle cx="1040" cy="490" r="5" fill="#138808" opacity="0.14" />
      </svg>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6" style={{ position: "relative", zIndex: 2 }}>
        <div className="ap-card">
          <div className="ap-inner">

            {/* Image */}
            <div className="ap-img-col">
              <div className="ap-img-wrap">
                <div className="ap-img-inner">
                  {profileImage
                    ? <img src={profileImage} alt={name} />
                    : <span>🧑‍💼</span>
                  }
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="ap-text-col">
              <span className="ap-chip">About Me</span>

              <h2 className="ap-heading">
                {name}
                {title && (
                  <>
                    <br />
                    <span style={{ color: "#FF9933" }}>{title}</span>
                  </>
                )}
              </h2>

              <div className="ap-grad-line" />

              <p className="ap-bio">
                {shortIntro || "Full-stack developer with a passion for building scalable web applications and organizing tech events that bring communities together."}
              </p>

              <div className="ap-skills">
                {["React", "Node.js", "MongoDB", "TypeScript", "Tailwind CSS", "Next.js"].map((skill) => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
