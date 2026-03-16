import { trendingPosts } from "@/data/blogData"
import { Eye, Heart } from "lucide-react"

const formatNum = (n) =>
  n >= 1000 ? (n / 1000).toFixed(1) + "k" : n

export default function TrendingCard() {
  return (
    <div className="rounded-xl bg-card p-6 border shadow-sm">

      <h3 className="font-semibold mb-4">
        Trending This Week
      </h3>

      <div className="space-y-4">

        {trendingPosts.map((post, i) => (
          <div key={i} className="flex items-start gap-3">

            <span className="text-2xl font-bold text-primary/20 w-8">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div>

              <h4 className="text-sm font-medium mb-1">
                {post.title}
              </h4>

              <div className="flex gap-3 text-xs text-muted-foreground">

                <span className="flex items-center gap-1">
                  <Eye size={12}/> {formatNum(post.views)}
                </span>

                <span className="flex items-center gap-1">
                  <Heart size={12}/> {formatNum(post.likes)}
                </span>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}