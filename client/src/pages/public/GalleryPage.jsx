import { useState } from "react";
import FloatingBubbles from "@/components/blog/FloatingBubbles";
import GalleryHero from "@/components/gallery/GalleryHero";
import GalleryControls from "@/components/gallery/GalleryControls";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import GalleryBento from "@/components/gallery/GalleryBento";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";
import GalleryFooter from "@/components/gallery/GalleryFooter";
import { collections } from "@/data/GalleryData";

const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeLayout, setActiveLayout] = useState("grid");
  const [lightboxItem, setLightboxItem] = useState(null);

  return (
    <div className="relative min-h-screen bg-background">
      <FloatingBubbles />
      <div className="relative z-10">
        <GalleryHero />
        <GalleryControls
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          activeLayout={activeLayout}
          onLayoutChange={setActiveLayout}
        />
        <GalleryGrid
          collectionLabel={collections[0].name}
          gallery={collections[0].galleries[0]}
          onItemClick={setLightboxItem}
        />
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-1 rounded-full bg-gradient-to-r from-primary via-secondary to-primary" />
        </div>
        <GalleryBento
          collectionLabel={collections[1].name}
          gallery={collections[1].galleries[0]}
          onItemClick={setLightboxItem}
        />
        <GalleryFooter />
      </div>
      {lightboxItem && (
        <GalleryLightbox
          item={lightboxItem}
          onClose={() => setLightboxItem(null)}
        />
      )}
    </div>
  );
};

export default GalleryPage;