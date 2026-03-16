import { Eye, Heart, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"

const formatNum = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : n)

export default function BlogCard({ post }) {
  return (
    <div className="rounded-xl overflow-hidden bg-card shadow border flex flex-col">
      
      <div className={`bg-gradient-to-br ${post.coverGradient} h-40 flex items-center justify-center`}>
        <span className="text-4xl opacity-25 font-bold">✍️</span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded mb-2 self-start">
          {post.category}
        </span>

        <h3 className="font-semibold mb-2 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">

          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye size={12} /> {formatNum(post.stats.views)}
            </span>

            <span className="flex items-center gap-1">
              <Heart size={12} /> {formatNum(post.stats.likes)}
            </span>

            <span className="flex items-center gap-1">
              <Bookmark size={12} /> {formatNum(post.stats.bookmarks)}
            </span>
          </div>

          <Button size="sm" variant="outline">
            Read
          </Button>

        </div>
      </div>
    </div>
  )
}