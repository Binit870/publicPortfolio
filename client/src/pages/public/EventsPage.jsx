import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPublishedEventsApi } from "../../api/event.api";

const filters = ["All", "Conference", "Workshop", "Webinar", "Technology"];

const badgeStyle = (status) => {
  if (status === "Published") return "bg-green-100 text-green-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";
  return "bg-primary/10 text-primary";
};

const modeStyle = (mode) => {
  if (mode === "Online") return "bg-secondary/40 text-secondary-foreground";
  return "bg-primary/10 text-primary";
};

const EventsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getPublishedEventsApi({ limit: 20 });
        setEvents(res.data.data || []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filtered = activeFilter === "All"
    ? events
    : events.filter((e) => e.category === activeFilter || e.eventMode === activeFilter);

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 bg-section-alt">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="section-label mb-2 block">All Events</span>
          <h1 className="section-title mb-2">Upcoming Events</h1>
          <div className="saffron-underline mx-auto" />
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm">
            Conferences, workshops, and live sessions.
          </p>
        </div>
      </section>

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

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((e) => (
                <div
                  key={e._id}
                  className="card-portfolio overflow-hidden cursor-pointer group"
                  onClick={() => navigate(`/events/${e._id}`)}
                >
                  <div className="relative h-36 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-6xl">
                    <span className="group-hover:scale-110 transition-smooth inline-block">
                      {e.category === "Technology" ? "💻" : e.eventMode === "Online" ? "🎙️" : "📐"}
                    </span>
                    <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeStyle(e.status)}`}>
                      {e.status}
                    </span>
                    <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full ${modeStyle(e.eventMode)}`}>
                      {e.eventMode}
                    </span>
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                      {e.category}
                    </span>
                    <h3 className="font-bold text-foreground leading-snug mb-3 mt-1">{e.title}</h3>
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>📅</span>
                        <span>{e.dateTime?.startDate ? new Date(e.dateTime.startDate).toDateString() : "TBA"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>📍</span>
                        <span>{e.location?.city || e.location?.venue || "Online"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>🎟️</span>
                        <span>{e.registration?.isFree ? "Free" : `${e.registration?.currency} ${e.registration?.price}`}</span>
                      </div>
                    </div>
                    <button className="btn-primary w-full text-sm py-2">
                      View Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-muted-foreground">No events found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;