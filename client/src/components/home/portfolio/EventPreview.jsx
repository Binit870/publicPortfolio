import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPublishedEventsApi } from "../../../api/event.api";

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

  @keyframes evSpinCw  { to { transform: rotate(360deg); } }
  @keyframes evSpinCcw { to { transform: rotate(-360deg); } }
  @keyframes evPulse { 0%,100%{opacity:.11} 50%{opacity:.21} }
  @keyframes evShimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  .ev-spin-cw  { animation: evSpinCw  20s linear infinite; }
  .ev-spin-ccw { animation: evSpinCcw 16s linear infinite; }
  .ev-pulse    { animation: evPulse    5s ease-in-out infinite; }

  /* Section */
  .ev-section {
    position: relative; overflow: hidden;
    background: #e8e2da;
    padding: clamp(60px,10vw,96px) 0;
    font-family: 'Outfit', sans-serif;
  }
  .ev-blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px); pointer-events: none; z-index: 0; opacity: .75;
  }

  /* Container */
  .ev-container {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(16px,4vw,48px);
  }

  /* Header */
  .ev-header { text-align: center; margin-bottom: clamp(36px,6vw,52px); }
  .ev-chip {
    display: inline-block;
    background: #fff3e6; color: #e07d1a;
    border: 1px solid #ffd9a8; border-radius: 100px;
    font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
    padding: 4px 14px; margin-bottom: 10px; font-family: 'Outfit', sans-serif;
  }
  .ev-title {
    font-family: 'Outfit', sans-serif; font-weight: 800;
    font-size: clamp(1.7rem,3.5vw,2.4rem); color: #111;
    margin: 0 0 10px; line-height: 1.15;
  }
  .ev-underline {
    width: 52px; height: 4px; border-radius: 2px; margin: 0 auto 14px;
    background: linear-gradient(90deg,#FF9933,#138808);
  }
  .ev-subtitle {
    color: #888; font-size: clamp(.85rem,1.2vw,.95rem);
    font-family: 'Outfit', sans-serif; max-width: 400px; margin: 0 auto;
  }

  /* Grid */
  .ev-grid { display: grid; gap: clamp(14px,2vw,22px); }
  .ev-grid-1 { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; }
  .ev-grid-2 { grid-template-columns: repeat(2,1fr); max-width: 760px; margin: 0 auto; }
  .ev-grid-3 { grid-template-columns: repeat(3,1fr); }

  /* Card */
  .ev-card {
    background: white; border-radius: 20px;
    border: 1px solid rgba(255,153,51,.13);
    box-shadow: 0 4px 24px rgba(0,0,0,.07);
    overflow: hidden; cursor: pointer;
    transition: transform .2s, box-shadow .2s;
  }
  .ev-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,.11); }

  /* Card banner */
  .ev-banner {
    position: relative; height: 140px;
    background: linear-gradient(135deg, rgba(255,153,51,.18), rgba(255,153,51,.05));
    display: flex; align-items: center; justify-content: center;
    font-size: 56px;
  }
  .ev-banner-emoji { transition: transform .2s; display: inline-block; }
  .ev-card:hover .ev-banner-emoji { transform: scale(1.1); }
  .ev-badge {
    position: absolute; top: 10px;
    font-size: 10px; font-weight: 700;
    padding: 3px 10px; border-radius: 100px;
    font-family: 'Outfit', sans-serif;
  }

  /* Card body */
  .ev-body { padding: clamp(14px,2.5vw,20px); }
  .ev-card-title {
    font-family: 'Outfit', sans-serif; font-weight: 700;
    font-size: clamp(.9rem,1.3vw,1rem); color: #111;
    line-height: 1.4; margin: 0 0 12px;
  }
  .ev-meta { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .ev-meta-row {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: #888; font-family: 'Outfit', sans-serif;
  }

  /* View Event btn */
  .ev-btn-primary {
    display: block; width: 100%; text-align: center;
    background: #FF9933; color: white;
    font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px;
    padding: 10px 0; border-radius: 10px; border: none; cursor: pointer;
    transition: background .2s, transform .15s;
    box-shadow: 0 4px 14px rgba(255,153,51,.28);
  }
  .ev-btn-primary:hover { background: #e07d1a; transform: translateY(-1px); }

  /* Footer btn */
  .ev-footer { text-align: center; margin-top: clamp(28px,4vw,44px); }
  .ev-btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: #FF9933;
    font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 14px;
    padding: 13px 32px; border-radius: 12px; border: 2px solid #FF9933; cursor: pointer;
    transition: background .2s, color .2s, transform .15s;
  }
  .ev-btn-outline:hover { background: #FF9933; color: white; transform: translateY(-2px); }

  /* Skeleton */
  .ev-skel {
    border-radius: 8px;
    background: linear-gradient(90deg,#e0dbd4 25%,#ccc6be 50%,#e0dbd4 75%);
    background-size: 800px 100%;
    animation: evShimmer 1.4s infinite linear;
  }
  .ev-skel-banner { height: 140px; border-radius: 0; }
  .ev-skel-line { height: 13px; margin-bottom: 10px; }

  /* ── TABLET ── */
  @media (max-width: 900px) {
    .ev-grid-3 { grid-template-columns: repeat(2,1fr); }
  }
  /* ── MOBILE ── */
  @media (max-width: 600px) {
    .ev-section { padding: 56px 0; }
    .ev-grid-3, .ev-grid-2 { grid-template-columns: 1fr; max-width: 100%; }
    .ev-btn-outline { width: 100%; justify-content: center; }
  }
`;

const ShapesBg = () => (
  <>
    <div className="ev-blob" style={{ width:420, height:420, top:"-12%", right:"-6%", background:"#d4c9b8" }} />
    <div className="ev-blob" style={{ width:260, height:260, bottom:"-5%", left:"-4%", background:"#b8d4b8" }} />
    <div className="ev-blob" style={{ width:180, height:180, top:"45%", left:"38%", background:"#ccc4b8" }} />
    <svg aria-hidden="true" style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:1 }}
      xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 600">
      {Array.from({length:5}).map((_,r) => Array.from({length:5}).map((_,c) => (
        <circle key={`tl-${r}-${c}`} cx={36+c*20} cy={36+r*20} r="2.4" fill="#138808" opacity="0.18" />
      )))}
      <g style={{transformOrigin:"1368px 72px"}} className="ev-spin-cw">
        <circle cx="1368" cy="72" r="64" fill="none" stroke="#FF9933" strokeWidth="1.8" strokeDasharray="9 6" opacity="0.22" />
      </g>
      <circle cx="1368" cy="72" r="40" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.12" />
      <circle cx="1368" cy="72" r="8" fill="#FF9933" opacity="0.14" />
      <polygon className="ev-pulse" points="720,10 770,96 670,96" fill="none" stroke="#138808" strokeWidth="2" opacity="0.14" />
      <polygon points="720,28 757,86 683,86" fill="none" stroke="#138808" strokeWidth="1" opacity="0.08" />
      <g style={{transformOrigin:"52px 300px"}} className="ev-spin-cw">
        <rect x="24" y="272" width="56" height="56" rx="6" fill="none" stroke="#FF9933" strokeWidth="1.8" opacity="0.2" />
      </g>
      <g style={{transformOrigin:"52px 300px"}} className="ev-spin-ccw">
        <rect x="36" y="284" width="32" height="32" rx="4" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.11" />
      </g>
      <polygon className="ev-pulse" points="1400,256 1426,272 1426,304 1400,320 1374,304 1374,272" fill="none" stroke="#138808" strokeWidth="2" opacity="0.16" />
      <g style={{transformOrigin:"88px 536px"}} className="ev-spin-ccw">
        <circle cx="88" cy="536" r="54" fill="none" stroke="#138808" strokeWidth="1.8" strokeDasharray="7 5" opacity="0.19" />
      </g>
      <circle cx="88" cy="536" r="32" fill="none" stroke="#138808" strokeWidth="1" opacity="0.10" />
      <circle cx="88" cy="536" r="7" fill="#138808" opacity="0.11" />
      {Array.from({length:4}).map((_,r) => Array.from({length:4}).map((_,c) => (
        <circle key={`br-${r}-${c}`} cx={1282+c*20} cy={466+r*20} r="2.4" fill="#FF9933" opacity="0.17" />
      )))}
      <path d="M320,570 Q400,546 480,570 Q560,594 640,570 Q720,546 800,570 Q880,594 960,570 Q1040,546 1120,570" fill="none" stroke="#FF9933" strokeWidth="2" opacity="0.17" strokeLinecap="round" />
      <path d="M320,582 Q400,558 480,582 Q560,606 640,582 Q720,558 800,582 Q880,606 960,582 Q1040,558 1120,582" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.08" strokeLinecap="round" />
      <g style={{transformOrigin:"1110px 140px"}} className="ev-spin-cw">
        <rect x="1086" y="116" width="48" height="48" rx="7" fill="none" stroke="#FF9933" strokeWidth="1.6" opacity="0.14" />
      </g>
      {[{x:220,y:68,c:"#FF9933"},{x:1200,y:175,c:"#138808"},{x:44,y:455,c:"#FF9933"},{x:1388,y:415,c:"#FF9933"},{x:705,y:562,c:"#138808"},{x:375,y:295,c:"#138808"}].map((p,i)=>(
        <g key={i} opacity="0.19">
          <line x1={p.x-9} y1={p.y} x2={p.x+9} y2={p.y} stroke={p.c} strokeWidth="2.5" strokeLinecap="round" />
          <line x1={p.x} y1={p.y-9} x2={p.x} y2={p.y+9} stroke={p.c} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}
      <circle cx="338" cy="508" r="6" fill="#FF9933" opacity="0.16" />
      <circle cx="802" cy="42"  r="5" fill="#138808" opacity="0.14" />
      <circle cx="1188" cy="375" r="8" fill="#FF9933" opacity="0.12" />
      <circle cx="182"  cy="218" r="4" fill="#138808" opacity="0.15" />
    </svg>
  </>
);

const EventsPreview = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getPublishedEventsApi({ limit: 3 });
        setEvents(res.data.data || []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section id="events" className="ev-section">
        <style>{STYLES}</style>
        <ShapesBg />
        <div className="ev-container">
          <div className="ev-header">
            <span className="ev-chip">Upcoming</span>
            <h2 className="ev-title">Events</h2>
            <div className="ev-underline" />
          </div>
          <div className="ev-grid ev-grid-3">
            {[1,2,3].map((i) => (
              <div key={i} className="ev-card">
                <div className="ev-skel ev-skel-banner" />
                <div style={{padding:"16px"}}>
                  <div className="ev-skel ev-skel-line" style={{width:"75%"}} />
                  <div className="ev-skel ev-skel-line" style={{width:"50%"}} />
                  <div className="ev-skel ev-skel-line" style={{width:"60%"}} />
                  <div className="ev-skel ev-skel-line" style={{width:"100%", height:36, borderRadius:10}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  const gridClass =
    events.length === 1 ? "ev-grid ev-grid-1"
    : events.length === 2 ? "ev-grid ev-grid-2"
    : "ev-grid ev-grid-3";

  return (
    <section id="events" className="ev-section">
      <style>{STYLES}</style>
      <ShapesBg />

      <div className="ev-container">
        <div className="ev-header">
          <span className="ev-chip">Upcoming</span>
          <h2 className="ev-title">Events</h2>
          <div className="ev-underline" />
          <p className="ev-subtitle">Join me at upcoming conferences, live sessions, and workshops.</p>
        </div>

        <div className={gridClass}>
          {events.map((e) => (
            <div key={e._id} className="ev-card" onClick={() => navigate(`/events/${e._id}`)}>
              <div className="ev-banner">
                <span className="ev-banner-emoji">
                  {e.eventMode === "Online" ? "🎙️" : e.eventMode === "Hybrid" ? "💻" : "📐"}
                </span>
                <span className={`ev-badge ${badgeStyle(e.status)}`} style={{left:10}}>{e.status}</span>
                <span className={`ev-badge ${modeStyle(e.eventMode)}`} style={{right:10}}>{e.eventMode}</span>
              </div>

              <div className="ev-body">
                <h3 className="ev-card-title">{e.title}</h3>
                <div className="ev-meta">
                  <div className="ev-meta-row">
                    <span>📅</span>
                    <span>{e.dateTime?.startDate ? new Date(e.dateTime.startDate).toDateString() : "TBA"}</span>
                  </div>
                  <div className="ev-meta-row">
                    <span>📍</span>
                    <span>{e.location?.city || e.location?.venue || "Online"}</span>
                  </div>
                  <div className="ev-meta-row">
                    <span>🎟️</span>
                    <span>{e.registration?.isFree ? "Free" : `${e.registration?.currency} ${e.registration?.price}`}</span>
                  </div>
                </div>
                <button
                  className="ev-btn-primary"
                  onClick={(ev) => { ev.stopPropagation(); navigate(`/events/${e._id}`); }}
                >
                  View Event
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="ev-footer">
          <button className="ev-btn-outline" onClick={() => navigate("/events")}>
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;
