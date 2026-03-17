const StatsBar = ({ event }) => {
  if (!event) return null;

  const stats = [
    { label: "Attendees", value: event.registration?.maxAttendees?.toLocaleString() || "500+" },
    { label: "Speakers", value: event.speakers?.length ? `${event.speakers.length}+` : "20+" },
    { label: "Sessions", value: event.agenda?.length ? `${event.agenda.length}+` : "10+" },
    { label: "Views", value: event.stats?.views?.toLocaleString() || "0" },
  ];

  return (
    <section className="py-10 bg-section-alt">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <h2 className="text-3xl font-bold text-foreground">{s.value}</h2>
              <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;