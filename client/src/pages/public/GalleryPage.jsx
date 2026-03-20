import { useState, useEffect } from "react";
import FloatingBubbles from "@/components/blog/FloatingBubbles";
import GalleryHero from "@/components/gallery/GalleryHero";
import GalleryControls from "@/components/gallery/GalleryControls";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import GalleryBento from "@/components/gallery/GalleryBento";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";
import GalleryFooter from "@/components/gallery/GalleryFooter";
import { getGalleriesApi } from "../../api/gallery.api";

const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeLayout, setActiveLayout] = useState("grid");
  const [lightboxItem, setLightboxItem] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getGalleriesApi();
        const data = res.data || [];
        setGalleries(data);

        // build unique categories from all items across all galleries
        const allItems = data.flatMap((g) => g.items || []);
        const cats = ["All"];

        // add unique categories
        allItems.forEach((item) => {
          if (item.category && !cats.includes(item.category)) {
            cats.push(item.category);
          }
        });

        // add media type filters if any video or gif exists
        const hasVideo = allItems.some((i) => i.mediaType === "video");
        const hasGif = allItems.some((i) => i.mediaType === "gif");
        if (hasVideo) cats.push("Video");
        if (hasGif) cats.push("GIF");

        setCategories(cats);
      } catch {
        setGalleries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Galleries", value: galleries.length },
    { label: "Media Items", value: galleries.flatMap((g) => g.items || []).length },
    {
      label: "Total Views",
      value: galleries
        .flatMap((g) => g.items || [])
        .reduce((acc, i) => acc + (i.stats?.views || 0), 0)
        .toLocaleString(),
    },
  ];

  const gridGallery = galleries.find((g) => g.layoutType === "grid");
  const bentoGallery = galleries.find((g) => g.layoutType === "bento");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <FloatingBubbles />
      <div className="relative z-10">
        <GalleryHero stats={stats} />

        {/* <GalleryControls
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          activeLayout={activeLayout}
          onLayoutChange={setActiveLayout}
          categories={categories}
        /> */}

        {gridGallery && (
          <GalleryGrid
            collectionLabel="Collection 01"
            gallery={gridGallery}
            activeFilter={activeFilter}
            onItemClick={setLightboxItem}
          />
        )}

        {gridGallery && bentoGallery && (
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-1 rounded-full bg-gradient-to-r from-primary via-secondary to-primary" />
          </div>
        )}

        {bentoGallery && (
          <GalleryBento
            collectionLabel="Collection 02"
            gallery={bentoGallery}
            activeFilter={activeFilter}
            onItemClick={setLightboxItem}
          />
        )}

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