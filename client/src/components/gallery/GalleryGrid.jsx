import { useState } from "react";
import GalleryItemCard from "./GalleryItemCard";

const GalleryGrid = ({ collectionLabel, gallery, activeFilter, onItemClick }) => {

  if (!gallery) return null;

  const items = gallery.items || [];

  const [activeCat, setActiveCat] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const INITIAL_COUNT = 4;

  const filtered = items.filter((item) => {
    const matchesGlobal = activeFilter === "All" || item.category === activeFilter || item.mediaType?.toLowerCase() === activeFilter.toLowerCase();
    const matchesLocal = activeCat === "All" || item.category === activeCat;
    return matchesGlobal && matchesLocal;
  });

  const visibleItems = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

  return (
    <section className="gg-section">
      <style>{STYLES}</style>

      {/* ── Background blobs ── */}
      <div className="gg-blob" style={{ width:380, height:380, top:"-15%", right:"-8%", background:"#e8d5b8" }} />
      <div className="gg-blob" style={{ width:260, height:260, bottom:"-10%", left:"-5%", background:"#c8dfc8" }} />
      <div className="gg-blob" style={{ width:180, height:180, top:"50%", left:"40%", background:"#ddd0c0" }} />

      {/* ── Decorative SVG shapes ── */}
      <svg aria-hidden="true" className="gg-svg-bg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 800">

        {/* Top-right cross-hatch grid */}
        {Array.from({length:6}).map((_,row) =>
          Array.from({length:6}).map((_,col) => (
            <g key={`ch-${row}-${col}`} transform={`translate(${1210+col*26},${24+row*26})`} opacity="0.18">
              <line x1="-5" y1="-5" x2="5" y2="5" stroke="#FF9933" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="5" y1="-5" x2="-5" y2="5" stroke="#FF9933" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          ))
        )}

        {/* Bottom-left cross-hatch grid */}
        {Array.from({length:5}).map((_,row) =>
          Array.from({length:5}).map((_,col) => (
            <g key={`ch2-${row}-${col}`} transform={`translate(${28+col*26},${660+row*26})`} opacity="0.16">
              <line x1="-5" y1="-5" x2="5" y2="5" stroke="#138808" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="5" y1="-5" x2="-5" y2="5" stroke="#138808" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          ))
        )}

        {/* Top-left spinning concentric rings */}
        <g style={{transformOrigin:"72px 68px"}} className="gg-spin-cw">
          <circle cx="72" cy="68" r="55" fill="none" stroke="#FF9933" strokeWidth="1.5" strokeDasharray="5 8" opacity="0.22" />
        </g>
        <g style={{transformOrigin:"72px 68px"}} className="gg-spin-ccw">
          <circle cx="72" cy="68" r="34" fill="none" stroke="#138808" strokeWidth="1" strokeDasharray="3 10" opacity="0.17" />
        </g>
        <circle cx="72" cy="68" r="6" fill="#FF9933" opacity="0.2" />

        {/* Bottom-right spinning concentric rings */}
        <g style={{transformOrigin:"1380px 740px"}} className="gg-spin-ccw">
          <circle cx="1380" cy="740" r="58" fill="none" stroke="#FF9933" strokeWidth="1.5" strokeDasharray="5 8" opacity="0.2" />
        </g>
        <g style={{transformOrigin:"1380px 740px"}} className="gg-spin-cw">
          <circle cx="1380" cy="740" r="36" fill="none" stroke="#FF9933" strokeWidth="1" strokeDasharray="3 10" opacity="0.14" />
        </g>
        <circle cx="1380" cy="740" r="6" fill="#FF9933" opacity="0.18" />

        {/* Floating diamonds */}
        <g className="gg-float-1">
          <polygon points="130,200 158,238 130,276 102,238" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.22" />
          <polygon points="130,212 150,238 130,264 110,238" fill="none" stroke="#FF9933" strokeWidth="0.8" opacity="0.13" />
        </g>
        <g className="gg-float-2">
          <polygon points="1310,180 1340,220 1310,260 1280,220" fill="none" stroke="#138808" strokeWidth="1.5" opacity="0.2" />
        </g>
        <g className="gg-float-3">
          <polygon points="700,680 728,716 700,752 672,716" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.18" />
        </g>

        {/* Triangle outlines */}
        <polygon className="gg-pulse" points="1100,80 1132,140 1068,140" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.2" />
        <polygon className="gg-pulse" style={{animationDelay:"1.8s"}} points="340,660 370,714 310,714" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.18" />

        {/* Arc decorations */}
        <path d="M 0 400 A 180 180 0 0 1 160 260" fill="none" stroke="#FF9933" strokeWidth="1.2" opacity="0.14" strokeDasharray="6 9" />
        <path d="M 1440 400 A 180 180 0 0 0 1280 260" fill="none" stroke="#138808" strokeWidth="1.2" opacity="0.14" strokeDasharray="6 9" />

        {/* Rotating square mid-right */}
        <g style={{transformOrigin:"1400px 380px"}} className="gg-spin-cw">
          <rect x="1376" y="356" width="48" height="48" rx="7" fill="none" stroke="#FF9933" strokeWidth="1.6" opacity="0.17" />
        </g>
        <g style={{transformOrigin:"1400px 380px"}} className="gg-spin-ccw">
          <rect x="1388" y="368" width="24" height="24" rx="4" fill="none" stroke="#138808" strokeWidth="1" opacity="0.12" />
        </g>

        {/* Asterisk stars scattered */}
        {[
          {x:230, y:60,  c:"#138808"},
          {x:1210,y:380, c:"#FF9933"},
          {x:55,  y:480, c:"#FF9933"},
          {x:910, y:760, c:"#138808"},
          {x:570, y:100, c:"#FF9933"},
          {x:1060,y:700, c:"#FF9933"},
        ].map((p,i)=>(
          <g key={`star-${i}`} opacity="0.22">
            <line x1={p.x-9} y1={p.y}   x2={p.x+9} y2={p.y}   stroke={p.c} strokeWidth="2" strokeLinecap="round" />
            <line x1={p.x}   y1={p.y-9} x2={p.x}   y2={p.y+9} stroke={p.c} strokeWidth="2" strokeLinecap="round" />
            <line x1={p.x-6} y1={p.y-6} x2={p.x+6} y2={p.y+6} stroke={p.c} strokeWidth="1.5" strokeLinecap="round" />
            <line x1={p.x+6} y1={p.y-6} x2={p.x-6} y2={p.y+6} stroke={p.c} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ))}

        {/* Accent filled circles */}
        <circle cx="420"  cy="70"  r="5" fill="#FF9933" opacity="0.18" />
        <circle cx="1050" cy="90"  r="4" fill="#138808" opacity="0.2"  />
        <circle cx="210"  cy="560" r="6" fill="#FF9933" opacity="0.17" />
        <circle cx="1250" cy="580" r="5" fill="#FF9933" opacity="0.18" />
        <circle cx="730"  cy="770" r="4" fill="#138808" opacity="0.17" />
      </svg>

      {/* ── Content ── */}
      <div className="gg-container">

        {/* Collection label */}
        <p className="gg-collection-label">
          {collectionLabel} · {gallery.layoutType} Layout
        </p>

        {/* Title */}
        <h2 className="gg-title">{gallery.title}</h2>

        {/* Subtitle */}
        <p className="gg-subtitle">{gallery.subtitle}</p>

        {/* Local category filter chips */}
        {gallery.allowFilter && gallery.categories?.length > 0 && (
          <div className="gg-filters">
            {gallery.categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCat(cat.name)}
                className={activeCat === cat.name ? "gg-filter-btn gg-filter-active" : "gg-filter-btn"}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="gg-grid">
          {visibleItems.map((item) => (
            <GalleryItemCard
              key={item._id || item.order}
              item={item}
              onClick={onItemClick}
            />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="gg-empty">
            <div className="gg-empty-icon">🔍</div>
            <p className="gg-empty-text">No items found for this filter.</p>
          </div>
        )}

        {/* Load more */}
        {filtered.length > INITIAL_COUNT && (
          <div className="gg-footer">
            <button
              className="gg-load-more"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Show Less" : `Load More`}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

  /* ── Animations ── */
  @keyframes ggSpinCw  { to { transform: rotate(360deg); } }
  @keyframes ggSpinCcw { to { transform: rotate(-360deg); } }
  @keyframes ggPulse   { 0%,100%{opacity:.12} 50%{opacity:.24} }
  @keyframes ggFloat1  {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%     { transform: translateY(-10px) rotate(7deg); }
  }
  @keyframes ggFloat2  {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%     { transform: translateY(-14px) rotate(-6deg); }
  }
  @keyframes ggFloat3  {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%     { transform: translateY(-8px) rotate(9deg); }
  }
  .gg-spin-cw  { animation: ggSpinCw  18s linear infinite; }
  .gg-spin-ccw { animation: ggSpinCcw 13s linear infinite; }
  .gg-pulse    { animation: ggPulse    4.5s ease-in-out infinite; }
  .gg-float-1  { animation: ggFloat1   6s ease-in-out infinite; }
  .gg-float-2  { animation: ggFloat2   8s ease-in-out infinite; }
  .gg-float-3  { animation: ggFloat3   7s ease-in-out infinite; }

  /* ── Section ── */
  .gg-section {
    position: relative;
    overflow: hidden;
    background: #f0ece6;
    padding: clamp(48px, 8vw, 80px) 0;
    font-family: 'Outfit', sans-serif;
  }

  /* ── Blobs ── */
  .gg-blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px); pointer-events: none; z-index: 0; opacity: 0.65;
  }

  /* ── SVG layer ── */
  .gg-svg-bg {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 1;
  }

  /* ── Container ── */
  .gg-container {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(16px, 4vw, 48px);
  }

  /* ── Collection label ── */
  .gg-collection-label {
    font-family: 'Outfit', sans-serif;
    font-size: 11px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .12em;
    color: #999999;
    margin: 0 0 8px;
  }

  /* ── Title ── */
  .gg-title {
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: clamp(1.5rem, 3vw, 2.1rem);
    color: #111111;
    margin: 0 0 8px;
    line-height: 1.2;
  }

  /* ── Subtitle ── */
  .gg-subtitle {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(.85rem, 1.3vw, .95rem);
    color: #555555;
    margin: 0 0 28px;
    line-height: 1.65;
  }

  /* ── Filter chips ── */
  .gg-filters {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: clamp(24px, 4vw, 36px);
  }
  .gg-filter-btn {
    padding: 7px 18px;
    border-radius: 100px;
    font-size: 13px; font-weight: 600;
    font-family: 'Outfit', sans-serif;
    border: 1.5px solid rgba(255,153,51,.25);
    background: rgba(255,255,255,.8);
    color: #555555;
    cursor: pointer;
    transition: all .2s;
  }
  .gg-filter-btn:hover {
    border-color: rgba(255,153,51,.5);
    color: #FF9933;
    background: rgba(255,153,51,.08);
  }
  .gg-filter-active {
    background: #FF9933 !important;
    color: white !important;
    border-color: #FF9933 !important;
  }

  /* ── Grid ── */
  .gg-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: clamp(14px, 2vw, 24px);
    margin-bottom: clamp(24px, 4vw, 36px);
  }

  /* ── Empty state ── */
  .gg-empty {
    text-align: center;
    padding: clamp(40px, 8vw, 64px) 0;
  }
  .gg-empty-icon { font-size: 40px; margin-bottom: 12px; }
  .gg-empty-text {
    font-family: 'Outfit', sans-serif;
    color: #999999; font-size: .95rem;
  }

  /* ── Footer / load more ── */
  .gg-footer { text-align: center; margin-top: clamp(16px, 3vw, 28px); }
  .gg-load-more {
    display: inline-block;
    padding: 13px 40px;
    border-radius: 12px;
    background: #FF9933;
    color: white;
    font-family: 'Outfit', sans-serif;
    font-weight: 700; font-size: 14px;
    border: none; cursor: pointer;
    transition: background .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 6px 20px rgba(255,153,51,.28);
  }
  .gg-load-more:hover {
    background: #e07d1a;
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(255,153,51,.36);
  }

  /* ── TABLET (≤ 1024px): 3 columns ── */
  @media (max-width: 1024px) {
    .gg-grid { grid-template-columns: repeat(3, 1fr); }
  }

  /* ── SMALL TABLET (≤ 768px): 2 columns ── */
  @media (max-width: 768px) {
    .gg-grid { grid-template-columns: repeat(2, 1fr); }
    .gg-title { font-size: clamp(1.3rem, 5vw, 1.7rem); }
  }

  /* ── MOBILE (≤ 480px): 1 column ── */
  @media (max-width: 480px) {
    .gg-section { padding: 48px 0; }
    .gg-grid { grid-template-columns: 1fr; }
    .gg-load-more { width: 100%; }
    .gg-filters { gap: 6px; }
    .gg-filter-btn { font-size: 12px; padding: 6px 14px; }
  }
`;

export default GalleryGrid;