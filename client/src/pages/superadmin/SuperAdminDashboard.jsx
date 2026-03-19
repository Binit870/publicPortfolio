import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import toast from "react-hot-toast";

// Add to index.html <head>:
// <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />

const STYLE = `
  :root {
    --saffron:        #FF9933;
    --saffron-deep:   #E8851A;
    --saffron-glow:   rgba(255,153,51,0.28);
    --saffron-soft:   rgba(255,153,51,0.10);
    --saffron-pale:   #FFF5E6;
    --saffron-border: rgba(255,153,51,0.22);
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
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dash-wrap { min-height: 100vh; background: var(--bg); }
  .dash-main { display: flex; flex-direction: column; overflow-x: hidden; }

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
    position: fixed; top: -120px; left: -100px; width: 480px; height: 480px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,153,51,0.15) 0%, transparent 65%);
    filter: blur(72px); pointer-events: none; z-index: 0;
    animation: dOrb1 13s ease-in-out infinite;
  }
  .dash-orb-2 {
    position: fixed; bottom: -130px; right: -110px; width: 520px; height: 520px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(19,136,8,0.11) 0%, transparent 65%);
    filter: blur(80px); pointer-events: none; z-index: 0;
    animation: dOrb2 16s ease-in-out infinite;
  }
  @keyframes dOrb1 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(55px,45px) scale(1.08)} 70%{transform:translate(-25px,65px) scale(.93)} }
  @keyframes dOrb2 { 0%,100%{transform:translate(0,0) scale(1)} 45%{transform:translate(-55px,-38px) scale(1.10)} 75%{transform:translate(28px,-55px) scale(.92)} }

  .dash-content {
    position: relative; z-index: 1;
    max-width: 1120px; width: 100%; margin: 0 auto;
    padding: 1.25rem 1rem 3rem;
  }
  @media (min-width: 640px)  { .dash-content { padding: 1.75rem 1.5rem 3.5rem; } }
  @media (min-width: 1024px) { .dash-content { padding: 2rem 2rem 4rem; } }

  .dash-accent-line {
    height: 3px; border-radius: 2px;
    background: linear-gradient(90deg, var(--saffron) 0%, var(--green) 100%);
    margin-bottom: 1.5rem;
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

  .dash-header {
    display: flex; align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.5rem; gap: .75rem; flex-wrap: wrap;
  }
  .dash-header-left { display: flex; align-items: center; gap: .75rem; flex: 1; min-width: 0; }
  .dash-logo-wrap {
    width: 44px; height: 44px; border-radius: 13px;
    background: linear-gradient(135deg, var(--saffron), var(--saffron-deep));
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 20px var(--saffron-glow), 0 0 0 3px rgba(255,153,51,0.14);
    flex-shrink: 0; animation: logoFloat 4s ease-in-out infinite;
  }
  @media (min-width: 640px) { .dash-logo-wrap { width: 52px; height: 52px; border-radius: 15px; } }
  @keyframes logoFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  .dash-logo-wrap svg { width: 22px; height: 22px; color: #fff; }
  .dash-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.25rem, 5vw, 2.2rem);
    font-weight: 800; line-height: 1.1; color: var(--text-dark);
  }
  .dash-subtitle { font-size: .82rem; color: var(--text-soft); margin-top: .25rem; }

  .dash-badge {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: .5rem 1rem; text-align: right;
    box-shadow: 0 2px 10px rgba(255,153,51,0.07); flex-shrink: 0;
    align-self: flex-start; display: none;
  }
  @media (min-width: 768px) { .dash-badge { display: block; } }
  .dash-badge-label { font-size: .62rem; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; color: var(--text-faint); margin-bottom: .15rem; }
  .dash-badge-role  { font-family: 'Syne', sans-serif; font-size: .9rem; font-weight: 700; color: var(--saffron); }

  .dash-stats {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: .75rem; margin-bottom: 1.75rem;
  }
  @media (min-width: 900px) { .dash-stats { grid-template-columns: repeat(4, 1fr); } }

  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 1rem 1.1rem;
    display: flex; align-items: center; gap: .75rem;
    box-shadow: 0 2px 14px rgba(255,153,51,0.07);
    transition: all .22s ease; position: relative; overflow: hidden;
  }
  @media (min-width: 640px) { .stat-card { padding: 1.25rem 1.4rem; gap: 1rem; border-radius: 22px; } }
  .stat-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,153,51,0.04) 0%,transparent 55%); pointer-events:none; }
  .stat-card:hover { transform: translateY(-2px); border-color: var(--saffron-border); box-shadow: 0 6px 24px rgba(255,153,51,0.14); }
  .stat-card.green-card::before { background:linear-gradient(135deg,rgba(19,136,8,0.05) 0%,transparent 55%); }
  .stat-card.green-card:hover   { border-color:var(--green-border); box-shadow:0 6px 24px rgba(19,136,8,0.12); }
  .stat-card.red-card::before   { background:linear-gradient(135deg,rgba(229,57,53,0.05) 0%,transparent 55%); }
  .stat-card.red-card:hover     { border-color:rgba(229,57,53,0.22); box-shadow:0 6px 24px rgba(229,57,53,0.12); }
  .stat-card.blue-card::before  { background:linear-gradient(135deg,rgba(25,118,210,0.05) 0%,transparent 55%); }
  .stat-card.blue-card:hover    { border-color:rgba(25,118,210,0.22); box-shadow:0 6px 24px rgba(25,118,210,0.12); }

  .stat-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  @media (min-width:640px) { .stat-icon { width:44px; height:44px; border-radius:12px; } }
  .stat-icon.saffron { background:linear-gradient(135deg,var(--saffron),var(--saffron-deep)); box-shadow:0 4px 12px var(--saffron-glow); }
  .stat-icon.green   { background:linear-gradient(135deg,var(--green),var(--green-light));   box-shadow:0 4px 12px var(--green-glow); }
  .stat-icon.red     { background:linear-gradient(135deg,#E53935,#c62828); box-shadow:0 4px 12px rgba(229,57,53,0.28); }
  .stat-icon.blue    { background:linear-gradient(135deg,#1976D2,#1565C0); box-shadow:0 4px 12px rgba(25,118,210,0.28); }
  .stat-icon svg { width:18px; height:18px; color:#fff; }

  .stat-info { flex:1; min-width:0; }
  .stat-label { font-size:.72rem; font-weight:600; letter-spacing:.04em; color:var(--text-soft); margin-bottom:.25rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .stat-value { font-family:'Syne',sans-serif; font-size:1.5rem; font-weight:800; line-height:1; color:var(--text-dark); }
  @media (min-width:640px) { .stat-value { font-size:1.75rem; } }
  .stat-value.green { color:var(--green); }
  .stat-value.red   { color:var(--red); }
  .stat-value.blue  { color:#1976D2; }

  .dash-sec-head { display:flex; align-items:center; gap:.75rem; margin-bottom:1rem; flex-wrap:wrap; }
  .dash-sec-title {
    font-family:'Syne',sans-serif; font-size:1rem; font-weight:700;
    color:var(--text-dark); display:flex; align-items:center; gap:.5rem;
  }
  @media (min-width:640px) { .dash-sec-title { font-size:1.1rem; } }
  .dash-sec-title::before { content:''; display:inline-block; width:4px; height:1.2em; background:linear-gradient(180deg,var(--saffron) 0%,var(--green) 100%); border-radius:2px; flex-shrink:0; }
  .dash-count-pill { background:var(--saffron-soft); border:1px solid var(--saffron-border); color:var(--saffron-deep); font-size:.73rem; font-weight:700; padding:.18rem .6rem; border-radius:20px; }

  .dash-card { background:var(--surface); border:1px solid var(--saffron-border); border-radius:22px; overflow:hidden; box-shadow:0 4px 22px rgba(255,153,51,0.08); transition:box-shadow .22s ease; }
  .dash-card:hover { box-shadow:0 8px 32px rgba(255,153,51,0.13); }

  .dash-table-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }
  .dash-table { width:100%; border-collapse:collapse; font-size:.88rem; min-width:360px; }
  .dash-table thead tr { background:linear-gradient(90deg,var(--saffron-pale) 0%,var(--green-pale) 100%); border-bottom:1px solid var(--border); }
  .dash-table thead th { padding:.8rem 1rem; text-align:left; font-weight:700; font-size:.69rem; letter-spacing:.09em; text-transform:uppercase; color:var(--text-mid); }
  @media (min-width:640px) { .dash-table thead th { padding:.9rem 1.3rem; } }
  .dash-table tbody tr { border-bottom:1px solid #F2ECE2; transition:background .15s; }
  .dash-table tbody tr:last-child { border-bottom:none; }
  .dash-table tbody tr:hover { background:#FFF8EE; }
  .dash-table tbody td { padding:.85rem 1rem; color:var(--text-dark); }
  @media (min-width:640px) { .dash-table tbody td { padding:1rem 1.3rem; } }
  .dash-table tbody td.td-email { color:var(--text-soft); font-size:.84rem; }

  .td-name-wrap { display:flex; align-items:center; gap:.65rem; }
  .td-avatar { width:30px; height:30px; border-radius:8px; flex-shrink:0; background:linear-gradient(135deg,var(--saffron-soft),var(--green-pale)); border:1.5px solid var(--saffron-border); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:800; font-size:.72rem; color:var(--saffron-deep); }
  @media (min-width:640px) { .td-avatar { width:34px; height:34px; font-size:.8rem; } }
  .td-name { font-weight:600; font-size:.91rem; }
  .td-num  { color:var(--text-faint); font-size:.8rem; font-weight:600; font-family:'Syne',sans-serif; }

  .badge-active   { display:inline-flex; align-items:center; gap:.35rem; padding:.26rem .78rem; border-radius:20px; font-size:.74rem; font-weight:600; background:var(--green-pale); color:var(--green); border:1px solid var(--green-border); }
  .badge-active::before   { content:''; width:6px; height:6px; background:var(--green); border-radius:50%; box-shadow:0 0 5px rgba(19,136,8,0.45); }
  .badge-inactive { display:inline-flex; align-items:center; gap:.35rem; padding:.26rem .78rem; border-radius:20px; font-size:.74rem; font-weight:600; background:#FBE9E7; color:#D84315; border:1px solid rgba(229,57,53,0.22); }
  .badge-inactive::before { content:''; width:6px; height:6px; background:#D84315; border-radius:50%; }

  .mob-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:.9rem 1.1rem; box-shadow:0 2px 10px rgba(255,153,51,0.06); transition:all .18s ease; display:flex; align-items:center; gap:.85rem; }
  .mob-card:hover { box-shadow:0 5px 18px rgba(255,153,51,0.12); border-color:var(--saffron-border); transform:translateY(-1px); }
  .mob-avatar { width:38px; height:38px; border-radius:11px; flex-shrink:0; background:linear-gradient(135deg,var(--saffron-soft),var(--green-pale)); border:1.5px solid var(--saffron-border); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:800; font-size:.82rem; color:var(--saffron-deep); }
  .mob-card .mob-name  { font-weight:600; font-size:.92rem; color:var(--text-dark); }
  .mob-card .mob-email { font-size:.78rem; color:var(--text-soft); margin-top:.1rem; word-break:break-all; }
  .mob-card .mob-badge { margin-top:.38rem; }

  .dash-empty { display:flex; flex-direction:column; align-items:center; gap:1rem; padding:3rem 1.5rem; }
  .dash-empty-icon { width:58px; height:58px; border-radius:16px; background:var(--saffron-soft); border:1.5px solid var(--saffron-border); display:flex; align-items:center; justify-content:center; }
  .dash-empty-icon svg { width:26px; height:26px; color:var(--saffron); opacity:.65; }
  .dash-empty-title { font-family:'Syne',sans-serif; font-weight:700; color:var(--text-mid); font-size:.95rem; }
  .dash-empty-sub   { font-size:.8rem; color:var(--text-soft); text-align:center; }

  .mobile-only  { display:flex; flex-direction:column; gap:.65rem; }
  .desktop-only { display:none; }
  @media (min-width:768px) { .mobile-only{display:none;} .desktop-only{display:block;} }
`;

export default function SuperAdminDashboard() {
  const [admins, setAdmins] = useState([]);

  const fetchAdmins = async () => {
    const toastId = toast.loading("Fetching admins...");
    try {
      const res = await API.get("/superadmin/users");
      setAdmins(res.data.data);
      toast.success("Admins loaded", { id: toastId });
    } catch (err) { toast.error("Failed to fetch admins", { id: toastId }); }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const totalAdmins   = admins.length;
  const activeCount   = admins.filter((a) => a.isActive).length;
  const inactiveCount = admins.filter((a) => !a.isActive).length;
  const initials = (name = "") => name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const EmptyState = () => (
    <div className="dash-empty">
      <div className="dash-empty-icon">
        <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
        </svg>
      </div>
      <p className="dash-empty-title">No admins found</p>
      <p className="dash-empty-sub">Admins will appear here once created</p>
    </div>
  );

  return (
    <>
      <style>{STYLE}</style>
      <div className="dash-bg" /><div className="dash-dots" />
      <div className="dash-orb-1" /><div className="dash-orb-2" />

      <div className="dash-wrap">
        <div className="dash-main">
          <div className="dash-content">
            <div className="dash-accent-line" />

            <div className="dash-header">
              <div className="dash-header-left">
                <div className="dash-logo-wrap">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
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

            <div className="dash-stats">
              <div className="stat-card">
                <div className="stat-icon saffron">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                </div>
                <div className="stat-info">
                  <div className="stat-label">Total Admins</div>
                  <div className="stat-value">{totalAdmins}</div>
                </div>
              </div>
              <div className="stat-card green-card">
                <div className="stat-icon green">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="stat-info">
                  <div className="stat-label">Active</div>
                  <div className="stat-value green">{activeCount}</div>
                </div>
              </div>
              <div className="stat-card red-card">
                <div className="stat-icon red">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                </div>
                <div className="stat-info">
                  <div className="stat-label">Inactive</div>
                  <div className="stat-value red">{inactiveCount}</div>
                </div>
              </div>
              <div className="stat-card blue-card">
                <div className="stat-icon blue">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                </div>
                <div className="stat-info">
                  <div className="stat-label">Active Rate</div>
                  <div className="stat-value blue">{totalAdmins > 0 ? Math.round((activeCount / totalAdmins) * 100) : 0}%</div>
                </div>
              </div>
            </div>

            <div className="dash-sec-head">
              <div className="dash-sec-title">
                All Administrators
                {totalAdmins > 0 && <span className="dash-count-pill">{totalAdmins} total</span>}
              </div>
            </div>

            <div className="mobile-only">
              {admins.length === 0 ? <EmptyState /> : admins.map(admin => (
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
              ))}
            </div>

            <div className="desktop-only">
              <div className="dash-card">
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead>
                      <tr><th style={{ width: "48px" }}>#</th><th>Name</th><th>Email</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {admins.length === 0
                        ? <tr><td colSpan="4"><EmptyState /></td></tr>
                        : admins.map((admin, idx) => (
                          <tr key={admin._id}>
                            <td><span className="td-num">{String(idx + 1).padStart(2, "0")}</span></td>
                            <td><div className="td-name-wrap"><div className="td-avatar">{initials(admin.name)}</div><span className="td-name">{admin.name}</span></div></td>
                            <td className="td-email">{admin.email}</td>
                            <td><span className={admin.isActive ? "badge-active" : "badge-inactive"}>{admin.isActive ? "Active" : "Inactive"}</span></td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
