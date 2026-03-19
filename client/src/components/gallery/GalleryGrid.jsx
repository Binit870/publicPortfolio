import { useState } from "react";
import GalleryItemCard from "./GalleryItemCard";

const GalleryGrid = ({ collectionLabel, gallery, activeFilter, onItemClick }) => {

  if (!gallery) return null;

  const items = gallery.items || [];

  // use activeFilter from parent (global filter chips)
  // also allow local category filter within the grid
  const [activeCat, setActiveCat] = useState("All");

  const filtered = items.filter((item) => {
    const matchesGlobal = activeFilter === "All" || item.category === activeFilter || item.mediaType?.toLowerCase() === activeFilter.toLowerCase();
    const matchesLocal = activeCat === "All" || item.category === activeCat;
    return matchesGlobal && matchesLocal;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <p className="text-xs font-semibold text-muted-foreground mb-1">
        {collectionLabel} · {gallery.layoutType} Layout
      </p>
      <h2 className="text-2xl font-bold mb-1">{gallery.title}</h2>
      <p className="text-sm text-body mb-6 mt-2">{gallery.subtitle}</p>

      {gallery.allowFilter && gallery.categories?.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-8">
          {gallery.categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCat(cat.name)}
              className={`px-4 py-1.5 rounded-full text-sm transition-smooth ${
                activeCat === cat.name
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {filtered.map((item) => (
          <GalleryItemCard
            key={item._id || item.order}
            item={item}
            onClick={onItemClick}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-muted-foreground">No items found for this filter.</p>
        </div>
      )}

      <div className="text-center">
        <button className="px-8 py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-smooth">
          Load More
        </button>
      </div>
    </section>
  );
};

export default GalleryGrid;