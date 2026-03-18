import { Clock } from "lucide-react";

export default function FeaturedPost({ post }) {
  if (!post) return null;

  return (
    <div className="rounded-xl overflow-hidden bg-card shadow border mb-10">
      <div className="grid md:grid-cols-2">

        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full min-h-[220px] object-cover"
          />
        ) : (
          <div className="bg-gradient-to-br from-primary/20 to-secondary/10 min-h-[220px] flex items-center justify-center">
            <span className="text-6xl opacity-30">📝</span>
          </div>
        )}

        <div className="p-8 flex flex-col justify-center">
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded self-start mb-3">
            FEATURED
          </span>

          <h2 className="text-2xl font-bold mb-3">{post.title}</h2>

          <p className="text-muted-foreground mb-4">{post.excerpt}</p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {post.author?.name?.slice(0, 2).toUpperCase() || "AU"}
            </div>
            <span>{post.author?.name || "Author"}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toDateString()}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {post.readingTime} min
            </span>
          </div>

          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded self-start">
            {post.category}
          </span>
        </div>

      </div>
    </div>
  );
}