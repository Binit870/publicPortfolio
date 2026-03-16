import { featuredPost } from "@/data/blogData"
import { Clock } from "lucide-react"

export default function FeaturedPost() {
  const p = featuredPost

  return (
    <div className="rounded-xl overflow-hidden bg-card shadow border mb-10">
      <div className="grid md:grid-cols-2">

        <div className={`bg-gradient-to-br ${p.coverGradient} min-h-[220px] flex items-center justify-center`}>
          <span className="text-6xl opacity-30">📝</span>
        </div>

        <div className="p-8 flex flex-col justify-center">
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded self-start mb-3">
            FEATURED
          </span>

          <h2 className="text-2xl font-bold mb-3">{p.title}</h2>

          <p className="text-muted-foreground mb-4">
            {p.excerpt}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {p.author.avatar}
            </div>

            <span>{p.author.name}</span>

            <span>•</span>

            <span>{p.publishedAt}</span>

            <span className="flex items-center gap-1">
              <Clock size={12} /> {p.readingTime} min
            </span>
          </div>

          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded self-start">
            {p.category}
          </span>
        </div>

      </div>
    </div>
  )
}