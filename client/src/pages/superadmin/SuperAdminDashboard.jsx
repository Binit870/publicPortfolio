import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import toast from "react-hot-toast";

// Add to index.html <head>:
// <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />

const DASHBOARD_STYLE = `
  :root {
    --saffron:        #FF9933;
    --saffron-deep:   #E8851A;
    --saffron-glow:   rgba(255,153,51,0.28);
    --saffron-soft:   rgba(255,153,51,0.10);
    --saffron-pale:   #FFF5E6;
    --saffron-border: rgba(255,153,51,0.20);
    --green:          #138808;
    --green-light:    #22a020;
    --green-glow:     rgba(19,136,8,0.20);
    --green-pale:     #EEF7EE;
    --green-border:   rgba(19,136,8,0.22);
    --bg:             #FEF8F0;
    --surface:        #FFFFFF;
    --surface2:       #FDFAF5;
    --border:         rgba(220,200,170,0.50);
    --text-dark:      #1C1A16;
    --text-mid:       #5A5040;
    --text-soft:      #9A8E7A;
    --text-faint:     #C4B89A;
    --red:            #E53935;
    --radius-sm:      10px;
    --radius-md:      16px;
    --radius-lg:      22px;
    --radius-xl:      30px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dash-root {
    font-family: 'Outfit', sans-serif;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text-dark);
    position: relative;
    overflow-x: hidden;
  }

  /* ── Background ── */
  .dash-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 75% 55% at 8% 0%,  rgba(255,153,51,0.13) 0%, transparent 65%),
      radial-gradient(ellipse 60% 45% at 92% 95%, rgba(19,136,8,0.08)  0%, transparent 60%),
      linear-gradient(160deg, #FFF8EE 0%, #FEFCF5 50%, #F8FFF4 100%);
  }
  .dash-dots {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: radial-gradient(circle, rgba(255,153,51,0.11) 1px, transparent 1px);
    background-size: 26px 26px;
  }
  .dash-orb-1 {
    position: fixed; top: -120px; left: -100px;
    width: 480px; height: 480px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,153,51,0.15) 0%, transparent 65%);
    filter: blur(72px); pointer-events: none; z-index: 0;
    animation: dOrb1 13s ease-in-out infinite;
  }
  .dash-orb-2 {
    position: fixed; bottom: -130px; right: -110px;
    width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle, rgba(19,136,8,0.11) 0%, transparent 65%);
    filter: blur(80px); pointer-events: none; z-index: 0;
    animation: dOrb2 16s ease-in-out infinite;
  }
  @keyframes dOrb1 {
    0%,100%{transform:translate(0,0) scale(1)}
    40%{transform:translate(55px,45px) scale(1.08)}
    70%{transform:translate(-25px,65px) scale(.93)}
  }
  @keyframes dOrb2 {
    0%,100%{transform:translate(0,0) scale(1)}
    45%{transform:translate(-55px,-38px) scale(1.10)}
    75%{transform:translate(28px,-55px) scale(.92)}
  }

  /* ── Content ── */
  .dash-content {
    position: relative; z-index: 1;
    max-width: 1120px; margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
  }

  /* ── Accent line ── */
  .dash-accent-line {
    height: 3px; border-radius: 2px;
    background: linear-gradient(90deg, var(--saffron) 0%, var(--green) 100%);
    margin-bottom: 2rem;
    box-shadow: 0 2px 10px rgba(255,153,51,0.28);
    position: relative; overflow: hidden;
  }
  .dash-accent-line::after {
    content: ''; position: absolute; left: 0; top: -2px;
    width: 56px; height: 7px; background: var(--saffron);
    border-radius: 4px; filter: blur(4px);
    animation: scanLine 3s ease-in-out infinite;
  }
  @keyframes scanLine { 0%{left:0} 100%{left:calc(100% - 56px)} }

  /* ── Header ── */
  .dash-header {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap;
  }
  .dash-header-left { display: flex; align-items: center; gap: 1rem; }
  .dash-logo-wrap {
    width: 52px; height: 52px; border-radius: 15px;
    background: linear-gradient(135deg, var(--saffron), var(--saffron-deep));
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 20px var(--saffron-glow), 0 0 0 3px rgba(255,153,51,0.14);
    flex-shrink: 0;
    animation: logoFloat 4s ease-in-out infinite;
  }
  @keyframes logoFloat {
    0%,100%{transform:translateY(0)}
    50%{transform:translateY(-4px)}
  }
  .dash-logo-wrap svg { width: 25px; height: 25px; color: #fff; }
  .dash-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.5rem, 3.5vw, 2.2rem);
    font-weight: 800; line-height: 1.1;
    color: var(--text-dark);
  }
  .dash-subtitle {
    font-size: .84rem; color: var(--text-soft); margin-top: .25rem;
  }
  .dash-badge {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: .55rem 1.1rem; text-align: right;
    box-shadow: 0 2px 10px rgba(255,153,51,0.07);
    flex-shrink: 0;
  }
  .dash-badge-label {
    font-size: .65rem; font-weight: 700; letter-spacing: .13em;
    text-transform: uppercase; color: var(--text-faint); margin-bottom: .18rem;
  }
  .dash-badge-role {
    font-family: 'Syne', sans-serif; font-size: .95rem;
    font-weight: 700; color: var(--saffron);
  }

  /* ── Stats grid ── */
  .dash-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }
  @media (min-width: 640px) {
    .dash-stats { grid-template-columns: repeat(4, 1fr); }
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.25rem 1.4rem;
    display: flex; align-items: center; gap: 1rem;
    box-shadow: 0 2px 14px rgba(255,153,51,0.07), 0 1px 3px rgba(0,0,0,0.04);
    transition: all .22s ease;
    position: relative; overflow: hidden;
  }
  .stat-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,153,51,0.04) 0%, transparent 55%);
    pointer-events: none;
  }
  .stat-card:hover {
    box-shadow: 0 6px 24px rgba(255,153,51,0.14), 0 2px 6px rgba(0,0,0,0.06);
    transform: translateY(-2px);
    border-color: var(--saffron-border);
  }
  .stat-card.green-card::before {
    background: linear-gradient(135deg, rgba(19,136,8,0.05) 0%, transparent 55%);
  }
  .stat-card.green-card:hover {
    box-shadow: 0 6px 24px rgba(19,136,8,0.12), 0 2px 6px rgba(0,0,0,0.06);
    border-color: var(--green-border);
  }
  .stat-card.red-card::before {
    background: linear-gradient(135deg, rgba(229,57,53,0.05) 0%, transparent 55%);
  }
  .stat-card.red-card:hover {
    box-shadow: 0 6px 24px rgba(229,57,53,0.12), 0 2px 6px rgba(0,0,0,0.06);
    border-color: rgba(229,57,53,0.22);
  }
  .stat-card.blue-card::before {
    background: linear-gradient(135deg, rgba(25,118,210,0.05) 0%, transparent 55%);
  }
  .stat-card.blue-card:hover {
    box-shadow: 0 6px 24px rgba(25,118,210,0.12), 0 2px 6px rgba(0,0,0,0.06);
    border-color: rgba(25,118,210,0.22);
  }

  .stat-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .stat-icon.saffron {
    background: linear-gradient(135deg, var(--saffron), var(--saffron-deep));
    box-shadow: 0 4px 12px var(--saffron-glow);
  }
  .stat-icon.green {
    background: linear-gradient(135deg, var(--green), var(--green-light));
    box-shadow: 0 4px 12px var(--green-glow);
  }
  .stat-icon.red {
    background: linear-gradient(135deg, #E53935, #c62828);
    box-shadow: 0 4px 12px rgba(229,57,53,0.28);
  }
  .stat-icon.blue {
    background: linear-gradient(135deg, #1976D2, #1565C0);
    box-shadow: 0 4px 12px rgba(25,118,210,0.28);
  }
  .stat-icon svg { width: 20px; height: 20px; color: #fff; }

  .stat-info { flex: 1; min-width: 0; }
  .stat-label {
    font-size: .75rem; font-weight: 600; letter-spacing: .04em;
    color: var(--text-soft); margin-bottom: .3rem;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .stat-value {
    font-family: 'Syne', sans-serif; font-size: 1.75rem;
    font-weight: 800; line-height: 1; color: var(--text-dark);
  }
  .stat-value.green { color: var(--green); }
  .stat-value.red   { color: var(--red); }
  .stat-value.blue  { color: #1976D2; }

  /* ── Section header ── */
  .dash-section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1rem; gap: 1rem; flex-wrap: wrap;
  }
  .dash-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem; font-weight: 700; color: var(--text-dark);
    display: flex; align-items: center; gap: .55rem;
  }
  .dash-section-title::before {
    content: ''; display: inline-block; width: 4px; height: 1.2em;
    background: linear-gradient(180deg, var(--saffron) 0%, var(--green) 100%);
    border-radius: 2px; flex-shrink: 0;
  }
  .dash-count-pill {
    background: var(--saffron-soft);
    border: 1px solid var(--saffron-border);
    color: var(--saffron-deep);
    font-size: .75rem; font-weight: 700;
    padding: .2rem .65rem; border-radius: 20px;
    letter-spacing: .03em;
  }

  /* ── Table card ── */
  .dash-card {
    background: var(--surface);
    border: 1px solid var(--saffron-border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: 0 4px 22px rgba(255,153,51,0.08), 0 1px 4px rgba(0,0,0,0.04);
    transition: box-shadow .22s ease;
  }
  .dash-card:hover {
    box-shadow: 0 8px 32px rgba(255,153,51,0.13), 0 2px 7px rgba(0,0,0,0.06);
  }

  /* ── Table ── */
  .dash-table-wrap { overflow-x: auto; }
  .dash-table { width: 100%; border-collapse: collapse; font-size: .92rem; }
  .dash-table thead tr {
    background: linear-gradient(90deg, var(--saffron-pale) 0%, var(--green-pale) 100%);
    border-bottom: 1px solid var(--border);
  }
  .dash-table thead th {
    padding: .9rem 1.3rem; text-align: left;
    font-weight: 700; font-size: .71rem;
    letter-spacing: .09em; text-transform: uppercase; color: var(--text-mid);
  }
  .dash-table tbody tr {
    border-bottom: 1px solid #F2ECE2; transition: background .15s;
  }
  .dash-table tbody tr:last-child { border-bottom: none; }
  .dash-table tbody tr:hover { background: #FFF8EE; }
  .dash-table tbody td { padding: 1rem 1.3rem; color: var(--text-dark); }
  .dash-table tbody td.td-email { color: var(--text-soft); font-size: .87rem; }
  .dash-table .empty-cell {
    padding: 3.5rem; text-align: center; color: var(--text-soft); font-style: italic;
  }

  /* ── Avatar ── */
  .td-name-wrap { display: flex; align-items: center; gap: .75rem; }
  .td-avatar {
    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--saffron-soft), var(--green-pale));
    border: 1.5px solid var(--saffron-border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: .8rem;
    color: var(--saffron-deep);
  }
  .td-name { font-weight: 600; font-size: .93rem; }

  /* ── Row number ── */
  .td-num {
    color: var(--text-faint); font-size: .82rem; font-weight: 600;
    font-family: 'Syne', sans-serif;
  }

  /* ── Badges ── */
  .badge-active {
    display: inline-flex; align-items: center; gap: .35rem;
    padding: .28rem .85rem; border-radius: 20px;
    font-size: .75rem; font-weight: 600;
    background: var(--green-pale); color: var(--green);
    border: 1px solid var(--green-border);
  }
  .badge-active::before {
    content: ''; width: 6px; height: 6px; background: var(--green);
    border-radius: 50%; box-shadow: 0 0 5px rgba(19,136,8,0.45);
  }
  .badge-inactive {
    display: inline-flex; align-items: center; gap: .35rem;
    padding: .28rem .85rem; border-radius: 20px;
    font-size: .75rem; font-weight: 600;
    background: #FBE9E7; color: #D84315;
    border: 1px solid rgba(229,57,53,0.22);
  }
  .badge-inactive::before {
    content: ''; width: 6px; height: 6px; background: #D84315; border-radius: 50%;
  }

  /* ── Mobile cards ── */
  .mob-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1rem 1.2rem;
    box-shadow: 0 2px 10px rgba(255,153,51,0.06);
    transition: all .18s ease;
    display: flex; align-items: center; gap: .9rem;
  }
  .mob-card:hover {
    box-shadow: 0 5px 18px rgba(255,153,51,0.12);
    border-color: var(--saffron-border);
    transform: translateY(-1px);
  }
  .mob-avatar {
    width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--saffron-soft), var(--green-pale));
    border: 1.5px solid var(--saffron-border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: .88rem;
    color: var(--saffron-deep);
  }
  .mob-card .mob-name  { font-weight: 600; font-size: .95rem; color: var(--text-dark); }
  .mob-card .mob-email { font-size: .8rem; color: var(--text-soft); margin-top: .12rem; }
  .mob-card .mob-badge { margin-top: .4rem; }

  /* ── Empty state ── */
  .dash-empty {
    display: flex; flex-direction: column; align-items: center;
    gap: 1rem; padding: 3.5rem 2rem;
  }
  .dash-empty-icon {
    width: 62px; height: 62px; border-radius: 18px;
    background: var(--saffron-soft); border: 1.5px solid var(--saffron-border);
    display: flex; align-items: center; justify-content: center;
  }
  .dash-empty-icon svg { width: 27px; height: 27px; color: var(--saffron); opacity: .65; }
  .dash-empty-title {
    font-family: 'Syne', sans-serif; font-weight: 700;
    color: var(--text-mid); font-size: .97rem;
  }
  .dash-empty-sub { font-size: .82rem; color: var(--text-soft); }

  /* ── Responsive ── */
  .mobile-only  { display: flex; flex-direction: column; gap: .7rem; }
  .desktop-only { display: none; }
  @media (min-width: 768px) {
    .mobile-only  { display: none; }
    .desktop-only { display: block; }
  }
`;

export default function SuperAdminDashboard() {
  const [admins, setAdmins] = useState([]);

  const fetchAdmins = async () => {
    const toastId = toast.loading("Fetching admins...");
    try {
      const res = await API.get("/superadmin/users");
      setAdmins(res.data.data);
      toast.success("Admins loaded", { id: toastId });
    } catch (err) {
      toast.error("Failed to fetch admins", { id: toastId });
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  // Derived stats — pure display, no logic change
  const totalAdmins  = admins.length;
  const activeCount  = admins.filter((a) => a.isActive).length;
  const inactiveCount = admins.filter((a) => !a.isActive).length;

  // Avatar initials helper
  const initials = (name = "") =>
    name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <>
      <style>{DASHBOARD_STYLE}</style>

      <div className="dash-bg" />
      <div className="dash-dots" />
      <div className="dash-orb-1" />
      <div className="dash-orb-2" />

      <div className="dash-root">
        <div className="dash-content">

          {/* ── Accent line ── */}
          <div className="dash-accent-line" />

          {/* ── Header ── */}
          <div className="dash-header">
            <div className="dash-header-left">
              <div className="dash-logo-wrap">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <div className="dash-title">SuperAdmin Dashboard</div>
                <div className="dash-subtitle">Overview of all administrators and their access status</div>
              </div>
            </div>
            <div className="dash-badge">
              <div className="dash-badge-label">Panel</div>
              <div className="dash-badge-role">Super Admin</div>
            </div>
          </div>

          {/* ── Stats cards ── */}
          <div className="dash-stats">
            {/* Total */}
            <div className="stat-card">
              <div className="stat-icon saffron">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">Total Admins</div>
                <div className="stat-value">{totalAdmins}</div>
              </div>
            </div>

            {/* Active */}
            <div className="stat-card green-card">
              <div className="stat-icon green">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">Active</div>
                <div className="stat-value green">{activeCount}</div>
              </div>
            </div>

            {/* Inactive */}
            <div className="stat-card red-card">
              <div className="stat-icon red">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">Inactive</div>
                <div className="stat-value red">{inactiveCount}</div>
              </div>
            </div>

            {/* Active % */}
            <div className="stat-card blue-card">
              <div className="stat-icon blue">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">Active Rate</div>
                <div className="stat-value blue">
                  {totalAdmins > 0 ? Math.round((activeCount / totalAdmins) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>

          {/* ── Section header ── */}
          <div className="dash-section-header">
            <div className="dash-section-title">
              All Administrators
              {totalAdmins > 0 && (
                <span className="dash-count-pill">{totalAdmins} total</span>
              )}
            </div>
          </div>

          {/* ── MOBILE VIEW ── */}
          <div className="mobile-only">
            {admins.length === 0 ? (
              <div className="dash-empty">
                <div className="dash-empty-icon">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                  </svg>
                </div>
                <p className="dash-empty-title">No admins found</p>
                <p className="dash-empty-sub">Admins will appear here once created</p>
              </div>
            ) : (
              admins.map((admin) => (
                <div key={admin._id} className="mob-card">
                  <div className="mob-avatar">{initials(admin.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="mob-name">{admin.name}</p>
                    <p className="mob-email">{admin.email}</p>
                    <div className="mob-badge">
                      <span className={admin.isActive ? "badge-active" : "badge-inactive"}>
                        {admin.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── DESKTOP TABLE ── */}
          <div className="desktop-only">
            <div className="dash-card">
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th style={{ width: "48px" }}>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.length === 0 ? (
                      <tr>
                        <td colSpan="4">
                          <div className="dash-empty">
                            <div className="dash-empty-icon">
                              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                              </svg>
                            </div>
                            <p className="dash-empty-title">No admins found</p>
                            <p className="dash-empty-sub">Admins will appear here once created</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      admins.map((admin, idx) => (
                        <tr key={admin._id}>
                          <td><span className="td-num">{String(idx + 1).padStart(2, "0")}</span></td>
                          <td>
                            <div className="td-name-wrap">
                              <div className="td-avatar">{initials(admin.name)}</div>
                              <span className="td-name">{admin.name}</span>
                            </div>
                          </td>
                          <td className="td-email">{admin.email}</td>
                          <td>
                            <span className={admin.isActive ? "badge-active" : "badge-inactive"}>
                              {admin.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
