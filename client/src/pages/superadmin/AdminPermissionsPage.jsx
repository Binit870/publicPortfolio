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
    --radius-sm:      10px;
    --radius-md:      16px;
    --radius-lg:      22px;
    --radius-xl:      30px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pp-root {
    font-family: 'Outfit', sans-serif;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text-dark);
    position: relative;
    overflow-x: hidden;
  }

  /* ── Background ── */
  .pp-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 75% 55% at 8% 0%,  rgba(255,153,51,0.13) 0%, transparent 65%),
      radial-gradient(ellipse 60% 45% at 92% 95%, rgba(19,136,8,0.08)  0%, transparent 60%),
      linear-gradient(160deg, #FFF8EE 0%, #FEFCF5 50%, #F8FFF4 100%);
  }
  .pp-dots {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: radial-gradient(circle, rgba(255,153,51,0.11) 1px, transparent 1px);
    background-size: 26px 26px;
  }
  .pp-orb-1 {
    position: fixed; top: -120px; left: -100px;
    width: 480px; height: 480px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,153,51,0.15) 0%, transparent 65%);
    filter: blur(72px); pointer-events: none; z-index: 0;
    animation: pOrb1 13s ease-in-out infinite;
  }
  .pp-orb-2 {
    position: fixed; bottom: -130px; right: -110px;
    width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle, rgba(19,136,8,0.11) 0%, transparent 65%);
    filter: blur(80px); pointer-events: none; z-index: 0;
    animation: pOrb2 16s ease-in-out infinite;
  }
  @keyframes pOrb1 {
    0%,100%{transform:translate(0,0) scale(1)}
    40%{transform:translate(55px,45px) scale(1.08)}
    70%{transform:translate(-25px,65px) scale(.93)}
  }
  @keyframes pOrb2 {
    0%,100%{transform:translate(0,0) scale(1)}
    45%{transform:translate(-55px,-38px) scale(1.10)}
    75%{transform:translate(28px,-55px) scale(.92)}
  }

  /* ── Content wrapper ── */
  .pp-content {
    position: relative; z-index: 1;
    max-width: 1120px; margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
  }

  /* ── Accent line ── */
  .pp-accent-line {
    height: 3px; border-radius: 2px;
    background: linear-gradient(90deg, var(--saffron) 0%, var(--green) 100%);
    margin-bottom: 2rem;
    box-shadow: 0 2px 10px rgba(255,153,51,0.28);
    position: relative; overflow: hidden;
  }
  .pp-accent-line::after {
    content: ''; position: absolute; left: 0; top: -2px;
    width: 56px; height: 7px; background: var(--saffron);
    border-radius: 4px; filter: blur(4px);
    animation: scanLine 3s ease-in-out infinite;
  }
  @keyframes scanLine { 0%{left:0} 100%{left:calc(100% - 56px)} }

  /* ── Header ── */
  .pp-header {
    display: flex; align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 2rem; gap: 1rem;
  }
  .pp-header-left { display: flex; align-items: center; gap: 1rem; }
  .pp-logo-wrap {
    width: 52px; height: 52px; border-radius: 15px;
    background: linear-gradient(135deg, var(--saffron), var(--saffron-deep));
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 20px var(--saffron-glow), 0 0 0 3px rgba(255,153,51,0.14);
    flex-shrink: 0;
    animation: logoFloat 4s ease-in-out infinite;
  }
  @keyframes logoFloat {
    0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)}
  }
  .pp-logo-wrap svg { width: 25px; height: 25px; color: #fff; }
  .pp-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.5rem, 3.5vw, 2.2rem);
    font-weight: 800; line-height: 1.1; color: var(--text-dark);
  }
  .pp-subtitle { font-size: .85rem; color: var(--text-soft); margin-top: .28rem; }
  .pp-badge {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-md); padding: .55rem 1.1rem; text-align: right;
    box-shadow: 0 2px 10px rgba(255,153,51,0.07); flex-shrink: 0;
  }
  .pp-badge-label {
    font-size: .65rem; font-weight: 700; letter-spacing: .13em;
    text-transform: uppercase; color: var(--text-faint); margin-bottom: .18rem;
  }
  .pp-badge-role {
    font-family: 'Syne', sans-serif; font-size: .95rem;
    font-weight: 700; color: var(--saffron);
  }

  /* ── Section header ── */
  .pp-section-header {
    display: flex; align-items: center; gap: .75rem;
    margin-bottom: 1.25rem;
  }
  .pp-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.05rem; font-weight: 700; color: var(--text-dark);
    display: flex; align-items: center; gap: .5rem;
  }
  .pp-section-title::before {
    content: ''; display: inline-block; width: 4px; height: 1.15em;
    background: linear-gradient(180deg, var(--saffron) 0%, var(--green) 100%);
    border-radius: 2px; flex-shrink: 0;
  }
  .pp-count-pill {
    background: var(--saffron-soft); border: 1px solid var(--saffron-border);
    color: var(--saffron-deep); font-size: .73rem; font-weight: 700;
    padding: .18rem .6rem; border-radius: 20px; letter-spacing: .03em;
  }

  /* ── Admin card ── */
  .pp-admin-card {
    background: var(--surface);
    border: 1px solid var(--saffron-border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: 0 3px 18px rgba(255,153,51,0.07), 0 1px 4px rgba(0,0,0,0.04);
    transition: box-shadow .22s ease, transform .22s ease;
    margin-bottom: 1.1rem;
  }
  .pp-admin-card:hover {
    box-shadow: 0 8px 30px rgba(255,153,51,0.13), 0 2px 7px rgba(0,0,0,0.06);
    transform: translateY(-1px);
  }

  /* Card header band */
  .pp-card-head {
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
    padding: 1.1rem 1.5rem;
    display: flex; align-items: center; gap: .9rem;
    position: relative; overflow: hidden;
  }
  .pp-card-head::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,153,51,0.06) 0%, transparent 55%);
    pointer-events: none;
  }
  .pp-avatar {
    width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--saffron-soft), var(--green-pale));
    border: 1.5px solid var(--saffron-border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: .85rem;
    color: var(--saffron-deep);
  }
  .pp-admin-name {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 1rem; color: var(--text-dark); line-height: 1.2;
  }
  .pp-admin-email { font-size: .8rem; color: var(--text-soft); margin-top: .18rem; }

  /* Status dot on card head */
  .pp-status-dot {
    margin-left: auto; flex-shrink: 0;
    display: flex; align-items: center; gap: .4rem;
    font-size: .75rem; font-weight: 600;
  }
  .pp-status-dot .dot {
    width: 8px; height: 8px; border-radius: 50%;
  }
  .pp-status-dot.active .dot {
    background: var(--green); box-shadow: 0 0 6px rgba(19,136,8,0.5);
  }
  .pp-status-dot.active { color: var(--green); }
  .pp-status-dot.inactive .dot { background: var(--red); }
  .pp-status-dot.inactive { color: var(--red); }

  /* Card body */
  .pp-card-body { padding: 1.25rem 1.5rem; }

  .pp-perms-label {
    font-size: .7rem; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; color: var(--saffron);
    margin-bottom: .9rem;
    display: flex; align-items: center; gap: .4rem;
  }
  .pp-perms-label::before {
    content: ''; display: inline-block; width: 5px; height: 5px;
    background: var(--saffron); border-radius: 50%;
    box-shadow: 0 0 5px var(--saffron);
  }

  /* Permission grid */
  .pp-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: .65rem;
  }
  @media (min-width: 480px) { .pp-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 768px) { .pp-grid { grid-template-columns: repeat(4, 1fr); } }
  @media (min-width: 1024px) { .pp-grid { grid-template-columns: repeat(5, 1fr); } }

  /* Permission toggle item */
  .pp-perm-item {
    position: relative;
    background: #FAFAF6;
    border: 1.5px solid #EAE4D8;
    border-radius: var(--radius-sm);
    padding: .65rem .8rem;
    cursor: pointer;
    transition: all .18s ease;
    display: flex; flex-direction: column; gap: .5rem;
    user-select: none;
  }
  .pp-perm-item:hover {
    border-color: var(--saffron-border);
    background: var(--saffron-pale);
    box-shadow: 0 2px 10px rgba(255,153,51,0.10);
  }
  .pp-perm-item.checked {
    background: var(--green-pale);
    border-color: var(--green-border);
    box-shadow: 0 2px 10px rgba(19,136,8,0.08);
  }
  .pp-perm-item.checked:hover {
    box-shadow: 0 4px 14px rgba(19,136,8,0.14);
  }
  .pp-perm-item.disabled-item {
    opacity: .55; cursor: not-allowed; pointer-events: none;
  }

  /* Top row: key name + custom toggle */
  .pp-perm-top {
    display: flex; align-items: center; justify-content: space-between; gap: .4rem;
  }
  .pp-perm-key {
    font-size: .76rem; font-weight: 600; color: var(--text-mid);
    line-height: 1.3; flex: 1;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    text-transform: capitalize;
  }
  .pp-perm-item.checked .pp-perm-key { color: var(--green); }

  /* Custom toggle switch */
  .pp-toggle {
    position: relative; width: 32px; height: 18px; flex-shrink: 0;
  }
  .pp-toggle input {
    position: absolute; opacity: 0; width: 0; height: 0;
  }
  .pp-toggle-track {
    position: absolute; inset: 0; border-radius: 20px;
    background: #D8D2C6; transition: background .2s ease;
    cursor: pointer;
  }
  .pp-toggle input:checked + .pp-toggle-track { background: var(--green); }
  .pp-perm-item:not(.checked) .pp-toggle-track { background: #D8D2C6; }

  .pp-toggle-thumb {
    position: absolute; top: 2px; left: 2px;
    width: 14px; height: 14px; border-radius: 50%;
    background: #fff; transition: transform .2s ease;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
    pointer-events: none;
  }
  .pp-toggle input:checked ~ .pp-toggle-thumb { transform: translateX(14px); }



  /* Hidden native checkbox (accessible) */
  .pp-native-cb {
    position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none;
  }

  /* ── Empty state ── */
  .pp-empty {
    display: flex; flex-direction: column; align-items: center;
    gap: 1rem; padding: 4rem 2rem;
    background: var(--surface); border: 1px solid var(--saffron-border);
    border-radius: var(--radius-xl);
    box-shadow: 0 3px 18px rgba(255,153,51,0.07);
  }
  .pp-empty-icon {
    width: 62px; height: 62px; border-radius: 18px;
    background: var(--saffron-soft); border: 1.5px solid var(--saffron-border);
    display: flex; align-items: center; justify-content: center;
  }
  .pp-empty-icon svg { width: 27px; height: 27px; color: var(--saffron); opacity: .65; }
  .pp-empty-title {
    font-family: 'Syne', sans-serif; font-weight: 700;
    color: var(--text-mid); font-size: .97rem;
  }
  .pp-empty-sub { font-size: .82rem; color: var(--text-soft); }
`;

export default function AdminPermissionPage() {
  const [admins, setAdmins]   = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdmins = async () => {
    const toastId = toast.loading("Loading admins...");
    try {
      const res = await API.get("/superadmin/users");
      setAdmins(res.data.data);
      toast.success("Admins loaded", { id: toastId });
    } catch (err) {
      toast.error("Failed to load admins", { id: toastId });
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleTogglePermission = async (adminId, key, value) => {
    setLoading(true);
    try {
      const admin = admins.find((a) => a._id === adminId);
      const updatedPermissions = { ...admin.permissions, [key]: !value };
      await API.patch(`/superadmin/users/${adminId}/permissions`, {
        permissions: updatedPermissions,
      });
      setAdmins((prev) =>
        prev.map((a) =>
          a._id === adminId ? { ...a, permissions: updatedPermissions } : a
        )
      );
      toast.success("Permission updated");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Avatar initials
  const initials = (name = "") =>
    name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <>
      <style>{STYLE}</style>

      <div className="pp-bg" />
      <div className="pp-dots" />
      <div className="pp-orb-1" />
      <div className="pp-orb-2" />

      <div className="pp-root">
        <div className="pp-content">

          {/* ── Accent line ── */}
          <div className="pp-accent-line" />

          {/* ── Header ── */}
          <div className="pp-header">
            <div className="pp-header-left">
              <div className="pp-logo-wrap">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div>
                <div className="pp-title">Admin Permissions</div>
                <div className="pp-subtitle">
                  Manage granular access controls for each administrator
                </div>
              </div>
            </div>
            <div className="pp-badge">
              <div className="pp-badge-label">Panel</div>
              <div className="pp-badge-role">Super Admin</div>
            </div>
          </div>

          {/* ── Section label ── */}
          <div className="pp-section-header">
            <div className="pp-section-title">
              All Administrators
              {admins.length > 0 && (
                <span className="pp-count-pill">{admins.length} total</span>
              )}
            </div>
          </div>

          {/* ── Admin list ── */}
          {admins.length === 0 ? (
            <div className="pp-empty">
              <div className="pp-empty-icon">
                <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                </svg>
              </div>
              <p className="pp-empty-title">No admins found</p>
              <p className="pp-empty-sub">Admins will appear here once created</p>
            </div>
          ) : (
            admins.map((admin) => (
              <div key={admin._id} className="pp-admin-card">

                {/* Card head */}
                <div className="pp-card-head">
                  <div className="pp-avatar">{initials(admin.name)}</div>
                  <div>
                    <div className="pp-admin-name">{admin.name}</div>
                    <div className="pp-admin-email">{admin.email}</div>
                  </div>
                  <div className={`pp-status-dot ${admin.isActive ? "active" : "inactive"}`}>
                    <span className="dot" />
                    {admin.isActive ? "Active" : "Inactive"}
                  </div>
                </div>

                {/* Permissions body */}
                <div className="pp-card-body">
                  <div className="pp-perms-label">Permissions</div>
                  <div className="pp-grid">
                    {Object.entries(admin.permissions).map(([key, value]) => (
                      <label
                        key={key}
                        className={`pp-perm-item ${value ? "checked" : ""} ${loading ? "disabled-item" : ""}`}
                      >
                        {/* Hidden native checkbox — keeps original onChange logic intact */}
                        <input
                          className="pp-native-cb"
                          type="checkbox"
                          checked={value}
                          disabled={loading}
                          onChange={() => handleTogglePermission(admin._id, key, value)}
                        />

                        <div className="pp-perm-top">
                          <span className="pp-perm-key">{key}</span>
                          {/* Visual toggle (click bubbles to label → triggers onChange) */}
                          <div className="pp-toggle" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={value}
                              disabled={loading}
                              onChange={() => handleTogglePermission(admin._id, key, value)}
                            />
                            <div className="pp-toggle-track" />
                            <div className="pp-toggle-thumb" style={{
                              transform: value ? "translateX(14px)" : "translateX(0)"
                            }} />
                          </div>
                        </div>


                      </label>
                    ))}
                  </div>
                </div>

              </div>
            ))
          )}

        </div>
      </div>
    </>
  );
}
