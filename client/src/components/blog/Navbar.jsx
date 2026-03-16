import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = ["Home", "Blog", "Series", "About"]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <a href="/" className="text-xl font-bold">
          <span className="text-primary">Dev</span>Blog
        </a>

        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a key={link} href="#" className="text-sm hover:text-primary">
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">

          <Button className="hidden md:inline-flex">
            Write Blog
          </Button>

          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>

        </div>

      </div>

      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a key={link} href="#" className="block text-sm">
              {link}
            </a>
          ))}
          <Button className="w-full">Write Blog</Button>
        </div>
      )}

    </nav>
  )
}