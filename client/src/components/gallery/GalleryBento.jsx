import GalleryItemCard from "./GalleryItemCard";

const bentoClasses = [
  "sm:col-span-2",
  "",
  "sm:row-span-2",
  "",
  "sm:col-span-2",
  "",
];

const GalleryBento = ({ collectionLabel, gallery, onItemClick }) => {
  if (!gallery) return null;

  const items = gallery.items || [];

  return (
    <section className="gb-section">
      <style>{STYLES}</style>

      {/* ── Background blobs ── */}
      <div className="gb-blob" style={{ width:420, height:420, top:"-18%", left:"-8%",  background:"#e8d5b8" }} />
      <div className="gb-blob" style={{ width:300, height:300, bottom:"-12%", right:"-6%", background:"#c8dfc8" }} />
      <div className="gb-blob" style={{ width:200, height:200, top:"45%",  right:"25%", background:"#ddd0c0" }} />

      {/* ── Decorative SVG shapes ── */}
      <svg aria-hidden="true" className="gb-svg-bg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 700">

        {/* Top-right cross-hatch grid */}
        {Array.from({length:6}).map((_,row) =>
          Array.from({length:6}).map((_,col) => (
            <g key={`ch-${row}-${col}`} transform={`translate(${1210+col*26},${22+row*26})`} opacity="0.17">
              <line x1="-5" y1="-5" x2="5" y2="5" stroke="#FF9933" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="5" y1="-5" x2="-5" y2="5" stroke="#FF9933" strokeWidth="1.2" strokeLinecap="round"/>
            </g>
          ))
        )}

        {/* Bottom-left cross-hatch grid */}
        {Array.from({length:5}).map((_,row) =>
          Array.from({length:5}).map((_,col) => (
            <g key={`ch2-${row}-${col}`} transform={`translate(${28+col*26},${570+row*26})`} opacity="0.15">
              <line x1="-5" y1="-5" x2="5" y2="5" stroke="#138808" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="5" y1="-5" x2="-5" y2="5" stroke="#138808" strokeWidth="1.2" strokeLinecap="round"/>
            </g>
          ))
        )}

        {/* Top-left spinning concentric rings */}
        <g style={{transformOrigin:"68px 64px"}} className="gb-spin-cw">
          <circle cx="68" cy="64" r="54" fill="none" stroke="#FF9933" strokeWidth="1.5" strokeDasharray="5 8" opacity="0.22"/>
        </g>
        <g style={{transformOrigin:"68px 64px"}} className="gb-spin-ccw">
          <circle cx="68" cy="64" r="33" fill="none" stroke="#138808" strokeWidth="1" strokeDasharray="3 10" opacity="0.17"/>
        </g>
        <circle cx="68" cy="64" r="6" fill="#FF9933" opacity="0.2"/>

        {/* Bottom-right spinning concentric rings */}
        <g style={{transformOrigin:"1375px 640px"}} className="gb-spin-ccw">
          <circle cx="1375" cy="640" r="58" fill="none" stroke="#FF9933" strokeWidth="1.5" strokeDasharray="5 8" opacity="0.2"/>
        </g>
        <g style={{transformOrigin:"1375px 640px"}} className="gb-spin-cw">
          <circle cx="1375" cy="640" r="36" fill="none" stroke="#FF9933" strokeWidth="1" strokeDasharray="3 10" opacity="0.14"/>
        </g>
        <circle cx="1375" cy="640" r="6" fill="#FF9933" opacity="0.18"/>

        {/* Floating diamonds */}
        <g className="gb-float-1">
          <polygon points="128,230 155,266 128,302 101,266" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.22"/>
          <polygon points="128,242 147,266 128,290 109,266" fill="none" stroke="#FF9933" strokeWidth="0.8" opacity="0.12"/>
        </g>
        <g className="gb-float-2">
          <polygon points="1310,220 1338,258 1310,296 1282,258" fill="none" stroke="#138808" strokeWidth="1.5" opacity="0.2"/>
        </g>
        <g className="gb-float-3">
          <polygon points="700,580 728,616 700,652 672,616" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.18"/>
        </g>

        {/* Pulsing triangle outlines */}
        <polygon className="gb-pulse" points="1095,72 1127,130 1063,130" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.2"/>
        <polygon className="gb-pulse" style={{animationDelay:"2s"}} points="340,590 370,642 310,642" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.18"/>

        {/* Arc decorations */}
        <path d="M 0 350 A 170 170 0 0 1 155 218" fill="none" stroke="#FF9933" strokeWidth="1.2" opacity="0.14" strokeDasharray="6 9"/>
        <path d="M 1440 350 A 170 170 0 0 0 1285 218" fill="none" stroke="#138808" strokeWidth="1.2" opacity="0.14" strokeDasharray="6 9"/>

        {/* Rotating nested squares — right mid */}
        <g style={{transformOrigin:"1400px 340px"}} className="gb-spin-cw">
          <rect x="1376" y="316" width="48" height="48" rx="7" fill="none" stroke="#FF9933" strokeWidth="1.6" opacity="0.18"/>
        </g>
        <g style={{transformOrigin:"1400px 340px"}} className="gb-spin-ccw">
          <rect x="1388" y="328" width="24" height="24" rx="4" fill="none" stroke="#138808" strokeWidth="1" opacity="0.12"/>
        </g>

        {/* Asterisk stars */}
        {[
          {x:228, y:58,  c:"#138808"},
          {x:1210,y:360, c:"#FF9933"},
          {x:52,  y:450, c:"#FF9933"},
          {x:908, y:665, c:"#138808"},
          {x:568, y:92,  c:"#FF9933"},
          {x:1058,y:605, c:"#FF9933"},
        ].map((p,i)=>(
          <g key={`star-${i}`} opacity="0.21">
            <line x1={p.x-9} y1={p.y}   x2={p.x+9} y2={p.y}   stroke={p.c} strokeWidth="2"   strokeLinecap="round"/>
            <line x1={p.x}   y1={p.y-9} x2={p.x}   y2={p.y+9} stroke={p.c} strokeWidth="2"   strokeLinecap="round"/>
            <line x1={p.x-6} y1={p.y-6} x2={p.x+6} y2={p.y+6} stroke={p.c} strokeWidth="1.5" strokeLinecap="round"/>
            <line x1={p.x+6} y1={p.y-6} x2={p.x-6} y2={p.y+6} stroke={p.c} strokeWidth="1.5" strokeLinecap="round"/>
          </g>
        ))}

        {/* Accent circles */}
        <circle cx="418"  cy="66"  r="5" fill="#FF9933" opacity="0.18"/>
        <circle cx="1048" cy="85"  r="4" fill="#138808" opacity="0.2"/>
        <circle cx="208"  cy="540" r="6" fill="#FF9933" opacity="0.16"/>
        <circle cx="1248" cy="520" r="5" fill="#FF9933" opacity="0.18"/>
        <circle cx="728"  cy="670" r="4" fill="#138808" opacity="0.17"/>
      </svg>

      {/* ── Content ── */}
      <div className="gb-container">

        <p className="gb-collection-label">
          {collectionLabel} · Bento Layout
        </p>

        <h2 className="gb-title">{gallery.title}</h2>
        <p className="gb-subtitle">{gallery.subtitle}</p>

        <div className="gb-bento-grid">
          {items.map((item, i) => (
            <GalleryItemCard
              key={item._id || item.order}
              item={item}
              onClick={onItemClick}
              className={bentoClasses[i % bentoClasses.length]}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

  /* ── Animations ── */
  @keyframes gbSpinCw  { to { transform: rotate(360deg); } }
  @keyframes gbSpinCcw { to { transform: rotate(-360deg); } }
  @keyframes gbPulse   { 0%,100%{opacity:.12} 50%{opacity:.24} }
  @keyframes gbFloat1  {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%     { transform: translateY(-10px) rotate(7deg); }
  }
  @keyframes gbFloat2  {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%     { transform: translateY(-14px) rotate(-6deg); }
  }
  @keyframes gbFloat3  {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%     { transform: translateY(-8px) rotate(9deg); }
  }
  .gb-spin-cw  { animation: gbSpinCw  18s linear infinite; }
  .gb-spin-ccw { animation: gbSpinCcw 13s linear infinite; }
  .gb-pulse    { animation: gbPulse    4.5s ease-in-out infinite; }
  .gb-float-1  { animation: gbFloat1   6s  ease-in-out infinite; }
  .gb-float-2  { animation: gbFloat2   8s  ease-in-out infinite; }
  .gb-float-3  { animation: gbFloat3   7s  ease-in-out infinite; }

  /* ── Section ── */
  .gb-section {
    position: relative;
    overflow: hidden;
    background: #f0ece6;
    padding: clamp(48px, 8vw, 80px) 0;
    font-family: 'Outfit', sans-serif;
  }

  /* ── Blobs ── */
  .gb-blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px); pointer-events: none; z-index: 0; opacity: 0.65;
  }

  /* ── SVG layer ── */
  .gb-svg-bg {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 1;
  }

  /* ── Container ── */
  .gb-container {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(16px, 4vw, 48px);
  }

  /* ── Collection label ── */
  .gb-collection-label {
    font-family: 'Outfit', sans-serif;
    font-size: 11px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .14em;
    color: #999999;
    margin: 0 0 8px;
  }

  /* ── Title ── */
  .gb-title {
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: clamp(1.5rem, 3.5vw, 2.2rem);
    color: #111111;
    margin: 0 0 8px;
    line-height: 1.18;
  }

  /* ── Subtitle ── */
  .gb-subtitle {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(.85rem, 1.3vw, .95rem);
    color: #555555;
    margin: 0 0 clamp(24px, 4vw, 36px);
    line-height: 1.65;
  }

  /* ── Bento grid ── */
  .gb-bento-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(12px, 2vw, 24px);
  }

  /* Bento span helpers */
  .gb-bento-grid .sm\\:col-span-2 { grid-column: span 2; }
  .gb-bento-grid .sm\\:row-span-2 { grid-row: span 2; }

  /* ── TABLET (≤ 900px): 2 columns, no row/col spans ── */
  @media (max-width: 900px) {
    .gb-bento-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .gb-bento-grid .sm\\:col-span-2,
    .gb-bento-grid .sm\\:row-span-2 {
      grid-column: span 1;
      grid-row: span 1;
    }
  }

  /* ── MOBILE (≤ 560px): 1 column ── */
  @media (max-width: 560px) {
    .gb-section { padding: 48px 0; }
    .gb-bento-grid {
      grid-template-columns: 1fr;
    }
    .gb-bento-grid .sm\\:col-span-2,
    .gb-bento-grid .sm\\:row-span-2 {
      grid-column: span 1;
      grid-row: span 1;
    }
  }
`;

export default GalleryBento;
