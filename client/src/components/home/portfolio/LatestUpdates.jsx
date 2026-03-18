import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPublishedBlogsApi } from "../../../api/blog.api";

const LatestUpdates = () => {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedBlogsApi({ limit: 3 })
      .then((res) => setUpdates(res.data.data || []))
      .catch(() => setUpdates([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="updates" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="section-label mb-2 block">Latest</span>
            <h2 className="section-title">Latest Updates</h2>
            <div className="saffron-underline mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-portfolio p-6 animate-pulse">
                <div className="w-14 h-14 rounded-2xl bg-muted mb-5" />
                <div className="h-3 bg-muted rounded w-1/3 mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (updates.length === 0) return null;

  return (
    <section id="updates" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <span className="section-label mb-2 block">Latest</span>
          <h2 className="section-title">Latest Updates</h2>
          <div className="saffron-underline mx-auto" />
        </div>

        <div className={`grid gap-6 ${
          updates.length === 1 ? "md:grid-cols-1 max-w-md mx-auto"
          : updates.length === 2 ? "md:grid-cols-2 max-w-2xl mx-auto"
          : "md:grid-cols-3"
        }`}>
          {updates.map((u) => (
            <div
              key={u.slug}
              className="card-portfolio p-6 text-left cursor-pointer group"
              onClick={() => navigate(`/updates/${u.slug}`)}
            >
              {/* Cover or gradient */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition-smooth overflow-hidden">
                {u.coverImage ? (
                  <img src={u.coverImage} alt={u.title} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  "📝"
                )}
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="green-pill">{u.category}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(u.createdAt).toDateString()}
                </span>
              </div>

              <h3 className="font-bold text-foreground leading-snug mb-2">{u.title}</h3>

              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {u.excerpt}
              </p>

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