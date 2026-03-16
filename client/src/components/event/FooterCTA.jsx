import { Button } from "@/components/ui/button";

const FooterCTA = () => {
  return (
    <section className="bg-primary relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-primary-foreground text-lg md:text-xl font-bold">
          Seats are filling up fast!
        </p>

        <Button size="lg">
          Register Now
        </Button>
      </div>
    </section>
  );
};

export default FooterCTA;