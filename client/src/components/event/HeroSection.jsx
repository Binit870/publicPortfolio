import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { eventData } from "@/data/eventData";

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-primary-foreground/10" />
        <div className="absolute bottom-20 -left-10 w-48 h-48 rounded-full bg-primary-foreground/5" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-accent/20" />
      </div>

      <div className="relative z-10 flex flex-col justify-end px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto pt-20 pb-24 md:pt-24 md:pb-28">
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="bg-highlight text-highlight px-3 py-1 rounded-full text-xs font-semibold">
            {eventData.category}
          </span>

          <span className="bg-primary-foreground/20 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            {eventData.status}
          </span>

          <span className="bg-primary-foreground/20 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            {eventData.mode}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-3">
          {eventData.title}
        </h1>

        <p className="text-primary-foreground/85 text-base sm:text-lg max-w-2xl mb-8">
          {eventData.subtitle}
        </p>

        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            Register Now
          </Button>

          <Button size="lg">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Add to Calendar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;