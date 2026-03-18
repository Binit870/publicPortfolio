const CATEGORIES = [
  "All", "React", "Node.js", "JavaScript",
  "DevOps", "System Design", "Career", "CSS",
];

export default function CategoryChips({ active, onSelect }) {
  return (
    <section className="py-6 border-b">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-smooth ${
              active === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
}