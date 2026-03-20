const GalleryHero = ({ stats = [] }) => {
  return (
    <section className="gh-section">
      <style>{STYLES}</style>

      {/* ── Background blobs ── */}
      <div className="gh-blob" style={{ width:500, height:500, top:"-30%", left:"-10%", background:"#e8d5b8" }} />
      <div className="gh-blob" style={{ width:360, height:360, bottom:"-20%", right:"-8%", background:"#c8dfc8" }} />
      <div className="gh-blob" style={{ width:220, height:220, top:"30%", right:"20%", background:"#ddd0c0" }} />

      {/* ── Animated SVG patterns ── */}
      <svg aria-hidden="true" className="gh-svg-bg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 500">

        {/* Floating diamond shapes */}
        <g className="gh-float-1">
          <polygon points="120,80 150,120 120,160 90,120" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.3" />
          <polygon points="120,92 142,120 120,148 98,120" fill="none" stroke="#FF9933" strokeWidth="0.8" opacity="0.18" />
        </g>
        <g className="gh-float-2">
          <polygon points="1300,60 1336,104 1300,148 1264,104" fill="none" stroke="#138808" strokeWidth="1.5" opacity="0.28" />
        </g>
        <g className="gh-float-3">
          <polygon points="680,380 710,416 680,452 650,416" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.22" />
        </g>

        {/* Cross-hatch grid pattern — top-right */}
        {Array.from({length:6}).map((_,row) =>
          Array.from({length:6}).map((_,col) => (
            <g key={`ch-${row}-${col}`} transform={`translate(${1200+col*28},${20+row*28})`} opacity="0.2">
              <line x1="-6" y1="-6" x2="6" y2="6" stroke="#FF9933" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="6" y1="-6" x2="-6" y2="6" stroke="#FF9933" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          ))
        )}

        {/* Cross-hatch grid pattern — bottom-left */}
        {Array.from({length:5}).map((_,row) =>
          Array.from({length:5}).map((_,col) => (
            <g key={`ch2-${row}-${col}`} transform={`translate(${30+col*28},${360+row*28})`} opacity="0.18">
              <line x1="-6" y1="-6" x2="6" y2="6" stroke="#138808" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="6" y1="-6" x2="-6" y2="6" stroke="#138808" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          ))
        )}

        {/* Spinning concentric circles — top-left */}
        <g style={{transformOrigin:"80px 60px"}} className="gh-spin-cw">
          <circle cx="80" cy="60" r="55" fill="none" stroke="#FF9933" strokeWidth="1.5" strokeDasharray="5 8" opacity="0.25" />
        </g>
        <g style={{transformOrigin:"80px 60px"}} className="gh-spin-ccw">
          <circle cx="80" cy="60" r="36" fill="none" stroke="#138808" strokeWidth="1" strokeDasharray="3 10" opacity="0.2" />
        </g>
        <circle cx="80" cy="60" r="6" fill="#FF9933" opacity="0.22" />

        {/* Spinning concentric circles — bottom-right */}
        <g style={{transformOrigin:"1370px 440px"}} className="gh-spin-ccw">
          <circle cx="1370" cy="440" r="60" fill="none" stroke="#FF9933" strokeWidth="1.5" strokeDasharray="5 8" opacity="0.22" />
        </g>
        <g style={{transformOrigin:"1370px 440px"}} className="gh-spin-cw">
          <circle cx="1370" cy="440" r="38" fill="none" stroke="#FF9933" strokeWidth="1" strokeDasharray="3 10" opacity="0.16" />
        </g>
        <circle cx="1370" cy="440" r="6" fill="#FF9933" opacity="0.2" />

        {/* Arc rings — decorative */}
        <path d="M 0 250 A 200 200 0 0 1 180 120" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.15" strokeDasharray="6 9" />
        <path d="M 1440 250 A 200 200 0 0 0 1260 120" fill="none" stroke="#138808" strokeWidth="1.5" opacity="0.15" strokeDasharray="6 9" />

        {/* Horizontal dashed line — mid */}
        <line x1="0" y1="250" x2="340" y2="250" stroke="#FF9933" strokeWidth="1" strokeDasharray="4 8" opacity="0.18" />
        <line x1="1100" y1="250" x2="1440" y2="250" stroke="#138808" strokeWidth="1" strokeDasharray="4 8" opacity="0.18" />

        {/* Triangle outlines scattered */}
        <g className="gh-pulse">
          <polygon points="1100,60 1130,114 1070,114" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.2" />
        </g>
        <g className="gh-pulse" style={{animationDelay:"1.5s"}}>
          <polygon points="340,380 368,430 312,430" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.2" />
        </g>

        {/* Star / asterisk accents */}
        {[
          {x:220, y:50,  c:"#138808"},
          {x:1220,y:300, c:"#FF9933"},
          {x:50,  y:300, c:"#FF9933"},
          {x:900, y:440, c:"#138808"},
          {x:560, y:80,  c:"#FF9933"},
          {x:1050,y:420, c:"#FF9933"},
        ].map((p,i) => (
          <g key={`star-${i}`} opacity="0.25">
            <line x1={p.x-9} y1={p.y}   x2={p.x+9} y2={p.y}   stroke={p.c} strokeWidth="2" strokeLinecap="round" />
            <line x1={p.x}   y1={p.y-9} x2={p.x}   y2={p.y+9} stroke={p.c} strokeWidth="2" strokeLinecap="round" />
            <line x1={p.x-6} y1={p.y-6} x2={p.x+6} y2={p.y+6} stroke={p.c} strokeWidth="1.5" strokeLinecap="round" />
            <line x1={p.x+6} y1={p.y-6} x2={p.x-6} y2={p.y+6} stroke={p.c} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ))}

        {/* Small filled circles */}
        <circle cx="400"  cy="60"  r="5" fill="#FF9933" opacity="0.2" />
        <circle cx="1040" cy="80"  r="4" fill="#138808" opacity="0.22" />
        <circle cx="200"  cy="380" r="6" fill="#FF9933" opacity="0.18" />
        <circle cx="1240" cy="400" r="5" fill="#FF9933" opacity="0.2" />
        <circle cx="720"  cy="460" r="4" fill="#138808" opacity="0.18" />
      </svg>

      {/* ── Content ── */}
      <div className="gh-container">

        <div className="gh-pill h-f1">
          <span className="gh-pill-dot" />
          Visual Gallery
        </div>

        <h1 className="gh-heading h-f2">
          Discover <span className="gh-accent">Stunning</span> Visual Stories
        </h1>

        <p className="gh-subtitle h-f3">
          Browse curated photography, videos and digital art.
        </p>

        {stats.length > 0 && (
          <div className="gh-stats h-f4">
            {stats.map((stat) => (
              <div key={stat.label} className="gh-stat-card">
                <p className="gh-stat-value">{stat.value}</p>
                <p className="gh-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

  /* ── Animations ── */
  .h-f1 { animation: ghFade .6s ease both; }
  .h-f2 { animation: ghFade .6s .1s ease both; }
  .h-f3 { animation: ghFade .6s .2s ease both; }
  .h-f4 { animation: ghFade .6s .35s ease both; }
  @keyframes ghFade {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes ghSpinCw  { to { transform: rotate(360deg); } }
  @keyframes ghSpinCcw { to { transform: rotate(-360deg); } }
  @keyframes ghPulse { 0%,100%{opacity:.15} 50%{opacity:.3} }
  @keyframes ghFloat1 {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-10px) rotate(8deg); }
  }
  @keyframes ghFloat2 {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-14px) rotate(-6deg); }
  }
  @keyframes ghFloat3 {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-8px) rotate(10deg); }
  }

  .gh-spin-cw  { animation: ghSpinCw  18s linear infinite; }
  .gh-spin-ccw { animation: ghSpinCcw 13s linear infinite; }
  .gh-pulse    { animation: ghPulse    4s ease-in-out infinite; }
  .gh-float-1  { animation: ghFloat1   6s ease-in-out infinite; }
  .gh-float-2  { animation: ghFloat2   8s ease-in-out infinite; }
  .gh-float-3  { animation: ghFloat3   7s ease-in-out infinite; }

  /* ── Section ── */
  .gh-section {
    position: relative;
    overflow: hidden;
    background: #f0ece6;
    padding: clamp(72px, 12vw, 112px) 0;
    font-family: 'Outfit', sans-serif;
  }

  /* ── Blobs ── */
  .gh-blob {
    position: absolute; border-radius: 50%;
    filter: blur(90px); pointer-events: none; z-index: 0; opacity: 0.7;
  }

  /* ── SVG layer ── */
  .gh-svg-bg {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 1;
  }

  /* ── Content ── */
  .gh-container {
    position: relative; z-index: 2;
    max-width: 760px; margin: 0 auto;
    padding: 0 clamp(16px, 5vw, 32px);
    text-align: center;
  }

  /* ── Pill ── */
  .gh-pill {
    display: inline-flex; align-items: center; gap: 8px;
    background: #fff3e6;
    border: 1px solid #ffd9a8;
    color: #FF9933;
    border-radius: 100px;
    font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
    padding: 6px 16px; margin-bottom: 20px;
    font-family: 'Outfit', sans-serif;
  }
  .gh-pill-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #FF9933;
    animation: ghPulse 2s ease-in-out infinite;
    flex-shrink: 0;
  }

  /* ── Heading ── */
  .gh-heading {
    font-family: 'Outfit', sans-serif;
    font-weight: 900;
    font-size: clamp(2rem, 5.5vw, 3.6rem);
    color: #111111;
    line-height: 1.12;
    margin: 0 0 16px;
    letter-spacing: -.02em;
  }
  .gh-accent {
    background: linear-gradient(135deg, #FF9933 0%, #e07d1a 60%, #138808 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Subtitle ── */
  .gh-subtitle {
    font-family: 'Outfit', sans-serif;
    font-weight: 400;
    font-size: clamp(.9rem, 1.5vw, 1.05rem);
    color: #555555;
    margin: 0 0 36px;
    max-width: 440px;
    margin-left: auto; margin-right: auto;
    line-height: 1.7;
  }

  /* ── Stats ── */
  .gh-stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: clamp(10px, 2vw, 16px);
  }
  .gh-stat-card {
    background: rgba(255,255,255,.75);
    border: 1px solid rgba(255,153,51,.2);
    border-radius: 14px;
    padding: clamp(10px, 2vw, 14px) clamp(18px, 3vw, 28px);
    backdrop-filter: blur(8px);
    transition: border-color .2s, background .2s, transform .2s;
  }
  .gh-stat-card:hover {
    border-color: rgba(255,153,51,.5);
    background: rgba(255,153,51,.07);
    transform: translateY(-3px);
  }
  .gh-stat-value {
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: clamp(1.3rem, 2.5vw, 1.6rem);
    color: #FF9933;
    margin: 0 0 3px;
    line-height: 1;
  }
  .gh-stat-label {
    font-family: 'Outfit', sans-serif;
    font-size: 11px; font-weight: 500;
    color: #999999; text-transform: uppercase;
    letter-spacing: .08em; margin: 0;
  }

  /* ── TABLET ── */
  @media (max-width: 768px) {
    .gh-section { padding: clamp(60px, 10vw, 80px) 0; }
    .gh-heading { font-size: clamp(1.8rem, 6vw, 2.6rem); }
  }

  /* ── MOBILE ── */
  @media (max-width: 480px) {
    .gh-section { padding: 64px 0; }
    .gh-stat-card { padding: 10px 18px; }
    .gh-stats { gap: 10px; }
    .gh-stat-value { font-size: 1.2rem; }
  }
`;

export default GalleryHero;
