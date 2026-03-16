import { categories } from "@/data/blogData"
import { Button } from "@/components/ui/button"

export default function CategoryChips({ active, onSelect }) {
  return (
    <section className="py-6 border-b">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-3">
        
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={active === cat ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(cat)}
          >
            {cat}
          </Button>
        ))}

      </div>
    </section>
  )
}