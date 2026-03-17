import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPublishedEventsApi } from "../../../api/event.api";

const badgeStyle = (status) => {
  if (status === "Published") return "bg-green-100 text-green-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";
  return "bg-primary/10 text-primary";
};

const modeStyle = (mode) => {
  if (mode === "Online") return "bg-secondary/40 text-secondary-foreground";
  return "bg-primary/10 text-primary";
};

const EventsPreview = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getPublishedEventsApi({ limit: 3 });
        setEvents(res.data.data || []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section id="events" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="section-label mb-2 block">Upcoming</span>
            <h2 className="section-title">Events</h2>
            <div className="saffron-underline mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-portfolio overflow-hidden animate-pulse">
                <div className="h-36 bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="h-8 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

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

        <div className={`grid gap-6 ${
          events.length === 1
            ? "md:grid-cols-1 max-w-md mx-auto"
            : events.length === 2
            ? "md:grid-cols-2 max-w-2xl mx-auto"
            : "md:grid-cols-3"
        }`}>
          {events.map((e) => (
            <div
              key={e._id}
              className="card-portfolio overflow-hidden cursor-pointer group"
              onClick={() => navigate(`/events/${e._id}`)}
            >
              <div className="relative h-36 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-6xl">
                <span className="group-hover:scale-110 transition-smooth inline-block">
                  {e.eventMode === "Online" ? "🎙️" : e.eventMode === "Hybrid" ? "💻" : "📐"}
                </span>
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeStyle(e.status)}`}>
                  {e.status}
                </span>
                <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full ${modeStyle(e.eventMode)}`}>
                  {e.eventMode}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-foreground leading-snug mb-3">
                  {e.title}
                </h3>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>📅</span>
                    <span>
                      {e.dateTime?.startDate
                        ? new Date(e.dateTime.startDate).toDateString()
                        : "TBA"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>📍</span>
                    <span>
                      {e.location?.city || e.location?.venue || "Online"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>🎟️</span>
                    <span>
                      {e.registration?.isFree
                        ? "Free"
                        : `${e.registration?.currency} ${e.registration?.price}`}
                    </span>
                  </div>
                </div>
                <button
                  className="btn-primary w-full text-sm py-2"
                  onClick={(ev) => { ev.stopPropagation(); navigate(`/events/${e._id}`); }}
                >
                  View Event
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