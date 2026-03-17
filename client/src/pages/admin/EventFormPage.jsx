import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { createEventApi, updateEventApi, getAllEventsAdminApi } from "../../api/event.api";
import toast, { Toaster } from "react-hot-toast";

const InputField = ({ label, value, onChange, placeholder, type = "text", required }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-primary tracking-[0.15em] uppercase flex items-center gap-1">
      {label}{required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2.5 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-primary tracking-[0.15em] uppercase">{label}</label>
    <textarea
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2.5 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
    />
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
    <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-5">{title}</h3>
    {children}
  </div>
);

const defaultForm = {
  title: "",
  subtitle: "",
  overview: "",
  description: "",
  category: "",
  tags: "",
  eventMode: "Online",
  status: "Draft",
  dateTime: { startDate: "", endDate: "", timezone: "" },
  registration: { isFree: true, price: 0, currency: "USD", maxAttendees: "", registrationDeadline: "" },
  highlights: { duration: "", mode: "" },
  location: { venue: "", address: "", city: "", country: "", meetingLink: "", mapLink: "" },
  organizer: { name: "", organization: "", bio: "", email: "", website: "", followers: "", eventsHosted: "" },
  agenda: [],
  speakers: [],
};

const EventFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await getAllEventsAdminApi();
      const event = res.data.data.find((e) => e._id === id);
      if (event) {
        setForm({
          ...event,
          tags: event.tags?.join(", ") || "",
          dateTime: {
            startDate: event.dateTime?.startDate ? new Date(event.dateTime.startDate).toISOString().split("T")[0] : "",
            endDate: event.dateTime?.endDate ? new Date(event.dateTime.endDate).toISOString().split("T")[0] : "",
            timezone: event.dateTime?.timezone || "",
          },
          registration: {
            ...event.registration,
            registrationDeadline: event.registration?.registrationDeadline
              ? new Date(event.registration.registrationDeadline).toISOString().split("T")[0]
              : "",
          },
        });
      }
    } catch {
      toast.error("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (path, value) => {
    setForm((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const addAgendaItem = () => {
    setForm((prev) => ({
      ...prev,
      agenda: [...prev.agenda, { startTime: "", endTime: "", title: "", description: "" }],
    }));
  };

  const removeAgendaItem = (i) => {
    setForm((prev) => ({ ...prev, agenda: prev.agenda.filter((_, idx) => idx !== i) }));
  };

  const updateAgendaItem = (i, field, value) => {
    setForm((prev) => {
      const agenda = [...prev.agenda];
      agenda[i] = { ...agenda[i], [field]: value };
      return { ...prev, agenda };
    });
  };

  const addSpeaker = () => {
    setForm((prev) => ({
      ...prev,
      speakers: [...prev.speakers, { name: "", designation: "", bio: "", photo: "" }],
    }));
  };

  const removeSpeaker = (i) => {
    setForm((prev) => ({ ...prev, speakers: prev.speakers.filter((_, idx) => idx !== i) }));
  };

  const updateSpeaker = (i, field, value) => {
    setForm((prev) => {
      const speakers = [...prev.speakers];
      speakers[i] = { ...speakers[i], [field]: value };
      return { ...prev, speakers };
    });
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return toast.error("Title is required");

    setSaving(true);
    try {
      const payload = new FormData();

      // Basic fields
      payload.append("title", form.title);
      payload.append("subtitle", form.subtitle || "");
      payload.append("overview", form.overview || "");
      payload.append("description", form.description || "");
      payload.append("category", form.category || "");
      payload.append("eventMode", form.eventMode);
      payload.append("status", form.status);
      payload.append("tags", JSON.stringify(
        form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : []
      ));

      // Nested objects as JSON strings
      payload.append("dateTime", JSON.stringify(form.dateTime));
      payload.append("registration", JSON.stringify(form.registration));
      payload.append("highlights", JSON.stringify(form.highlights));
      payload.append("location", JSON.stringify(form.location));
      payload.append("organizer", JSON.stringify(form.organizer));
      payload.append("agenda", JSON.stringify(form.agenda));
      payload.append("speakers", JSON.stringify(form.speakers));

      if (isEdit) {
        await updateEventApi(id, payload);
        toast.success("Event updated successfully");
      } else {
        await createEventApi(payload);
        toast.success("Event created successfully");
      }

      navigate("/admin/events");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate("/admin/events")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth mb-3"
            >
              <ArrowLeft size={14} /> Back to Events
            </button>
            <h1 className="text-2xl font-bold font-poppins text-foreground">
              {isEdit ? "Edit Event" : "New Event"}
            </h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {saving ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
          </button>
        </div>

        <div className="space-y-6">

          {/* Basic Info */}
          <SectionCard title="Basic Information">
            <div className="space-y-4">
              <InputField label="Title" value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Event title" required />
              <InputField label="Subtitle" value={form.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} placeholder="Short subtitle" />
              <TextAreaField label="Overview" value={form.overview} onChange={(e) => updateField("overview", e.target.value)} placeholder="Full event description..." rows={5} />
              <div className="grid md:grid-cols-2 gap-4">
                <InputField label="Category" value={form.category} onChange={(e) => updateField("category", e.target.value)} placeholder="Technology, Workshop..." />
                <InputField label="Tags (comma separated)" value={form.tags} onChange={(e) => updateField("tags", e.target.value)} placeholder="AI, React, Web3..." />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-primary tracking-[0.15em] uppercase">Event Mode</label>
                  <select value={form.eventMode} onChange={(e) => updateField("eventMode", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option>Online</option>
                    <option>Offline</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-primary tracking-[0.15em] uppercase">Status</label>
                  <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option>Draft</option>
                    <option>Published</option>
                    <option>Cancelled</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Date & Time */}
          <SectionCard title="Date & Time">
            <div className="grid md:grid-cols-3 gap-4">
              <InputField label="Start Date" type="date" value={form.dateTime.startDate} onChange={(e) => updateField("dateTime.startDate", e.target.value)} />
              <InputField label="End Date" type="date" value={form.dateTime.endDate} onChange={(e) => updateField("dateTime.endDate", e.target.value)} />
              <InputField label="Timezone" value={form.dateTime.timezone} onChange={(e) => updateField("dateTime.timezone", e.target.value)} placeholder="PST (UTC-8)" />
            </div>
          </SectionCard>

          {/* Registration */}
          <SectionCard title="Registration">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={form.registration.isFree}
                  onChange={(e) => updateField("registration.isFree", e.target.checked)}
                  className="accent-primary w-4 h-4"
                />
                <label htmlFor="isFree" className="text-sm font-medium text-foreground">Free Event</label>
              </div>
              {!form.registration.isFree && (
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField label="Price" type="number" value={form.registration.price} onChange={(e) => updateField("registration.price", e.target.value)} placeholder="0" />
                  <InputField label="Currency" value={form.registration.currency} onChange={(e) => updateField("registration.currency", e.target.value)} placeholder="USD" />
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <InputField label="Max Attendees" type="number" value={form.registration.maxAttendees} onChange={(e) => updateField("registration.maxAttendees", e.target.value)} placeholder="500" />
                <InputField label="Registration Deadline" type="date" value={form.registration.registrationDeadline} onChange={(e) => updateField("registration.registrationDeadline", e.target.value)} />
              </div>
            </div>
          </SectionCard>

          {/* Location */}
          <SectionCard title="Location">
            <div className="space-y-4">
              {(form.eventMode === "Offline" || form.eventMode === "Hybrid") && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputField label="Venue" value={form.location.venue} onChange={(e) => updateField("location.venue", e.target.value)} placeholder="Convention Center" />
                    <InputField label="Address" value={form.location.address} onChange={(e) => updateField("location.address", e.target.value)} placeholder="123 Main St" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputField label="City" value={form.location.city} onChange={(e) => updateField("location.city", e.target.value)} placeholder="San Francisco" />
                    <InputField label="Country" value={form.location.country} onChange={(e) => updateField("location.country", e.target.value)} placeholder="United States" />
                  </div>
                </>
              )}
              {(form.eventMode === "Online" || form.eventMode === "Hybrid") && (
                <InputField label="Meeting Link" value={form.location.meetingLink} onChange={(e) => updateField("location.meetingLink", e.target.value)} placeholder="https://meet.example.com" />
              )}
            </div>
          </SectionCard>

          {/* Organizer */}
          <SectionCard title="Organizer">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <InputField label="Name" value={form.organizer.name} onChange={(e) => updateField("organizer.name", e.target.value)} placeholder="Organizer name" />
                <InputField label="Organization" value={form.organizer.organization} onChange={(e) => updateField("organizer.organization", e.target.value)} placeholder="Company name" />
              </div>
              <TextAreaField label="Bio" value={form.organizer.bio} onChange={(e) => updateField("organizer.bio", e.target.value)} placeholder="About the organizer..." rows={3} />
              <div className="grid md:grid-cols-2 gap-4">
                <InputField label="Website" value={form.organizer.website} onChange={(e) => updateField("organizer.website", e.target.value)} placeholder="https://example.com" />
                <InputField label="Email" type="email" value={form.organizer.email} onChange={(e) => updateField("organizer.email", e.target.value)} placeholder="contact@example.com" />
              </div>
            </div>
          </SectionCard>

          {/* Agenda */}
          <SectionCard title="Agenda">
            <div className="space-y-3 mb-4">
              {form.agenda.map((item, i) => (
                <div key={i} className="p-4 bg-background rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Session {i + 1}</span>
                    <button onClick={() => removeAgendaItem(i)} className="text-destructive hover:text-destructive/80">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <InputField label="Start Time" value={item.startTime} onChange={(e) => updateAgendaItem(i, "startTime", e.target.value)} placeholder="9:00 AM" />
                    <InputField label="End Time" value={item.endTime} onChange={(e) => updateAgendaItem(i, "endTime", e.target.value)} placeholder="10:00 AM" />
                  </div>
                  <InputField label="Title" value={item.title} onChange={(e) => updateAgendaItem(i, "title", e.target.value)} placeholder="Session title" />
                  <div className="mt-3">
                    <TextAreaField label="Description" value={item.description} onChange={(e) => updateAgendaItem(i, "description", e.target.value)} placeholder="Session description..." rows={2} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addAgendaItem} className="btn-outline-primary flex items-center gap-2 text-sm py-2">
              <Plus size={14} /> Add Session
            </button>
          </SectionCard>

          {/* Speakers */}
          <SectionCard title="Speakers">
            <div className="space-y-3 mb-4">
              {form.speakers.map((speaker, i) => (
                <div key={i} className="p-4 bg-background rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Speaker {i + 1}</span>
                    <button onClick={() => removeSpeaker(i)} className="text-destructive hover:text-destructive/80">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <InputField label="Name" value={speaker.name} onChange={(e) => updateSpeaker(i, "name", e.target.value)} placeholder="Speaker name" />
                    <InputField label="Designation" value={speaker.designation} onChange={(e) => updateSpeaker(i, "designation", e.target.value)} placeholder="CTO, Company" />
                    <InputField label="Photo URL" value={speaker.photo} onChange={(e) => updateSpeaker(i, "photo", e.target.value)} placeholder="https://..." />
                    <InputField label="Bio" value={speaker.bio} onChange={(e) => updateSpeaker(i, "bio", e.target.value)} placeholder="Short bio" />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addSpeaker} className="btn-outline-primary flex items-center gap-2 text-sm py-2">
              <Plus size={14} /> Add Speaker
            </button>
          </SectionCard>

          {/* Save button */}
          <div className="flex justify-end pt-2">
            <button onClick={handleSubmit} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? (
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default EventFormPage;