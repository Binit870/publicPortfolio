import { useNavigate } from "react-router-dom";

const images = [
  { id: "1", emoji: "📸", title: "Tech Meetup 2025", category: "Events", gradient: "from-primary/20 to-accent/15" },
  { id: "2", emoji: "🎨", title: "Design Workshop", category: "Workshop", gradient: "from-accent/25 to-primary/10" },
  { id: "3", emoji: "🏆", title: "Hackathon Win", category: "Achievement", gradient: "from-primary/25 to-primary/5" },
  { id: "4", emoji: "🌍", title: "Conference Talk", category: "Speaking", gradient: "from-accent/20 to-accent/5" },
];

const GalleryPreview = () => {
  const navigate = useNavigate();

  return (
    <section id="gallery" className="bg-section-alt relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 lg:py-24">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-2 font-display">
              Gallery
            </h2>
            <p className="text-muted-foreground">
              Moments captured from events, talks, and travels.
            </p>
          </div>
          <button
            className="btn-outline-primary"
            onClick={() => navigate("/gallery")}
          >
            View Full Gallery
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => navigate("/gallery")}
            >
              <div className={`w-full h-full bg-gradient-to-br ${img.gradient} flex items-center justify-center text-5xl`}>
                {img.emoji}
              </div>
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