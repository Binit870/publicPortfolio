import { Eye, Heart, Bookmark } from "lucide-react"

const mediaBadgeColor = {
  image: "bg-primary",
  video: "bg-blue-500",
  gif: "bg-purple-500",
}

const GalleryItemCard = ({ item, onClick, className = "" }) => {
  return (
    <div
      onClick={() => onClick(item)}
      className={`rounded-xl overflow-hidden bg-card cursor-pointer group ${className}`}
    >

      <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 via-secondary/10 to-muted">

        <div className="absolute inset-0 flex items-center justify-center text-5xl">
          {item.emoji}
        </div>

        <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] text-white ${mediaBadgeColor[item.mediaType]}`}>
          {item.mediaType}
        </span>

        <span className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 rounded-full px-2 py-0.5 text-xs">
          <Heart size={12}/> {item.stats.likes}
        </span>

      </div>

      <div className="p-4">

        <span className="text-[11px] font-semibold text-primary uppercase">
          {item.category}
        </span>

        <h3 className="text-sm font-bold mt-1 mb-2">
          {item.title}
        </h3>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">

          <span className="flex items-center gap-1">
            <Eye size={12}/> {item.stats.views}
          </span>

          <span className="flex items-center gap-1">
            <Heart size={12}/> {item.stats.likes}
          </span>

          <span className="flex items-center gap-1">
            <Bookmark size={12}/> {Math.floor(item.stats.likes * 0.4)}
          </span>

        </div>

      </div>

    </div>
  )
}

export default GalleryItemCard