import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/axiosInstance"; // ← your shared axios instance
import {
  Plus, Search, Filter, Eye, Edit2, Trash2, ToggleLeft,
  ToggleRight, Clock, Calendar, FileText,
  Archive, CheckCircle, AlertCircle, MoreVertical, RefreshCw,
  BookOpen, Heart, Bookmark, Share2,
} from "lucide-react";

/* ─────────────────────────────────────────────
   API helpers — using shared axios instance
   baseURL is already "http://localhost:8000/api"
───────────────────────────────────────────────*/
const ADMIN_API = "/admin/blogs";

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────*/

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="card-portfolio p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold font-poppins text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    published: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    draft:     "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    archived:  "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${map[status] ?? map.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-section-alt border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div className="text-3xl mb-3 text-center">⚠️</div>
        <h3 className="font-bold font-poppins text-foreground text-center mb-2">Are you sure?</h3>
        <p className="text-sm text-muted-foreground text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-outline-primary flex-1">Cancel</button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/80 hover:bg-red-500 text-white transition-smooth"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function RowMenu({ blog, onEdit, onDelete, onToggle, onView }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 w-44 bg-section-alt border border-border rounded-xl shadow-xl overflow-hidden">
            {[
              { icon: Eye,      label: "View Live", fn: onView },
              { icon: Edit2,    label: "Edit",      fn: onEdit },
              {
                icon:  blog.status === "published" ? ToggleLeft : ToggleRight,
                label: blog.status === "published" ? "Unpublish" : "Publish",
                fn: onToggle,
              },
              { icon: Trash2, label: "Delete", fn: onDelete, danger: true },
            ].map(({ icon: Icon, label, fn, danger }) => (
              <button
                key={label}
                onClick={() => { fn(); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-smooth
                  ${danger
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────────*/
const UpdatesAdminPage = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs]   = useState([]);
  const [meta, setMeta]     = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage]               = useState(1);

  const [deleteTarget, setDeleteTarget] = useState(null);

  /* fetch */
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 10 };
      if (statusFilter !== "all") params.status = statusFilter;

      const res  = await API.get(ADMIN_API, { params });
      const data = res.data.data;

      setBlogs(data.blogs ?? data.data ?? []);
      setMeta({
        total:      data.total      ?? 0,
        page:       data.page       ?? 1,
        totalPages: data.totalPages ?? 1,
      });
    } catch (e) {
      setError(e.response?.data?.message ?? e.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  /* actions */
  const handleDelete = async (id) => {
    try {
      await API.delete(`${ADMIN_API}/${id}`);
      setDeleteTarget(null);
      toast.success("Post deleted");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message ?? e.message);
    }
  };

  const handleToggleStatus = async (blog) => {
    const next = blog.status === "published" ? "draft" : "published";
    try {
      await API.patch(`${ADMIN_API}/${blog._id}/status`, { status: next });
      toast.success(`Post ${next === "published" ? "published" : "unpublished"}`);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message ?? e.message);
    }
  };

  /* client-side search on current page */
  const visible = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    total:     meta.total,
    published: blogs.filter((b) => b.status === "published").length,
    draft:     blogs.filter((b) => b.status === "draft").length,
    archived:  blogs.filter((b) => b.status === "archived").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {deleteTarget && (
        <ConfirmModal
          message={`"${deleteTarget.title}" will be permanently deleted.`}
          onConfirm={() => handleDelete(deleteTarget._id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-poppins text-foreground">Blog Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Create, edit, and publish your updates</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={load}
              className="btn-outline-primary flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={() => navigate("/admin/updates/new")}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={15} />
              New Post
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FileText}    label="Total Posts" value={counts.total}     accent="bg-primary/10 text-primary" />
          <StatCard icon={CheckCircle} label="Published"   value={counts.published} accent="bg-emerald-500/10 text-emerald-400" />
          <StatCard icon={AlertCircle} label="Drafts"      value={counts.draft}     accent="bg-amber-500/10 text-amber-400" />
          <StatCard icon={Archive}     label="Archived"    value={counts.archived}  accent="bg-zinc-500/10 text-zinc-400" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-section-alt border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-smooth"
            />
          </div>
          <div className="relative">
            <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="pl-9 pr-8 py-2.5 text-sm bg-section-alt border border-border rounded-xl text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition-smooth cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* List */}
        {error ? (
          <div className="card-portfolio p-8 text-center">
            <p className="text-red-400 font-medium">{error}</p>
            <button onClick={load} className="btn-outline-primary mt-4">Retry</button>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card-portfolio p-5 animate-pulse">
                <div className="h-4 bg-border rounded w-2/3 mb-3" />
                <div className="h-3 bg-border rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="card-portfolio p-12 text-center">
            <BookOpen size={40} className="text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="text-muted-foreground">No posts found.</p>
            <button
              onClick={() => navigate("/admin/updates/new")}
              className="btn-primary mt-5 inline-flex items-center gap-2"
            >
              <Plus size={14} /> Create your first post
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((blog) => (
              <div
                key={blog._id}
                className="card-portfolio p-5 flex flex-col sm:flex-row sm:items-center gap-4 group"
              >
                <div className="w-full sm:w-20 h-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                  {blog.coverImage
                    ? <img src={blog.coverImage} alt="" className="w-full h-full object-cover rounded-xl" />
                    : "📝"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <StatusBadge status={blog.status} />
                    {blog.category && <span className="green-pill">{blog.category}</span>}
                  </div>
                  <h3 className="font-semibold text-sm text-foreground leading-snug truncate group-hover:text-primary transition-smooth">
                    {blog.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1"><Clock    size={11} /> {blog.readingTime ?? "—"} min</span>
                    <span className="flex items-center gap-1"><Eye      size={11} /> {(blog.stats?.views     ?? 0).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Heart    size={11} /> {(blog.stats?.likes     ?? 0).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Bookmark size={11} /> {(blog.stats?.bookmarks ?? 0).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Share2   size={11} /> {(blog.stats?.shares    ?? 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    title="Edit"
                    onClick={() => navigate(`/admin/updates/edit/${blog._id}`)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
                  >
                    <Edit2 size={15} />
                  </button>
                  <RowMenu
                    blog={blog}
                    onView={() => window.open(`/updates/${blog.slug}`, "_blank")}
                    onEdit={() => navigate(`/admin/updates/edit/${blog._id}`)}
                    onToggle={() => handleToggleStatus(blog)}
                    onDelete={() => setDeleteTarget(blog)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              Page {meta.page} of {meta.totalPages} · {meta.total} total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-outline-primary px-4 py-2 text-xs disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="btn-outline-primary px-4 py-2 text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatesAdminPage;