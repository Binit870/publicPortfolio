import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"/>

      <div className="relative max-w-3xl mx-auto px-4 text-center">

        <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full mb-4 inline-block">
          The Developer Blog
        </span>

        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
          Stories & Ideas for{" "}
          <span className="text-primary">Modern Developers</span>
        </h1>

        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Explore tutorials, deep dives, and insights from the developer community.
        </p>

        <div className="flex items-center max-w-lg mx-auto bg-card rounded-xl border shadow overflow-hidden">

          <div className="flex items-center flex-1 px-4 gap-2">
            <Search size={18} className="text-muted-foreground"/>
            <Input
              placeholder="Search articles..."
              className="border-0 focus-visible:ring-0"
            />
          </div>

          <Button className="rounded-none">
            Search
          </Button>

        </div>

      </div>

    </section>
  )
}