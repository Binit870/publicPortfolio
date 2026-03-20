import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

  @keyframes bhFade {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes bhSpinCw  { to { transform: rotate(360deg); } }
  @keyframes bhSpinCcw { to { transform: rotate(-360deg); } }
  @keyframes bhPulse   { 0%,100%{opacity:.12} 50%{opacity:.24} }
  @keyframes bhFloat1  {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%     { transform: translateY(-10px) rotate(7deg); }
  }
  @keyframes bhFloat2  {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%     { transform: translateY(-14px) rotate(-6deg); }
  }
  @keyframes bhFloat3  {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-8px) rotate(9deg); }
  }

  .bh-f1 { animation: bhFade .6s ease both; }
  .bh-f2 { animation: bhFade .6s .1s ease both; }
  .bh-f3 { animation: bhFade .6s .2s ease both; }
  .bh-f4 { animation: bhFade .6s .32s ease both; }

  .bh-spin-cw  { animation: bhSpinCw  20s linear infinite; }
  .bh-spin-ccw { animation: bhSpinCcw 15s linear infinite; }
  .bh-pulse    { animation: bhPulse    4.5s ease-in-out infinite; }
  .bh-float-1  { animation: bhFloat1   6s ease-in-out infinite; }
  .bh-float-2  { animation: bhFloat2   8s ease-in-out infinite; }
  .bh-float-3  { animation: bhFloat3   7s ease-in-out infinite; }

  /* ── Section ── */
  .bh-section {
    position: relative;
    overflow: hidden;
    background: #f0ece6;
    padding: clamp(72px, 12vw, 110px) 0;
    font-family: 'Outfit', sans-serif;
  }

  /* ── Blobs ── */
  .bh-blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px); pointer-events: none; z-index: 0;
  }

  /* ── SVG ── */
  .bh-svg {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 1;
  }

  /* ── Content ── */
  .bh-container {
    position: relative; z-index: 2;
    max-width: 720px; margin: 0 auto;
    padding: 0 clamp(16px, 5vw, 32px);
    text-align: center;
  }

  /* ── Chip ── */
  .bh-chip {
    display: inline-block;
    background: #edf7ed; color: #138808;
    border: 1px solid #c0e0bc;
    border-radius: 100px;
    font-size: 11px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    padding: 5px 16px; margin-bottom: 18px;
    font-family: 'Outfit', sans-serif;
  }

  /* ── Heading ── */
  .bh-heading {
    font-family: 'Outfit', sans-serif;
    font-weight: 900;
    font-size: clamp(1.9rem, 5vw, 3.4rem);
    color: #111;
    line-height: 1.12;
    margin: 0 0 14px;
    letter-spacing: -.02em;
  }
  .bh-accent { color: #FF9933; }

  /* ── Subtitle ── */
  .bh-subtitle {
    font-family: 'Outfit', sans-serif;
    font-weight: 400;
    font-size: clamp(.88rem, 1.5vw, 1rem);
    color: #777;
    margin: 0 0 32px;
    max-width: 480px;
    margin-left: auto; margin-right: auto;
    line-height: 1.7;
  }

  /* ── Search bar ── */
  .bh-search-wrap {
    display: flex;
    align-items: center;
    max-width: 520px;
    margin: 0 auto;
    background: white;
    border-radius: 14px;
    border: 1.5px solid rgba(255,153,51,.25);
    box-shadow: 0 6px 28px rgba(0,0,0,.08);
    overflow: hidden;
    transition: border-color .2s, box-shadow .2s;
  }
  .bh-search-wrap:focus-within {
    border-color: rgba(255,153,51,.55);
    box-shadow: 0 8px 32px rgba(255,153,51,.15);
  }
  .bh-search-inner {
    display: flex; align-items: center;
    flex: 1; padding: 0 16px; gap: 10px;
  }
  .bh-search-icon { color: #bbb; flex-shrink: 0; }

  /* ── Search button base ── */
  .bh-search-btn {
    border-radius: 0 14px 14px 0 !important;
    padding: 14px 24px !important;
    font-family: 'Outfit', sans-serif !important;
    font-weight: 700 !important;
    font-size: 14px !important;
    white-space: nowrap;
    flex-shrink: 0;
    height: 100%;
    align-self: stretch;
  }

  /* ── TABLET ── */
  @media (max-width: 768px) {
    .bh-section { padding: clamp(60px, 10vw, 80px) 0; }
    .bh-heading  { font-size: clamp(1.7rem, 6vw, 2.4rem); }
  }

  /* ── MOBILE ── */
  @media (max-width: 480px) {
    .bh-section { padding: 64px 0; }
    .bh-search-wrap {
      flex-direction: row;
      border-radius: 50px;
      max-width: 100%;
    }
    .bh-search-inner { padding: 0 12px; gap: 6px; }
    .bh-search-btn {
      border-radius: 0 50px 50px 0 !important;
      padding: 12px 18px !important;
      font-size: 13px !important;
      white-space: nowrap;
      flex-shrink: 0;
    }
  }
`;

export default function HeroSection() {
  return (
    <section className="bh-section">
      <style>{STYLES}</style>

      {/* ── Blobs ── */}
      <div className="bh-blob" style={{ width:460, height:460, top:"-20%", right:"-8%",  background:"#e8d5b8", opacity:.85 }} />
      <div className="bh-blob" style={{ width:300, height:300, bottom:"-15%", left:"-6%", background:"#c8dfc8", opacity:.7  }} />
      <div className="bh-blob" style={{ width:200, height:200, top:"35%",  left:"35%",  background:"#ddd0c0", opacity:.55 }} />

      {/* ── Decorative SVG shapes ── */}
      <svg aria-hidden="true" className="bh-svg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 500">

        {/* Top-left dot grid */}
        {Array.from({length:5}).map((_,r) =>
          Array.from({length:5}).map((_,c) => (
            <circle key={`tl-${r}-${c}`} cx={38+c*22} cy={38+r*22} r="2.4" fill="#138808" opacity="0.2"/>
          ))
        )}

        {/* Top-right spinning dashed ring */}
        <g style={{transformOrigin:"1365px 75px"}} className="bh-spin-cw">
          <circle cx="1365" cy="75" r="65" fill="none" stroke="#FF9933" strokeWidth="1.8" strokeDasharray="9 6" opacity="0.22"/>
        </g>
        <circle cx="1365" cy="75" r="42" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.13"/>
        <circle cx="1365" cy="75" r="8" fill="#FF9933" opacity="0.15"/>

        {/* Top-center triangle */}
        <polygon className="bh-pulse" points="720,12 772,100 668,100" fill="none" stroke="#138808" strokeWidth="2" opacity="0.15"/>
        <polygon points="720,30 758,90 682,90" fill="none" stroke="#138808" strokeWidth="1" opacity="0.08"/>

        {/* Left-mid rotating squares */}
        <g style={{transformOrigin:"55px 260px"}} className="bh-spin-cw">
          <rect x="27" y="232" width="56" height="56" rx="7" fill="none" stroke="#FF9933" strokeWidth="1.8" opacity="0.2"/>
        </g>
        <g style={{transformOrigin:"55px 260px"}} className="bh-spin-ccw">
          <rect x="39" y="244" width="32" height="32" rx="4" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.11"/>
        </g>

        {/* Right-mid hexagon */}
        <polygon className="bh-pulse" style={{animationDelay:"1s"}}
          points="1400,220 1426,236 1426,268 1400,284 1374,268 1374,236"
          fill="none" stroke="#138808" strokeWidth="2" opacity="0.17"/>
        <polygon
          points="1400,234 1418,244 1418,266 1400,276 1382,266 1382,244"
          fill="none" stroke="#138808" strokeWidth="1" opacity="0.09"/>

        {/* Bottom-left spinning ring */}
        <g style={{transformOrigin:"92px 458px"}} className="bh-spin-ccw">
          <circle cx="92" cy="458" r="55" fill="none" stroke="#138808" strokeWidth="1.8" strokeDasharray="7 5" opacity="0.2"/>
        </g>
        <circle cx="92" cy="458" r="33" fill="none" stroke="#138808" strokeWidth="1" opacity="0.11"/>
        <circle cx="92" cy="458" r="7" fill="#138808" opacity="0.12"/>

        {/* Bottom-right dot grid */}
        {Array.from({length:4}).map((_,r) =>
          Array.from({length:4}).map((_,c) => (
            <circle key={`br-${r}-${c}`} cx={1278+c*22} cy={378+r*22} r="2.4" fill="#FF9933" opacity="0.18"/>
          ))
        )}

        {/* Bottom wavy lines */}
        <path d="M300,468 Q380,444 460,468 Q540,492 620,468 Q700,444 780,468 Q860,492 940,468 Q1020,444 1100,468 Q1180,492 1260,468"
          fill="none" stroke="#FF9933" strokeWidth="2" opacity="0.18" strokeLinecap="round"/>
        <path d="M300,480 Q380,456 460,480 Q540,504 620,480 Q700,456 780,480 Q860,504 940,480 Q1020,456 1100,480 Q1180,504 1260,480"
          fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.09" strokeLinecap="round"/>

        {/* Mid-right rotating square */}
        <g style={{transformOrigin:"1108px 148px"}} className="bh-spin-cw">
          <rect x="1084" y="124" width="48" height="48" rx="7" fill="none" stroke="#FF9933" strokeWidth="1.6" opacity="0.15"/>
        </g>

        {/* Floating diamonds */}
        <g className="bh-float-1">
          <polygon points="125,148 152,184 125,220 98,184" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.2"/>
        </g>
        <g className="bh-float-2">
          <polygon points="1305,130 1332,166 1305,202 1278,166" fill="none" stroke="#138808" strokeWidth="1.5" opacity="0.18"/>
        </g>
        <g className="bh-float-3">
          <polygon points="680,400 706,434 680,468 654,434" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.16"/>
        </g>

        {/* Scattered asterisks */}
        {[
          {x:232, y:64,  c:"#FF9933"},
          {x:1202,y:168, c:"#138808"},
          {x:46,  y:380, c:"#FF9933"},
          {x:1390,y:355, c:"#FF9933"},
          {x:706,  y:472, c:"#138808"},
          {x:378,  y:280, c:"#138808"},
        ].map((p,i)=>(
          <g key={`star-${i}`} opacity="0.2">
            <line x1={p.x-9} y1={p.y}   x2={p.x+9} y2={p.y}   stroke={p.c} strokeWidth="2"   strokeLinecap="round"/>
            <line x1={p.x}   y1={p.y-9} x2={p.x}   y2={p.y+9} stroke={p.c} strokeWidth="2"   strokeLinecap="round"/>
            <line x1={p.x-6} y1={p.y-6} x2={p.x+6} y2={p.y+6} stroke={p.c} strokeWidth="1.5" strokeLinecap="round"/>
            <line x1={p.x+6} y1={p.y-6} x2={p.x-6} y2={p.y+6} stroke={p.c} strokeWidth="1.5" strokeLinecap="round"/>
          </g>
        ))}

        {/* Accent circles */}
        <circle cx="342" cy="420" r="6" fill="#FF9933" opacity="0.17"/>
        <circle cx="806" cy="48"  r="5" fill="#138808" opacity="0.16"/>
        <circle cx="1192" cy="320" r="8" fill="#FF9933" opacity="0.13"/>
        <circle cx="188"  cy="200" r="4" fill="#138808" opacity="0.16"/>
      </svg>

      {/* ── Content ── */}
      <div className="bh-container">

        <div className="bh-f1">
          <span className="bh-chip">The Developer Blog</span>
        </div>

        <h1 className="bh-heading bh-f2">
          Stories &amp; Ideas for{" "}
          <span className="bh-accent">Modern Developers</span>
        </h1>

        <p className="bh-subtitle bh-f3">
          Explore tutorials, deep dives, and insights from the developer community.
        </p>

        <div className="bh-search-wrap bh-f4">
          <div className="bh-search-inner">
            <Search size={18} className="bh-search-icon" />
            <Input
              placeholder="Search articles..."
              className="border-0 focus-visible:ring-0 bg-transparent font-['Outfit']"
            />
          </div>
          <Button className="bh-search-btn rounded-none">
            Search
          </Button>
        </div>

      </div>
    </section>
  )
}