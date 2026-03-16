import { useNavigate } from "react-router-dom";

const updates = [
  { slug: "portfolio-v3", emoji: "🚀", color: "from-primary/20 to-primary/5", date: "Mar 10, 2026", title: "Launched New Portfolio v3", desc: "Complete redesign with modern stack and improved performance.", tag: "Launch" },
  { slug: "react-patterns-guide", emoji: "📝", color: "from-secondary/30 to-secondary/10", date: "Feb 28, 2026", title: "Published React Patterns Guide", desc: "A comprehensive guide to advanced React patterns and best practices.", tag: "Article" },
  { slug: "reactconf-2026", emoji: "🎤", color: "from-primary/15 to-secondary/15", date: "Feb 15, 2026", title: "Spoke at ReactConf 2026", desc: "Keynote on building scalable frontend architectures.", tag: "Speaking" },
];

const LatestUpdates = () => {
  const navigate = useNavigate();

  return (
    <section id="updates" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <span className="section-label mb-2 block">Latest</span>
          <h2 className="section-title">Latest Updates</h2>
          <div className="saffron-underline mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {updates.map((u) => (
            <div
              key={u.slug}
              className="card-portfolio p-6 text-left cursor-pointer group"
              onClick={() => navigate(`/updates/${u.slug}`)}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${u.color} flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition-smooth`}>
                {u.emoji}
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="green-pill">{u.tag}</span>
                <span className="text-xs text-muted-foreground">{u.date}</span>
              </div>
              <h3 className="font-bold text-foreground leading-snug mb-2">{u.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{u.desc}</p>
              <span className="text-xs font-semibold text-primary mt-4 inline-block group-hover:underline">
                Read more &rarr;
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            className="btn-outline-primary"
            onClick={() => navigate("/updates")}
          >
            View All Updates
          </button>
        </div>

      </div>
    </section>
  );
};

export default LatestUpdates;