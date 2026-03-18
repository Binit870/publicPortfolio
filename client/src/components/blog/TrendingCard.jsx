import { useState, useEffect } from "react";
import { Eye, Heart } from "lucide-react";
import { getPublishedBlogsApi } from "@/api/blog.api";

const formatNum = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : n);

export default function TrendingCard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPublishedBlogsApi({ limit: 4 })
      .then((res) => setPosts(res.data.data || []))
      .catch(() => setPosts([]));
  }, []);

  return (
    <div className="rounded-xl bg-card p-6 border shadow-sm">
      <h3 className="font-semibold mb-4">Trending This Week</h3>
      <div className="space-y-4">
        {posts.map((post, i) => (
          <div key={post.slug} className="flex items-start gap-3">
            <span className="text-2xl font-bold text-primary/20 w-8">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h4 className="text-sm font-medium mb-1 line-clamp-2">{post.title}</h4>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye size={12} /> {formatNum(post.stats?.views || 0)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={12} /> {formatNum(post.stats?.likes || 0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}