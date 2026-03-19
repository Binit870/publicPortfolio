import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SIDEBAR_STYLE = `
  :root {
    --sa-saffron:        #FF9933;
    --sa-saffron-deep:   #E8851A;
    --sa-saffron-glow:   rgba(255,153,51,0.30);
    --sa-saffron-soft:   rgba(255,153,51,0.10);
    --sa-saffron-border: rgba(255,153,51,0.22);
    --sa-green:          #138808;
    --sa-green-soft:     rgba(19,136,8,0.08);
    --sa-surface:        #FFFFFF;
    --sa-surface2:       #FDFAF5;
    --sa-border:         rgba(220,200,170,0.55);
    --sa-text-dark:      #1C1A16;
    --sa-text-mid:       #5A5040;
    --sa-text-soft:      #9A8E7A;
    --sa-text-faint:     #C4B89A;
    --sa-red:            #E53935;
  }

  /* ══ MOBILE TOPBAR ══ */
  .sa-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .65rem 1rem;
    background: var(--sa-surface);
    border-bottom: 1px solid var(--sa-saffron-border);
    box-shadow: 0 2px 12px rgba(255,153,51,0.08);
    position: sticky; top: 0; z-index: 40;
    font-family: 'Outfit', sans-serif;
    position: relative;
  }
  @media (min-width: 768px) { .sa-topbar { display: none !important; } }

  .sa-topbar-left { display: flex; align-items: center; gap: .55rem; }
  .sa-topbar-logo {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg, var(--sa-saffron), var(--sa-saffron-deep));
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 3px 10px var(--sa-saffron-glow); flex-shrink: 0;
  }
  .sa-topbar-logo svg { width: 15px; height: 15px; color: #fff; }
  .sa-topbar-brand {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: .92rem; color: var(--sa-text-dark);
  }
  .sa-topbar-brand b { color: var(--sa-saffron); }
  .sa-topbar-bar {
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--sa-saffron) 0%, var(--sa-green) 100%);
  }
  .sa-menu-btn {
    background: none; border: none; cursor: pointer;
    padding: .32rem; border-radius: 8px; color: var(--sa-text-mid);
    display: flex; align-items: center; transition: all .18s;
  }
  .sa-menu-btn:hover { background: var(--sa-saffron-soft); color: var(--sa-saffron-deep); }

  /* ══ OVERLAY ══ */
  .sa-overlay {
    position: fixed; inset: 0;
    background: rgba(60,40,10,0.38);
    backdrop-filter: blur(3px); z-index: 48;
  }
  @media (min-width: 768px) { .sa-overlay { display: none !important; } }

  /* ══ SIDEBAR SHELL ══ */
  .sa-sidebar {
    font-family: 'Outfit', sans-serif;
    height: 100vh;
    background: var(--sa-surface);
    border-right: 1px solid var(--sa-saffron-border);
    display: flex; flex-direction: column;
    box-shadow: 2px 0 20px rgba(255,153,51,0.07);
    overflow: hidden; flex-shrink: 0;
    position: fixed; top: 0; left: 0; z-index: 50;
    width: 236px;
    transform: translateX(-100%);
    transition: transform .28s cubic-bezier(.4,0,.2,1),
                width     .28s cubic-bezier(.4,0,.2,1);
  }
  .sa-sidebar.mob-open { transform: translateX(0); }

  @media (min-width: 768px) {
    .sa-sidebar {
      position: static;
      transform: none !important;
    }
    .sa-sidebar.desk-expanded  { width: 236px; }
    .sa-sidebar.desk-collapsed { width: 66px; }
  }

  .sa-accent {
    height: 3px; flex-shrink: 0;
    background: linear-gradient(90deg, var(--sa-saffron) 0%, var(--sa-green) 100%);
  }

  /* ── Header ── */
  .sa-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: .85rem .9rem; border-bottom: 1px solid var(--sa-border);
    min-height: 58px; flex-shrink: 0;
    background: var(--sa-surface2);
    position: relative; overflow: hidden; gap: .4rem;
  }
  .sa-head::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,153,51,0.05) 0%, transparent 60%);
    pointer-events: none;
  }
  .sa-head-left {
    display: flex; align-items: center; gap: .6rem;
    overflow: hidden; flex: 1; min-width: 0;
  }
  .sa-head-icon {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--sa-saffron), var(--sa-saffron-deep));
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 3px 10px var(--sa-saffron-glow);
  }
  .sa-head-icon svg { width: 15px; height: 15px; color: #fff; }
  .sa-head-title {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: .88rem;
    color: var(--sa-text-dark); white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; line-height: 1.2;
  }
  .sa-head-title b { color: var(--sa-saffron); font-weight: 800; }
  .sa-head-btns { display: flex; gap: .2rem; flex-shrink: 0; }
  .sa-icon-btn {
    background: none; border: none; cursor: pointer;
    color: var(--sa-text-soft); padding: .28rem; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    transition: all .18s ease;
  }
  .sa-icon-btn:hover { background: var(--sa-saffron-soft); color: var(--sa-saffron-deep); }

  /* ── Nav ── */
  .sa-nav {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    padding: .65rem .55rem;
    display: flex; flex-direction: column; gap: .2rem;
  }
  .sa-nav::-webkit-scrollbar { width: 3px; }
  .sa-nav::-webkit-scrollbar-thumb { background: var(--sa-saffron-border); border-radius: 4px; }

  .sa-nav-sec {
    font-size: .6rem; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; color: var(--sa-text-faint);
    padding: .55rem .5rem .2rem; white-space: nowrap;
  }

  .sa-btn {
    display: flex; align-items: center; gap: .65rem;
    width: 100%; padding: .58rem .72rem;
    border: none; background: none; border-radius: 10px;
    cursor: pointer; color: var(--sa-text-mid);
    font-family: 'Outfit', sans-serif; font-size: .86rem; font-weight: 500;
    transition: all .18s ease; text-align: left; white-space: nowrap;
  }
  .sa-btn:hover { background: var(--sa-saffron-soft); color: var(--sa-saffron-deep); }
  .sa-btn .ico { flex-shrink: 0; display: flex; align-items: center; width: 18px; height: 18px; }
  .sa-btn .lbl { overflow: hidden; text-overflow: ellipsis; flex: 1; }

  .sa-drop-btn {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: .58rem .72rem;
    border: none; background: none; border-radius: 10px;
    cursor: pointer; color: var(--sa-text-mid);
    font-family: 'Outfit', sans-serif; font-size: .86rem; font-weight: 500;
    transition: all .18s ease;
  }
  .sa-drop-btn:hover,
  .sa-drop-btn.open { background: var(--sa-saffron-soft); color: var(--sa-saffron-deep); }
  .sa-drop-left { display: flex; align-items: center; gap: .65rem; }
  .sa-drop-left .ico { flex-shrink: 0; display: flex; align-items: center; width: 18px; height: 18px; }
  .sa-drop-lbl { overflow: hidden; text-overflow: ellipsis; }
  .sa-chevron { color: var(--sa-text-faint); flex-shrink: 0; transition: transform .22s ease; }
  .sa-chevron.up { transform: rotate(180deg); }

  .sa-subs {
    display: flex; flex-direction: column; gap: .08rem;
    padding-left: .85rem; margin-top: .1rem;
    animation: subFade .18s ease;
  }
  @keyframes subFade {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sa-sub {
    display: flex; align-items: center; gap: .5rem;
    width: 100%; padding: .44rem .72rem;
    border: none; background: none; border-radius: 8px;
    cursor: pointer; color: var(--sa-text-soft);
    font-family: 'Outfit', sans-serif; font-size: .82rem; font-weight: 500;
    transition: all .15s ease; text-align: left; text-transform: capitalize;
  }
  .sa-sub:hover { background: var(--sa-green-soft); color: var(--sa-green); }
  .sa-sub-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--sa-text-faint); flex-shrink: 0; transition: background .15s;
  }
  .sa-sub:hover .sa-sub-dot { background: var(--sa-green); box-shadow: 0 0 4px rgba(19,136,8,0.4); }

  /* ── Collapsed — hide labels only, NOT icons ── */
  .sa-sidebar.desk-collapsed .sa-nav-sec,
  .sa-sidebar.desk-collapsed .sa-btn .lbl,
  .sa-sidebar.desk-collapsed .sa-drop-lbl,
  .sa-sidebar.desk-collapsed .sa-chevron,
  .sa-sidebar.desk-collapsed .sa-subs,
  .sa-sidebar.desk-collapsed .sa-head-title { display: none; }
  .sa-sidebar.desk-collapsed .sa-nav       { padding: .65rem .4rem; }
  .sa-sidebar.desk-collapsed .sa-btn,
  .sa-sidebar.desk-collapsed .sa-drop-btn  { justify-content: center; padding: .65rem; }
  .sa-sidebar.desk-collapsed .sa-drop-left { justify-content: center; }
  .sa-sidebar.desk-collapsed .sa-head      { justify-content: center; padding: .85rem .5rem; }
  .sa-sidebar.desk-collapsed .sa-head-left { justify-content: center; }

  /* ── Footer ── */
  .sa-footer {
    padding: .6rem .55rem; border-top: 1px solid var(--sa-border);
    flex-shrink: 0; background: var(--sa-surface2);
  }
  .sa-logout {
    display: flex; align-items: center; gap: .65rem;
    width: 100%; padding: .58rem .72rem;
    border: none; background: none; border-radius: 10px;
    cursor: pointer; color: var(--sa-red);
    font-family: 'Outfit', sans-serif; font-size: .86rem; font-weight: 600;
    transition: all .18s ease; white-space: nowrap;
  }
  .sa-logout:hover { background: rgba(229,57,53,0.08); }
  .sa-logout .ico  { flex-shrink: 0; display: flex; align-items: center; width: 18px; height: 18px; }
  .sa-sidebar.desk-collapsed .sa-logout     { justify-content: center; padding: .65rem; }
  .sa-sidebar.desk-collapsed .sa-logout .lbl { display: none; }
`;

const LogoSvg = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="15" height="15">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6
         11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623
         5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152
         c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

export default function SuperAdminSidebar() {
  const [collapsed,  setCollapsed]  = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate   = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const go = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  // Collapsed mein icon click = seedha create page pe jao
  // Expanded mein icon click = dropdown toggle karo
  const handleManageClick = () => {
    if (collapsed) {
      go("/superadmin/admins/create");
    } else {
      setManageOpen(!manageOpen);
    }
  };

  const sidebarClass = [
    "sa-sidebar",
    mobileOpen  ? "mob-open"       : "",
    collapsed   ? "desk-collapsed" : "desk-expanded",
  ].join(" ");

  return (
    <>
      <style>{SIDEBAR_STYLE}</style>

      {/* ══ MOBILE TOPBAR ══ */}
      <div className="sa-topbar">
        <div className="sa-topbar-left">
          <div className="sa-topbar-logo"><LogoSvg /></div>
          <span className="sa-topbar-brand">Super<b>Admin</b></span>
        </div>
        <button className="sa-menu-btn" onClick={() => setMobileOpen(true)}>
          <Menu size={22} />
        </button>
        <div className="sa-topbar-bar" />
      </div>

      {/* ══ OVERLAY ══ */}
      {mobileOpen && (
        <div className="sa-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* ══ SIDEBAR ══ */}
      <div className={sidebarClass}>
        <div className="sa-accent" />

        {/* Header */}
        <div className="sa-head">
          <div className="sa-head-left">
            <div className="sa-head-icon"><LogoSvg /></div>
            <span className="sa-head-title">Super<b>Admin</b></span>
          </div>
          <div className="sa-head-btns">
            <button className="sa-icon-btn" onClick={() => setCollapsed(!collapsed)}>
              <Menu size={17} />
            </button>
            <button
              className="sa-icon-btn"
              onClick={() => setMobileOpen(false)}
              style={{ display: mobileOpen ? "flex" : "none" }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="sa-nav">
          <div className="sa-nav-sec">Main</div>

          <button className="sa-btn" onClick={() => go("/superadmin/dashboard")}>
            <span className="ico"><LayoutDashboard size={18} /></span>
            <span className="lbl">Dashboard</span>
          </button>

          <div className="sa-nav-sec">Management</div>

          <div>
            <button
              className={`sa-drop-btn ${manageOpen && !collapsed ? "open" : ""}`}
              onClick={handleManageClick}
            >
              <div className="sa-drop-left">
                <span className="ico"><Users size={18} /></span>
                <span className="sa-drop-lbl">Manage Admins</span>
              </div>
              <ChevronDown size={14} className={`sa-chevron ${manageOpen ? "up" : ""}`} />
            </button>

            {manageOpen && !collapsed && (
              <div className="sa-subs">
                {["create", "toggle", "delete"].map((type) => (
                  <button
                    key={type}
                    className="sa-sub"
                    onClick={() => go(`/superadmin/admins/${type}`)}
                  >
                    <span className="sa-sub-dot" />
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="sa-btn" onClick={() => go("/superadmin/admin-permissions")}>
            <span className="ico"><ShieldCheck size={18} /></span>
            <span className="lbl">Permissions</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="sa-footer">
          <button className="sa-logout" onClick={handleLogout}>
            <span className="ico"><LogOut size={18} /></span>
            <span className="lbl">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
