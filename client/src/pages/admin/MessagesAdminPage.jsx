import { useState, useEffect, useCallback } from "react";
import API from "../../api/axiosInstance";
import toast from "react-hot-toast";


const MESSAGES_API = "/admin/messages";

function getStatus(msg) {
  if (msg.isReplied) return "replied";
  if (msg.isRead) return "read";
  return "unread";
}

function StatusBadge({ status }) {
  const styles = {
    unread: "bg-orange-100 text-orange-600 border border-orange-300",
    read: "bg-amber-50 text-amber-600 border border-amber-200",
    replied: "bg-green-100 text-green-700 border border-green-300",
  };
  return (
    <span className={`inline-block text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-sm font-mono ${styles[status]}`}>
      {status}
    </span>
  );
}

function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white border border-orange-200 rounded-xl p-8 w-80 shadow-2xl">
        <p className="text-[10px] tracking-[0.2em] uppercase text-orange-500 font-mono mb-3">
          Confirm Delete
        </p>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          Permanently delete this message? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 text-xs font-mono tracking-widest uppercase py-2 rounded-lg transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 text-xs font-mono tracking-widest uppercase py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageDrawer({ msg, onClose, onDelete, onMarkReplied }) {
  if (!msg) return null;
  const status = getStatus(msg);

  const meta = [
    { label: "Email", value: msg.email, full: true },
    { label: "Phone", value: msg.phone || "—" },
    { label: "Company", value: msg.company || "—" },
    { label: "Newsletter", value: msg.newsletterOptIn ? "Opted In" : "No" },
    { label: "IP Address", value: msg.ipAddress || "—" },
  ];

  return (
    <div className="fixed inset-0 z-30 flex justify-end">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex flex-col w-full max-w-lg h-full bg-white border-l border-orange-100 shadow-2xl overflow-y-auto">

        {/* Saffron top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-amber-400 to-green-400 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-start gap-3 px-7 py-6 border-b border-orange-100">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h2 className="text-lg font-bold text-slate-800">
                {msg.firstName} {msg.lastName}
              </h2>
              <StatusBadge status={status} />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl leading-none p-1 transition-colors mt-0.5"
          >
            ✕
          </button>
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 px-7 py-5 border-b border-orange-100 bg-orange-50/40">
          {meta.map(({ label, value, full }) => (
            <div key={label} className={full ? "col-span-2" : ""}>
              <p className="text-[9px] tracking-[0.18em] uppercase text-orange-400 font-mono mb-1">
                {label}
              </p>
              <p className="text-sm text-slate-700 break-all">{value}</p>
            </div>
          ))}
        </div>

        {/* Message Body */}
        <div className="flex-1 px-7 py-5">
          <p className="text-[9px] tracking-[0.18em] uppercase text-orange-400 font-mono mb-3">
            Message
          </p>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {msg.message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 px-7 py-5 border-t border-orange-100 flex-wrap bg-white">
          {!msg.isReplied && (
            <button
              onClick={() => onMarkReplied(msg._id)}
              className="bg-green-50 hover:bg-green-100 border border-green-300 text-green-700 text-xs font-mono tracking-widest uppercase px-4 py-2 rounded-lg transition-colors"
            >
              ✓ Mark Replied
            </button>
          )}
          <a
            href={`mailto:${msg.email}`}
            className="bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 text-xs font-mono tracking-widest uppercase px-4 py-2 rounded-lg transition-colors"
          >
            ✉ Reply
          </a>
          <button
            onClick={() => onDelete(msg._id)}
            className="ml-auto bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 text-xs font-mono tracking-widest uppercase px-4 py-2 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const LIMIT = 10;

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (filter === "unread") params.isRead = false;
      if (filter === "read") params.isRead = true;
      const { data } = await API.get(MESSAGES_API, { params });
      setMessages(data.data.data || []);
      setTotalPages(data.data.totalPages || 1);
    } catch {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const handleOpen = async (id) => {
    try {
      const { data } = await API.get(`${MESSAGES_API}/${id}`);
      setSelectedMsg(data.data);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isRead: true } : m))
      );
    } catch {
      toast.error("Failed to load message");
    }
  };

  const handleMarkReplied = async (id) => {
    try {
      const { data } = await API.patch(`${MESSAGES_API}/${id}/replied`);
      setSelectedMsg(data.data);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isReplied: true } : m))
      );
      toast.success("Marked as replied");
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDeleteRequest = (id) => setConfirmDelete(id);

  const handleDeleteConfirm = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    try {
      await API.delete(`${MESSAGES_API}/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selectedMsg?._id === id) setSelectedMsg(null);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const tabs = ["all", "unread", "read"];

  return (
    <div className="min-h-screen bg-orange-50/30 text-slate-800">

      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-amber-400 to-green-500" />

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] tracking-[0.2em] uppercase text-orange-500 font-mono">
              Admin / Inbox
            </span>
            {unreadCount > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                {unreadCount} new
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Messages</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage incoming contact form submissions
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total",
              value: messages.length,
              color: "border-orange-200 bg-white",
              text: "text-orange-500",
            },
            {
              label: "Unread",
              value: messages.filter((m) => !m.isRead).length,
              color: "border-amber-200 bg-white",
              text: "text-amber-500",
            },
            {
              label: "Replied",
              value: messages.filter((m) => m.isReplied).length,
              color: "border-green-200 bg-white",
              text: "text-green-600",
            },
          ].map(({ label, value, color, text }) => (
            <div
              key={label}
              className={`rounded-xl border px-5 py-4 shadow-sm ${color}`}
            >
              <p className="text-[9px] tracking-[0.18em] uppercase text-slate-400 font-mono mb-1">
                {label}
              </p>
              <p className={`text-2xl font-bold ${text}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-5 bg-white border border-orange-200 rounded-lg p-1 w-fit shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => { setFilter(tab); setPage(1); }}
              className={`px-4 py-1.5 rounded-md text-[11px] font-mono tracking-widest uppercase transition-all ${
                filter === tab
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-orange-100 rounded-xl overflow-hidden shadow-sm">

          {/* Table Head */}
          <div className="hidden sm:grid grid-cols-[2fr_2fr_1.2fr_90px_20px] gap-4 px-5 py-3 border-b border-orange-100 bg-orange-50">
            {["Sender", "Preview", "Date", "Status", ""].map((h) => (
              <span
                key={h}
                className="text-[9px] tracking-[0.18em] uppercase text-orange-400 font-mono"
              >
                {h}
              </span>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center h-48 gap-3">
              <div className="w-7 h-7 border-2 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-xs text-slate-400 font-mono">Loading messages…</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-2xl mb-2">📭</p>
              <p className="text-slate-400 text-sm font-mono">No messages found.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const status = getStatus(msg);
              const isUnread = !msg.isRead;
              return (
                <div
                  key={msg._id}
                  onClick={() => handleOpen(msg._id)}
                  className={`
                    group grid grid-cols-1 sm:grid-cols-[2fr_2fr_1.2fr_90px_20px] gap-2 sm:gap-4
                    px-5 py-4 border-b border-orange-50 cursor-pointer
                    hover:bg-orange-50/60 transition-colors
                    ${isUnread ? "bg-amber-50/40" : "bg-white"}
                  `}
                >
                  <div className="min-w-0">
                    <p
                      className={`text-sm mb-0.5 truncate ${
                        isUnread
                          ? "font-semibold text-slate-800"
                          : "font-normal text-slate-600"
                      }`}
                    >
                      {isUnread && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mr-2 mb-0.5 align-middle" />
                      )}
                      {msg.firstName} {msg.lastName}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">
                      {msg.email}
                    </p>
                  </div>
                  <p className="text-sm text-slate-400 truncate pr-4 self-center">
                    {msg.message.slice(0, 65)}
                    {msg.message.length > 65 ? "…" : ""}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono self-center">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <div className="self-center">
                    <StatusBadge status={status} />
                  </div>
                  <span className="hidden sm:block text-orange-200 group-hover:text-orange-500 transition-colors self-center text-base text-right">
                    ›
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="bg-white border border-orange-200 text-slate-500 hover:text-orange-600 hover:border-orange-400 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-mono tracking-widest uppercase px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              ‹ Prev
            </button>
            <span className="text-[11px] font-mono text-slate-400 px-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="bg-white border border-orange-200 text-slate-500 hover:text-orange-600 hover:border-orange-400 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-mono tracking-widest uppercase px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Next ›
            </button>
          </div>
        )}
      </div>

      {/* Drawer */}
      {selectedMsg && (
        <MessageDrawer
          msg={selectedMsg}
          onClose={() => setSelectedMsg(null)}
          onDelete={handleDeleteRequest}
          onMarkReplied={handleMarkReplied}
        />
      )}

      {/* Confirm Modal */}
      {confirmDelete && (
        <ConfirmModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}