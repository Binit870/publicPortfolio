import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getGalleryItemsApi } from "../../../api/gallery.api";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

  @keyframes glSpinCw  { to { transform: rotate(360deg); } }
  @keyframes glSpinCcw { to { transform: rotate(-360deg); } }
  @keyframes glPulse { 0%,100%{opacity:.11} 50%{opacity:.21} }
  @keyframes glShimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  .gl-spin-cw  { animation: glSpinCw  20s linear infinite; }
  .gl-spin-ccw { animation: glSpinCcw 16s linear infinite; }
  .gl-pulse    { animation: glPulse    5s ease-in-out infinite; }

  /* Section */
  .gl-section {
    position: relative; overflow: hidden;
    background: #e8e2da;
    font-family: 'Outfit', sans-serif;
  }
  .gl-blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px); pointer-events: none; z-index: 0; opacity: .75;
  }

  /* Container */
  .gl-container {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: clamp(56px,8vw,96px) clamp(16px,4vw,64px);
  }

  /* Header row */
  .gl-header-row {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: clamp(28px,5vw,48px);
    flex-wrap: wrap;
  }
  .gl-header-left {}
  .gl-chip {
    display: inline-block;
    color: #FF9933; font-family: 'Outfit', sans-serif;
    font-size: 12px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .12em;
    margin-bottom: 6px;
  }
  .gl-title {
    font-family: 'Outfit', sans-serif; font-weight: 800;
    font-size: clamp(1.7rem,3.5vw,2.4rem); color: #111;
    margin: 0 0 6px; line-height: 1.15;
  }
  .gl-subtitle {
    color: #888; font-size: clamp(.85rem,1.2vw,.95rem);
    font-family: 'Outfit', sans-serif; margin: 0;
  }
  .gl-btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: #FF9933;
    font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 14px;
    padding: 12px 28px; border-radius: 12px; border: 2px solid #FF9933; cursor: pointer;
    transition: background .2s, color .2s, transform .15s;
    white-space: nowrap; flex-shrink: 0;
  }
  .gl-btn-outline:hover { background: #FF9933; color: white; transform: translateY(-2px); }

  /* Grid */
  .gl-grid { display: grid; gap: clamp(10px,1.5vw,16px); }
  .gl-grid-1 { grid-template-columns: 1fr; max-width: 300px; margin: 0 auto; }
  .gl-grid-2 { grid-template-columns: repeat(2,1fr); max-width: 600px; margin: 0 auto; }
  .gl-grid-3 { grid-template-columns: repeat(3,1fr); }
  .gl-grid-4 { grid-template-columns: repeat(2,1fr); }

  /* Item */
  .gl-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 18px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0,0,0,.09);
    transition: transform .2s, box-shadow .2s;
  }
    .gl-desktop-btn { display: inline-flex; }
.gl-mobile-btn { display: none; }

@media (max-width: 640px) {
  .gl-desktop-btn { display: none; }
  .gl-mobile-btn { display: block; width: 100%; }
}
  .gl-item:hover { transform: scale(1.02); box-shadow: 0 10px 32px rgba(0,0,0,.14); }
  .gl-item img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform .3s;
  }
  .gl-item:hover img { transform: scale(1.06); }
  .gl-placeholder {
    width: 100%; height: 100%;
    background: linear-gradient(135deg, rgba(255,153,51,.18), rgba(19,136,8,.08));
    display: flex; align-items: center; justify-content: center;
    font-size: clamp(36px,6vw,52px);
  }
  .gl-overlay {
    position: absolute; inset: 0;
    background: rgba(255,153,51,0);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 4px;
    transition: background .3s;
  }
  .gl-item:hover .gl-overlay { background: rgba(30,20,10,.65); }
  .gl-overlay-title {
    color: white; font-family: 'Outfit', sans-serif;
    font-weight: 700; font-size: clamp(11px,1.4vw,14px);
    opacity: 0; transition: opacity .3s; text-align: center; padding: 0 8px;
  }
  .gl-overlay-cat {
    color: rgba(255,255,255,.75); font-family: 'Outfit', sans-serif;
    font-size: clamp(10px,1.1vw,12px);
    opacity: 0; transition: opacity .3s;
  }
  .gl-item:hover .gl-overlay-title,
  .gl-item:hover .gl-overlay-cat { opacity: 1; }

  /* Skeleton */
  .gl-skel-item {
    aspect-ratio: 1; border-radius: 18px;
    background: linear-gradient(90deg,#e0dbd4 25%,#ccc6be 50%,#e0dbd4 75%);
    background-size: 800px 100%;
    animation: glShimmer 1.4s infinite linear;
  }
  .gl-skel-header { height: 80px; width: 200px; border-radius: 12px; margin-bottom: 32px;
    background: linear-gradient(90deg,#e0dbd4 25%,#ccc6be 50%,#e0dbd4 75%);
    background-size: 800px 100%;
    animation: glShimmer 1.4s infinite linear;
  }

  /* ── LARGE DESKTOP: 4 col ── */
  @media (min-width: 1024px) {
    .gl-grid-4 { grid-template-columns: repeat(4,1fr); }
  }
  /* ── TABLET ── */
  @media (max-width: 900px) {
    .gl-grid-3 { grid-template-columns: repeat(2,1fr); }
    .gl-grid-4 { grid-template-columns: repeat(2,1fr); }
  }
  /* ── MOBILE ── */
  @media (max-width: 580px) {
    .gl-header-row { flex-direction: column; align-items: flex-start; }
    .gl-btn-outline { width: 100%; justify-content: center; }
    .gl-grid-2, .gl-grid-3 { grid-template-columns: repeat(2,1fr); }
    .gl-grid-4 { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 380px) {
    .gl-grid-4, .gl-grid-3, .gl-grid-2 { grid-template-columns: 1fr; }
  }
`;

const ShapesBg = () => (
  <>
    <div className="gl-blob" style={{ width: 380, height: 380, top: "-15%", left: "-6%", background: "#d4c9b8" }} />
    <div className="gl-blob" style={{ width: 260, height: 260, bottom: "-8%", right: "-4%", background: "#b8d4b8" }} />
    <div className="gl-blob" style={{ width: 160, height: 160, top: "40%", right: "30%", background: "#ccc4b8" }} />
    <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
      xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 600">
      {/* top-right dot grid */}
      {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 5 }).map((_, c) => (
        <circle key={`tr-${r}-${c}`} cx={1300 + c * 20} cy={36 + r * 20} r="2.4" fill="#138808" opacity="0.18" />
      )))}
      {/* top-left spinning ring */}
      <g style={{ transformOrigin: "80px 72px" }} className="gl-spin-cw">
        <circle cx="80" cy="72" r="60" fill="none" stroke="#FF9933" strokeWidth="1.8" strokeDasharray="9 6" opacity="0.22" />
      </g>
      <circle cx="80" cy="72" r="38" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.12" />
      <circle cx="80" cy="72" r="8" fill="#FF9933" opacity="0.14" />
      {/* top-center triangle */}
      <polygon className="gl-pulse" points="720,10 770,96 670,96" fill="none" stroke="#138808" strokeWidth="2" opacity="0.14" />
      <polygon points="720,28 757,86 683,86" fill="none" stroke="#138808" strokeWidth="1" opacity="0.08" />
      {/* right-mid rotating squares */}
      <g style={{ transformOrigin: "1390px 300px" }} className="gl-spin-cw">
        <rect x="1362" y="272" width="56" height="56" rx="6" fill="none" stroke="#FF9933" strokeWidth="1.8" opacity="0.2" />
      </g>
      <g style={{ transformOrigin: "1390px 300px" }} className="gl-spin-ccw">
        <rect x="1374" y="284" width="32" height="32" rx="4" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.11" />
      </g>
      {/* left-mid hexagon */}
      <polygon className="gl-pulse" points="44,256 70,272 70,304 44,320 18,304 18,272" fill="none" stroke="#138808" strokeWidth="2" opacity="0.16" />
      {/* bottom-right spinning ring */}
      <g style={{ transformOrigin: "1350px 536px" }} className="gl-spin-ccw">
        <circle cx="1350" cy="536" r="54" fill="none" stroke="#138808" strokeWidth="1.8" strokeDasharray="7 5" opacity="0.19" />
      </g>
      <circle cx="1350" cy="536" r="32" fill="none" stroke="#138808" strokeWidth="1" opacity="0.10" />
      <circle cx="1350" cy="536" r="7" fill="#138808" opacity="0.11" />
      {/* bottom-left dot grid */}
      {Array.from({ length: 4 }).map((_, r) => Array.from({ length: 4 }).map((_, c) => (
        <circle key={`bl-${r}-${c}`} cx={36 + c * 20} cy={466 + r * 20} r="2.4" fill="#FF9933" opacity="0.17" />
      )))}
      {/* top wavy */}
      <path d="M320,40 Q400,16 480,40 Q560,64 640,40 Q720,16 800,40 Q880,64 960,40 Q1040,16 1120,40" fill="none" stroke="#138808" strokeWidth="1.8" opacity="0.14" strokeLinecap="round" />
      {/* bottom wavy */}
      <path d="M320,570 Q400,546 480,570 Q560,594 640,570 Q720,546 800,570 Q880,594 960,570 Q1040,546 1120,570" fill="none" stroke="#FF9933" strokeWidth="2" opacity="0.17" strokeLinecap="round" />
      {/* rotating square mid */}
      <g style={{ transformOrigin: "340px 140px" }} className="gl-spin-cw">
        <rect x="316" y="116" width="48" height="48" rx="7" fill="none" stroke="#138808" strokeWidth="1.6" opacity="0.14" />
      </g>
      {/* plus signs */}
      {[{ x: 1220, y: 68, c: "#FF9933" }, { x: 200, y: 175, c: "#138808" }, { x: 1396, y: 455, c: "#FF9933" }, { x: 52, y: 415, c: "#FF9933" }, { x: 705, y: 562, c: "#138808" }, { x: 1055, y: 295, c: "#138808" }].map((p, i) => (
        <g key={i} opacity="0.19">
          <line x1={p.x - 9} y1={p.y} x2={p.x + 9} y2={p.y} stroke={p.c} strokeWidth="2.5" strokeLinecap="round" />
          <line x1={p.x} y1={p.y - 9} x2={p.x} y2={p.y + 9} stroke={p.c} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}
      <circle cx="1100" cy="508" r="6" fill="#FF9933" opacity="0.16" />
      <circle cx="640" cy="42" r="5" fill="#138808" opacity="0.14" />
      <circle cx="255" cy="375" r="8" fill="#FF9933" opacity="0.12" />
      <circle cx="1260" cy="218" r="4" fill="#138808" opacity="0.15" />
    </svg>
  </>
);

const GalleryPreview = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getGalleryItemsApi({ limit: 4 });
        setItems(res.data.data || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) {
    return (
      <section id="gallery" className="gl-section">
        <style>{STYLES}</style>
        <ShapesBg />
        <div className="gl-container">
          <div className="gl-skel-header" />
          <div className="gl-grid gl-grid-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="gl-skel-item" />)}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  const gridClass =
    items.length === 1 ? "gl-grid gl-grid-1"
      : items.length === 2 ? "gl-grid gl-grid-2"
        : items.length === 3 ? "gl-grid gl-grid-3"
          : "gl-grid gl-grid-4";

 return (
  <section id="gallery" className="gl-section">
    <style>{STYLES}</style>
    <ShapesBg />

    <div className="gl-container">

      {/* HEADER */}
      <div className="gl-header-row">
        <div className="gl-header-left">
          <span className="gl-chip">Portfolio</span>
          <h2 className="gl-title">Gallery</h2>
          <p className="gl-subtitle">
            Moments captured from events, talks, and travels.
          </p>
        </div>

        {/* ✅ DESKTOP BUTTON */}
        <button
          className="gl-btn-outline gl-desktop-btn"
          onClick={() => navigate("/gallery")}
        >
          View More
        </button>
      </div>

      {/* GRID */}
      <div className={gridClass}>
        {items.map((img) => (
          <div
            key={img._id}
            className="gl-item"
            onClick={() => navigate("/gallery")}
          >
            {img.mediaUrl ? (
              <img
                src={img.thumbnail || img.mediaUrl}
                alt={img.altText || img.title}
              />
            ) : (
              <div className="gl-placeholder">🖼️</div>
            )}
            <div className="gl-overlay">
              <span className="gl-overlay-title">{img.title}</span>
              <span className="gl-overlay-cat">{img.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ MOBILE BUTTON BELOW GRID */}
      <div className="gl-mobile-btn mt-6">
        <button
          className="gl-btn-outline w-full justify-center"
          onClick={() => navigate("/gallery")}
        >
          View More
        </button>
      </div>

    </div>
  </section>
);
};

export default GalleryPreview;
