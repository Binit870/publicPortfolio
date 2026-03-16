import { popularTags } from "@/data/blogData"
import { Badge } from "@/components/ui/badge"

export default function PopularTags() {
  return (
    <div className="rounded-xl bg-card p-6 border shadow-sm">

      <h3 className="font-semibold mb-4">
        Popular Tags
      </h3>

      <div className="flex flex-wrap gap-2">

        {popularTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-white"
          >
            {tag}
          </Badge>
        ))}

      </div>

    </div>
  )
}