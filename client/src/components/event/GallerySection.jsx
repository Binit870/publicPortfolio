import { eventData } from "@/data/eventData";

const GallerySection = () => {
  return (
    <section className="bg-section-alt relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
        <h2 className="text-2xl font-bold text-heading mb-8">Gallery</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventData.gallery.map((url, i) => (
            <div key={i} className="group relative overflow-hidden rounded-xl aspect-[3/2] cursor-pointer">
              <img
                src={url}
                alt={`Event gallery ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm opacity-0 group-hover:opacity-100">
                  View
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;