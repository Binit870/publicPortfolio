import { Grid3X3, LayoutDashboard, Columns3 } from "lucide-react";

const layouts = [
  { id: "grid", icon: Grid3X3, label: "Grid" },
  { id: "bento", icon: LayoutDashboard, label: "Bento" },
  { id: "masonry", icon: Columns3, label: "Masonry" },
];

const GalleryControls = ({ activeFilter, onFilterChange, activeLayout, onLayoutChange, categories = [] }) => {
  return (
    <section className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border py-3">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3">

        {/* Filter — plain text like in screenshot */}
        {/* <div className="flex gap-6 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onFilterChange(cat)}
              className={`text-sm whitespace-nowrap transition-smooth pb-0.5 ${
                activeFilter === cat
                  ? "text-foreground font-semibold border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div> */}

        {/* Layout toggles */}
        <div className="flex gap-1 shrink-0">
          {layouts.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onLayoutChange(id)}
              title={label}
              className={`w-8 h-8 flex items-center justify-center rounded-md transition-smooth ${
                activeLayout === id
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-primary/10"
              }`}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default GalleryControls;