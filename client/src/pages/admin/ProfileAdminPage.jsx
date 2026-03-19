import { useState, useEffect, useRef } from "react";
import API from "../../api/axiosInstance"; // ✅ uses VITE_API_URL/api base — adjust path as needed

const tabs = ["Home", "About", "Social", "Footer"];

const inputCls =
  "w-full bg-[#fafff8] border border-[#d4e8d0] text-[#1a1a1a] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#138808] focus:ring-2 focus:ring-[#138808]/10 transition-all placeholder:text-[#bbb]";
const labelCls =
  "block text-[10px] uppercase tracking-[0.15em] text-[#138808] mb-1.5 font-bold";
const sectionTitleCls =
  "text-[11px] uppercase tracking-[0.2em] text-[#FF9933] font-bold mb-5 pb-2 border-b-2 border-[#FF9933]/20";

// ─── ImageUploadField ─────────────────────────────────────────────────────────
function ImageUploadField({ label, name, currentUrl, onChange }) {
  const [preview, setPreview] = useState(currentUrl || null);
  const inputRef = useRef();

  useEffect(() => setPreview(currentUrl || null), [currentUrl]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(name, file);
  };

  return (
    <div className="space-y-2">
      <label className={labelCls}>{label}</label>
      <div
        onClick={() => inputRef.current.click()}
        className="relative w-full h-40 border-2 border-dashed border-[#d4e8d0] rounded-xl overflow-hidden cursor-pointer group hover:border-[#138808] transition-colors bg-[#fafff8]"
      >
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <svg width="28" height="28" fill="none" stroke="#138808" strokeWidth="1.5" viewBox="0 0 24 24" opacity="0.5">
              <path d="M4 16l4-4 4 4 4-6 4 6" />
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            <span className="text-xs tracking-widest font-bold text-[#138808]/60">CLICK TO UPLOAD</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-xs text-white tracking-widest font-bold bg-[#FF9933] px-3 py-1.5 rounded-md">
            CHANGE IMAGE
          </span>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, name, value, onChange, type = "text", rows, placeholder }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {rows ? (
        <textarea
          rows={rows}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={inputCls + " resize-none"}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={inputCls}
        />
      )}
    </div>
  );
}

// ─── AchievementEditor ────────────────────────────────────────────────────────
function AchievementEditor({ achievements = [], onChange }) {
  const add = () => onChange([...achievements, { title: "", description: "", year: "" }]);
  const remove = (i) => onChange(achievements.filter((_, idx) => idx !== i));
  const update = (i, key, val) =>
    onChange(achievements.map((a, idx) => (idx === i ? { ...a, [key]: val } : a)));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className={labelCls + " mb-0"}>Achievements</label>
        <button
          type="button"
          onClick={add}
          className="text-[10px] tracking-[0.12em] text-white bg-[#138808] px-3 py-1.5 rounded-md hover:bg-[#0f6b06] transition-colors font-bold uppercase"
        >
          + Add
        </button>
      </div>

      {achievements.length === 0 && (
        <p className="text-xs text-[#bbb] italic py-6 text-center border-2 border-dashed border-[#e8f5e5] rounded-xl">
          No achievements yet. Click + Add to get started.
        </p>
      )}

      {achievements.map((ach, i) => (
        <div key={i} className="border border-[#e0f0dc] bg-[#fafff8] p-4 rounded-xl space-y-2.5 relative">
          <button
            type="button"
            onClick={() => remove(i)}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-[#ccc] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors text-xs font-bold"
          >✕</button>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <input placeholder="Achievement title" value={ach.title || ""} onChange={(e) => update(i, "title", e.target.value)} className={inputCls} />
            </div>
            <input placeholder="Year" value={ach.year || ""} onChange={(e) => update(i, "year", e.target.value)} className={inputCls} />
          </div>
          <textarea
            placeholder="Description"
            rows={2}
            value={ach.description || ""}
            onChange={(e) => update(i, "description", e.target.value)}
            className={inputCls + " resize-none"}
          />
        </div>
      ))}
    </div>
  );
}

// ─── ProfileAdminPage ─────────────────────────────────────────────────────────
export default function ProfileAdminPage() {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("Home");
  const [files, setFiles] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ GET /api/admin/profile  (base already has /api)
    API.get("/admin/profile")
      .then((res) => setProfile(res.data.data))
      .catch(() => showToast("Failed to load profile", "error"))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (section, key, value) =>
    setProfile((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));

  const handleNestedChange = (section, parent, key, value) =>
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: { ...prev[section]?.[parent], [key]: value },
      },
    }));

  const handleFileChange = (name, file) =>
    setFiles((prev) => ({ ...prev, [name]: file }));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const fd = new FormData();

      // Flatten nested profile object into FormData dot-notation keys
      const flatAppend = (obj, prefix = "") => {
        for (const key in obj) {
          const val = obj[key];
          if (val === null || val === undefined) continue;
          const fieldKey = prefix ? `${prefix}[${key}]` : key;
          if (Array.isArray(val)) {
            val.forEach((item, idx) => {
              if (item && typeof item === "object") {
                flatAppend(item, `${fieldKey}[${idx}]`);
              } else {
                fd.append(`${fieldKey}[${idx}]`, item ?? "");
              }
            });
          } else if (typeof val === "object" && !(val instanceof File)) {
            flatAppend(val, fieldKey);
          } else {
            fd.append(fieldKey, val);
          }
        }
      };

      flatAppend(profile);
      if (files.heroImage) fd.append("heroImage", files.heroImage);
      if (files.aboutProfileImage) fd.append("aboutProfileImage", files.aboutProfileImage);

      // ✅ PATCH /api/admin/profile
      // ⚠️ Do NOT set Content-Type manually — axios auto-sets multipart/form-data
      // with the correct boundary when the body is FormData. Setting it manually
      // overwrites the Authorization header injected by the interceptor → 401.
      const res = await API.patch("/admin/profile", fd);

      setProfile(res.data.data);
      setFiles({});
      showToast("Profile saved successfully");
    } catch (e) {
      showToast(e?.response?.data?.message || e.message || "Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
          .tc-spinner {
            width: 44px; height: 44px; border-radius: 50%;
            border: 4px solid #f0f0f0;
            border-top-color: #FF9933;
            border-right-color: #ffffff;
            border-bottom-color: #138808;
            animation: spin 0.9s linear infinite;
          }
        `}</style>
        <div className="flex flex-col items-center gap-4">
          <div className="tc-spinner" />
          <p className="text-xs text-[#aaa] tracking-[0.2em] uppercase font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
            Loading Profile…
          </p>
        </div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f6fdf6]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f0faf0; }
        ::-webkit-scrollbar-thumb { background: #b8ddb5; border-radius: 3px; }
        @keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes toastSlide { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .tab-anim { animation: slideUp 0.2s ease both; }
        .form-card {
          background: white;
          border: 1px solid #e4f0e2;
          border-radius: 16px;
          padding: 28px 28px 24px;
          box-shadow: 0 2px 12px rgba(19,136,8,0.04);
        }
        .tab-btn {
          padding: 11px 22px;
          font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
          font-weight: 800; border-bottom: 3px solid transparent;
          margin-bottom: -1px; transition: all 0.2s;
          font-family: 'Syne', sans-serif; background: none; border-left: none; border-right: none; border-top: none; cursor: pointer;
        }
        .tab-active  { color: #FF9933; border-bottom-color: #FF9933; }
        .tab-inactive { color: #bbb; }
        .tab-inactive:hover { color: #138808; }
        .save-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #FF9933; color: white;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 10px 24px; border-radius: 9px; border: none; cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(255,153,51,0.28);
        }
        .save-btn:hover:not(:disabled) { background: #e07d1a; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,153,51,0.38); }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .tricolor-pip {
          width: 5px; height: 40px; border-radius: 4px; flex-shrink: 0;
          background: linear-gradient(to bottom, #FF9933 33%, #ffffff 33% 66%, #138808 66%);
          border: 1px solid #ddd;
        }
        .toast-base {
          position: fixed; bottom: 24px; right: 24px; z-index: 9999;
          display: flex; align-items: center; gap: 10px;
          padding: 13px 20px; border-radius: 12px;
          font-size: 13px; font-weight: 700; letter-spacing: 0.02em;
          box-shadow: 0 8px 28px rgba(0,0,0,0.13);
          animation: toastSlide 0.25s ease;
          font-family: 'Syne', sans-serif;
        }
        .toast-success { background: #138808; color: white; }
        .toast-error   { background: #c0392b; color: white; }
      `}</style>

      {/* ── Header ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#e4f0e2] shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="tricolor-pip" />
            <div>
              <p className="text-[10px] tracking-[0.25em] text-[#FF9933] uppercase font-bold mb-0.5" style={{ fontFamily: "Syne, sans-serif" }}>
                Admin Panel
              </p>
              <h1 className="text-lg font-black tracking-tight text-[#111]" style={{ fontFamily: "Syne, sans-serif" }}>
                Profile Settings
              </h1>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={saving} className="save-btn">
            {saving ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving…
              </>
            ) : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* ── Tabs ── */}
        <div className="flex border-b border-[#e0ece0] mb-8 bg-white rounded-t-xl px-2 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn ${activeTab === tab ? "tab-active" : "tab-inactive"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div className="tab-anim" key={activeTab}>

          {/* HOME */}
          {activeTab === "Home" && (
            <div className="space-y-6">
              <div className="form-card">
                <p className={sectionTitleCls}>Hero Section</p>
                <div className="space-y-5">
                  <ImageUploadField label="Hero Image" name="heroImage" currentUrl={profile?.home?.heroImage} onChange={handleFileChange} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Name" value={profile?.home?.name} placeholder="Your full name" onChange={(e) => handleChange("home", "name", e.target.value)} />
                    <Field label="Title / Role" value={profile?.home?.title} placeholder="e.g. Full-Stack Developer" onChange={(e) => handleChange("home", "title", e.target.value)} />
                  </div>
                  <Field label="Tagline" value={profile?.home?.tagline} placeholder="A short punchy tagline…" onChange={(e) => handleChange("home", "tagline", e.target.value)} />
                </div>
              </div>

              <div className="form-card">
                <p className={sectionTitleCls}>About Preview (Homepage)</p>
                <Field
                  label="Short Introduction"
                  value={profile?.home?.aboutPreview?.shortIntro}
                  rows={4}
                  placeholder="Brief intro shown on the homepage about section…"
                  onChange={(e) => handleNestedChange("home", "aboutPreview", "shortIntro", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ABOUT */}
          {activeTab === "About" && (
            <div className="space-y-6">
              <div className="form-card">
                <p className={sectionTitleCls}>Identity</p>
                <div className="space-y-5">
                  <ImageUploadField label="Profile Image" name="aboutProfileImage" currentUrl={profile?.about?.profileImage} onChange={handleFileChange} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Full Name" value={profile?.about?.name} placeholder="Your full name" onChange={(e) => handleChange("about", "name", e.target.value)} />
                    <Field label="Title" value={profile?.about?.title} placeholder="Your professional title" onChange={(e) => handleChange("about", "title", e.target.value)} />
                  </div>
                  <Field label="Biography" value={profile?.about?.biography} rows={6} placeholder="Write your biography…" onChange={(e) => handleChange("about", "biography", e.target.value)} />
                </div>
              </div>

              <div className="form-card">
                <p className={sectionTitleCls}>Philosophy</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Vision" value={profile?.about?.vision} rows={4} placeholder="Your long-term vision…" onChange={(e) => handleChange("about", "vision", e.target.value)} />
                  <Field label="Goals" value={profile?.about?.goals} rows={4} placeholder="Your current goals…" onChange={(e) => handleChange("about", "goals", e.target.value)} />
                </div>
              </div>

              <div className="form-card">
                <p className={sectionTitleCls}>Achievements</p>
                <AchievementEditor
                  achievements={profile?.about?.achievements || []}
                  onChange={(val) => handleChange("about", "achievements", val)}
                />
              </div>
            </div>
          )}

          {/* SOCIAL */}
          {activeTab === "Social" && (
            <div className="form-card">
              <p className={sectionTitleCls}>Social Links</p>
              <div className="space-y-4">
                {[
                  { key: "twitter",   label: "Twitter / X",      icon: "𝕏",  placeholder: "https://twitter.com/username" },
                  { key: "github",    label: "GitHub",           icon: "⌥",  placeholder: "https://github.com/username" },
                  { key: "linkedin",  label: "LinkedIn",         icon: "in", placeholder: "https://linkedin.com/in/username" },
                  { key: "instagram", label: "Instagram",        icon: "◈",  placeholder: "https://instagram.com/username" },
                  { key: "website",   label: "Personal Website", icon: "⌘",  placeholder: "https://yourwebsite.com" },
                ].map(({ key, label, icon, placeholder }) => (
                  <div key={key} className="flex items-end gap-3">
                    <div className="w-10 h-10 flex-shrink-0 mb-0.5 flex items-center justify-center rounded-lg bg-[#fff3e6] border border-[#ffd9a8] text-[#FF9933] font-mono font-bold text-sm">
                      {icon}
                    </div>
                    <div className="flex-1">
                      <label className={labelCls}>{label}</label>
                      <input
                        type="url"
                        value={profile?.socialLinks?.[key] || ""}
                        placeholder={placeholder}
                        onChange={(e) => handleChange("socialLinks", key, e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FOOTER */}
          {activeTab === "Footer" && (
            <div className="form-card">
              <p className={sectionTitleCls}>Footer Details</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Contact Email" type="email" value={profile?.footer?.contactEmail} placeholder="you@email.com" onChange={(e) => handleChange("footer", "contactEmail", e.target.value)} />
                  <Field label="Contact Phone" type="tel" value={profile?.footer?.contactPhone} placeholder="+91 00000 00000" onChange={(e) => handleChange("footer", "contactPhone", e.target.value)} />
                </div>
                <Field label="Address" value={profile?.footer?.address} rows={2} placeholder="City / address…" onChange={(e) => handleChange("footer", "address", e.target.value)} />
                <Field
                  label="Copyright Text"
                  value={profile?.footer?.copyrightText}
                  placeholder={`© ${new Date().getFullYear()} Your Name. All rights reserved.`}
                  onChange={(e) => handleChange("footer", "copyrightText", e.target.value)}
                />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`toast-base ${toast.type === "error" ? "toast-error" : "toast-success"}`}>
          <span>{toast.type === "error" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}