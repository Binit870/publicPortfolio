const CATEGORIES = [
  "All", "React", "Node.js", "JavaScript",
  "DevOps", "System Design", "Career", "CSS",
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

  .cc-strip {
    padding: 16px 0;
    border-bottom: 1px solid rgba(255,153,51,.15);
    background: rgba(240,236,230,.88);
    backdrop-filter: blur(8px);
    position: sticky; top: 0; z-index: 50;
  }
  .cc-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(16px,4vw,48px);
    display: flex; flex-wrap: wrap;
    justify-content: center; gap: 8px;
  }
  .cc-btn {
    padding: 7px 18px;
    border-radius: 100px;
    font-size: 13px; font-weight: 600;
    font-family: 'Outfit', sans-serif;
    border: 1.5px solid rgba(255,153,51,.28);
    background: rgba(255,255,255,.75);
    color: #777; cursor: pointer;
    transition: all .2s;
    white-space: nowrap;
  }
  .cc-btn:hover {
    border-color: #FF9933;
    color: #FF9933;
    background: rgba(255,153,51,.07);
  }
  .cc-btn-active {
    background: #FF9933 !important;
    color: white !important;
    border-color: #FF9933 !important;
  }

  @media (max-width: 560px) {
    .cc-inner {
      justify-content: flex-start;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding-bottom: 4px;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .cc-inner::-webkit-scrollbar { display: none; }
  }
`;

export default function CategoryChips({ active, onSelect }) {
  return (
    <section className="cc-strip">
      <style>{STYLES}</style>
      <div className="cc-inner">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={active === cat ? "cc-btn cc-btn-active" : "cc-btn"}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
}