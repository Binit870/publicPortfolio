import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/axiosInstance";
import {
  ArrowLeft, Save, Eye, Upload, X, Plus, Tag, Image as ImageIcon,
  FileText, Settings, Search, Globe, Hash, BookOpen, AlignLeft,
  ToggleLeft, ToggleRight, Loader2,
} from "lucide-react";

/* ─────────────────────────────────────────────
   API helpers — using shared axios instance
   baseURL is already "http://localhost:8000/api"
───────────────────────────────────────────────*/
const ADMIN_API = "/admin/blogs";

async function apiFetch(url, params = {}) {
  const res = await API.get(url, { params });
  return res.data.data;
}

async function apiFormData(url, method, body) {
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  const res = method === "PATCH"
    ? await API.patch(url, body, config)
    : await API.post(url, body, config);
  return res.data.data;
}

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────────*/
const CATEGORIES = [
  "Development", "Design", "DevOps", "Career", "Open Source",
  "AI/ML", "Security", "Productivity", "Tutorial",
];

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  tags: [],
  status: "draft",
  allowComments: true,
  seo: { metaTitle: "", metaDescription: "", keywords: [] },
};

/* ─────────────────────────────────────────────
   Small reusable pieces
───────────────────────────────────────────────*/

function SectionLabel({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={15} className="text-primary" />
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3.5 py-2.5 text-sm bg-section-alt border border-border rounded-xl text-foreground
        placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-smooth ${className}`}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full px-3.5 py-2.5 text-sm bg-section-alt border border-border rounded-xl text-foreground
        placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition-smooth ${className}`}
      {...props}
    />
  );
}

function TagInput({ tags, onChange }) {
  const [input, setInput] = useState("");
  const add = () => {
    const val = input.trim().replace(/^#/, "");
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput("");
  };
  const remove = (t) => onChange(tags.filter((x) => x !== t));
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            placeholder="Add tag and press Enter"
          />
        </div>
        <button type="button" onClick={add} className="btn-outline-primary px-4 py-2 text-xs flex items-center gap-1.5">
          <Plus size={13} /> Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="green-pill flex items-center gap-1.5">
              {t}
              <button type="button" onClick={() => remove(t)} className="hover:text-red-400 transition-smooth">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function CoverUpload({ previewUrl, onFile, onRemove }) {
  const fileRef = useRef(null);
  return (
    <div>
      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden h-40 bg-section-alt">
          <img src={previewUrl} alt="Cover" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-smooth"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full h-40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-smooth"
        >
          <Upload size={24} />
          <span className="text-sm font-medium">Upload Cover Image</span>
          <span className="text-xs opacity-60">PNG, JPG — recommended 1200×630</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) onFile(e.target.files[0]); }}
      />
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-sm text-foreground"
    >
      {checked
        ? <ToggleRight size={22} className="text-primary" />
        : <ToggleLeft size={22} className="text-muted-foreground" />}
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────────*/
const UpdateFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [slug, setSlug]           = useState("");          // ✅ slug state
  const [form, setForm]           = useState(EMPTY_FORM);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [errors, setErrors]       = useState({});
  const [saving, setSaving]       = useState(false);
  const [loadingPost, setLoadingPost] = useState(isEdit);
  const [activeTab, setActiveTab] = useState("content");

  /* ✅ FIXED — load existing post by its ID directly (includes content field) */
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const found = await apiFetch(`${ADMIN_API}/${id}`);
        if (!found) throw new Error("Post not found");

        if (found.slug) setSlug(found.slug);

        setForm({
          title:         found.title          ?? "",
          excerpt:       found.excerpt         ?? "",
          content:       found.content         ?? "",   // ✅ now included — getBlogById has no .select("-content")
          category:      found.category        ?? "",
          tags:          found.tags            ?? [],
          status:        found.status          ?? "draft",
          allowComments: found.allowComments   ?? true,
          seo: {
            metaTitle:       found.seo?.metaTitle       ?? "",
            metaDescription: found.seo?.metaDescription ?? "",
            keywords:        found.seo?.keywords        ?? [],
          },
        });
        if (found.coverImage) setCoverPreview(found.coverImage);
      } catch (e) {
        toast.error(e.response?.data?.message ?? e.message);
      } finally {
        setLoadingPost(false);
      }
    })();
  }, [id, isEdit]);

  /* field setters */
  const set    = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
  const setSeo = (key) => (val) => setForm((f) => ({ ...f, seo: { ...f.seo, [key]: val } }));

  /* validation */
  function validate() {
    const e = {};
    if (!form.title.trim())   e.title   = "Title is required";
    if (!form.content.trim()) e.content = "Content is required";
    if (form.excerpt && form.excerpt.length > 300) e.excerpt = "Max 300 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* save */
  async function handleSave(publishAfter = false) {
    if (!validate()) return;
    setSaving(true);
    try {
      const fd      = new FormData();
      const payload = { ...form };
      if (publishAfter) payload.status = "published";

      Object.entries(payload).forEach(([k, v]) => {
        if (k === "tags" || k === "seo") fd.append(k, JSON.stringify(v));
        else fd.append(k, String(v));
      });
      if (coverFile) fd.append("coverImage", coverFile);

      if (isEdit) {
        const updated = await apiFormData(`${ADMIN_API}/${id}`, "PATCH", fd);
        if (updated?.slug) setSlug(updated.slug);          // ✅ keep slug fresh after update
        toast.success("Post updated successfully!");
      } else {
        const created = await apiFormData(ADMIN_API, "POST", fd);
        if (created?.slug) setSlug(created.slug);          // ✅ store slug on create
        toast.success("Post created successfully!");
        setTimeout(() => navigate("/admin/updates"), 1200);
      }

      if (publishAfter) setForm((f) => ({ ...f, status: "published" }));
    } catch (e) {
      toast.error(e.response?.data?.message ?? e.message);
    } finally {
      setSaving(false);
    }
  }

  function handleCoverFile(file) {
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }
  function removeCover() {
    setCoverFile(null);
    setCoverPreview("");
  }

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  const isPublished = form.status === "published";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/updates")}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-section-alt border border-border text-muted-foreground hover:text-primary hover:border-primary transition-smooth"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-xl font-bold font-poppins text-foreground">
                {isEdit ? "Edit Post" : "New Post"}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isEdit ? `Editing · ${form.status}` : "Create a new blog update"}
              </p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {/* ✅ Preview uses slug, disabled until slug is available */}
            {isPublished && (
              <button
                type="button"
                disabled={!slug}
                onClick={() => navigate(`/updates/${slug}`)}
                className="btn-outline-primary flex items-center gap-2 text-sm disabled:opacity-40"
              >
                <Eye size={14} /> Preview
              </button>
            )}

            {!isPublished && (
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={saving}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
                Publish
              </button>
            )}
            {isPublished && (
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={saving}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Update
              </button>
            )}
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 mb-8 bg-section-alt border border-border rounded-xl p-1 w-fit">
          {[
            { id: "content",  icon: AlignLeft, label: "Content"  },
            { id: "seo",      icon: Search,    label: "SEO"       },
            { id: "settings", icon: Settings,  label: "Settings"  },
          ].map(({ id: tabId, icon: Icon, label }) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth
                ${activeTab === tabId
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"}`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left: main editor ── */}
          <div className="flex-1 min-w-0 space-y-6">

            {activeTab === "content" && (
              <>
                <Field label="Post Title" error={errors.title}>
                  <Input
                    value={form.title}
                    onChange={(e) => set("title")(e.target.value)}
                    placeholder="Enter a compelling title…"
                    className="text-base font-semibold"
                  />
                </Field>

                <Field label="Excerpt / Summary" error={errors.excerpt}>
                  <Textarea
                    rows={3}
                    value={form.excerpt}
                    onChange={(e) => set("excerpt")(e.target.value)}
                    placeholder="A short summary shown in post cards (max 300 chars)…"
                  />
                  <p className="text-right text-xs text-muted-foreground mt-1">
                    {form.excerpt.length}/300
                  </p>
                </Field>

                <Field label="Content (Markdown / HTML)" error={errors.content}>
                  <Textarea
                    rows={22}
                    value={form.content}
                    onChange={(e) => set("content")(e.target.value)}
                    placeholder="Write your full article here… (Markdown and HTML supported)"
                    className="font-mono text-xs leading-relaxed"
                  />
                </Field>
              </>
            )}

            {activeTab === "seo" && (
              <div className="card-portfolio p-6 space-y-5">
                <SectionLabel icon={Search} label="Search Engine Optimisation" />

                <Field label="Meta Title">
                  <Input
                    value={form.seo.metaTitle}
                    onChange={(e) => setSeo("metaTitle")(e.target.value)}
                    placeholder="Override page title for search engines"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {form.seo.metaTitle.length}/60 · Recommended ≤60 chars
                  </p>
                </Field>

                <Field label="Meta Description">
                  <Textarea
                    rows={3}
                    value={form.seo.metaDescription}
                    onChange={(e) => setSeo("metaDescription")(e.target.value)}
                    placeholder="Short description shown in search results (≤160 chars)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {form.seo.metaDescription.length}/160
                  </p>
                </Field>

                <Field label="SEO Keywords">
                  <TagInput tags={form.seo.keywords} onChange={setSeo("keywords")} />
                </Field>

                {(form.seo.metaTitle || form.title) && (
                  <div className="mt-4 p-4 bg-background border border-border rounded-xl">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-2">Search Preview</p>
                    <p className="text-blue-400 text-sm font-medium truncate">
                      {form.seo.metaTitle || form.title}
                    </p>
                    <p className="text-xs text-emerald-500 mt-0.5 truncate">
                      yoursite.com/updates/{slug || "..."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {form.seo.metaDescription || form.excerpt || "No description set."}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="card-portfolio p-6 space-y-6">
                <SectionLabel icon={Settings} label="Post Settings" />

                <Field label="Publication Status">
                  <div className="flex flex-wrap gap-2">
                    {["draft", "published", "archived"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => set("status")(s)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-smooth
                          ${form.status === s
                            ? "bg-primary text-white border-primary"
                            : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Comments">
                  <Toggle
                    checked={form.allowComments}
                    onChange={set("allowComments")}
                    label={form.allowComments ? "Comments enabled" : "Comments disabled"}
                  />
                </Field>
              </div>
            )}
          </div>

          {/* ── Right: sidebar ── */}
          <div className="w-full lg:w-[280px] shrink-0 space-y-5">

            <div className="card-portfolio p-5">
              <SectionLabel icon={ImageIcon} label="Cover Image" />
              <CoverUpload
                previewUrl={coverPreview}
                onFile={handleCoverFile}
                onRemove={removeCover}
              />
            </div>

            <div className="card-portfolio p-5">
              <SectionLabel icon={BookOpen} label="Category" />
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => set("category")(form.category === cat ? "" : cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-smooth
                      ${form.category === cat
                        ? "bg-primary text-white border-primary"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-portfolio p-5">
              <SectionLabel icon={Tag} label="Tags" />
              <TagInput tags={form.tags} onChange={set("tags")} />
            </div>

            <div className="card-portfolio p-5">
              <SectionLabel icon={FileText} label="Status" />
              <div
                className={`text-sm font-semibold px-3 py-2 rounded-xl w-fit
                  ${form.status === "published"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : form.status === "archived"
                      ? "bg-zinc-500/15 text-zinc-400"
                      : "bg-amber-500/15 text-amber-400"}`}
              >
                {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
              </div>
              {!isPublished && (
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="btn-primary w-full mt-3 flex items-center justify-center gap-2 text-sm"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
                  Publish Now
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateFormPage;