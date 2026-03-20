export default function Footer() {
  const footerLinks = ["Home", "Blog", "Series", "About", "Contact"]

  return (
    <footer className="bg-black text-white py-12">

      <div className="max-w-7xl mx-auto px-4 text-center">

        <h2 className="text-xl font-bold mb-3">
          <span className="text-orange-500">Dev Blog</span>
        </h2>

        <p className="text-sm text-gray-400 mb-6">
          A community-driven blog for developers.
        </p>

        <div className="flex justify-center gap-6 flex-wrap mb-6">
          {footerLinks.map((link) => (
            <a key={link} href="#" className="text-sm hover:text-primary">
              {link}
            </a>
          ))}
        </div>

        <p className="text-xs text-gray-500">
          © 2026 DevBlog. All rights reserved.
        </p>

      </div>

    </footer>
  )
}