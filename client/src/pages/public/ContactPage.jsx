import ContactHeader from "@/components/contact/ContactHeader";
import ContactForm from "@/components/contact/ContactForm";
import FeatureHighlights from "@/components/contact/ContactFeatures";
import PopularLinks from "@/components/contact/PopularLinks";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

  @keyframes cpSpinCw  { to { transform: rotate(360deg); } }
  @keyframes cpSpinCcw { to { transform: rotate(-360deg); } }
  @keyframes cpPulse   { 0%,100%{opacity:.11} 50%{opacity:.23} }
  @keyframes cpFloat1  {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-10px) rotate(7deg); }
  }
  @keyframes cpFloat2  {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-14px) rotate(-6deg); }
  }
  @keyframes cpFloat3  {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-8px) rotate(9deg); }
  }

  .cp-spin-cw  { animation: cpSpinCw  20s linear infinite; }
  .cp-spin-ccw { animation: cpSpinCcw 15s linear infinite; }
  .cp-pulse    { animation: cpPulse    4.5s ease-in-out infinite; }
  .cp-float-1  { animation: cpFloat1   6s ease-in-out infinite; }
  .cp-float-2  { animation: cpFloat2   8s ease-in-out infinite; }
  .cp-float-3  { animation: cpFloat3   7s ease-in-out infinite; }

  /* ── Page ── */
  .cp-page {
    min-height: 100vh;
    background: #f0ece6;
    overflow-x: hidden;
    font-family: 'Outfit', sans-serif;
    position: relative;
  }

  /* ── Fixed bg blobs ── */
  .cp-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(85px);
    pointer-events: none;
    z-index: 0;
  }

  /* ── Fixed SVG shapes ── */
  .cp-svg {
    position: fixed; inset: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 0;
  }

  /* ── Content above shapes ── */
  .cp-inner { position: relative; z-index: 10; }

  /* ── Two-column section ── */
  .cp-two-col {
    max-width: 1100px; margin: 0 auto;
    padding: clamp(32px,6vw,56px) clamp(16px,4vw,24px);
    display: grid;
    grid-template-columns: 7fr 5fr;
    gap: clamp(24px,4vw,48px);
    align-items: start;
  }

  /* ── TABLET (≤ 1024px) ── */
  @media (max-width: 1024px) {
    .cp-two-col { grid-template-columns: 1fr 1fr; gap: 28px; }
  }

  /* ── MOBILE (≤ 700px): stack ── */
  @media (max-width: 700px) {
    .cp-two-col {
      grid-template-columns: 1fr;
      padding: 28px 16px;
      gap: 24px;
    }
  }
`;

const ShapesBg = () => (
  <>
    {/* Blobs */}
    <div className="cp-blob" style={{ width:480, height:480, top:"-10%",  right:"-8%",  background:"#e8d5b8", opacity:.85 }} />
    <div className="cp-blob" style={{ width:340, height:340, bottom:"10%", left:"-6%",  background:"#c8dfc8", opacity:.7  }} />
    <div className="cp-blob" style={{ width:220, height:220, top:"42%",   left:"38%",  background:"#ddd0c0", opacity:.55 }} />

    {/* SVG decorative shapes */}
    <svg aria-hidden="true" className="cp-svg"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1440 900">

      {/* Top-left dot grid */}
      {Array.from({length:5}).map((_,r) =>
        Array.from({length:5}).map((_,c) => (
          <circle key={`tl-${r}-${c}`} cx={38+c*22} cy={38+r*22} r="2.4" fill="#138808" opacity="0.19"/>
        ))
      )}

      {/* Top-right spinning dashed ring */}
      <g style={{transformOrigin:"1368px 76px"}} className="cp-spin-cw">
        <circle cx="1368" cy="76" r="68" fill="none" stroke="#FF9933" strokeWidth="1.8" strokeDasharray="9 6" opacity="0.22"/>
      </g>
      <circle cx="1368" cy="76" r="44" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.13"/>
      <circle cx="1368" cy="76" r="8"  fill="#FF9933" opacity="0.15"/>

      {/* Top-center triangle */}
      <polygon className="cp-pulse" points="720,12 774,104 666,104" fill="none" stroke="#138808" strokeWidth="2" opacity="0.15"/>
      <polygon points="720,30 760,94 680,94" fill="none" stroke="#138808" strokeWidth="1" opacity="0.08"/>

      {/* Left-mid rotating squares */}
      <g style={{transformOrigin:"55px 420px"}} className="cp-spin-cw">
        <rect x="27" y="392" width="56" height="56" rx="7" fill="none" stroke="#FF9933" strokeWidth="1.8" opacity="0.2"/>
      </g>
      <g style={{transformOrigin:"55px 420px"}} className="cp-spin-ccw">
        <rect x="39" y="404" width="32" height="32" rx="4" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.11"/>
      </g>

      {/* Right-mid hexagon */}
      <polygon className="cp-pulse" style={{animationDelay:"1s"}}
        points="1402,380 1428,396 1428,428 1402,444 1376,428 1376,396"
        fill="none" stroke="#138808" strokeWidth="2" opacity="0.17"/>
      <polygon
        points="1402,394 1420,404 1420,426 1402,436 1384,426 1384,404"
        fill="none" stroke="#138808" strokeWidth="1" opacity="0.09"/>

      {/* Bottom-left spinning ring */}
      <g style={{transformOrigin:"90px 800px"}} className="cp-spin-ccw">
        <circle cx="90" cy="800" r="58" fill="none" stroke="#138808" strokeWidth="1.8" strokeDasharray="7 5" opacity="0.2"/>
      </g>
      <circle cx="90" cy="800" r="35" fill="none" stroke="#138808" strokeWidth="1" opacity="0.11"/>
      <circle cx="90" cy="800" r="7"  fill="#138808" opacity="0.12"/>

      {/* Bottom-right dot grid */}
      {Array.from({length:4}).map((_,r) =>
        Array.from({length:4}).map((_,c) => (
          <circle key={`br-${r}-${c}`} cx={1280+c*22} cy={762+r*22} r="2.4" fill="#FF9933" opacity="0.18"/>
        ))
      )}

      {/* Bottom wavy lines */}
      <path d="M300,858 Q400,834 500,858 Q600,882 700,858 Q800,834 900,858 Q1000,882 1100,858 Q1200,834 1300,858"
        fill="none" stroke="#FF9933" strokeWidth="2" opacity="0.18" strokeLinecap="round"/>
      <path d="M300,872 Q400,848 500,872 Q600,896 700,872 Q800,848 900,872 Q1000,896 1100,872 Q1200,848 1300,872"
        fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.09" strokeLinecap="round"/>

      {/* Mid-right rotating square */}
      <g style={{transformOrigin:"1108px 200px"}} className="cp-spin-cw">
        <rect x="1084" y="176" width="48" height="48" rx="7" fill="none" stroke="#FF9933" strokeWidth="1.6" opacity="0.15"/>
      </g>

      {/* Floating diamonds */}
      <g className="cp-float-1">
        <polygon points="126,300 153,338 126,376 99,338" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.2"/>
        <polygon points="126,312 145,338 126,364 107,338" fill="none" stroke="#FF9933" strokeWidth="0.8" opacity="0.11"/>
      </g>
      <g className="cp-float-2">
        <polygon points="1308,260 1336,298 1308,336 1280,298" fill="none" stroke="#138808" strokeWidth="1.5" opacity="0.18"/>
      </g>
      <g className="cp-float-3">
        <polygon points="700,700 728,736 700,772 672,736" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.16"/>
      </g>

      {/* Top-left arc */}
      <path d="M 0 340 A 180 180 0 0 1 165 208" fill="none" stroke="#FF9933" strokeWidth="1.2" opacity="0.14" strokeDasharray="6 9"/>
      {/* Top-right arc */}
      <path d="M 1440 340 A 180 180 0 0 0 1275 208" fill="none" stroke="#138808" strokeWidth="1.2" opacity="0.14" strokeDasharray="6 9"/>

      {/* Scattered asterisks */}
      {[
        {x:232, y:62,  c:"#FF9933"},
        {x:1204,y:270, c:"#138808"},
        {x:46,  y:620, c:"#FF9933"},
        {x:1392,y:580, c:"#FF9933"},
        {x:706,  y:865, c:"#138808"},
        {x:380,  y:500, c:"#138808"},
        {x:560,  y:138, c:"#FF9933"},
        {x:900,  y:160, c:"#138808"},
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
      <circle cx="1194" cy="555" r="8" fill="#FF9933" opacity="0.13"/>
      <circle cx="190"  cy="318" r="4" fill="#138808" opacity="0.16"/>
      <circle cx="1050" cy="738" r="5" fill="#138808" opacity="0.14"/>
      <circle cx="640"  cy="820" r="6" fill="#FF9933" opacity="0.15"/>
    </svg>
  </>
);

const ContactPage = () => (
  <div className="cp-page">
    <style>{STYLES}</style>

    {/* Fixed background shapes */}
    <ShapesBg />

    <div className="cp-inner">
      <ContactHeader />

      {/* Section 2: Two Column Layout */}
      <section className="cp-two-col">
        <div>
          <ContactForm />
        </div>
        <div>
          <FeatureHighlights />
        </div>
      </section>

      <PopularLinks />
    </div>
  </div>
);

export default ContactPage;