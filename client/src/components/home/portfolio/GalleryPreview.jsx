import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getGalleryItemsApi } from "../../../api/gallery.api";

const GalleryPreview = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getGalleryItemsApi({ limit: 4 });
        setItems(res.data.data || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) {
    return (
      <section id="gallery" className="bg-section-alt relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 lg:py-24">
          <div className="flex justify-between mb-12">
            <div className="h-20 w-48 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section id="gallery" className="bg-section-alt relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 lg:py-24">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Portfolio</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-2 font-display">Gallery</h2>
            <p className="text-muted-foreground">Moments captured from events, talks, and travels.</p>
          </div>
          <button className="btn-outline-primary" onClick={() => navigate("/gallery")}>
            View Full Gallery
          </button>
        </div>

        <div className={`grid gap-4 ${
          items.length === 1 ? "grid-cols-1 max-w-xs mx-auto"
          : items.length === 2 ? "grid-cols-2 max-w-lg mx-auto"
          : items.length === 3 ? "grid-cols-3"
          : "grid-cols-2 lg:grid-cols-4"
        }`}>
          {items.map((img) => (
            <div
              key={img._id}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => navigate("/gallery")}
            >
              {img.mediaUrl ? (
                <img
                  src={img.thumbnail || img.mediaUrl}
                  alt={img.altText || img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center text-5xl">
                  🖼️
                </div>
              )}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/70 transition-colors duration-300 flex flex-col items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.title}
                </span>
                <span className="text-primary-foreground/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                  {img.category}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default GalleryPreview;