import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, RefreshCw } from "lucide-react";
import { getAllEventsAdminApi, deleteEventApi, updateEventStatusApi } from "../../api/event.api";
import toast, { Toaster } from "react-hot-toast";

const statusStyle = (status) => {
  if (status === "Published") return "bg-green-100 text-green-700";
  if (status === "Draft") return "bg-yellow-100 text-yellow-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";
  if (status === "Completed") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
};

const EventsAdminPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getAllEventsAdminApi({ limit: 50 });
      setEvents(res.data.data || []);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await deleteEventApi(id);
      toast.success("Event deleted");
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch {
      toast.error("Failed to delete event");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateEventStatusApi(id, status);
      toast.success(`Status updated to ${status}`);
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status } : e))
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filtered = filter === "All"
    ? events
    : events.filter((e) => e.status === filter);

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Admin</span>
            <h1 className="text-2xl font-bold font-poppins text-foreground mt-1">Events</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {events.length} total events
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchEvents} className="btn-outline-primary flex items-center gap-2 text-sm py-2">
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={() => navigate("/admin/events/new")}
              className="btn-primary flex items-center gap-2 text-sm py-2"
            >
              <Plus size={14} /> New Event
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["All", "Draft", "Published", "Cancelled", "Completed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-smooth ${
                filter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-section-alt">
                  <th className="text-left p-4 font-semibold text-muted-foreground">Event</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Date</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Mode</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e._id} className="border-b border-border hover:bg-section-alt transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-foreground">{e.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{e.category}</p>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {e.dateTime?.startDate ? new Date(e.dateTime.startDate).toDateString() : "TBA"}
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary/40 text-secondary-foreground">
                        {e.eventMode}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={e.status}
                        onChange={(ev) => handleStatusChange(e._id, ev.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-none outline-none cursor-pointer ${statusStyle(e.status)}`}
                      >
                        {["Draft", "Published", "Cancelled", "Completed"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(`/events/${e._id}`, "_blank")}
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                          title="View"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/events/${e._id}/edit`)}
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(e._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-muted-foreground">No events found.</p>
                <button
                  onClick={() => navigate("/admin/events/new")}
                  className="btn-primary mt-4"
                >
                  Create First Event
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
};

export default EventsAdminPage;