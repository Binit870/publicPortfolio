const GalleryHero = ({ stats = [] }) => {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <span className="pill-green mb-4 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          Visual Gallery
        </span>
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
          Discover <span className="text-primary">Stunning</span> Visual Stories
        </h1>
        <p className="text-base mb-8 max-w-xl mx-auto">
          Browse curated photography, videos and digital art.
        </p>
        {stats.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card border rounded-xl px-5 py-3">
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GalleryHero;