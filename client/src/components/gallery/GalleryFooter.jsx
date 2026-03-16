const footerLinks = ["Home", "Gallery", "Collections", "About", "Contact", "Privacy"]

const GalleryFooter = () => {
  return (
    <footer className="bg-foreground py-12">

      <div className="max-w-7xl mx-auto px-4 text-center">

        <a href="/" className="text-xl font-bold text-primary mb-3 inline-block">
          <span className="text-primary">Visual</span>
          <span className="text-primary-foreground">Gallery</span>
        </a>

        <p className="text-sm text-muted-foreground/70 mb-6 max-w-sm mx-auto">
          A curated platform for stunning visual stories.
        </p>

        <div className="flex justify-center gap-6 mb-6 flex-wrap">

          {footerLinks.map((link) => (
            <a key={link} href="#" className="text-sm hover:text-primary">
              {link}
            </a>
          ))}

        </div>

        <p className="text-xs text-muted-foreground/50">
          © 2026 VisualGallery. All rights reserved.
        </p>

      </div>

    </footer>
  )
}

export default GalleryFooter