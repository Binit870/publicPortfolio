import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { getPublishedBlogsApi } from "@/api/blog.api";

export default function PopularTags() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getPublishedBlogsApi({ limit: 50 })
      .then((res) => {
        const allTags = (res.data.data || []).flatMap((p) => p.tags || []);
        const unique = [...new Set(allTags)].slice(0, 12);
        setTags(unique);
      })
      .catch(() => setTags([]));
  }, []);

  return (
    <div className="rounded-xl bg-card p-6 border shadow-sm">
      <h3 className="font-semibold mb-4">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-white transition-smooth"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}