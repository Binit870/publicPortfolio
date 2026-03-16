import { eventData } from "@/data/eventData";

const AgendaSection = () => {
  return (
    <section className="bg-section-alt relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
        <h2 className="text-2xl font-bold text-heading mb-8">Agenda</h2>

        <div className="relative">
          <div className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-0.5 bg-primary/30" />

          <div className="space-y-6">
            {eventData.agenda.map((item, i) => (
              <div key={i} className="relative flex gap-4 md:gap-6">
                <div className="relative z-10 mt-1.5 flex-shrink-0">
                  <div className="w-[10px] h-[10px] md:w-[14px] md:h-[14px] rounded-full bg-primary border-2 border-primary ring-4 ring-background" />
                </div>

                <div className={`flex-1 rounded-lg p-4 ${i % 2 === 0 ? "bg-card" : "bg-section-alt"} border border-border`}>
                  <p className="text-xs font-medium text-primary mb-1">
                    {item.start} – {item.end}
                  </p>

                  <h3 className="font-semibold text-heading text-sm md:text-base">
                    {item.title}
                  </h3>

                  <p className="text-body text-sm mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;