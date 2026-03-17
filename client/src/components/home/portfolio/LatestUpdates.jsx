import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/axiosInstance";

const EMOJI_MAP = {
  Development: "💻", Design: "🎨", DevOps: "⚙️", Career: "🚀",
  "Open Source": "🌐", "AI/ML": "🤖", Security: "🔒",
  Productivity: "⚡", Tutorial: "📝",
};

const LatestUpdates = () => {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res  = await API.get("/blogs", { params: { limit: 3 } });
        const data = res.data.data;
        setUpdates(data.blogs ?? data.data ?? []);
      } catch {
        // silently fail — section just won't render
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Skeleton while loading
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
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card-portfolio p-6 animate-pulse">
                <div className="w-14 h-14 rounded-2xl bg-border mb-5" />
                <div className="h-3 bg-border rounded w-1/3 mb-3" />
                <div className="h-5 bg-border rounded w-3/4 mb-2" />
                <div className="h-4 bg-border rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Don't render section if no posts
  if (updates.length === 0) return null;

  return (
    <section id="updates" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <span className="section-label mb-2 block">Latest</span>
          <h2 className="section-title">Latest Updates</h2>
          <div className="saffron-underline mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {updates.map((post) => (
            <div
              key={post._id}
              className="card-portfolio p-6 text-left cursor-pointer group"
              onClick={() => navigate(`/updates/${post.slug}`)}
            >
              {/* Cover image or emoji fallback */}
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-14 h-14 rounded-2xl object-cover mb-5 group-hover:scale-105 transition-smooth"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition-smooth">
                  {EMOJI_MAP[post.category] ?? "📝"}
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                {post.category && <span className="green-pill">{post.category}</span>}
                <span className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </span>
              </div>

              <h3 className="font-bold text-foreground leading-snug mb-2 line-clamp-2">
                {post.title}
              </h3>

              {post.excerpt && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              )}

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