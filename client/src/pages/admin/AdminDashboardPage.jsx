import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import API from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

/* ─────────────── THEME ─────────────── */
const T = {
  saffron:     "#FF9933",
  saffronLight:"#FFF3E6",
  saffronMid:  "#FFD9AA",
  green:       "#138808",
  greenLight:  "#E6F4E6",
  greenMid:    "#A8D5A2",
  white:       "#FFFFFF",
  offWhite:    "#FAFAF8",
  bg:          "#FDF8F2",
  surface:     "#FFFFFF",
  border:      "#EDE8DF",
  borderStrong:"#D9CFC0",
  muted:       "#9A8F7E",
  text:        "#1A1208",
  textSub:     "#6B5E4A",
};

/*
  ENDPOINTS (matched exactly to your route files):
  GET /admin/blogs/      → blog.admin.routes    → router.get("/")
  GET /admin/events/     → event.admin.routes   → router.get("/")
  GET /admin/messages/   → message.admin.routes → router.get("/")
  GET /gallery/items     → public gallery route → router.get("/items")
*/
const statConfigs = [
  {
    key: "blogs",
    label: "Blogs",
    endpoint: "/admin/blogs/",
    subStats: [
      { label: "Published", endpoint: "/admin/blogs/?status=published" },
      { label: "Draft",     endpoint: "/admin/blogs/?status=draft"     },
      { label: "Archived",  endpoint: "/admin/blogs/?status=archived"  },
    ],
    color: T.saffron, light: T.saffronLight, mid: T.saffronMid,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    key: "events",
    label: "Events",
    endpoint: "/admin/events/",
    subStats: [
      { label: "Published", endpoint: "/admin/events/?status=Published" },
      { label: "Draft",     endpoint: "/admin/events/?status=Draft"     },
      { label: "Completed", endpoint: "/admin/events/?status=Completed" },
      { label: "Cancelled", endpoint: "/admin/events/?status=Cancelled" },
    ],
    color: T.green, light: T.greenLight, mid: T.greenMid,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    key: "gallery",
    label: "Gallery",
    endpoint: "/gallery/items",
    subStats: [],
    color: T.saffron, light: T.saffronLight, mid: T.saffronMid,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    key: "messages",
    label: "Messages",
    endpoint: "/admin/messages/",
    subStats: [
      { label: "Unread", endpoint: "/admin/messages/?isRead=false" },
      { label: "Read",   endpoint: "/admin/messages/?isRead=true"  },
    ],
    color: T.green, light: T.greenLight, mid: T.greenMid,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

/* ─────────────── FETCH HELPER ─────────────── */
async function fetchCount(endpoint) {
  // append limit=1 to reduce payload — we only need `total` from paginatedResponse
  const sep = endpoint.includes("?") ? "&" : "?";
  const { data } = await API.get(`${endpoint}${sep}limit=1`);
  // paginatedResponse shape: { data: [...], total, page, limit, totalPages }
  return data?.data?.pagination?.total ?? 0;
}

/* ─────────────── SHIMMER ─────────────── */
function Shimmer({ w = "100%", h = "1rem", r = "5px" }) {
  return (
    <span style={{
      display: "inline-block", width: w, height: h, borderRadius: r,
      background: `linear-gradient(90deg, ${T.saffronLight} 25%, ${T.saffronMid} 50%, ${T.saffronLight} 75%)`,
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }} />
  );
}

/* ─────────────── STAT CARD ─────────────── */
function StatCard({ cfg, data, loading, index }) {
  const [hovered, setHovered] = useState(false);
  const { total, sub } = data || {};

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:        hovered ? cfg.light : T.surface,
        borderTopWidth:    "3px",
        borderRightWidth:  "1.5px",
        borderBottomWidth: "1.5px",
        borderLeftWidth:   "1.5px",
        borderStyle:       "solid",
        borderColor:       hovered ? cfg.color + "66" : T.border,
        borderTopColor:    cfg.color,
        borderRadius:      "14px",
        padding:           "1.5rem",
        position:          "relative",
        overflow:          "hidden",
        transition:        "all 0.22s ease",
        boxShadow:         hovered
          ? `0 8px 28px ${cfg.color}22, 0 2px 8px rgba(0,0,0,0.06)`
          : "0 1px 4px rgba(0,0,0,0.05)",
        animation:         "fadeUp 0.45s ease both",
        animationDelay:    `${index * 85}ms`,
        cursor:            "default",
      }}
    >
      {/* Corner glow */}
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 100, height: 100, borderRadius: "50%",
        background: cfg.color,
        opacity: hovered ? 0.08 : 0.04,
        transition: "opacity 0.22s",
        pointerEvents: "none",
      }} />

      {/* Label + Icon */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: "1rem",
      }}>
        <span style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "0.72rem", fontWeight: 700,
          letterSpacing: "0.13em", textTransform: "uppercase",
          color: T.muted,
        }}>{cfg.label}</span>
        <div style={{
          width: 38, height: 38, borderRadius: "10px",
          background: cfg.light,
          borderWidth: "1.5px", borderStyle: "solid", borderColor: cfg.mid,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: cfg.color,
          transition: "transform 0.2s",
          transform: hovered ? "scale(1.1)" : "scale(1)",
        }}>{cfg.icon}</div>
      </div>

      {/* Total */}
      <div style={{ marginBottom: cfg.subStats.length > 0 ? "1rem" : 0 }}>
        {loading ? (
          <Shimmer w="72px" h="2.6rem" r="7px" />
        ) : total === null || total === undefined ? (
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "2rem", color: T.muted }}>—</span>
        ) : (
          <span style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "2.8rem", fontWeight: 700,
            color: cfg.color, lineHeight: 1, letterSpacing: "-0.02em",
          }}>
            {Number(total).toLocaleString()}
          </span>
        )}
      </div>

      {/* Sub-stat pills */}
      {cfg.subStats.length > 0 && (
        <div style={{
          borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: T.border,
          paddingTop: "0.85rem",
          display: "flex", flexWrap: "wrap", gap: "0.45rem",
        }}>
          {cfg.subStats.map((s) => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", gap: "0.35rem",
              background: T.offWhite,
              borderWidth: "1px", borderStyle: "solid", borderColor: T.borderStrong,
              borderRadius: "6px", padding: "0.25rem 0.6rem",
            }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.62rem", color: T.muted,
                textTransform: "uppercase", letterSpacing: "0.05em",
              }}>{s.label}</span>
              <span style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "0.88rem", fontWeight: 700, color: cfg.color,
              }}>
                {loading
                  ? <Shimmer w="24px" h="0.8rem" r="3px" />
                  : Number(sub?.[s.label] ?? 0).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────── MAIN PAGE ─────────────── */
export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();

  const [stats, setStats]       = useState({});
  const [loading, setLoading]   = useState(true);
  const [spinning, setSpinning] = useState(false);

  const loadStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setSpinning(true);
      toast.loading("Refreshing dashboard…", { id: "dash" });
    } else {
      setLoading(true);
    }

    let hasError = false;
    const result = {};

    await Promise.all(
      statConfigs.map(async (cfg) => {
        try {
          const total = await fetchCount(cfg.endpoint);
          const sub = {};
          await Promise.all(
            cfg.subStats.map(async (s) => {
              try {
                sub[s.label] = await fetchCount(s.endpoint);
              } catch {
                sub[s.label] = 0;
                hasError = true;
              }
            })
          );
          result[cfg.key] = { total, sub };
        } catch (err) {
          console.error(`Failed to fetch ${cfg.key}:`, err?.response?.status, err?.response?.data);
          result[cfg.key] = { total: null, sub: {} };
          hasError = true;
        }
      })
    );

    setStats(result);
    setLoading(false);
    setSpinning(false);

    if (isRefresh) {
      toast[hasError ? "error" : "success"](
        hasError ? "Some stats failed to refresh." : "Dashboard refreshed!",
        { id: "dash" }
      );
    } else {
      if (hasError) toast.error("Some stats could not be fetched.");
      else toast.success("Dashboard loaded successfully!");
    }
  }, []);

  // Only fire after AuthContext confirms the user is logged in
  useEffect(() => {
    if (!authLoading && user) {
      loadStats(false);
    }
  }, [authLoading, user, loadStats]);

  const now = new Date();

  if (authLoading) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: T.bg,
        backgroundImage: `
          radial-gradient(ellipse 60% 40% at 0% 0%,   #FF993312 0%, transparent 50%),
          radial-gradient(ellipse 50% 35% at 100% 100%, #13880810 0%, transparent 50%)
        `,
        color: T.text,
        fontFamily: "'DM Sans', sans-serif",
        padding: "2rem clamp(1rem, 5vw, 3rem)",
      }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: "1rem", marginBottom: "1.5rem",
          animation: "fadeUp 0.4s ease both",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.4rem" }}>
              {/* Tricolor flag pin */}
              <div style={{ display: "flex", flexDirection: "column", gap: "3px", flexShrink: 0 }}>
                {[T.saffron, T.white, T.green].map((c, i) => (
                  <div key={i} style={{
                    width: 22, height: 5, background: c, borderRadius: "2px",
                    ...(i === 1 && {
                      borderWidth: "1px", borderStyle: "solid", borderColor: T.borderStrong,
                    }),
                  }} />
                ))}
              </div>
              <h1 style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "clamp(1.7rem, 4vw, 2.3rem)",
                fontWeight: 700, letterSpacing: "0.05em", lineHeight: 1,
              }}>
                <span style={{ color: T.saffron }}>ADMIN</span>
                {" "}
                <span style={{ color: T.green }}>DASHBOARD</span>
              </h1>
            </div>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem", color: T.muted, letterSpacing: "0.05em",
            }}>
              {now.toLocaleDateString("en-IN", {
                weekday: "short", year: "numeric", month: "short", day: "numeric",
              })}
              {" · "}
              {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              {user?.name && (
                <span style={{ marginLeft: "0.6rem", color: T.green }}>· {user.name}</span>
              )}
            </p>
          </div>

          {/* Refresh button */}
          <button
            onClick={() => loadStats(true)}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.55rem 1.2rem",
              background: T.white,
              borderWidth: "1.5px", borderStyle: "solid", borderColor: T.borderStrong,
              borderRadius: "9px", color: T.textSub, cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem", letterSpacing: "0.05em",
              transition: "all 0.18s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.saffron;
              e.currentTarget.style.color = T.saffron;
              e.currentTarget.style.background = T.saffronLight;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.borderStrong;
              e.currentTarget.style.color = T.textSub;
              e.currentTarget.style.background = T.white;
            }}
          >
            <svg
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              width="13" height="13"
              style={{ animation: spinning ? "spin 0.7s linear infinite" : "none" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* ── Tricolor divider ── */}
        <div style={{
          display: "flex", height: "4px", borderRadius: "3px",
          overflow: "hidden", marginBottom: "2rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}>
          <div style={{ flex: 1, background: T.saffron }} />
          <div style={{ flex: 1, background: T.white, borderWidth: "1px", borderStyle: "solid", borderColor: T.borderStrong }} />
          <div style={{ flex: 1, background: T.green }} />
        </div>

        {/* ── Section label ── */}
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.63rem", letterSpacing: "0.14em",
          textTransform: "uppercase", color: T.muted,
          marginBottom: "1rem",
          animation: "fadeUp 0.4s ease both 0.1s",
        }}>
          ▸ Content Overview
        </p>

        {/* ── Cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
          gap: "1.1rem",
        }}>
          {statConfigs.map((cfg, i) => (
            <StatCard
              key={cfg.key}
              cfg={cfg}
              data={stats[cfg.key]}
              loading={loading}
              index={i}
            />
          ))}
        </div>

        {/* ── Footer ── */}
        <div style={{
          marginTop: "2.5rem",
          borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: T.border,
          paddingTop: "1rem",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "0.5rem",
          animation: "fadeUp 0.4s ease both 0.4s",
        }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.63rem", color: T.muted,
          }}>🇮🇳 &nbsp;Jai Hind</span>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            {[T.saffron, T.white, T.green].map((c, i) => (
              <div key={i} style={{
                width: 9, height: 9, borderRadius: "50%", background: c,
                ...(i === 1 && {
                  borderWidth: "1px", borderStyle: "solid", borderColor: T.borderStrong,
                }),
              }} />
            ))}
          </div>
        </div>

      </div>
    </>
  );
}