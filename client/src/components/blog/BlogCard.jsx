import { Button } from "@/components/ui/button";

export default function BlogCard({ post }) {
  if (!post) return null;

  return (
    <div className="rounded-xl overflow-hidden bg-card shadow border flex flex-col hover:-translate-y-1 transition-all duration-200">

      {post.coverImage ? (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="bg-gradient-to-br from-primary/20 to-secondary/10 h-40 flex items-center justify-center">
          <span className="text-4xl opacity-25 font-bold">✍️</span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded mb-2 self-start">
          {post.category}
        </span>

        <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-end">
          <Button size="sm" variant="outline">Read</Button>
        </div>
      </div>
    </div>
  );
}