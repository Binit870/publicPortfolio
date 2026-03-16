import { Grid3X3, LayoutDashboard, Columns3 } from "lucide-react"
import { galleryFilterCategories } from "@/data/galleryData"

const layouts = [
  { id: "grid", icon: Grid3X3, label: "Grid" },
  { id: "bento", icon: LayoutDashboard, label: "Bento" },
  { id: "masonry", icon: Columns3, label: "Masonry" },
]

const GalleryControls = ({ activeFilter, onFilterChange, activeLayout, onLayoutChange }) => {
  return (
    <section className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border py-3">

      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">

        <div className="flex gap-2 flex-wrap">

          {galleryFilterCategories.map((cat) => {

            const isMedia = cat === "Video" || cat === "GIF"

            return (
              <button
                key={cat}
                onClick={() => onFilterChange(cat)}
                className={`chip ${
                  activeFilter === cat
                    ? "chip-active"
                    : isMedia
                    ? "bg-secondary/20 text-heading"
                    : "chip-inactive"
                }`}
              >
                {cat}
              </button>
            )
          })}

        </div>

        <div className="flex gap-1">

          {layouts.map(({ id, icon: Icon, label }) => (

            <button
              key={id}
              onClick={() => onLayoutChange(id)}
              title={label}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                activeLayout === id
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-primary/10"
              }`}
            >
              <Icon size={16}/>
            </button>

          ))}

        </div>

      </div>

    </section>
  )
}

export default GalleryControls