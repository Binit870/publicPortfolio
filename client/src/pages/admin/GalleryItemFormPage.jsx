import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Upload, X, Image } from "lucide-react";
import { addGalleryItemApi, updateGalleryItemApi, getGalleryItemsApi, getGalleriesApi } from "../../api/gallery.api";
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
      className="w-full px-4 py-2.5 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
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
  description: "",
  mediaType: "image",
  category: "",
  tags: "",
  altText: "",
  hoverText: "",
  lightboxEnabled: true,
  order: 0,
  galleryId: "",
};

const GalleryItemFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(defaultForm);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [existingMediaUrl, setExistingMediaUrl] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    fetchGalleries();
    if (isEdit) fetchItem();
  }, [id]);

  const fetchGalleries = async () => {
    try {
      const res = await getGalleriesApi();
      setGalleries(res.data || []);
    } catch {
      // galleries optional
    }
  };

  const fetchItem = async () => {
    try {
      const res = await getGalleryItemsApi({ limit: 200 });
      const item = (res.data.data || []).find((i) => i._id === id);
      if (item) {
        setForm({
          title: item.title || "",
          description: item.description || "",
          mediaType: item.mediaType || "image",
          category: item.category || "",
          tags: item.tags?.join(", ") || "",
          altText: item.altText || "",
          hoverText: item.hoverText || "",
          lightboxEnabled: item.lightboxEnabled ?? true,
          order: item.order || 0,
          galleryId: "",
        });
        setExistingMediaUrl(item.mediaUrl || null);
        setMediaPreview(item.thumbnail || item.mediaUrl || null);
      }
    } catch {
      toast.error("Failed to load item");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(existingMediaUrl);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!isEdit && !mediaFile) return toast.error("Media file is required");

    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description || "");
      payload.append("mediaType", form.mediaType);
      payload.append("category", form.category || "");
      payload.append("tags", JSON.stringify(
        form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : []
      ));
      payload.append("altText", form.altText || "");
      payload.append("hoverText", form.hoverText || "");
      payload.append("lightboxEnabled", form.lightboxEnabled);
      payload.append("order", form.order || 0);
      if (form.galleryId) payload.append("galleryId", form.galleryId);
      if (mediaFile) payload.append("media", mediaFile);

      if (isEdit) {
        await updateGalleryItemApi(id, payload);
        toast.success("Item updated successfully");
      } else {
        await addGalleryItemApi(payload);
        toast.success("Item added successfully");
      }

      navigate("/admin/gallery");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save item");
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
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate("/admin/gallery")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth mb-3"
            >
              <ArrowLeft size={14} /> Back to Gallery
            </button>
            <h1 className="text-2xl font-bold font-poppins text-foreground">
              {isEdit ? "Edit Gallery Item" : "Add Gallery Item"}
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
            {saving ? "Saving..." : isEdit ? "Update" : "Add Item"}
          </button>
        </div>

        <div className="space-y-6">

          {/* Media Upload */}
          <SectionCard title="Media Upload">
            <div className="space-y-4">

              {/* Media type selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-primary tracking-[0.15em] uppercase">
                  Media Type
                </label>
                <div className="flex gap-3">
                  {["image", "video", "gif"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setForm((prev) => ({ ...prev, mediaType: type }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-smooth capitalize ${
                        form.mediaType === type
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload area */}
              <div
                className="border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer hover:border-primary transition-smooth"
                onClick={() => fileInputRef.current?.click()}
              >
                {mediaPreview ? (
                  <div className="relative">
                    {form.mediaType === "image" || form.mediaType === "gif" ? (
                      <img
                        src={mediaPreview}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-xl object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎬</div>
                          <p className="text-sm">Video selected</p>
                        </div>
                      </div>
                    )}
                    {mediaFile && (
                      <button
                        onClick={(e) => { e.stopPropagation(); clearMedia(); }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:border-red-300 hover:text-red-600 transition-smooth"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="py-6">
                    <Upload size={32} className="mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-foreground">
                      Click to upload {form.mediaType}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {form.mediaType === "image"
                        ? "JPG, PNG, WEBP up to 10MB"
                        : form.mediaType === "video"
                        ? "MP4, MOV up to 50MB"
                        : "GIF up to 20MB"}
                    </p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept={
                  form.mediaType === "image"
                    ? "image/*"
                    : form.mediaType === "video"
                    ? "video/*"
                    : "image/gif"
                }
                className="hidden"
                onChange={handleFileChange}
              />

              {isEdit && existingMediaUrl && !mediaFile && (
                <p className="text-xs text-muted-foreground">
                  Current media will be kept unless you upload a new file.
                </p>
              )}
            </div>
          </SectionCard>

          {/* Basic Info */}
          <SectionCard title="Basic Information">
            <div className="space-y-4">
              <InputField
                label="Title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Item title"
                required
              />
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-primary tracking-[0.15em] uppercase">
                  Description
                </label>
                <textarea
                  value={form.description || ""}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Short description..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <InputField
                  label="Category"
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  placeholder="Nature, Events, Architecture..."
                />
                <InputField
                  label="Tags (comma separated)"
                  value={form.tags}
                  onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                  placeholder="landscape, sunset, nature..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <InputField
                  label="Alt Text"
                  value={form.altText}
                  onChange={(e) => setForm((p) => ({ ...p, altText: e.target.value }))}
                  placeholder="Image description for accessibility"
                />
                <InputField
                  label="Hover Text"
                  value={form.hoverText}
                  onChange={(e) => setForm((p) => ({ ...p, hoverText: e.target.value }))}
                  placeholder="Text shown on hover"
                />
              </div>
              <InputField
                label="Order"
                type="number"
                value={form.order}
                onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
          </SectionCard>

          {/* Gallery Assignment */}
          <SectionCard title="Assign to Gallery">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-primary tracking-[0.15em] uppercase">
                Gallery (optional)
              </label>
              <select
                value={form.galleryId}
                onChange={(e) => setForm((p) => ({ ...p, galleryId: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">No gallery assigned</option>
                {galleries.map((g) => (
                  <option key={g._id} value={g._id}>{g.title}</option>
                ))}
              </select>
            </div>
          </SectionCard>

          {/* Settings */}
          <SectionCard title="Settings">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Enable Lightbox</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Allow clicking to open full view
                </p>
              </div>
              <button
                onClick={() => setForm((p) => ({ ...p, lightboxEnabled: !p.lightboxEnabled }))}
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-colors ${
                  form.lightboxEnabled
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {form.lightboxEnabled ? "Enabled" : "Disabled"}
              </button>
            </div>
          </SectionCard>

          {/* Save */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving..." : isEdit ? "Update Item" : "Add Item"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default GalleryItemFormPage;