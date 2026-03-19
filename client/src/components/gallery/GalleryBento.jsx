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
    <section className="max-w-7xl mx-auto px-4 py-12">
      <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-1">
        {collectionLabel} · Bento Layout
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold text-heading mb-1">{gallery.title}</h2>
      <p className="text-sm text-body mb-8 mt-2">{gallery.subtitle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <GalleryItemCard
            key={item._id || item.order}
            item={item}
            onClick={onItemClick}
            className={bentoClasses[i % bentoClasses.length]}
          />
        ))}
      </div>
    </section>
  );
};

export default GalleryBento;