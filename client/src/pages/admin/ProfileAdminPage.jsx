import { useState, useEffect, useRef, useCallback } from "react";
import API from "../../api/axiosInstance";

// ─── TODO: Replace the showToast calls below with your toast from main.jsx ────
// e.g.  import { toast } from 'react-hot-toast'
//       then replace showToast("msg") → toast.success("msg")
//                    showToast("msg","error") → toast.error("msg")
// ─────────────────────────────────────────────────────────────────────────────

const tabs = ["Home", "About", "Social", "Footer"];

const inputCls =
  "w-full bg-[#fafff8] border border-[#d4e8d0] text-[#1a1a1a] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#138808] focus:ring-2 focus:ring-[#138808]/10 transition-all placeholder:text-[#bbb]";
const labelCls =
  "block text-[10px] uppercase tracking-[0.15em] text-[#138808] mb-1.5 font-bold";
const sectionTitleCls =
  "text-[11px] uppercase tracking-[0.2em] text-[#FF9933] font-bold mb-5 pb-2 border-b-2 border-[#FF9933]/20";

// ─── CropModal ────────────────────────────────────────────────────────────────
// shape="circle" → circular overlay + 1:1 square PNG output  (hero)
// shape="rect"   → rectangular overlay + 3:4 portrait JPEG   (about)
function CropModal({ imageSrc, shape, onCrop, onCancel }) {
  const isCircle   = shape === "circle";
  const aspectRatio = isCircle ? 1 : 3 / 4;

  const canvasRef  = useRef();
  const imageRef   = useRef();
  const [isDragging,   setIsDragging]   = useState(false);
  const [isResizing,   setIsResizing]   = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [imageLoaded,  setImageLoaded]  = useState(false);
  const dragStart = useRef(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const cropRef = useRef(crop);
  cropRef.current = crop;

  useEffect(() => {
    if (!imageLoaded || !imageRef.current) return;
    const img = imageRef.current;
    const cw = img.clientWidth;
    const ch = img.clientHeight;
    const size = Math.min(cw, ch) * 0.7;
    const w = size;
    const h = size / aspectRatio;
    setCrop({ x: (cw - Math.min(w, cw)) / 2, y: (ch - Math.min(h, ch)) / 2, w: Math.min(w, cw), h: Math.min(h, ch) });
  }, [imageLoaded, aspectRatio]);

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const handleMouseDown = (e, type, handle = null) => {
    e.preventDefault(); e.stopPropagation();
    if (type === "drag")   setIsDragging(true);
    if (type === "resize") { setIsResizing(true); setResizeHandle(handle); }
    dragStart.current = { x: e.clientX, y: e.clientY, crop: { ...cropRef.current } };
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragStart.current || !imageRef.current) return;
    const img  = imageRef.current;
    const iw   = img.clientWidth;
    const ih   = img.clientHeight;
    const dx   = e.clientX - dragStart.current.x;
    const dy   = e.clientY - dragStart.current.y;
    const prev = dragStart.current.crop;
    const MIN  = 60;

    if (isDragging) {
      setCrop((c) => ({
        ...c,
        x: clamp(prev.x + dx, 0, iw - prev.w),
        y: clamp(prev.y + dy, 0, ih - prev.h),
      }));
    }
    if (isResizing) {
      let { x, y, w, h } = prev;
      // Always lock to target aspect ratio while resizing
      if (resizeHandle === "se") { w = clamp(prev.w + dx, MIN, iw - prev.x); h = w / aspectRatio; }
      else if (resizeHandle === "sw") { w = clamp(prev.w - dx, MIN, prev.x + prev.w); h = w / aspectRatio; x = prev.x + prev.w - w; }
      else if (resizeHandle === "ne") { w = clamp(prev.w + dx, MIN, iw - prev.x); h = w / aspectRatio; y = prev.y + prev.h - h; }
      else if (resizeHandle === "nw") { w = clamp(prev.w - dx, MIN, prev.x + prev.w); h = w / aspectRatio; x = prev.x + prev.w - w; y = prev.y + prev.h - h; }
      setCrop({ x: clamp(x, 0, iw - MIN), y: clamp(y, 0, ih - MIN), w, h });
    }
  }, [isDragging, isResizing, resizeHandle, aspectRatio]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false); setIsResizing(false); setResizeHandle(null); dragStart.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup",   handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup",   handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleCrop = () => {
    const img    = imageRef.current;
    const canvas = canvasRef.current;
    const scaleX = img.naturalWidth  / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;

    const srcX = crop.x * scaleX;
    const srcY = crop.y * scaleY;
    const srcW = crop.w * scaleX;
    const srcH = crop.h * scaleY;

    // Force exact output ratio so display never re-crops
    const outputW = Math.round(srcW);
    const outputH = Math.round(outputW / aspectRatio);
    canvas.width  = outputW;
    canvas.height = outputH;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outputW, outputH);

    const mime = isCircle ? "image/png" : "image/jpeg";
    canvas.toBlob(
      (blob) => { if (blob) onCrop(new File([blob], isCircle ? "cropped.png" : "cropped.jpg", { type: mime })); },
      mime, 0.92
    );
  };

  const handles = [
    { id: "nw", style: { top: -6, left: -6,   cursor: "nw-resize" } },
    { id: "ne", style: { top: -6, right: -6,  cursor: "ne-resize" } },
    { id: "sw", style: { bottom: -6, left: -6,  cursor: "sw-resize" } },
    { id: "se", style: { bottom: -6, right: -6, cursor: "se-resize" } },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4f0e2]">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-[#FF9933] uppercase font-bold" style={{ fontFamily: "Syne, sans-serif" }}>Image Editor</p>
            <h3 className="text-sm font-black text-[#111]" style={{ fontFamily: "Syne, sans-serif" }}>
              {isCircle ? "Circular Crop — Hero" : "Portrait Crop 3:4 — About"}
            </h3>
          </div>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#ccc] hover:text-red-500 transition-colors text-lg font-bold">✕</button>
        </div>

        {/* Canvas */}
        <div className="relative bg-[#111] overflow-hidden select-none" style={{ maxHeight: "60vh" }}>
          <img
            ref={imageRef}
            src={imageSrc}
            alt="crop"
            onLoad={() => setImageLoaded(true)}
            className="w-full object-contain"
            style={{ maxHeight: "60vh", display: "block" }}
            draggable={false}
          />

          {imageLoaded && (
            <>
              {/* SVG overlay — circular hole for hero, rectangular hole for about */}
              <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
                <defs>
                  <mask id="cropMask">
                    <rect width="100%" height="100%" fill="white" />
                    {isCircle ? (
                      <ellipse
                        cx={crop.x + crop.w / 2}
                        cy={crop.y + crop.h / 2}
                        rx={crop.w / 2}
                        ry={crop.h / 2}
                        fill="black"
                      />
                    ) : (
                      <rect x={crop.x} y={crop.y} width={crop.w} height={crop.h} fill="black" />
                    )}
                  </mask>
                </defs>

                {/* Dimmed area outside the crop */}
                <rect width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#cropMask)" />

                {/* Circle border (dashed) */}
                {isCircle && (
                  <ellipse
                    cx={crop.x + crop.w / 2}
                    cy={crop.y + crop.h / 2}
                    rx={crop.w / 2}
                    ry={crop.h / 2}
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                  />
                )}

                {/* Rule-of-thirds lines inside the crop area */}
                {[1, 2].map((i) => (
                  <g key={i}>
                    <line
                      x1={crop.x + (crop.w * i) / 3} y1={crop.y}
                      x2={crop.x + (crop.w * i) / 3} y2={crop.y + crop.h}
                      stroke="rgba(255,255,255,0.18)" strokeWidth="1"
                    />
                    <line
                      x1={crop.x}          y1={crop.y + (crop.h * i) / 3}
                      x2={crop.x + crop.w} y2={crop.y + (crop.h * i) / 3}
                      stroke="rgba(255,255,255,0.18)" strokeWidth="1"
                    />
                  </g>
                ))}

                {/* Rectangle border for portrait mode */}
                {!isCircle && (
                  <rect x={crop.x} y={crop.y} width={crop.w} height={crop.h}
                    fill="none" stroke="white" strokeWidth="2"
                    style={{ filter: "drop-shadow(0 0 0 1px rgba(255,153,51,0.6))" }}
                  />
                )}
              </svg>

              {/* Invisible drag + resize target (always the bounding box) */}
              <div
                className="absolute"
                style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h, cursor: "move" }}
                onMouseDown={(e) => handleMouseDown(e, "drag")}
              >
                {/* Corner handles */}
                {handles.map(({ id, style }) => (
                  <div
                    key={id}
                    style={{
                      position: "absolute", width: 12, height: 12,
                      background: "#FF9933", border: "2px solid white",
                      borderRadius: 3, zIndex: 10, ...style,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, "resize", id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#e4f0e2] bg-[#fafff8]">
          <p className="text-xs text-[#999]">
            Drag to move · Corners to resize ·{" "}
            <span className="font-bold text-[#FF9933]">
              {isCircle ? "Circular crop → circle on site" : "3:4 portrait crop → about section"}
            </span>
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="px-4 py-2 text-xs font-bold text-[#666] border border-[#ddd] rounded-lg hover:bg-[#f5f5f5] transition-colors" style={{ fontFamily: "Syne, sans-serif" }}>Cancel</button>
            <button onClick={handleCrop} className="px-5 py-2 text-xs font-bold text-white bg-[#FF9933] rounded-lg hover:bg-[#e07d1a] transition-colors" style={{ fontFamily: "Syne, sans-serif" }}>Apply Crop</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HeroImageUpload ──────────────────────────────────────────────────────────
function HeroImageUpload({ currentUrl, onChange }) {
  const [preview, setPreview] = useState(currentUrl || null);
  const [cropSrc, setCropSrc] = useState(null);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef();

  useEffect(() => setPreview(currentUrl || null), [currentUrl]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCropSrc(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleCropDone = (file) => {
    setPreview(URL.createObjectURL(file));
    onChange("heroImage", file);
    setCropSrc(null);
  };

  return (
    <>
      {cropSrc && (
        <CropModal imageSrc={cropSrc} shape="circle" onCrop={handleCropDone} onCancel={() => setCropSrc(null)} />
      )}
      <div>
        <label className={labelCls}>Hero Image</label>
        <div className="flex flex-col items-center gap-3 py-5">
          <div style={{ position: "relative", width: 200, height: 200, flexShrink: 0 }}>
            {/* Tricolor spinning ring */}
            <div style={{
              position: "absolute", inset: -7, borderRadius: "50%",
              background: "conic-gradient(#FF9933 0deg 120deg, #ffffff 120deg 240deg, #138808 240deg 360deg)",
              animation: "triSpin 14s linear infinite",
            }} />
            {/* Clickable circle */}
            <div
              onClick={() => inputRef.current.click()}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                position: "absolute", inset: 0, zIndex: 1,
                borderRadius: "50%", overflow: "hidden",
                border: "5px solid white", background: "#f3faf3",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 64,
              }}
            >
              {preview ? (
                <img src={preview} alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", borderRadius: "50%", display: "block" }} />
              ) : (
                <span>👨‍💻</span>
              )}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "rgba(0,0,0,0.52)", opacity: hovered ? 1 : 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "opacity 0.2s", pointerEvents: "none",
              }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "white", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "Syne, sans-serif" }}>
                  {preview ? "CHANGE" : "UPLOAD"}
                </span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", lineHeight: 1.5 }}>
            Shown as a <strong>circle</strong> on homepage<br />
            Use the <strong>circular crop</strong> to frame your subject
          </p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </>
  );
}

// ─── AboutImageUpload ─────────────────────────────────────────────────────────
function AboutImageUpload({ currentUrl, onChange }) {
  const [preview, setPreview] = useState(currentUrl || null);
  const [cropSrc, setCropSrc] = useState(null);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef();

  useEffect(() => setPreview(currentUrl || null), [currentUrl]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCropSrc(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleCropDone = (file) => {
    setPreview(URL.createObjectURL(file));
    onChange("aboutProfileImage", file);
    setCropSrc(null);
  };

  return (
    <>
      {cropSrc && (
        <CropModal imageSrc={cropSrc} shape="rect" onCrop={handleCropDone} onCancel={() => setCropSrc(null)} />
      )}
      <div>
        <label className={labelCls}>Profile Image</label>
        <div className="flex flex-col items-center gap-3 py-5">
          <div style={{ position: "relative", width: 180, flexShrink: 0, paddingLeft: 14, paddingBottom: 14 }}>
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "calc(100% - 14px)", height: "calc(100% - 14px)", borderRadius: 16, border: "3px solid #FF9933", zIndex: 0 }} />
            <div style={{ position: "absolute", top: -12, right: -12, width: "52%", height: "52%", borderRadius: 12, border: "3px solid #138808", zIndex: 0 }} />
            <div
              onClick={() => inputRef.current.click()}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                position: "relative", zIndex: 1, width: "100%", aspectRatio: "3/4",
                borderRadius: 16, overflow: "hidden", background: "#f0faf0",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56,
              }}
            >
              {preview ? (
                <img src={preview} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
              ) : (
                <span>🧑‍💼</span>
              )}
              <div style={{
                position: "absolute", inset: 0, background: "rgba(0,0,0,0.52)", opacity: hovered ? 1 : 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "opacity 0.2s", pointerEvents: "none",
              }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "white", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "Syne, sans-serif", textAlign: "center", padding: "0 10px" }}>
                  {preview ? "CHANGE & CROP" : "UPLOAD & CROP"}
                </span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", lineHeight: 1.5 }}>
            Shown as a <strong>portrait rectangle</strong> in About<br />
            Crop outputs <strong>3:4</strong> — exactly what shows on site
          </p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, name, value, onChange, type = "text", rows, placeholder }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {rows
        ? <textarea rows={rows} name={name} value={value || ""} onChange={onChange} placeholder={placeholder} className={inputCls + " resize-none"} />
        : <input type={type} name={name} value={value || ""} onChange={onChange} placeholder={placeholder} className={inputCls} />
      }
    </div>
  );
}

// ─── AchievementEditor ────────────────────────────────────────────────────────
function AchievementEditor({ achievements = [], onChange }) {
  const add    = ()            => onChange([...achievements, { title: "", description: "", year: "" }]);
  const remove = (i)           => onChange(achievements.filter((_, idx) => idx !== i));
  const update = (i, key, val) => onChange(achievements.map((a, idx) => idx === i ? { ...a, [key]: val } : a));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className={labelCls + " mb-0"}>Achievements</label>
        <button type="button" onClick={add} className="text-[10px] tracking-[0.12em] text-white bg-[#138808] px-3 py-1.5 rounded-md hover:bg-[#0f6b06] transition-colors font-bold uppercase">+ Add</button>
      </div>
      {achievements.length === 0 && (
        <p className="text-xs text-[#bbb] italic py-6 text-center border-2 border-dashed border-[#e8f5e5] rounded-xl">No achievements yet. Click + Add to get started.</p>
      )}
      {achievements.map((ach, i) => (
        <div key={i} className="border border-[#e0f0dc] bg-[#fafff8] p-4 rounded-xl space-y-2.5 relative">
          <button type="button" onClick={() => remove(i)} className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-[#ccc] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors text-xs font-bold">✕</button>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-2">
              <input placeholder="Achievement title" value={ach.title || ""} onChange={(e) => update(i, "title", e.target.value)} className={inputCls} />
            </div>
            <input placeholder="Year" value={ach.year || ""} onChange={(e) => update(i, "year", e.target.value)} className={inputCls} />
          </div>
          <textarea placeholder="Description" rows={2} value={ach.description || ""} onChange={(e) => update(i, "description", e.target.value)} className={inputCls + " resize-none"} />
        </div>
      ))}
    </div>
  );
}

// ─── ProfileAdminPage ─────────────────────────────────────────────────────────
export default function ProfileAdminPage() {
  const [profile,   setProfile]   = useState(null);
  const [activeTab, setActiveTab] = useState("Home");
  const [files,     setFiles]     = useState({});
  const [saving,    setSaving]    = useState(false);
  const [loading,   setLoading]   = useState(true);

  // ── Toast state — replace with your import from main.jsx ──────────────────
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };
  // ──────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    API.get("/admin/profile")
      .then((res) => setProfile(res.data.data))
      .catch(() => showToast("Failed to load profile", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (section, key, value) =>
    setProfile((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));

  const handleNestedChange = (section, parent, key, value) =>
    setProfile((prev) => ({
      ...prev,
      [section]: { ...prev[section], [parent]: { ...prev[section]?.[parent], [key]: value } },
    }));

  const handleFileChange = (name, file) =>
    setFiles((prev) => ({ ...prev, [name]: file }));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      const flatAppend = (obj, prefix = "") => {
        for (const key in obj) {
          const val = obj[key];
          if (val === null || val === undefined) continue;
          const fieldKey = prefix ? `${prefix}[${key}]` : key;
          if (Array.isArray(val)) {
            val.forEach((item, idx) => {
              if (item && typeof item === "object") flatAppend(item, `${fieldKey}[${idx}]`);
              else fd.append(`${fieldKey}[${idx}]`, item ?? "");
            });
          } else if (typeof val === "object" && !(val instanceof File)) {
            flatAppend(val, fieldKey);
          } else {
            fd.append(fieldKey, val);
          }
        }
      };
      flatAppend(profile);
      if (files.heroImage)         fd.append("heroImage",         files.heroImage);
      if (files.aboutProfileImage) fd.append("aboutProfileImage", files.aboutProfileImage);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
          .tc-spinner { width:44px;height:44px;border-radius:50%;border:4px solid #f0f0f0;border-top-color:#FF9933;border-right-color:#fff;border-bottom-color:#138808;animation:spin 0.9s linear infinite; }
        `}</style>
        <div className="flex flex-col items-center gap-4">
          <div className="tc-spinner" />
          <p className="text-xs text-[#aaa] tracking-[0.2em] uppercase font-bold" style={{ fontFamily: "Syne, sans-serif" }}>Loading Profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6fdf6]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#f0faf0; }
        ::-webkit-scrollbar-thumb { background:#b8ddb5;border-radius:3px; }
        @keyframes slideUp    { from{transform:translateY(10px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes toastSlide { from{transform:translateX(20px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes triSpin    { to { transform: rotate(360deg); } }
        .tab-anim  { animation: slideUp 0.2s ease both; }
        .form-card { background:white;border:1px solid #e4f0e2;border-radius:16px;padding:clamp(16px,4vw,28px);box-shadow:0 2px 12px rgba(19,136,8,0.04); }
        .tab-btn   { padding:11px clamp(12px,3vw,22px);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;font-weight:800;border-bottom:3px solid transparent;margin-bottom:-1px;transition:all 0.2s;font-family:'Syne',sans-serif;background:none;border-left:none;border-right:none;border-top:none;cursor:pointer;white-space:nowrap; }
        .tab-active   { color:#FF9933;border-bottom-color:#FF9933; }
        .tab-inactive { color:#bbb; }
        .tab-inactive:hover { color:#138808; }
        .save-btn { display:inline-flex;align-items:center;gap:8px;background:#FF9933;color:white;font-family:'Syne',sans-serif;font-weight:800;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;padding:10px clamp(14px,3vw,24px);border-radius:9px;border:none;cursor:pointer;transition:background 0.2s,transform 0.15s,box-shadow 0.2s;box-shadow:0 4px 14px rgba(255,153,51,0.28);white-space:nowrap; }
        .save-btn:hover:not(:disabled) { background:#e07d1a;transform:translateY(-1px);box-shadow:0 6px 20px rgba(255,153,51,0.38); }
        .save-btn:disabled { opacity:0.5;cursor:not-allowed; }
        .tricolor-pip { width:5px;height:40px;border-radius:4px;flex-shrink:0;background:linear-gradient(to bottom,#FF9933 33%,#ffffff 33% 66%,#138808 66%);border:1px solid #ddd; }
        .toast-base { position:fixed;bottom:clamp(12px,3vw,24px);right:clamp(12px,3vw,24px);z-index:9999;display:flex;align-items:center;gap:10px;padding:13px 20px;border-radius:12px;font-size:13px;font-weight:700;letter-spacing:0.02em;box-shadow:0 8px 28px rgba(0,0,0,0.13);animation:toastSlide 0.25s ease;font-family:'Syne',sans-serif;max-width:calc(100vw - 24px); }
        .toast-success { background:#138808;color:white; }
        .toast-error   { background:#c0392b;color:white; }
        .tabs-scroll { overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none; }
        .tabs-scroll::-webkit-scrollbar { display:none; }
      `}</style>

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#e4f0e2] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="tricolor-pip" />
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.25em] text-[#FF9933] uppercase font-bold mb-0.5 hidden sm:block" style={{ fontFamily: "Syne, sans-serif" }}>Admin Panel</p>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-[#111] truncate" style={{ fontFamily: "Syne, sans-serif" }}>Profile Settings</h1>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={saving} className="save-btn flex-shrink-0">
            {saving ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving…
              </>
            ) : (
              <>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" /></svg>
                Save
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── Tabs ── */}
        <div className="tabs-scroll border-b border-[#e0ece0] mb-6 sm:mb-8 bg-white rounded-t-xl px-2 shadow-sm">
          <div className="flex min-w-max sm:min-w-0">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-btn ${activeTab === tab ? "tab-active" : "tab-inactive"}`}>{tab}</button>
            ))}
          </div>
        </div>

        <div className="tab-anim" key={activeTab}>

          {/* ── HOME TAB ── */}
          {activeTab === "Home" && (
            <div className="space-y-5 sm:space-y-6">
              <div className="form-card">
                <p className={sectionTitleCls}>Hero Section</p>
                <div className="space-y-4 sm:space-y-5">
                  <HeroImageUpload currentUrl={profile?.home?.heroImage} onChange={handleFileChange} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Name"        value={profile?.home?.name}    placeholder="Your full name"            onChange={(e) => handleChange("home", "name",    e.target.value)} />
                    <Field label="Title / Role" value={profile?.home?.title}   placeholder="e.g. Full-Stack Developer" onChange={(e) => handleChange("home", "title",   e.target.value)} />
                  </div>
                  <Field label="Tagline" value={profile?.home?.tagline} placeholder="A short punchy tagline…" onChange={(e) => handleChange("home", "tagline", e.target.value)} />
                </div>
              </div>
              <div className="form-card">
                <p className={sectionTitleCls}>About Preview (Homepage)</p>
                <Field label="Short Introduction" value={profile?.home?.aboutPreview?.shortIntro} rows={4} placeholder="Brief intro shown on the homepage about section…" onChange={(e) => handleNestedChange("home", "aboutPreview", "shortIntro", e.target.value)} />
              </div>
            </div>
          )}

          {/* ── ABOUT TAB ── */}
          {activeTab === "About" && (
            <div className="space-y-5 sm:space-y-6">
              <div className="form-card">
                <p className={sectionTitleCls}>Identity</p>
                <div className="space-y-4 sm:space-y-5">
                  <AboutImageUpload currentUrl={profile?.about?.profileImage} onChange={handleFileChange} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" value={profile?.about?.name}  placeholder="Your full name"           onChange={(e) => handleChange("about", "name",  e.target.value)} />
                    <Field label="Title"     value={profile?.about?.title} placeholder="Your professional title"  onChange={(e) => handleChange("about", "title", e.target.value)} />
                  </div>
                  <Field label="Biography" value={profile?.about?.biography} rows={6} placeholder="Write your biography…" onChange={(e) => handleChange("about", "biography", e.target.value)} />
                </div>
              </div>
              <div className="form-card">
                <p className={sectionTitleCls}>Philosophy</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Vision" value={profile?.about?.vision} rows={4} placeholder="Your long-term vision…" onChange={(e) => handleChange("about", "vision", e.target.value)} />
                  <Field label="Goals"  value={profile?.about?.goals}  rows={4} placeholder="Your current goals…"    onChange={(e) => handleChange("about", "goals",  e.target.value)} />
                </div>
              </div>
              <div className="form-card">
                <p className={sectionTitleCls}>Achievements</p>
                <AchievementEditor achievements={profile?.about?.achievements || []} onChange={(val) => handleChange("about", "achievements", val)} />
              </div>
            </div>
          )}

          {/* ── SOCIAL TAB ── */}
          {activeTab === "Social" && (
            <div className="form-card">
              <p className={sectionTitleCls}>Social Links</p>
              <div className="space-y-4">
                {[
                  { key:"twitter",   label:"Twitter / X",     icon:"𝕏",  placeholder:"https://twitter.com/username"    },
                  { key:"github",    label:"GitHub",           icon:"⌥",  placeholder:"https://github.com/username"     },
                  { key:"linkedin",  label:"LinkedIn",         icon:"in", placeholder:"https://linkedin.com/in/username" },
                  { key:"instagram", label:"Instagram",        icon:"◈",  placeholder:"https://instagram.com/username"  },
                  { key:"website",   label:"Personal Website", icon:"⌘",  placeholder:"https://yourwebsite.com"         },
                ].map(({ key, label, icon, placeholder }) => (
                  <div key={key} className="flex items-end gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 mb-0.5 flex items-center justify-center rounded-lg bg-[#fff3e6] border border-[#ffd9a8] text-[#FF9933] font-mono font-bold text-sm">{icon}</div>
                    <div className="flex-1 min-w-0">
                      <label className={labelCls}>{label}</label>
                      <input type="url" value={profile?.socialLinks?.[key] || ""} placeholder={placeholder} onChange={(e) => handleChange("socialLinks", key, e.target.value)} className={inputCls} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FOOTER TAB ── */}
          {activeTab === "Footer" && (
            <div className="form-card">
              <p className={sectionTitleCls}>Footer Details</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Contact Email" type="email" value={profile?.footer?.contactEmail} placeholder="you@email.com"   onChange={(e) => handleChange("footer", "contactEmail", e.target.value)} />
                  <Field label="Contact Phone" type="tel"   value={profile?.footer?.contactPhone} placeholder="+91 00000 00000" onChange={(e) => handleChange("footer", "contactPhone", e.target.value)} />
                </div>
                <Field label="Address"        value={profile?.footer?.address}       rows={2} placeholder="City / address…"                                                onChange={(e) => handleChange("footer", "address",       e.target.value)} />
                <Field label="Copyright Text" value={profile?.footer?.copyrightText}          placeholder={`© ${new Date().getFullYear()} Your Name. All rights reserved.`} onChange={(e) => handleChange("footer", "copyrightText", e.target.value)} />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Toast — swap this block with your toast from main.jsx ── */}
      {toast && (
        <div className={`toast-base ${toast.type === "error" ? "toast-error" : "toast-success"}`}>
          <span className="flex-shrink-0">{toast.type === "error" ? "✕" : "✓"}</span>
          <span className="truncate">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}