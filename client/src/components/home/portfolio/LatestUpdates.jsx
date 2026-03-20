import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPublishedBlogsApi } from "../../../api/blog.api";

const LatestUpdates = () => {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedBlogsApi({ limit: 3 })
      .then((res) => setUpdates(res.data.data || []))
      .catch(() => setUpdates([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="updates" className="lu-section">
        <style>{STYLES}</style>
        <div className="lu-container">
          <div className="lu-header">
            <span className="lu-chip">Latest</span>
            <h2 className="lu-title">Latest Updates</h2>
            <div className="lu-underline" />
          </div>
          <div className="lu-grid lu-grid-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="lu-card lu-skeleton-card">
                <div className="lu-skel lu-skel-icon" />
                <div className="lu-skel lu-skel-tag" />
                <div className="lu-skel lu-skel-title" />
                <div className="lu-skel lu-skel-body" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (updates.length === 0) return null;

  const gridClass =
    updates.length === 1 ? "lu-grid lu-grid-1"
    : updates.length === 2 ? "lu-grid lu-grid-2"
    : "lu-grid lu-grid-3";

  return (
    <section id="updates" className="lu-section">
      <style>{STYLES}</style>

      {/* ── Background blobs ── */}
      <div className="lu-blob" style={{ width: 420, height: 420, top: "-12%", right: "-6%", background: "#d4c9b8" }} />
      <div className="lu-blob" style={{ width: 260, height: 260, bottom: "-5%", left: "-4%", background: "#b8d4b8" }} />
      <div className="lu-blob" style={{ width: 180, height: 180, top: "45%", left: "38%", background: "#ccc4b8" }} />

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
            <circle key={`tl-${row}-${col}`} cx={36 + col * 20} cy={36 + row * 20} r="2.4" fill="#138808" opacity="0.18" />
          ))
        )}

        {/* Top-right spinning dashed ring */}
        <g style={{ transformOrigin: "1368px 72px" }} className="lu-spin-cw">
          <circle cx="1368" cy="72" r="64" fill="none" stroke="#FF9933" strokeWidth="1.8" strokeDasharray="9 6" opacity="0.22" />
        </g>
        <circle cx="1368" cy="72" r="40" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.12" />
        <circle cx="1368" cy="72" r="8" fill="#FF9933" opacity="0.14" />

        {/* Top-center triangle */}
        <polygon className="lu-pulse" points="720,10 770,96 670,96" fill="none" stroke="#138808" strokeWidth="2" opacity="0.14" />
        <polygon points="720,28 757,86 683,86" fill="none" stroke="#138808" strokeWidth="1" opacity="0.08" />

        {/* Left-mid rotating squares */}
        <g style={{ transformOrigin: "52px 300px" }} className="lu-spin-cw">
          <rect x="24" y="272" width="56" height="56" rx="6" fill="none" stroke="#FF9933" strokeWidth="1.8" opacity="0.2" />
        </g>
        <g style={{ transformOrigin: "52px 300px" }} className="lu-spin-ccw">
          <rect x="36" y="284" width="32" height="32" rx="4" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.11" />
        </g>

        {/* Right-mid hexagon */}
        <polygon className="lu-pulse" points="1400,256 1426,272 1426,304 1400,320 1374,304 1374,272" fill="none" stroke="#138808" strokeWidth="2" opacity="0.16" />
        <polygon points="1400,270 1418,280 1418,302 1400,312 1382,302 1382,280" fill="none" stroke="#138808" strokeWidth="1" opacity="0.08" />

        {/* Bottom-left spinning ring */}
        <g style={{ transformOrigin: "88px 536px" }} className="lu-spin-ccw">
          <circle cx="88" cy="536" r="54" fill="none" stroke="#138808" strokeWidth="1.8" strokeDasharray="7 5" opacity="0.19" />
        </g>
        <circle cx="88" cy="536" r="32" fill="none" stroke="#138808" strokeWidth="1" opacity="0.10" />
        <circle cx="88" cy="536" r="7" fill="#138808" opacity="0.11" />

        {/* Bottom-right dot grid */}
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 4 }).map((_, col) => (
            <circle key={`br-${row}-${col}`} cx={1282 + col * 20} cy={466 + row * 20} r="2.4" fill="#FF9933" opacity="0.17" />
          ))
        )}

        {/* Bottom wavy lines */}
        <path d="M320,570 Q400,546 480,570 Q560,594 640,570 Q720,546 800,570 Q880,594 960,570 Q1040,546 1120,570" fill="none" stroke="#FF9933" strokeWidth="2" opacity="0.17" strokeLinecap="round" />
        <path d="M320,582 Q400,558 480,582 Q560,606 640,582 Q720,558 800,582 Q880,606 960,582 Q1040,558 1120,582" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.08" strokeLinecap="round" />

        {/* Mid rotating square top-right area */}
        <g style={{ transformOrigin: "1110px 140px" }} className="lu-spin-cw">
          <rect x="1086" y="116" width="48" height="48" rx="7" fill="none" stroke="#FF9933" strokeWidth="1.6" opacity="0.14" />
        </g>

        {/* Scattered plus signs */}
        {[
          { x: 220,  y: 68,  c: "#FF9933" },
          { x: 1200, y: 175, c: "#138808" },
          { x: 44,   y: 455, c: "#FF9933" },
          { x: 1388, y: 415, c: "#FF9933" },
          { x: 705,  y: 562, c: "#138808" },
          { x: 375,  y: 295, c: "#138808" },
        ].map((p, i) => (
          <g key={`plus-${i}`} opacity="0.19">
            <line x1={p.x - 9} y1={p.y} x2={p.x + 9} y2={p.y} stroke={p.c} strokeWidth="2.5" strokeLinecap="round" />
            <line x1={p.x} y1={p.y - 9} x2={p.x} y2={p.y + 9} stroke={p.c} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}

        {/* Accent filled circles */}
        <circle cx="338" cy="508" r="6" fill="#FF9933" opacity="0.16" />
        <circle cx="802" cy="42"  r="5" fill="#138808" opacity="0.14" />
        <circle cx="1188" cy="375" r="8" fill="#FF9933" opacity="0.12" />
        <circle cx="182"  cy="218" r="4" fill="#138808" opacity="0.15" />
        <circle cx="1038" cy="488" r="5" fill="#138808" opacity="0.13" />
      </svg>

      {/* ── Content ── */}
      <div className="lu-container">

        <div className="lu-header">
          <span className="lu-chip">Latest</span>
          <h2 className="lu-title">Latest Updates</h2>
          <div className="lu-underline" />
        </div>

        <div className={gridClass}>
          {updates.map((u) => (
            <div
              key={u.slug}
              className="lu-card"
              onClick={() => navigate(`/updates/${u.slug}`)}
            >
              {/* Cover / icon */}
              <div className="lu-card-icon">
                {u.coverImage
                  ? <img src={u.coverImage} alt={u.title} className="lu-cover-img" />
                  : <span>📝</span>
                }
              </div>

              <div className="lu-card-meta">
                <span className="lu-category">{u.category}</span>
                <span className="lu-date">{new Date(u.createdAt).toDateString()}</span>
              </div>

              <h3 className="lu-card-title">{u.title}</h3>
              <p className="lu-card-excerpt">{u.excerpt}</p>

              <span className="lu-read-more">Read more &rarr;</span>
            </div>
          ))}
        </div>

        <div className="lu-footer">
          <button className="lu-btn-outline" onClick={() => navigate("/updates")}>
            View All Updates
          </button>
        </div>

      </div>
    </section>
  );
};

/* ─────────────────────────────────────────
   All styles in one const for clarity
───────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

  /* ── Animations ── */
  @keyframes luSpinCw  { to { transform: rotate(360deg); } }
  @keyframes luSpinCcw { to { transform: rotate(-360deg); } }
  @keyframes luPulse {
    0%, 100% { opacity: 0.12; }
    50%       { opacity: 0.22; }
  }
  @keyframes luSkeletonShimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .lu-spin-cw  { animation: luSpinCw  20s linear infinite; }
  .lu-spin-ccw { animation: luSpinCcw 16s linear infinite; }
  .lu-pulse    { animation: luPulse    5s ease-in-out infinite; }

  /* ── Section ── */
  .lu-section {
    position: relative;
    overflow: hidden;
    background: #e8e2da;
    padding: clamp(60px, 10vw, 96px) 0;
    font-family: 'Outfit', sans-serif;
  }

  /* ── Blobs ── */
  .lu-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    opacity: 0.75;
  }

  /* ── Container ── */
  .lu-container {
    position: relative;
    z-index: 2;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 clamp(16px, 4vw, 48px);
  }

  /* ── Header ── */
  .lu-header {
    text-align: center;
    margin-bottom: clamp(36px, 6vw, 56px);
  }
  .lu-chip {
    display: inline-block;
    background: #fff3e6; color: #e07d1a;
    border: 1px solid #ffd9a8; border-radius: 100px;
    font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
    padding: 4px 14px; margin-bottom: 12px;
    font-family: 'Outfit', sans-serif;
  }
  .lu-title {
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: clamp(1.7rem, 3.5vw, 2.4rem);
    color: #111;
    margin: 0 0 10px;
    line-height: 1.15;
  }
  .lu-underline {
    width: 52px; height: 4px; border-radius: 2px;
    margin: 0 auto;
    background: linear-gradient(90deg, #FF9933, #138808);
  }

  /* ── Grids ── */
  .lu-grid {
    display: grid;
    gap: clamp(16px, 2.5vw, 24px);
  }
  .lu-grid-1 { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; }
  .lu-grid-2 { grid-template-columns: repeat(2, 1fr); max-width: 760px; margin: 0 auto; }
  .lu-grid-3 { grid-template-columns: repeat(3, 1fr); }

  /* ── Card ── */
  .lu-card {
    background: white;
    border-radius: 20px;
    padding: clamp(18px, 3vw, 28px);
    border: 1px solid rgba(255,153,51,.13);
    box-shadow: 0 4px 24px rgba(0,0,0,.07);
    cursor: pointer;
    transition: transform .2s ease, box-shadow .2s ease;
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  .lu-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(0,0,0,.11);
  }

  /* ── Card icon ── */
  .lu-card-icon {
    width: 56px; height: 56px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(255,153,51,.18), rgba(255,153,51,.06));
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    margin-bottom: 18px;
    overflow: hidden;
    transition: transform .2s;
    flex-shrink: 0;
  }
  .lu-card:hover .lu-card-icon { transform: scale(1.07); }
  .lu-cover-img { width: 100%; height: 100%; object-fit: cover; border-radius: 16px; display: block; }

  /* ── Card meta ── */
  .lu-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    gap: 8px;
    flex-wrap: wrap;
  }
  .lu-category {
    display: inline-block;
    background: #edf7ed; color: #138808;
    border: 1.5px solid #c0e0bc;
    padding: 3px 11px; border-radius: 100px;
    font-size: 11px; font-weight: 600;
    font-family: 'Outfit', sans-serif;
  }
  .lu-date {
    font-size: 11px;
    color: #aaa;
    font-family: 'Outfit', sans-serif;
    white-space: nowrap;
  }

  /* ── Card text ── */
  .lu-card-title {
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: clamp(0.95rem, 1.4vw, 1.05rem);
    color: #111;
    line-height: 1.4;
    margin: 0 0 8px;
  }
  .lu-card-excerpt {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(0.82rem, 1.1vw, 0.9rem);
    color: #777;
    line-height: 1.65;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }
  .lu-read-more {
    font-size: 12px;
    font-weight: 700;
    color: #FF9933;
    margin-top: 14px;
    display: inline-block;
    font-family: 'Outfit', sans-serif;
    transition: text-decoration .15s;
  }
  .lu-card:hover .lu-read-more { text-decoration: underline; }

  /* ── Footer button ── */
  .lu-footer { text-align: center; margin-top: clamp(28px, 4vw, 44px); }
  .lu-btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: #FF9933;
    font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 14px;
    padding: 13px 32px; border-radius: 12px; border: 2px solid #FF9933; cursor: pointer;
    transition: background .2s, color .2s, transform .15s;
  }
  .lu-btn-outline:hover { background: #FF9933; color: white; transform: translateY(-2px); }

  /* ── Skeleton ── */
  .lu-skeleton-card { pointer-events: none; }
  .lu-skel {
    border-radius: 8px;
    background: linear-gradient(90deg, #e0dbd4 25%, #ccc6be 50%, #e0dbd4 75%);
    background-size: 800px 100%;
    animation: luSkeletonShimmer 1.4s infinite linear;
  }
  .lu-skel-icon  { width: 56px; height: 56px; border-radius: 16px; margin-bottom: 18px; }
  .lu-skel-tag   { width: 33%; height: 12px; margin-bottom: 12px; }
  .lu-skel-title { width: 75%; height: 16px; margin-bottom: 10px; }
  .lu-skel-body  { width: 100%; height: 12px; }

  /* ═══════════════════════════════════════
     TABLET  (≤ 900px)
  ═══════════════════════════════════════ */
  @media (max-width: 900px) {
    .lu-grid-3 { grid-template-columns: repeat(2, 1fr); }
  }

  /* ═══════════════════════════════════════
     MOBILE  (≤ 600px)
  ═══════════════════════════════════════ */
  @media (max-width: 600px) {
    .lu-section { padding: 56px 0; }
    .lu-grid-3,
    .lu-grid-2  { grid-template-columns: 1fr; max-width: 100%; }
    .lu-card    { padding: 18px 16px; border-radius: 16px; }
    .lu-btn-outline { width: 100%; justify-content: center; }
  }
`;

export default LatestUpdates;
