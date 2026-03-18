import { useState, useEffect } from "react";
import { Github, Twitter, Linkedin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "@/api/axiosInstance";

const formatNum = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : n);

export default function AuthorSidebar() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get("/profile")
      .then((res) => setProfile(res.data.data))
      .catch(() => setProfile(null));
  }, []);

  const name =
    profile?.about?.name || profile?.home?.name || "Arjun Mehta";
  const bio =
    profile?.about?.biography ||
    "Full-stack developer passionate about building great products.";
  const social = profile?.socialLinks || {};

  return (
    <div className="rounded-xl bg-card p-6 text-center shadow-sm border">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mx-auto mb-3">
        {name.slice(0, 2).toUpperCase()}
      </div>

      <h3 className="font-semibold">{name}</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Full-stack Developer
      </p>
      <p className="text-sm mb-4">{bio}</p>

      <div className="flex justify-center gap-2 mb-4">
        {[
          { icon: Github, href: social.github },
          { icon: Twitter, href: social.twitter },
          { icon: Linkedin, href: social.linkedin },
          { icon: Globe, href: social.website },
        ]
          .filter(({ href }) => href)
          .map(({ icon: Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg border flex items-center justify-center hover:text-primary transition-smooth"
            >
              <Icon size={16} />
            </a>
          ))}
      </div>

      <Button className="w-full">Follow Author</Button>
    </div>
  );
}