import { useNavigate } from "react-router-dom";

const events = [
  { id: "1", emoji: "💻", color: "from-primary/20 to-primary/5", title: "React Summit 2026", date: "Apr 15, 2026", location: "San Francisco, CA", mode: "Hybrid", capacity: "500 seats", badge: "Upcoming", cta: "Register Now" },
  { id: "2", emoji: "🎙️", color: "from-secondary/30 to-secondary/10", title: "DevTalk Live: System Design", date: "Apr 22, 2026", location: "Online", mode: "Online", capacity: "Unlimited", badge: "Live", cta: "Join Now" },
  { id: "3", emoji: "📐", color: "from-primary/15 to-secondary/15", title: "UI/UX Design Bootcamp", date: "May 5, 2026", location: "New York, NY", mode: "Offline", capacity: "120 seats", badge: "Upcoming", cta: "Book Seat" },
];

const badgeStyle = (badge) => {
  if (badge === "Live") return "bg-green-500 text-white animate-pulse";
  return "bg-primary/10 text-primary";
};

const modeStyle = (mode) => {
  if (mode === "Online") return "bg-secondary/40 text-secondary-foreground";
  return "bg-primary/10 text-primary";
};

const EventsPreview = () => {
  const navigate = useNavigate();

  return (
    <section id="events" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <span className="section-label mb-2 block">Upcoming</span>
          <h2 className="section-title">Events</h2>
          <div className="saffron-underline mx-auto" />
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm">
            Join me at upcoming conferences, live sessions, and workshops.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {events.map((e) => (
            <div
              key={e.id}
              className="card-portfolio overflow-hidden cursor-pointer group"
              onClick={() => navigate(`/events/${e.id}`)}
            >
              <div className={`relative h-36 bg-gradient-to-br ${e.color} flex items-center justify-center text-6xl`}>
                <span className="group-hover:scale-110 transition-smooth inline-block">
                  {e.emoji}
                </span>
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeStyle(e.badge)}`}>
                  {e.badge === "Live" && "🔴 "}{e.badge}
                </span>
                <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full ${modeStyle(e.mode)}`}>
                  {e.mode}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-foreground leading-snug mb-3">{e.title}</h3>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>📅</span><span>{e.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>📍</span><span>{e.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>🎟️</span><span>{e.capacity}</span>
                  </div>
                </div>
                <button
                  className="btn-primary w-full text-sm py-2"
                  onClick={(ev) => { ev.stopPropagation(); navigate(`/events/${e.id}`); }}
                >
                  {e.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            className="btn-outline-primary"
            onClick={() => navigate("/events")}
          >
            View All Events
          </button>
        </div>

      </div>
    </section>
  );
};

export default EventsPreview;