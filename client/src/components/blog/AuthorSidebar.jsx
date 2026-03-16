import { author } from "@/data/blogData"
import { Github, Twitter, Linkedin, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

const formatNum = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : n)

export default function AuthorSidebar() {
  return (
    <div className="rounded-xl bg-card p-6 text-center shadow-sm border">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mx-auto mb-3">
        {author.avatar}
      </div>

      <h3 className="font-semibold">{author.name}</h3>
      <p className="text-xs text-muted-foreground mb-3">@{author.username}</p>

      <p className="text-sm mb-4">{author.bio}</p>

      <div className="flex justify-center gap-6 mb-4 text-xs">
        <div>
          <div className="font-bold">{formatNum(author.followers)}</div>
          Followers
        </div>
        <div>
          <div className="font-bold">{author.articles}</div>
          Articles
        </div>
        <div>
          <div className="font-bold">{author.following}</div>
          Following
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {[
          { icon: Github, href: author.socialLinks.github },
          { icon: Twitter, href: author.socialLinks.twitter },
          { icon: Linkedin, href: author.socialLinks.linkedin },
          { icon: Globe, href: author.socialLinks.website },
        ].map(({ icon: Icon, href }, i) => (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-lg border flex items-center justify-center hover:text-primary"
          >
            <Icon size={16} />
          </a>
        ))}
      </div>

      <Button className="w-full">Follow Author</Button>
    </div>
  )
}