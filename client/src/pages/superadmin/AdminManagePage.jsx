import { useState, useEffect } from "react";
import API from "../../api/axiosInstance";
import toast from "react-hot-toast";

// Add to index.html <head>:
// <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />

const STYLE = `
  :root {
    --saffron:        #FF9933;
    --saffron-deep:   #E8851A;
    --saffron-glow:   rgba(255,153,51,0.30);
    --saffron-soft:   rgba(255,153,51,0.10);
    --saffron-pale:   #FFF5E6;
    --saffron-border: rgba(255,153,51,0.22);
    --green:          #138808;
    --green-light:    #22a020;
    --green-glow:     rgba(19,136,8,0.22);
    --green-soft:     rgba(19,136,8,0.08);
    --green-pale:     #EEF7EE;
    --bg:             #FEF8F0;
    --surface:        #FFFFFF;
    --surface2:       #FDFAF5;
    --border:         rgba(220,200,170,0.55);
    --text-dark:      #1C1A16;
    --text-mid:       #5A5040;
    --text-soft:      #9A8E7A;
    --text-faint:     #C4B89A;
    --red:            #E53935;
    --red-soft:       rgba(229,57,53,0.08);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ap-wrap { min-height: 100vh; background: var(--bg); }
  .ap-main { display: flex; flex-direction: column; overflow-x: hidden; }

  .ap-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 75% 55% at 8% 0%,  rgba(255,153,51,0.13) 0%, transparent 65%),
      radial-gradient(ellipse 60% 45% at 92% 95%, rgba(19,136,8,0.08)  0%, transparent 60%),
      linear-gradient(160deg, #FFF8EE 0%, #FEFCF5 50%, #F8FFF4 100%);
  }
  .ap-dots {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: radial-gradient(circle, rgba(255,153,51,0.12) 1px, transparent 1px);
    background-size: 26px 26px;
  }
  .ap-orb-1 {
    position: fixed; top: -120px; left: -100px; width: 480px; height: 480px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,153,51,0.16) 0%, transparent 65%);
    filter: blur(72px); pointer-events: none; z-index: 0;
    animation: orb1 13s ease-in-out infinite;
  }
  .ap-orb-2 {
    position: fixed; bottom: -130px; right: -110px; width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle, rgba(19,136,8,0.12) 0%, transparent 65%);
    filter: blur(80px); pointer-events: none; z-index: 0;
    animation: orb2 16s ease-in-out infinite;
  }
  @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(55px,45px) scale(1.08)} 70%{transform:translate(-25px,65px) scale(.93)} }
  @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 45%{transform:translate(-55px,-38px) scale(1.1)} 75%{transform:translate(28px,-55px) scale(.92)} }

  .ap-content {
    position: relative; z-index: 1;
    max-width: 1120px; width: 100%; margin: 0 auto;
    padding: 1.25rem 1rem 3rem;
  }
  @media (min-width: 640px)  { .ap-content { padding: 1.75rem 1.5rem 3.5rem; } }
  @media (min-width: 1024px) { .ap-content { padding: 2rem 2rem 4rem; } }

  .ap-accent-line {
    height: 3px; border-radius: 2px;
    background: linear-gradient(90deg, var(--saffron) 0%, var(--green) 100%);
    margin-bottom: 1.5rem; box-shadow: 0 2px 10px rgba(255,153,51,0.30);
    position: relative; overflow: hidden;
  }
  .ap-accent-line::after {
    content: ''; position: absolute; left: 0; top: -2px;
    width: 56px; height: 7px; background: var(--saffron);
    border-radius: 4px; filter: blur(4px);
    animation: scanLine 3s ease-in-out infinite;
  }
  @keyframes scanLine { 0%{left:0} 100%{left:calc(100% - 56px)} }

  .ap-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 1.5rem; gap: .75rem; flex-wrap: wrap;
  }
  .ap-header-left { display: flex; align-items: center; gap: .75rem; flex: 1; min-width: 0; }
  .ap-logo-wrap {
    width: 44px; height: 44px; border-radius: 13px;
    background: linear-gradient(135deg, var(--saffron), var(--saffron-deep));
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 20px var(--saffron-glow), 0 0 0 3px rgba(255,153,51,0.15);
    flex-shrink: 0; animation: logoFloat 4s ease-in-out infinite;
  }
  @media (min-width: 640px) { .ap-logo-wrap { width: 54px; height: 54px; border-radius: 16px; } }
  @keyframes logoFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  .ap-logo-wrap svg { width: 22px; height: 22px; color: #fff; }
  .ap-header-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.25rem, 5vw, 2.4rem);
    font-weight: 800; line-height: 1.1; color: var(--text-dark);
  }
  .ap-header-sub { font-size: .82rem; color: var(--text-soft); margin-top: .25rem; line-height: 1.5; }

  .ap-panel-badge {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: .5rem 1rem; text-align: right;
    box-shadow: 0 2px 12px rgba(255,153,51,0.08); flex-shrink: 0;
    align-self: flex-start; display: none;
  }
  @media (min-width: 768px) { .ap-panel-badge { display: block; } }
  .ap-panel-label { font-size: .62rem; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; color: var(--text-faint); margin-bottom: .15rem; }
  .ap-panel-role  { font-family: 'Syne', sans-serif; font-size: .9rem; font-weight: 700; color: var(--saffron); }

  .ap-tabs {
    display: flex; gap: .3rem;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 30px; padding: .3rem;
    margin-bottom: 1.5rem; box-shadow: 0 2px 12px rgba(255,153,51,0.08);
    width: 100%; overflow-x: auto;
  }
  @media (min-width: 480px) { .ap-tabs { width: fit-content; gap: .45rem; padding: .38rem; } }
  .ap-tab {
    display: flex; align-items: center; gap: .35rem;
    padding: .5rem .9rem; border-radius: 18px; border: none;
    background: none; font-family: 'Outfit', sans-serif;
    font-size: .8rem; font-weight: 500; color: var(--text-soft);
    cursor: pointer; transition: all .2s ease; white-space: nowrap;
    flex: 1; justify-content: center;
  }
  @media (min-width: 480px) { .ap-tab { font-size: .9rem; padding: .58rem 1.35rem; flex: unset; justify-content: flex-start; } }
  .ap-tab:hover { color: var(--text-dark); background: var(--saffron-soft); }
  .ap-tab.active-create { background: linear-gradient(135deg, var(--saffron), var(--saffron-deep)); color: #fff; box-shadow: 0 4px 14px var(--saffron-glow); font-weight: 600; }
  .ap-tab.active-toggle { background: linear-gradient(135deg, var(--saffron-deep), var(--saffron)); color: #fff; box-shadow: 0 4px 14px var(--saffron-glow); font-weight: 600; }
  .ap-tab.active-delete { background: linear-gradient(135deg, var(--red), #c62828); color: #fff; box-shadow: 0 4px 14px rgba(229,57,53,0.32); font-weight: 600; }
  .ap-tab svg { width: 14px; height: 14px; flex-shrink: 0; }
  @media (min-width: 480px) { .ap-tab svg { width: 16px; height: 16px; } }
  .ap-tab-label { display: none; }
  @media (min-width: 380px) { .ap-tab-label { display: inline; } }

  .ap-card {
    background: var(--surface); border: 1px solid var(--saffron-border);
    border-radius: 22px; overflow: hidden;
    box-shadow: 0 4px 24px rgba(255,153,51,0.09);
    transition: box-shadow .22s ease;
  }
  .ap-card:hover { box-shadow: 0 8px 32px rgba(255,153,51,0.14); }

  .ap-card-header {
    padding: 1rem 1.25rem; display: flex; align-items: center; gap: .75rem;
    border-bottom: 1px solid var(--border); position: relative; overflow: hidden;
    background: var(--surface2);
  }
  @media (min-width: 640px) { .ap-card-header { padding: 1.4rem 2rem; gap: 1rem; } }
  .ap-card-header::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,153,51,0.06) 0%,transparent 55%); pointer-events:none; }
  .ap-card-header.green-tint::before { background:linear-gradient(135deg,rgba(19,136,8,0.07) 0%,transparent 55%); }
  .ap-card-header.red-tint::before   { background:linear-gradient(135deg,rgba(229,57,53,0.07) 0%,transparent 55%); }

  .ap-card-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  @media (min-width:640px) { .ap-card-icon { width:42px; height:42px; border-radius:12px; } }
  .ap-card-icon.saffron { background:linear-gradient(135deg,var(--saffron),var(--saffron-deep)); box-shadow:0 4px 14px var(--saffron-glow); }
  .ap-card-icon.green   { background:linear-gradient(135deg,var(--green),var(--green-light));   box-shadow:0 4px 14px var(--green-glow); }
  .ap-card-icon.red     { background:linear-gradient(135deg,var(--red),#c62828); box-shadow:0 4px 14px rgba(229,57,53,0.32); }
  .ap-card-icon svg { width:18px; height:18px; color:#fff; }

  .ap-card-title    { font-family:'Syne',sans-serif; font-size:1.05rem; font-weight:700; color:var(--text-dark); line-height:1.2; }
  @media (min-width:640px) { .ap-card-title { font-size:1.2rem; } }
  .ap-card-subtitle { font-size:.78rem; color:var(--text-soft); margin-top:.2rem; }
  .ap-card-body     { padding:1.25rem; }
  @media (min-width:640px) { .ap-card-body { padding:2rem; } }
  .ap-card-divider  { height:1px; background:linear-gradient(90deg,var(--saffron) 0%,rgba(19,136,8,0.5) 50%,transparent 100%); margin:0 1.25rem; opacity:.3; }
  @media (min-width:640px) { .ap-card-divider { margin:0 2rem; } }

  .ap-section-label { display:flex; align-items:center; gap:.5rem; font-size:.71rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--saffron); margin-bottom:1.1rem; }
  .ap-section-label::before { content:''; display:inline-block; width:6px; height:6px; background:var(--saffron); border-radius:50%; box-shadow:0 0 6px var(--saffron); }
  .ap-form-grid { display:grid; grid-template-columns:1fr; gap:1rem; }
  @media (min-width:640px) { .ap-form-grid { grid-template-columns:1fr 1fr; } }
  @media (min-width:900px) { .ap-form-grid { grid-template-columns:1fr 1fr 1fr; } }

  .ap-field { display:flex; flex-direction:column; gap:.38rem; }
  .ap-label { font-size:.77rem; font-weight:600; color:var(--text-mid); letter-spacing:.03em; }
  .ap-label .req { color:var(--red); margin-left:2px; }
  .ap-input {
    width:100%; background:#FAFAF6; border:1.5px solid #E8E0D0;
    border-radius:10px; padding:.75rem 1rem;
    font-family:'Outfit',sans-serif; font-size:.94rem;
    color:var(--text-dark); outline:none; transition:all .2s ease;
  }
  .ap-input::placeholder { color:var(--text-faint); }
  .ap-input:focus { border-color:var(--saffron); background:var(--saffron-pale); box-shadow:0 0 0 3px rgba(255,153,51,0.14); }

  .ap-form-footer {
    display:flex; align-items:center; justify-content:space-between;
    flex-wrap:wrap; gap:.75rem; margin-top:1.25rem;
    padding-top:1.1rem; border-top:1px solid var(--border);
  }
  .ap-form-hint { font-size:.79rem; color:var(--text-faint); font-style:italic; }

  .ap-btn-primary {
    display:flex; align-items:center; gap:.5rem;
    background:linear-gradient(135deg,var(--green),var(--green-light));
    color:#fff; font-family:'Outfit',sans-serif; font-weight:600; font-size:.9rem;
    padding:.75rem 1.5rem; border:none; border-radius:10px;
    cursor:pointer; transition:all .22s ease; box-shadow:0 4px 14px var(--green-glow);
    position:relative; overflow:hidden; width:100%;
  }
  @media (min-width:480px) { .ap-btn-primary { width:auto; font-size:.94rem; padding:.8rem 2rem; } }
  .ap-btn-primary::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.18),transparent); opacity:0; transition:opacity .2s; }
  .ap-btn-primary:hover { transform:translateY(-2px); box-shadow:0 7px 22px var(--green-glow); }
  .ap-btn-primary:hover::before { opacity:1; }
  .ap-btn-primary:active { transform:translateY(0); }
  .ap-btn-primary svg { width:17px; height:17px; }

  .ap-btn-toggle { background:none; border:1.5px solid rgba(255,153,51,0.45); color:var(--saffron-deep); font-family:'Outfit',sans-serif; font-weight:600; font-size:.82rem; padding:.4rem 1rem; border-radius:20px; cursor:pointer; transition:all .2s; }
  .ap-btn-toggle:hover { background:var(--saffron-soft); border-color:var(--saffron); box-shadow:0 0 10px var(--saffron-glow); }
  .ap-btn-delete { background:none; border:1.5px solid rgba(229,57,53,0.38); color:var(--red); font-family:'Outfit',sans-serif; font-weight:600; font-size:.82rem; padding:.4rem 1rem; border-radius:20px; cursor:pointer; transition:all .2s; }
  .ap-btn-delete:hover { background:var(--red-soft); border-color:var(--red); box-shadow:0 0 10px rgba(229,57,53,0.22); }

  .badge-active   { display:inline-flex; align-items:center; gap:.35rem; padding:.26rem .78rem; border-radius:20px; font-size:.75rem; font-weight:600; background:var(--green-pale); color:var(--green); border:1px solid rgba(19,136,8,0.25); }
  .badge-active::before   { content:''; width:6px; height:6px; background:var(--green); border-radius:50%; box-shadow:0 0 5px rgba(19,136,8,0.5); }
  .badge-inactive { display:inline-flex; align-items:center; gap:.35rem; padding:.26rem .78rem; border-radius:20px; font-size:.75rem; font-weight:600; background:#FBE9E7; color:#D84315; border:1px solid rgba(229,57,53,0.22); }
  .badge-inactive::before { content:''; width:6px; height:6px; background:#D84315; border-radius:50%; }

  .ap-table-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }
  .ap-table { width:100%; border-collapse:collapse; font-size:.88rem; min-width:420px; }
  .ap-table thead tr { background:linear-gradient(90deg,var(--saffron-pale) 0%,var(--green-pale) 100%); border-bottom:1px solid var(--border); }
  .ap-table thead th { padding:.8rem 1rem; text-align:left; font-weight:700; font-size:.69rem; letter-spacing:.09em; text-transform:uppercase; color:var(--text-mid); }
  .ap-table tbody tr { border-bottom:1px solid #F2ECE2; transition:background .15s; }
  .ap-table tbody tr:hover { background:#FFF8EE; }
  .ap-table tbody td { padding:.85rem 1rem; color:var(--text-dark); }
  .ap-table tbody td.td-email { color:var(--text-soft); font-size:.84rem; }
  .empty-row td { padding:0; }

  .ap-empty { display:flex; flex-direction:column; align-items:center; gap:1rem; padding:2.5rem 1.5rem; }
  .ap-empty-icon { width:58px; height:58px; border-radius:16px; background:var(--saffron-soft); border:1.5px solid var(--saffron-border); display:flex; align-items:center; justify-content:center; }
  .ap-empty-icon svg { width:26px; height:26px; color:var(--saffron); opacity:.7; }
  .ap-empty-title { font-family:'Syne',sans-serif; font-weight:700; color:var(--text-mid); font-size:.95rem; }
  .ap-empty-sub   { font-size:.8rem; color:var(--text-soft); text-align:center; }

  .mob-item { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:.9rem 1.1rem; display:flex; justify-content:space-between; align-items:center; gap:.75rem; transition:all .18s ease; box-shadow:0 1px 6px rgba(255,153,51,0.06); }
  .mob-item:hover { box-shadow:0 4px 16px rgba(255,153,51,0.13); border-color:var(--saffron-border); }
  .mob-name  { font-weight:600; font-size:.91rem; color:var(--text-dark); }
  .mob-email { font-size:.77rem; color:var(--text-soft); margin-top:.12rem; word-break:break-all; }
  .mob-badge { margin-top:.38rem; }

  .mobile-only  { display:flex; flex-direction:column; gap:.65rem; }
  .desktop-only { display:none; }
  @media (min-width:768px) { .mobile-only{display:none;} .desktop-only{display:block;} }

  .modal-overlay { position:fixed; inset:0; background:rgba(60,40,10,0.35); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; z-index:50; padding:1rem; }
  .modal-box { background:var(--surface); border:1px solid var(--border); border-radius:30px; padding:1.5rem; width:100%; max-width:22rem; box-shadow:0 24px 64px rgba(60,40,10,0.18); animation:modalIn .22s cubic-bezier(.34,1.56,.64,1); }
  @media (min-width:480px) { .modal-box { padding:2rem; } }
  @keyframes modalIn { from{opacity:0;transform:scale(.88) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
  .modal-stripe { height:3px; border-radius:2px; margin-bottom:1.2rem; background:linear-gradient(90deg,var(--saffron) 33%,#fff 33% 66%,var(--green) 66%); }
  .modal-title  { font-family:'Syne',sans-serif; font-size:1.08rem; font-weight:700; color:var(--text-dark); margin-bottom:.5rem; }
  .modal-body   { font-size:.87rem; color:var(--text-mid); margin-bottom:1.4rem; line-height:1.6; }
  .modal-body strong { color:var(--text-dark); }
  .modal-actions { display:flex; justify-content:flex-end; gap:.65rem; flex-wrap:wrap; }
  .btn-cancel { background:none; border:1.5px solid #D8D0C4; color:var(--text-mid); font-family:'Outfit',sans-serif; font-weight:500; font-size:.88rem; padding:.55rem 1.2rem; border-radius:10px; cursor:pointer; transition:all .2s; }
  .btn-cancel:hover { border-color:var(--text-mid); background:#F5F2EC; }
  .btn-confirm-delete { background:linear-gradient(135deg,var(--red),#c62828); color:#fff; font-family:'Outfit',sans-serif; font-weight:600; font-size:.88rem; padding:.55rem 1.3rem; border:none; border-radius:10px; cursor:pointer; transition:all .2s; box-shadow:0 3px 12px rgba(229,57,53,0.32); }
  .btn-confirm-delete:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(229,57,53,0.4); }
`;

export default function AdminManagePage({ mode: propMode }) {
  const [activeMode, setActiveMode] = useState(propMode || "create");
  const [admins, setAdmins]         = useState([]);
  const [form, setForm]             = useState({ name: "", email: "", password: "" });
  const [deleteModal, setDeleteModal]   = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => { if (propMode) setActiveMode(propMode); }, [propMode]);

  const fetchAdmins = async () => {
    const toastId = toast.loading("Fetching admins...");
    try {
      const res = await API.get("/superadmin/users");
      setAdmins(res.data.data);
      toast.dismiss(toastId);
    } catch (err) { toast.error("Failed to fetch admins", { id: toastId }); }
  };
  useEffect(() => { fetchAdmins(); }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating admin...");
    try {
      await API.post("/superadmin/users", form);
      toast.success("Admin created successfully", { id: toastId });
      setForm({ name: "", email: "", password: "" });
      fetchAdmins();
    } catch (err) { toast.error(err.response?.data?.message || "Failed to create admin", { id: toastId }); }
  };

  const toggleStatus = async (id) => {
    const toastId = toast.loading("Updating status...");
    try {
      await API.patch(`/superadmin/users/${id}/toggle-status`);
      toast.success("Admin status updated", { id: toastId });
      fetchAdmins();
    } catch { toast.error("Failed to update status", { id: toastId }); }
  };

  const openDeleteModal = (admin) => { setSelectedAdmin(admin); setDeleteModal(true); };

  const deleteAdmin = async () => {
    if (!selectedAdmin) return;
    const toastId = toast.loading("Deleting admin...");
    try {
      await API.delete(`/superadmin/users/${selectedAdmin._id}`);
      toast.success("Admin deleted successfully", { id: toastId });
      setDeleteModal(false);
      fetchAdmins();
    } catch { toast.error("Failed to delete admin", { id: toastId }); }
  };

  const EmptyState = () => (
    <div className="ap-empty">
      <div className="ap-empty-icon">
        <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
        </svg>
      </div>
      <p className="ap-empty-title">No admins found</p>
      <p className="ap-empty-sub">Admins will appear here once created</p>
    </div>
  );

  return (
    <>
      <style>{STYLE}</style>
      <div className="ap-bg" /><div className="ap-dots" />
      <div className="ap-orb-1" /><div className="ap-orb-2" />

      <div className="ap-wrap">
        <div className="ap-main">
          <div className="ap-content">
            <div className="ap-accent-line" />

            <div className="ap-header">
              <div className="ap-header-left">
                <div className="ap-logo-wrap">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <div className="ap-header-title">Admin Portal</div>
                  <div className="ap-header-sub">Manage administrators — create, toggle access, or remove users.</div>
                </div>
              </div>
              <div className="ap-panel-badge">
                <div className="ap-panel-label">Panel</div>
                <div className="ap-panel-role">Super Admin</div>
              </div>
            </div>

            <div className="ap-tabs">
              <button className={`ap-tab ${activeMode==="create"?"active-create":""}`} onClick={()=>setActiveMode("create")}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
                <span className="ap-tab-label">Create Admin</span>
              </button>
              <button className={`ap-tab ${activeMode==="toggle"?"active-toggle":""}`} onClick={()=>setActiveMode("toggle")}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                <span className="ap-tab-label">Toggle Status</span>
              </button>
              <button className={`ap-tab ${activeMode==="delete"?"active-delete":""}`} onClick={()=>setActiveMode("delete")}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                <span className="ap-tab-label">Delete Admin</span>
              </button>
            </div>

            {activeMode==="create" && (
              <div className="ap-card">
                <div className="ap-card-header green-tint">
                  <div className="ap-card-icon green">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
                  </div>
                  <div>
                    <div className="ap-card-title">Create New Admin</div>
                    <div className="ap-card-subtitle">Fill in the details below to add a new administrator</div>
                  </div>
                </div>
                <div className="ap-card-divider" />
                <div className="ap-card-body">
                  <div className="ap-section-label">Account Details</div>
                  <form onSubmit={handleCreateAdmin}>
                    <div className="ap-form-grid">
                      <div className="ap-field">
                        <label className="ap-label">Full Name <span className="req">*</span></label>
                        <input type="text" placeholder="John Doe" value={form.name} required onChange={(e)=>setForm({...form,name:e.target.value})} className="ap-input" />
                      </div>
                      <div className="ap-field">
                        <label className="ap-label">Email Address <span className="req">*</span></label>
                        <input type="email" placeholder="admin@company.com" value={form.email} required onChange={(e)=>setForm({...form,email:e.target.value})} className="ap-input" />
                      </div>
                      <div className="ap-field">
                        <label className="ap-label">Password <span className="req">*</span></label>
                        <input type="password" placeholder="••••••••" value={form.password} required onChange={(e)=>setForm({...form,password:e.target.value})} className="ap-input" />
                      </div>
                    </div>
                    <div className="ap-form-footer">
                      <span className="ap-form-hint"><span style={{color:"var(--red)"}}>*</span> All fields are required</span>
                      <button type="submit" className="ap-btn-primary">
                        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Create Admin
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeMode==="toggle" && (
              <div className="ap-card">
                <div className="ap-card-header">
                  <div className="ap-card-icon saffron">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                  </div>
                  <div>
                    <div className="ap-card-title">Admin Status Control</div>
                    <div className="ap-card-subtitle">Enable or disable admin access instantly</div>
                  </div>
                </div>
                <div className="ap-card-divider" />
                <div className="ap-card-body mobile-only">
                  {admins.length===0?<EmptyState/>:admins.map(admin=>(
                    <div key={admin._id} className="mob-item">
                      <div style={{minWidth:0}}>
                        <div className="mob-name">{admin.name}</div>
                        <div className="mob-email">{admin.email}</div>
                        <div className="mob-badge"><span className={admin.isActive?"badge-active":"badge-inactive"}>{admin.isActive?"Active":"Inactive"}</span></div>
                      </div>
                      <button onClick={()=>toggleStatus(admin._id)} className="ap-btn-toggle" style={{flexShrink:0}}>Toggle</button>
                    </div>
                  ))}
                </div>
                <div className="desktop-only ap-table-wrap">
                  <table className="ap-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {admins.length===0?<tr className="empty-row"><td colSpan="4"><EmptyState/></td></tr>
                      :admins.map(admin=>(
                        <tr key={admin._id}>
                          <td style={{fontWeight:500}}>{admin.name}</td>
                          <td className="td-email">{admin.email}</td>
                          <td><span className={admin.isActive?"badge-active":"badge-inactive"}>{admin.isActive?"Active":"Inactive"}</span></td>
                          <td><button onClick={()=>toggleStatus(admin._id)} className="ap-btn-toggle">Toggle</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeMode==="delete" && (
              <div className="ap-card">
                <div className="ap-card-header red-tint">
                  <div className="ap-card-icon red">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
                  </div>
                  <div>
                    <div className="ap-card-title">Remove Admins</div>
                    <div className="ap-card-subtitle">Permanently delete admin accounts — this cannot be undone</div>
                  </div>
                </div>
                <div className="ap-card-divider" />
                <div className="ap-card-body mobile-only">
                  {admins.length===0?<EmptyState/>:admins.map(admin=>(
                    <div key={admin._id} className="mob-item">
                      <div style={{minWidth:0}}>
                        <div className="mob-name">{admin.name}</div>
                        <div className="mob-email">{admin.email}</div>
                      </div>
                      <button onClick={()=>openDeleteModal(admin)} className="ap-btn-delete" style={{flexShrink:0}}>Delete</button>
                    </div>
                  ))}
                </div>
                <div className="desktop-only ap-table-wrap">
                  <table className="ap-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Action</th></tr></thead>
                    <tbody>
                      {admins.length===0?<tr className="empty-row"><td colSpan="3"><EmptyState/></td></tr>
                      :admins.map(admin=>(
                        <tr key={admin._id}>
                          <td style={{fontWeight:500}}>{admin.name}</td>
                          <td className="td-email">{admin.email}</td>
                          <td><button onClick={()=>openDeleteModal(admin)} className="ap-btn-delete">Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {deleteModal && (
              <div className="modal-overlay">
                <div className="modal-box">
                  <div className="modal-stripe" />
                  <div className="modal-title">Delete Admin</div>
                  <div className="modal-body">Are you sure you want to permanently delete <strong>{selectedAdmin?.name}</strong>? This action cannot be undone.</div>
                  <div className="modal-actions">
                    <button onClick={()=>setDeleteModal(false)} className="btn-cancel">Cancel</button>
                    <button onClick={deleteAdmin} className="btn-confirm-delete">Yes, Delete</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
