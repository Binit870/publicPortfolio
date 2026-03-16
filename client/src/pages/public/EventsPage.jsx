import { useNavigate } from "react-router-dom";
import { useState } from "react";

const events = [
  { id: "1", emoji: "💻", color: "from-primary/20 to-primary/5", title: "React Summit 2026", date: "Apr 15, 2026", location: "San Francisco, CA", mode: "Hybrid", capacity: "500 seats", badge: "Upcoming", cta: "Register Now", category: "Conference" },
  { id: "2", emoji: "🎙️", color: "from-secondary/30 to-secondary/10", title: "DevTalk Live: System Design", date: "Apr 22, 2026", location: "Online", mode: "Online", capacity: "Unlimited", badge: "Live", cta: "Join Now", category: "Webinar" },
  { id: "3", emoji: "📐", color: "from-primary/15 to-secondary/15", title: "UI/UX Design Bootcamp", date: "May 5, 2026", location: "New York, NY", mode: "Offline", capacity: "120 seats", badge: "Upcoming", cta: "Book Seat", category: "Workshop" },
  { id: "4", emoji: "🧠", color: "from-primary/20 to-secondary/10", title: "AI & ML Summit 2026", date: "May 20, 2026", location: "London, UK", mode: "Hybrid", capacity: "800 seats", badge: "Upcoming", cta: "Register Now", category: "Conference" },
  { id: "5", emoji: "🚀", color: "from-secondary/20 to-primary/10", title: "Startup Launch Fest", date: "Jun 3, 2026", location: "Online", mode: "Online", capacity: "Unlimited", badge: "Upcoming", cta: "Join Now", category: "Webinar" },
  { id: "6", emoji: "🎯", color: "from-primary/25 to-primary/5", title: "Product Management Masterclass", date: "Jun 15, 2026", location: "Bangalore", mode: "Offline", capacity: "60 seats", badge: "Upcoming", cta: "Book Seat", category: "Workshop" },
];

const filters = ["All", "Conference", "Workshop", "Webinar"];

const badgeStyle = (badge) => {
  if (badge === "Live") return "bg-green-500 text-white animate-pulse";
  return "bg-primary/10 text-primary";
};

const modeStyle = (mode) => {
  if (mode === "Online") return "bg-secondary/40 text-secondary-foreground";
  return "bg-primary/10 text-primary";
};

const EventsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? events
    : events.filter((e) => e.category === activeFilter);

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="py-16 bg-section-alt">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="section-label mb-2 block">All Events</span>
          <h1 className="section-title mb-2">Upcoming Events</h1>
          <div className="saffron-underline mx-auto" />
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm">
            Conferences, workshops, and live sessions — join me at these upcoming events.
          </p>
        </div>
      </section>

      {/* Filter chips */}
      <section className="sticky top-16 z-40 bg-background/90 backdrop-blur-md border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-3 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-smooth whitespace-nowrap ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="text-xs text-muted-foreground ml-auto shrink-0">
            {filtered.length} events
          </span>
        </div>
      </section>

      {/* Events grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((e) => (
              <div
                key={e.id}
                className="card-portfolio overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/events/${e.id}`)}
              >
                {/* Top gradient */}
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

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                      {e.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground leading-snug mb-3">
                    {e.title}
                  </h3>
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

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-muted-foreground">No events found for this filter.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default EventsPage;