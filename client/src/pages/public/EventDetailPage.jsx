import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

import FloatingBubbles from "../../components/event/FloatingBubbles";
import HeroSection from "../../components/event/HeroSection";
import QuickHighlights from "../../components/event/QuickHighlights";
import OverviewSection from "../../components/event/OverviewSection";
import AgendaSection from "../../components/event/AgendaSection";
import SpeakersSection from "../../components/event/SpeakerSection";
import LocationSection from "../../components/event/LocationSection";
import OrganizerSection from "../../components/event/OrganizerSection";
import GallerySection from "../../components/event/GallerySection";
import TagsSection from "../../components/event/TagSection";
import StatsBar from "../../components/event/StatsBar";
import FooterCTA from "../../components/event/FooterCTA";
import MobileRegisterBar from "../../components/event/MobileRegisterBar";

import { getEventByIdApi } from "../../api/event.api";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

  @keyframes edSpinCw  { to { transform: rotate(360deg); } }
  @keyframes edSpinCcw { to { transform: rotate(-360deg); } }
  @keyframes edPulse   { 0%,100%{opacity:.11} 50%{opacity:.23} }
  @keyframes edFloat1  {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-10px) rotate(7deg); }
  }
  @keyframes edFloat2  {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-14px) rotate(-6deg); }
  }
  @keyframes edFloat3  {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-8px) rotate(9deg); }
  }

  .ed-spin-cw  { animation: edSpinCw  20s linear infinite; }
  .ed-spin-ccw { animation: edSpinCcw 15s linear infinite; }
  .ed-pulse    { animation: edPulse    4.5s ease-in-out infinite; }
  .ed-float-1  { animation: edFloat1   6s ease-in-out infinite; }
  .ed-float-2  { animation: edFloat2   8s ease-in-out infinite; }
  .ed-float-3  { animation: edFloat3   7s ease-in-out infinite; }

  /* ── Page ── */
  .ed-page {
    min-height: 100vh;
    background: #f0ece6;
    font-family: 'Outfit', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Fixed blobs ── */
  .ed-blob {
    position: fixed; border-radius: 50%;
    filter: blur(85px); pointer-events: none; z-index: 0;
  }

  /* ── Fixed SVG ── */
  .ed-svg {
    position: fixed; inset: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 0;
  }

  /* ── Inner content ── */
  .ed-inner { position: relative; z-index: 10; }

  /* ── Back button wrapper ── */
  .ed-back-wrap {
    max-width: 1280px; margin: 0 auto;
    padding: clamp(16px,3vw,24px) clamp(16px,4vw,48px) 0;
  }

  /* ── Back button ── */
  .ed-back-btn {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 600;
    color: #888; background: rgba(255,255,255,.75);
    border: 1.5px solid rgba(255,153,51,.2);
    border-radius: 100px; padding: 8px 18px;
    cursor: pointer; margin-bottom: clamp(16px,3vw,24px);
    transition: all .2s;
    box-shadow: 0 2px 10px rgba(0,0,0,.06);
  }
  .ed-back-btn:hover {
    color: #FF9933;
    border-color: #FF9933;
    background: rgba(255,153,51,.07);
    transform: translateX(-2px);
  }

  /* ── Loading state ── */
  .ed-loading {
    min-height: 100vh; background: #f0ece6;
    display: flex; align-items: center; justify-content: center;
  }
  .ed-spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 4px solid #FF9933; border-top-color: transparent;
    animation: edSpinCw .7s linear infinite;
  }

  /* ── Error state ── */
  .ed-error {
    min-height: 100vh; background: #f0ece6;
    display: flex; align-items: center; justify-content: center;
    text-align: center; padding: 0 24px;
  }
  .ed-error-icon { font-size: 56px; margin-bottom: 16px; }
  .ed-error-title {
    font-family: 'Outfit', sans-serif;
    font-weight: 800; font-size: clamp(1.4rem,3vw,1.8rem);
    color: #111; margin-bottom: 20px;
  }
  .ed-error-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: #FF9933; color: white;
    font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 14px;
    padding: 13px 28px; border-radius: 12px; border: none; cursor: pointer;
    transition: background .2s, transform .15s;
    box-shadow: 0 6px 20px rgba(255,153,51,.32);
  }
  .ed-error-btn:hover { background: #e07d1a; transform: translateY(-2px); }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .ed-back-wrap { padding-top: 14px; }
  }
  @media (max-width: 480px) {
    .ed-back-btn { font-size: 12px; padding: 7px 14px; }
  }
`;

const ShapesBg = () => (
  <>
    <div className="ed-blob" style={{ width:500, height:500, top:"-10%",  right:"-8%",  background:"#e8d5b8", opacity:.85 }} />
    <div className="ed-blob" style={{ width:340, height:340, bottom:"8%",  left:"-6%",  background:"#c8dfc8", opacity:.7  }} />
    <div className="ed-blob" style={{ width:220, height:220, top:"42%",   left:"36%",  background:"#ddd0c0", opacity:.55 }} />

    <svg aria-hidden="true" className="ed-svg"
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
      <g style={{transformOrigin:"1368px 76px"}} className="ed-spin-cw">
        <circle cx="1368" cy="76" r="68" fill="none" stroke="#FF9933" strokeWidth="1.8" strokeDasharray="9 6" opacity="0.22"/>
      </g>
      <circle cx="1368" cy="76" r="44" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.13"/>
      <circle cx="1368" cy="76" r="8"  fill="#FF9933" opacity="0.15"/>

      {/* Top-center triangle */}
      <polygon className="ed-pulse" points="720,12 774,104 666,104" fill="none" stroke="#138808" strokeWidth="2" opacity="0.15"/>
      <polygon points="720,30 760,94 680,94" fill="none" stroke="#138808" strokeWidth="1" opacity="0.08"/>

      {/* Left-mid rotating squares */}
      <g style={{transformOrigin:"55px 400px"}} className="ed-spin-cw">
        <rect x="27" y="372" width="56" height="56" rx="7" fill="none" stroke="#FF9933" strokeWidth="1.8" opacity="0.2"/>
      </g>
      <g style={{transformOrigin:"55px 400px"}} className="ed-spin-ccw">
        <rect x="39" y="384" width="32" height="32" rx="4" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.11"/>
      </g>

      {/* Right-mid hexagon */}
      <polygon className="ed-pulse" style={{animationDelay:"1s"}}
        points="1402,380 1428,396 1428,428 1402,444 1376,428 1376,396"
        fill="none" stroke="#138808" strokeWidth="2" opacity="0.17"/>
      <polygon
        points="1402,394 1420,404 1420,426 1402,436 1384,426 1384,404"
        fill="none" stroke="#138808" strokeWidth="1" opacity="0.09"/>

      {/* Bottom-left spinning ring */}
      <g style={{transformOrigin:"90px 800px"}} className="ed-spin-ccw">
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

      {/* Mid-right rotating square */}
      <g style={{transformOrigin:"1108px 200px"}} className="ed-spin-cw">
        <rect x="1084" y="176" width="48" height="48" rx="7" fill="none" stroke="#FF9933" strokeWidth="1.6" opacity="0.15"/>
      </g>

      {/* Floating diamonds */}
      <g className="ed-float-1">
        <polygon points="126,280 153,318 126,356 99,318" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.2"/>
        <polygon points="126,292 145,318 126,344 107,318" fill="none" stroke="#FF9933" strokeWidth="0.8" opacity="0.11"/>
      </g>
      <g className="ed-float-2">
        <polygon points="1308,240 1336,278 1308,316 1280,278" fill="none" stroke="#138808" strokeWidth="1.5" opacity="0.18"/>
      </g>
      <g className="ed-float-3">
        <polygon points="700,700 728,736 700,772 672,736" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.16"/>
      </g>

      {/* Arc decorations */}
      <path d="M 0 360 A 180 180 0 0 1 165 228" fill="none" stroke="#FF9933" strokeWidth="1.2" opacity="0.14" strokeDasharray="6 9"/>
      <path d="M 1440 360 A 180 180 0 0 0 1275 228" fill="none" stroke="#138808" strokeWidth="1.2" opacity="0.14" strokeDasharray="6 9"/>

      {/* Scattered asterisks */}
      {[
        {x:232, y:62,  c:"#FF9933"},
        {x:1204,y:272, c:"#138808"},
        {x:46,  y:615, c:"#FF9933"},
        {x:1392,y:580, c:"#FF9933"},
        {x:706, y:862, c:"#138808"},
        {x:380, y:496, c:"#138808"},
        {x:560, y:134, c:"#FF9933"},
        {x:900, y:155, c:"#138808"},
      ].map((p,i)=>(
        <g key={`star-${i}`} opacity="0.2">
          <line x1={p.x-9} y1={p.y}   x2={p.x+9} y2={p.y}   stroke={p.c} strokeWidth="2"   strokeLinecap="round"/>
          <line x1={p.x}   y1={p.y-9} x2={p.x}   y2={p.y+9} stroke={p.c} strokeWidth="2"   strokeLinecap="round"/>
          <line x1={p.x-6} y1={p.y-6} x2={p.x+6} y2={p.y+6} stroke={p.c} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1={p.x+6} y1={p.y-6} x2={p.x-6} y2={p.y+6} stroke={p.c} strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      ))}

      {/* Accent circles */}
      <circle cx="344" cy="676" r="6" fill="#FF9933" opacity="0.17"/>
      <circle cx="808" cy="46"  r="5" fill="#138808" opacity="0.16"/>
      <circle cx="1194" cy="554" r="8" fill="#FF9933" opacity="0.13"/>
      <circle cx="190"  cy="316" r="4" fill="#138808" opacity="0.16"/>
      <circle cx="1050" cy="736" r="5" fill="#138808" opacity="0.14"/>
      <circle cx="640"  cy="818" r="6" fill="#FF9933" opacity="0.15"/>
    </svg>
  </>
);

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getEventByIdApi(id);
        setEvent(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // 🔄 Loading
  if (loading) {
    return (
      <div className="ed-loading">
        <style>{STYLES}</style>
        <div className="ed-spinner" />
      </div>
    );
  }

  // ❌ Error
  if (error || !event) {
    return (
      <div className="ed-error">
        <style>{STYLES}</style>
        <div>
          <div className="ed-error-icon">📭</div>
          <h2 className="ed-error-title">Event not found</h2>
          <button className="ed-error-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back to Events
          </button>
        </div>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <div className="ed-page">
      <style>{STYLES}</style>
      <ShapesBg />

      <FloatingBubbles />

      <div className="ed-inner">

        {/* 🔙 Back button */}
        <div className="ed-back-wrap">
          <button onClick={() => navigate(-1)} className="ed-back-btn">
            <ArrowLeft size={15} /> Back to Events
          </button>
        </div>

        {/* Sections — all unchanged */}
        <HeroSection event={event} />
        <QuickHighlights event={event} />
        <OverviewSection event={event} />
        <AgendaSection event={event} />
        <SpeakersSection event={event} />
        <LocationSection event={event} />
        <OrganizerSection event={event} />
        <GallerySection event={event} />
        <TagsSection event={event} />
        <StatsBar event={event} />
        <FooterCTA />
      </div>

      <MobileRegisterBar />
    </div>
  );
};

export default EventDetailPage;