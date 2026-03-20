import { Link } from "react-router-dom"

const footerLinks = ["Home", "Events", "Updates", "Contact"]

const GalleryFooter = () => {
  return (
    <footer className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">

        <Link to="/" className="text-xl font-bold mb-3 inline-block">
          <span className="text-green-700">Visual</span>
          <span className="text-orange-500">Gallery</span>
        </Link>

        <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
          A curated platform for stunning visual stories.
        </p>

        <div className="flex justify-center gap-6 mb-6 flex-wrap">
          {footerLinks.map((link) => {
            const path =
              link === "Home"
                ? "/"
                : `/${link.toLowerCase()}`

            return (
              <Link
                key={link}
                to={path}
                className="text-sm text-gray-700 hover:text-orange-500 transition-colors"
              >
                {link}
              </Link>
            )
          })}
        </div>

        <p className="text-xs text-gray-500">
          © 2026 VisualGallery. All rights reserved.
        </p>

      </div>
    </footer>
  )
}

export default GalleryFooter