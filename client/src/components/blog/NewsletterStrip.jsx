import { Button } from "@/components/ui/button"

export default function NewsletterStrip() {
  return (
    <section className="py-14 bg-gradient-to-r from-primary/5 via-secondary/10 to-primary/5">

      <div className="max-w-2xl mx-auto px-4 text-center">

        <h2 className="text-3xl font-bold mb-2">
          Stay in the Loop
        </h2>

        <p className="text-muted-foreground mb-6">
          Get the latest articles delivered to your inbox.
        </p>

        <div className="flex max-w-md mx-auto bg-card rounded-full shadow border overflow-hidden">

          <input
            type="email"
            placeholder="you@example.com"
            className="flex-1 px-5 py-3 outline-none bg-transparent"
          />

          <Button className="rounded-full mr-1">
            Subscribe
          </Button>

        </div>

      </div>

    </section>
  )
}