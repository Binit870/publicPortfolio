import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPublishedEventsApi } from "../../api/event.api";

const filters = ["All", "Conference", "Workshop", "Webinar", "Technology"];

const badgeStyle = (status) => {
  if (status === "Published") return "bg-green-100 text-green-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";
  return "bg-primary/10 text-primary";
};

const modeStyle = (mode) => {
  if (mode === "Online") return "bg-secondary/40 text-secondary-foreground";
  return "bg-primary/10 text-primary";
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

  @keyframes epSpinCw  { to { transform: rotate(360deg); } }
  @keyframes epSpinCcw { to { transform: rotate(-360deg); } }
  @keyframes epPulse   { 0%,100%{opacity:.11} 50%{opacity:.23} }
  @keyframes epFloat1  {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-10px) rotate(7deg); }
  }
  @keyframes epFloat2  {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-14px) rotate(-6deg); }
  }
  @keyframes epFloat3  {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-8px) rotate(9deg); }
  }
  @keyframes epShimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }

  .ep-spin-cw  { animation: epSpinCw  20s linear infinite; }
  .ep-spin-ccw { animation: epSpinCcw 15s linear infinite; }
  .ep-pulse    { animation: epPulse    4.5s ease-in-out infinite; }
  .ep-float-1  { animation: epFloat1   6s ease-in-out infinite; }
  .ep-float-2  { animation: epFloat2   8s ease-in-out infinite; }
  .ep-float-3  { animation: epFloat3   7s ease-in-out infinite; }

  /* ── Page ── */
  .ep-page {
    min-height: 100vh;
    background: #f0ece6;
    font-family: 'Outfit', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Fixed blobs ── */
  .ep-blob {
    position: fixed; border-radius: 50%;
    filter: blur(85px); pointer-events: none; z-index: 0;
  }

  /* ── Fixed SVG ── */
  .ep-svg {
    position: fixed; inset: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 0;
  }

  /* ── Inner ── */
  .ep-inner { position: relative; z-index: 10; }

  /* ── Hero section ── */
  .ep-hero {
    padding: clamp(56px,10vw,96px) 0 clamp(40px,7vw,72px);
    text-align: center;
  }
  .ep-hero-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(16px,4vw,48px);
  }
  .ep-chip {
    display: inline-block;
    background: #edf7ed; color: #138808;
    border: 1px solid #c0e0bc; border-radius: 100px;
    font-size: 11px; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    padding: 5px 16px; margin-bottom: 14px;
    font-family: 'Outfit', sans-serif;
  }
  .ep-heading {
    font-family: 'Outfit', sans-serif;
    font-weight: 900;
    font-size: clamp(1.8rem,4.5vw,3rem);
    color: #111; line-height: 1.12;
    margin: 0 0 10px;
  }
  .ep-underline {
    width: 52px; height: 4px; border-radius: 2px;
    margin: 0 auto 14px;
    background: linear-gradient(90deg,#FF9933,#138808);
  }
  .ep-subtitle {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(.85rem,1.3vw,.95rem);
    color: #777; max-width: 400px;
    margin: 0 auto; line-height: 1.7;
  }

  /* ── Sticky filter bar ── */
  .ep-filter-bar {
    position: sticky; top: 0; z-index: 50;
    background: transparent;
    border-bottom: 1px solid rgba(255,153,51,.18);
    padding: 14px 0;
  }
  .ep-filter-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(16px,4vw,48px);
    display: flex; align-items: center;
    gap: 8px; overflow-x: auto;
    -ms-overflow-style: none; scrollbar-width: none;
  }
  .ep-filter-inner::-webkit-scrollbar { display: none; }
  .ep-filter-btn {
    padding: 7px 18px; border-radius: 100px;
    font-size: 13px; font-weight: 600;
    font-family: 'Outfit', sans-serif;
    border: 1.5px solid rgba(255,153,51,.28);
    background: rgba(255,255,255,.75);
    color: #777; cursor: pointer;
    transition: all .2s; white-space: nowrap; flex-shrink: 0;
  }
  .ep-filter-btn:hover {
    border-color: #FF9933; color: #FF9933;
    background: rgba(255,153,51,.07);
  }
  .ep-filter-active {
    background: #FF9933 !important;
    color: white !important;
    border-color: #FF9933 !important;
  }
  .ep-count {
    margin-left: auto; flex-shrink: 0;
    font-size: 12px; color: #aaa;
    font-family: 'Outfit', sans-serif; font-weight: 600;
  }

  /* ── Events grid section ── */
  .ep-grid-section {
    padding: clamp(32px,6vw,64px) 0;
  }
  .ep-grid-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(16px,4vw,48px);
  }

  /* ── Grid ── */
  .ep-grid {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: clamp(14px,2vw,24px);
  }

  /* ── Card ── */
  .ep-card {
    background: white; border-radius: 20px;
    border: 1px solid rgba(255,153,51,.13);
    box-shadow: 0 4px 24px rgba(0,0,0,.07);
    overflow: hidden; cursor: pointer;
    transition: transform .2s, box-shadow .2s;
  }
  .ep-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,.11); }

  /* ── Card banner ── */
  .ep-banner {
    position: relative; height: 140px;
    background: linear-gradient(135deg,rgba(255,153,51,.16),rgba(255,153,51,.04));
    display: flex; align-items: center; justify-content: center;
    font-size: 54px;
  }
  .ep-banner-emoji { transition: transform .2s; display: inline-block; }
  .ep-card:hover .ep-banner-emoji { transform: scale(1.1); }
  .ep-badge {
    position: absolute; top: 10px;
    font-size: 10px; font-weight: 700;
    padding: 3px 10px; border-radius: 100px;
    font-family: 'Outfit', sans-serif;
  }

  /* ── Card body ── */
  .ep-body { padding: clamp(14px,2.5vw,20px); }
  .ep-cat-label {
    font-size: 10px; font-weight: 700;
    color: #FF9933; text-transform: uppercase;
    letter-spacing: .1em; font-family: 'Outfit', sans-serif;
    display: block; margin-bottom: 4px;
  }
  .ep-card-title {
    font-family: 'Outfit', sans-serif; font-weight: 700;
    font-size: clamp(.9rem,1.3vw,1rem); color: #111;
    line-height: 1.4; margin: 0 0 12px;
  }
  .ep-meta { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .ep-meta-row {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: #888; font-family: 'Outfit', sans-serif;
  }
  .ep-btn {
    display: block; width: 100%; text-align: center;
    background: #FF9933; color: white;
    font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px;
    padding: 10px 0; border-radius: 10px; border: none; cursor: pointer;
    transition: background .2s, transform .15s;
    box-shadow: 0 4px 14px rgba(255,153,51,.28);
  }
  .ep-btn:hover { background: #e07d1a; transform: translateY(-1px); }

  /* ── Spinner ── */
  .ep-spinner-wrap { display: flex; justify-content: center; padding: 80px 0; }
  .ep-spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 4px solid #FF9933; border-top-color: transparent;
    animation: epSpinCw .7s linear infinite;
  }

  /* ── Empty ── */
  .ep-empty { text-align: center; padding: clamp(48px,10vw,80px) 0; }
  .ep-empty-icon { font-size: 44px; margin-bottom: 14px; }
  .ep-empty-text { font-family: 'Outfit', sans-serif; color: #999; font-size: .95rem; }

  /* ── Skeleton shimmer ── */
  .ep-skel {
    border-radius: 8px;
    background: linear-gradient(90deg,#e0dbd4 25%,#ccc6be 50%,#e0dbd4 75%);
    background-size: 800px 100%;
    animation: epShimmer 1.4s infinite linear;
  }

  /* ── TABLET (≤ 900px): 2 cols ── */
  @media (max-width: 900px) {
    .ep-grid { grid-template-columns: repeat(2,1fr); }
  }

  /* ── MOBILE (≤ 560px): 1 col ── */
  @media (max-width: 560px) {
    .ep-grid { grid-template-columns: 1fr; }
    .ep-heading { font-size: clamp(1.5rem,7vw,2rem); }
  }
`;

const ShapesBg = () => (
  <>
    <div className="ep-blob" style={{ width:480, height:480, top:"-10%",  right:"-8%",  background:"#e8d5b8", opacity:.85 }} />
    <div className="ep-blob" style={{ width:320, height:320, bottom:"8%",  left:"-5%",  background:"#c8dfc8", opacity:.7  }} />
    <div className="ep-blob" style={{ width:200, height:200, top:"44%",   left:"36%",  background:"#ddd0c0", opacity:.55 }} />

    <svg aria-hidden="true" className="ep-svg"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1440 900">

      {/* Top-left dot grid */}
      {Array.from({length:5}).map((_,r) =>
        Array.from({length:5}).map((_,c) => (
          <circle key={`tl-${r}-${c}`} cx={38+c*22} cy={38+r*22} r="2.4" fill="#138808" opacity="0.18"/>
        ))
      )}

      {/* Top-right spinning dashed ring */}
      <g style={{transformOrigin:"1368px 76px"}} className="ep-spin-cw">
        <circle cx="1368" cy="76" r="68" fill="none" stroke="#FF9933" strokeWidth="1.8" strokeDasharray="9 6" opacity="0.22"/>
      </g>
      <circle cx="1368" cy="76" r="44" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.13"/>
      <circle cx="1368" cy="76" r="8"  fill="#FF9933" opacity="0.15"/>

      {/* Top-center triangle */}
      <polygon className="ep-pulse" points="720,12 774,104 666,104" fill="none" stroke="#138808" strokeWidth="2" opacity="0.15"/>
      <polygon points="720,30 760,94 680,94" fill="none" stroke="#138808" strokeWidth="1" opacity="0.08"/>

      {/* Left-mid rotating squares */}
      <g style={{transformOrigin:"55px 420px"}} className="ep-spin-cw">
        <rect x="27" y="392" width="56" height="56" rx="7" fill="none" stroke="#FF9933" strokeWidth="1.8" opacity="0.2"/>
      </g>
      <g style={{transformOrigin:"55px 420px"}} className="ep-spin-ccw">
        <rect x="39" y="404" width="32" height="32" rx="4" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.11"/>
      </g>

      {/* Right-mid hexagon */}
      <polygon className="ep-pulse" style={{animationDelay:"1s"}}
        points="1402,400 1428,416 1428,448 1402,464 1376,448 1376,416"
        fill="none" stroke="#138808" strokeWidth="2" opacity="0.17"/>
      <polygon
        points="1402,414 1420,424 1420,446 1402,456 1384,446 1384,424"
        fill="none" stroke="#138808" strokeWidth="1" opacity="0.09"/>

      {/* Bottom-left spinning ring */}
      <g style={{transformOrigin:"90px 800px"}} className="ep-spin-ccw">
        <circle cx="90" cy="800" r="58" fill="none" stroke="#138808" strokeWidth="1.8" strokeDasharray="7 5" opacity="0.2"/>
      </g>
      <circle cx="90" cy="800" r="35" fill="none" stroke="#138808" strokeWidth="1" opacity="0.11"/>
      <circle cx="90" cy="800" r="7"  fill="#138808" opacity="0.12"/>

      {/* Bottom-right dot grid */}
      {Array.from({length:4}).map((_,r) =>
        Array.from({length:4}).map((_,c) => (
          <circle key={`br-${r}-${c}`} cx={1280+c*22} cy={760+r*22} r="2.4" fill="#FF9933" opacity="0.18"/>
        ))
      )}

      {/* Bottom wavy lines */}
      <path d="M300,858 Q400,834 500,858 Q600,882 700,858 Q800,834 900,858 Q1000,882 1100,858 Q1200,834 1300,858"
        fill="none" stroke="#FF9933" strokeWidth="2" opacity="0.18" strokeLinecap="round"/>
      <path d="M300,872 Q400,848 500,872 Q600,896 700,872 Q800,848 900,872 Q1000,896 1100,872 Q1200,848 1300,872"
        fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.09" strokeLinecap="round"/>

      {/* Mid rotating square */}
      <g style={{transformOrigin:"1108px 200px"}} className="ep-spin-cw">
        <rect x="1084" y="176" width="48" height="48" rx="7" fill="none" stroke="#FF9933" strokeWidth="1.6" opacity="0.15"/>
      </g>

      {/* Floating diamonds */}
      <g className="ep-float-1">
        <polygon points="126,280 153,318 126,356 99,318" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.2"/>
        <polygon points="126,292 145,318 126,344 107,318" fill="none" stroke="#FF9933" strokeWidth="0.8" opacity="0.11"/>
      </g>
      <g className="ep-float-2">
        <polygon points="1308,260 1336,298 1308,336 1280,298" fill="none" stroke="#138808" strokeWidth="1.5" opacity="0.18"/>
      </g>
      <g className="ep-float-3">
        <polygon points="700,700 728,736 700,772 672,736" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.16"/>
      </g>

      {/* Arc decorations */}
      <path d="M 0 360 A 180 180 0 0 1 165 228" fill="none" stroke="#FF9933" strokeWidth="1.2" opacity="0.14" strokeDasharray="6 9"/>
      <path d="M 1440 360 A 180 180 0 0 0 1275 228" fill="none" stroke="#138808" strokeWidth="1.2" opacity="0.14" strokeDasharray="6 9"/>

      {/* Scattered asterisks */}
      {[
        {x:232, y:62,  c:"#FF9933"},
        {x:1204,y:275, c:"#138808"},
        {x:46,  y:618, c:"#FF9933"},
        {x:1392,y:582, c:"#FF9933"},
        {x:706, y:863, c:"#138808"},
        {x:380, y:498, c:"#138808"},
        {x:560, y:136, c:"#FF9933"},
        {x:900, y:158, c:"#138808"},
      ].map((p,i)=>(
        <g key={`star-${i}`} opacity="0.2">
          <line x1={p.x-9} y1={p.y}   x2={p.x+9} y2={p.y}   stroke={p.c} strokeWidth="2"   strokeLinecap="round"/>
          <line x1={p.x}   y1={p.y-9} x2={p.x}   y2={p.y+9} stroke={p.c} strokeWidth="2"   strokeLinecap="round"/>
          <line x1={p.x-6} y1={p.y-6} x2={p.x+6} y2={p.y+6} stroke={p.c} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1={p.x+6} y1={p.y-6} x2={p.x-6} y2={p.y+6} stroke={p.c} strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      ))}

      {/* Accent circles */}
      <circle cx="344" cy="678" r="6" fill="#FF9933" opacity="0.17"/>
      <circle cx="808" cy="48"  r="5" fill="#138808" opacity="0.16"/>
      <circle cx="1194" cy="556" r="8" fill="#FF9933" opacity="0.13"/>
      <circle cx="190"  cy="318" r="4" fill="#138808" opacity="0.16"/>
      <circle cx="1050" cy="738" r="5" fill="#138808" opacity="0.14"/>
      <circle cx="640"  cy="820" r="6" fill="#FF9933" opacity="0.15"/>
    </svg>
  </>
);

const EventsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getPublishedEventsApi({ limit: 20 });
        setEvents(res.data.data || []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filtered = activeFilter === "All"
    ? events
    : events.filter((e) => e.category === activeFilter || e.eventMode === activeFilter);

  return (
    <div className="ep-page">
      <style>{STYLES}</style>
      <ShapesBg />

      <div className="ep-inner">

        {/* ── Hero ── */}
        <section className="ep-hero">
          <div className="ep-hero-inner">
            <span className="ep-chip">All Events</span>
            <h1 className="ep-heading">Upcoming Events</h1>
            <div className="ep-underline" />
            <p className="ep-subtitle">Conferences, workshops, and live sessions.</p>
          </div>
        </section>

        {/* ── Sticky filter bar ── */}
        <div className="ep-filter-bar">
          <div className="ep-filter-inner">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={activeFilter === f ? "ep-filter-btn ep-filter-active" : "ep-filter-btn"}
              >
                {f}
              </button>
            ))}
            <span className="ep-count">{filtered.length} events</span>
          </div>
        </div>

        {/* ── Events grid ── */}
        <section className="ep-grid-section">
          <div className="ep-grid-inner">
            {loading ? (
              <div className="ep-spinner-wrap">
                <div className="ep-spinner" />
              </div>
            ) : (
              <div className="ep-grid">
                {filtered.map((e) => (
                  <div
                    key={e._id}
                    className="ep-card"
                    onClick={() => navigate(`/events/${e._id}`)}
                  >
                    <div className="ep-banner">
                      <span className="ep-banner-emoji">
                        {e.category === "Technology" ? "💻" : e.eventMode === "Online" ? "🎙️" : "📐"}
                      </span>
                      <span className={`ep-badge ${badgeStyle(e.status)}`} style={{left:10}}>{e.status}</span>
                      <span className={`ep-badge ${modeStyle(e.eventMode)}`} style={{right:10}}>{e.eventMode}</span>
                    </div>

                    <div className="ep-body">
                      <span className="ep-cat-label">{e.category}</span>
                      <h3 className="ep-card-title">{e.title}</h3>
                      <div className="ep-meta">
                        <div className="ep-meta-row">
                          <span>📅</span>
                          <span>{e.dateTime?.startDate ? new Date(e.dateTime.startDate).toDateString() : "TBA"}</span>
                        </div>
                        <div className="ep-meta-row">
                          <span>📍</span>
                          <span>{e.location?.city || e.location?.venue || "Online"}</span>
                        </div>
                        <div className="ep-meta-row">
                          <span>🎟️</span>
                          <span>{e.registration?.isFree ? "Free" : `${e.registration?.currency} ${e.registration?.price}`}</span>
                        </div>
                      </div>
                      <button
                        className="ep-btn"
                        onClick={(ev) => { ev.stopPropagation(); navigate(`/events/${e._id}`); }}
                      >
                        View Event
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="ep-empty">
                <div className="ep-empty-icon">📭</div>
                <p className="ep-empty-text">No events found.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default EventsPage;