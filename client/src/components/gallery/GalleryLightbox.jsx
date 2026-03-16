import { X, Download, Share2, Heart, Eye } from "lucide-react"

const GalleryLightbox = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>

      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"/>

      <div
        className="relative bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center"
        >
          <X size={16}/>
        </button>

        <div className="aspect-video bg-gradient-to-br from-primary/10 via-secondary/10 to-muted flex items-center justify-center text-7xl">
          {item.emoji}
        </div>

        <div className="p-6">

          <h3 className="text-xl font-bold mb-2">
            {item.title}
          </h3>

          <p className="text-sm mb-4">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">

            <span className="pill-saffron">
              {item.category}
            </span>

            <span className="flex items-center gap-1">
              <Eye size={12}/> {item.stats.views}
            </span>

            <span className="flex items-center gap-1">
              <Heart size={12}/> {item.stats.likes}
            </span>

          </div>

          <div className="flex gap-3">

            <button className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white flex items-center justify-center gap-2">
              <Download size={16}/> Download
            </button>

            <button className="px-4 py-2.5 border rounded-lg flex items-center gap-2">
              <Share2 size={16}/> Share
            </button>

            <button className="px-4 py-2.5 border rounded-lg flex items-center gap-2">
              <Heart size={16}/> Like
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default GalleryLightbox