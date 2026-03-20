import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FloatingBubbles from "@/components/blog/FloatingBubbles";
import Navbar from "@/components/blog/Navbar";
import HeroSection from "@/components/blog/HeroSection";
import FeaturedPost from "@/components/blog/FeaturedPost";
import BlogCard from "@/components/blog/BlogCard";
import AuthorSidebar from "@/components/blog/AuthorSidebar";
import SeriesCard from "@/components/blog/SeriesCard";
import TrendingCard from "@/components/blog/TrendingCard";
import PopularTags from "@/components/blog/PopularTag";
import NewsletterStrip from "@/components/blog/NewsletterStrip";
import Footer from "@/components/blog/Footer";
import { getPublishedBlogsApi } from "@/api/blog.api";
import CategoryChips from "@/components/blog/CategoryChips";

const CATEGORIES = ["All", "React", "Node.js", "JavaScript", "DevOps", "System Design", "Career", "CSS"];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

  @keyframes upSpinCw  { to { transform: rotate(360deg); } }
  @keyframes upSpinCcw { to { transform: rotate(-360deg); } }
  @keyframes upPulse   { 0%,100%{opacity:.1} 50%{opacity:.22} }
  @keyframes upFloat1  {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-10px) rotate(7deg); }
  }
  @keyframes upFloat2  {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-14px) rotate(-6deg); }
  }
  @keyframes upFloat3  {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-8px) rotate(9deg); }
  }
  @keyframes upShimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }

  .up-spin-cw  { animation: upSpinCw  20s linear infinite; }
  .up-spin-ccw { animation: upSpinCcw 15s linear infinite; }
  .up-pulse    { animation: upPulse    4.5s ease-in-out infinite; }
  .up-float-1  { animation: upFloat1   6s ease-in-out infinite; }
  .up-float-2  { animation: upFloat2   8s ease-in-out infinite; }
  .up-float-3  { animation: upFloat3   7s ease-in-out infinite; }

  /* ── Page wrapper ── */
  .up-page {
    position: relative;
    min-height: 100vh;
    background: #f0ece6;
    font-family: 'Outfit', sans-serif;
  }

  /* ── Blobs ── */
  .up-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    z-index: 0;
  }

  /* ── SVG bg ── */
  .up-svg-bg {
    position: fixed; inset: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 0;
  }

  /* ── Inner content ── */
  .up-inner { position: relative; z-index: 10; }

  /* ── Category chips strip ── */
  .up-cats-strip {
    padding: 20px 0;
    border-bottom: 1px solid rgba(255,153,51,.15);
    background: rgba(240,236,230,.85);
    backdrop-filter: blur(8px);
    position: sticky; top: 0; z-index: 50;
  }
  .up-cats-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(16px,4vw,48px);
    display: flex; flex-wrap: wrap;
    justify-content: center; gap: 8px;
  }
  .up-cat-btn {
    padding: 7px 18px;
    border-radius: 100px;
    font-size: 13px; font-weight: 600;
    font-family: 'Outfit', sans-serif;
    border: 1.5px solid rgba(255,153,51,.28);
    background: rgba(255,255,255,.7);
    color: #777; cursor: pointer;
    transition: all .2s;
  }
  .up-cat-btn:hover {
    border-color: #FF9933;
    color: #FF9933;
    background: rgba(255,153,51,.07);
  }
  .up-cat-active {
    background: #FF9933 !important;
    color: white !important;
    border-color: #FF9933 !important;
  }

  /* ── Main layout ── */
  .up-layout {
    max-width: 1280px; margin: 0 auto;
    padding: clamp(28px,5vw,48px) clamp(16px,4vw,48px);
    display: flex;
    flex-direction: row;
    gap: clamp(24px,4vw,48px);
    align-items: flex-start;
  }

  /* ── Main content col ── */
  .up-main { flex: 1; min-width: 0; }

  /* ── Section heading ── */
  .up-section-heading {
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: clamp(1.1rem,2vw,1.4rem);
    color: #111;
    margin: 0 0 20px;
    display: flex; align-items: center; gap: 10px;
  }
  .up-section-heading::after {
    content: '';
    flex: 1; height: 2px;
    background: linear-gradient(90deg, rgba(255,153,51,.4), transparent);
    border-radius: 2px;
  }

  /* ── Blog grid ── */
  .up-blog-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(14px,2vw,24px);
    margin-bottom: 32px;
  }

  /* ── Spinner ── */
  .up-spinner-wrap {
    display: flex; justify-content: center; padding: 80px 0;
  }
  .up-spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 4px solid #FF9933;
    border-top-color: transparent;
    animation: upSpinCw .7s linear infinite;
  }

  /* ── Empty state ── */
  .up-empty {
    text-align: center; padding: clamp(48px,8vw,80px) 0;
  }
  .up-empty-icon { font-size: 40px; margin-bottom: 12px; }
  .up-empty-text {
    font-family: 'Outfit', sans-serif;
    color: #999; font-size: .95rem;
  }

  /* ── Sidebar ── */
  .up-sidebar {
    width: 300px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ── TABLET (≤ 1024px): narrow sidebar ── */
  @media (max-width: 1024px) {
    .up-sidebar { width: 260px; }
  }

  /* ── TABLET (≤ 860px): stack layout ── */
  @media (max-width: 860px) {
    .up-layout { flex-direction: column; }
    .up-sidebar { width: 100%; flex-direction: row; flex-wrap: wrap; }
    .up-sidebar > * { flex: 1 1 280px; }
  }

  /* ── MOBILE (≤ 560px): 1-col blog grid ── */
  @media (max-width: 560px) {
    .up-blog-grid { grid-template-columns: 1fr; }
    .up-cats-inner { justify-content: flex-start; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 4px; }
    .up-cats-inner::-webkit-scrollbar { display: none; }
    .up-sidebar { flex-direction: column; }
    .up-sidebar > * { flex: unset; width: 100%; }
  }
`;

const ShapesBg = () => (
  <>
    <div className="up-blob" style={{ width:500, height:500, top:"-10%",  right:"-8%",  background:"#e8d5b8", opacity:.8  }} />
    <div className="up-blob" style={{ width:320, height:320, bottom:"5%", left:"-5%",  background:"#c8dfc8", opacity:.65 }} />
    <div className="up-blob" style={{ width:200, height:200, top:"40%",  left:"35%",  background:"#ddd0c0", opacity:.5  }} />

    <svg aria-hidden="true" className="up-svg-bg"
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
      <g style={{transformOrigin:"1368px 78px"}} className="up-spin-cw">
        <circle cx="1368" cy="78" r="68" fill="none" stroke="#FF9933" strokeWidth="1.8" strokeDasharray="9 6" opacity="0.22"/>
      </g>
      <circle cx="1368" cy="78" r="44" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.13"/>
      <circle cx="1368" cy="78" r="8" fill="#FF9933" opacity="0.15"/>

      {/* Top-center triangle */}
      <polygon className="up-pulse" points="720,14 774,106 666,106" fill="none" stroke="#138808" strokeWidth="2" opacity="0.15"/>
      <polygon points="720,32 760,96 680,96" fill="none" stroke="#138808" strokeWidth="1" opacity="0.08"/>

      {/* Left-mid rotating squares */}
      <g style={{transformOrigin:"55px 420px"}} className="up-spin-cw">
        <rect x="27" y="392" width="56" height="56" rx="7" fill="none" stroke="#FF9933" strokeWidth="1.8" opacity="0.2"/>
      </g>
      <g style={{transformOrigin:"55px 420px"}} className="up-spin-ccw">
        <rect x="39" y="404" width="32" height="32" rx="4" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.11"/>
      </g>

      {/* Right-mid hexagon */}
      <polygon className="up-pulse" style={{animationDelay:"1s"}}
        points="1402,400 1428,416 1428,448 1402,464 1376,448 1376,416"
        fill="none" stroke="#138808" strokeWidth="2" opacity="0.17"/>
      <polygon
        points="1402,414 1420,424 1420,446 1402,456 1384,446 1384,424"
        fill="none" stroke="#138808" strokeWidth="1" opacity="0.09"/>

      {/* Bottom-left spinning ring */}
      <g style={{transformOrigin:"92px 800px"}} className="up-spin-ccw">
        <circle cx="92" cy="800" r="58" fill="none" stroke="#138808" strokeWidth="1.8" strokeDasharray="7 5" opacity="0.2"/>
      </g>
      <circle cx="92" cy="800" r="35" fill="none" stroke="#138808" strokeWidth="1" opacity="0.11"/>
      <circle cx="92" cy="800" r="7" fill="#138808" opacity="0.12"/>

      {/* Bottom-right dot grid */}
      {Array.from({length:4}).map((_,r) =>
        Array.from({length:4}).map((_,c) => (
          <circle key={`br-${r}-${c}`} cx={1280+c*22} cy={760+r*22} r="2.4" fill="#FF9933" opacity="0.18"/>
        ))
      )}

      {/* Bottom wavy lines */}
      <path d="M300,860 Q400,836 500,860 Q600,884 700,860 Q800,836 900,860 Q1000,884 1100,860 Q1200,836 1300,860"
        fill="none" stroke="#FF9933" strokeWidth="2" opacity="0.18" strokeLinecap="round"/>
      <path d="M300,874 Q400,850 500,874 Q600,898 700,874 Q800,850 900,874 Q1000,898 1100,874 Q1200,850 1300,874"
        fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.09" strokeLinecap="round"/>

      {/* Mid-right rotating square */}
      <g style={{transformOrigin:"1110px 200px"}} className="up-spin-cw">
        <rect x="1086" y="176" width="48" height="48" rx="7" fill="none" stroke="#FF9933" strokeWidth="1.6" opacity="0.15"/>
      </g>

      {/* Floating diamonds */}
      <g className="up-float-1">
        <polygon points="128,300 155,338 128,376 101,338" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.2"/>
        <polygon points="128,312 147,338 128,364 109,338" fill="none" stroke="#FF9933" strokeWidth="0.8" opacity="0.11"/>
      </g>
      <g className="up-float-2">
        <polygon points="1308,280 1336,318 1308,356 1280,318" fill="none" stroke="#138808" strokeWidth="1.5" opacity="0.18"/>
      </g>
      <g className="up-float-3">
        <polygon points="700,700 728,736 700,772 672,736" fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.16"/>
      </g>

      {/* Scattered asterisks */}
      {[
        {x:230, y:62,  c:"#FF9933"},
        {x:1205,y:280, c:"#138808"},
        {x:46,  y:620, c:"#FF9933"},
        {x:1392,y:600, c:"#FF9933"},
        {x:708,  y:868, c:"#138808"},
        {x:380,  y:500, c:"#138808"},
        {x:560,  y:140, c:"#FF9933"},
      ].map((p,i)=>(
        <g key={`star-${i}`} opacity="0.2">
          <line x1={p.x-9} y1={p.y}   x2={p.x+9} y2={p.y}   stroke={p.c} strokeWidth="2"   strokeLinecap="round"/>
          <line x1={p.x}   y1={p.y-9} x2={p.x}   y2={p.y+9} stroke={p.c} strokeWidth="2"   strokeLinecap="round"/>
          <line x1={p.x-6} y1={p.y-6} x2={p.x+6} y2={p.y+6} stroke={p.c} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1={p.x+6} y1={p.y-6} x2={p.x-6} y2={p.y+6} stroke={p.c} strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      ))}

      {/* Accent circles */}
      <circle cx="344" cy="680" r="6" fill="#FF9933" opacity="0.17"/>
      <circle cx="808" cy="50"  r="5" fill="#138808" opacity="0.16"/>
      <circle cx="1194" cy="560" r="8" fill="#FF9933" opacity="0.13"/>
      <circle cx="190"  cy="320" r="4" fill="#138808" opacity="0.16"/>
      <circle cx="1050" cy="740" r="5" fill="#138808" opacity="0.14"/>
    </svg>
  </>
);

const UpdatesPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getPublishedBlogsApi({ limit: 20 });
        const allBlogs = res.data.data || [];
        if (allBlogs.length > 0) {
          setFeaturedPost(allBlogs[0]);
          setBlogs(allBlogs.slice(1));
        } else {
          setBlogs([]);
        }
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filtered = activeCategory === "All"
    ? blogs
    : blogs.filter((post) => post.category === activeCategory);

  return (
    <div className="up-page">
      <style>{STYLES}</style>

      {/* Fixed background shapes */}
      <ShapesBg />

      <FloatingBubbles />

      <div className="up-inner">
        {/* <Navbar /> */}
        <HeroSection />

        {/* ── Category chips strip ── */}
        {/* <CategoryChips active={activeCategory} onSelect={setActiveCategory} /> */}

        {/* ── Main layout ── */}
        <div className="up-layout">

          {/* Main content */}
          <div className="up-main">
            {loading ? (
              <div className="up-spinner-wrap">
                <div className="up-spinner" />
              </div>
            ) : (
              <>
                {featuredPost && (
                  <div
                    className="cursor-pointer mb-10"
                    onClick={() => navigate(`/updates/${featuredPost.slug}`)}
                  >
                    <FeaturedPost post={featuredPost} />
                  </div>
                )}

                <h2 className="up-section-heading">Recent Posts</h2>

                <div className="up-blog-grid">
                  {filtered.map((post) => (
                    <div
                      key={post.slug}
                      onClick={() => navigate(`/updates/${post.slug}`)}
                      className="cursor-pointer"
                    >
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="up-empty">
                    <div className="up-empty-icon">📭</div>
                    <p className="up-empty-text">No posts found in this category.</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="up-sidebar">
            <AuthorSidebar />
            <SeriesCard />
            <TrendingCard />
            <PopularTags />
          </aside>

        </div>

        {/* <NewsletterStrip /> */}
        <Footer />
      </div>
    </div>
  );
};

export default UpdatesPage;