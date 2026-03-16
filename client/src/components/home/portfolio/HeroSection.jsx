import { Download, ArrowRight } from "lucide-react";

const stats = [
  { label: "Projects Done", value: "50+" },
  { label: "Followers", value: "12K" },
  { label: "Events Hosted", value: "30+" },
];

const HeroSection = () => {
  return (
    <section id="home" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

        <div>
          <span className="section-label mb-4 block">
            Welcome to my portfolio
          </span>

          <h1 className="font-poppins font-bold text-foreground mb-4 leading-tight">
            Hi, I'm{" "}
            <span className="text-primary">Arjun</span>{" "}
            Mehta
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Full-Stack Developer & Event Organizer building scalable
            products and meaningful tech communities.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <button className="btn-primary gap-2">
              Explore My Work <ArrowRight size={16} />
            </button>
            <button className="btn-outline-primary gap-2">
              <Download size={16} /> Download CV
            </button>
          </div>

          <div className="flex gap-10">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold font-poppins text-foreground">
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-52 h-52 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center text-8xl shadow-orange">
            👨‍💻
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;