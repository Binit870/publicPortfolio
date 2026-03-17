import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// ─── Inject CSS once ──────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("auth-global-styles")) return;
  const style = document.createElement("style");
  style.id = "auth-global-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    .auth-root {
      min-height:100vh; display:flex; align-items:center; justify-content:center;
      background:linear-gradient(135deg,#d44f00 0%,#ff7700 35%,#ff9933 65%,#ffb347 100%);
      font-family:'Nunito',sans-serif; position:relative; overflow:hidden;
    }
    .auth-orb {
      position:absolute; border-radius:50%;
      background:rgba(255,255,255,0.09);
      animation:orbFloat 8s ease-in-out infinite; pointer-events:none;
    }
    .auth-orb:nth-child(1){ width:380px;height:380px;top:-130px;left:-120px;animation-delay:0s; }
    .auth-orb:nth-child(2){ width:240px;height:240px;bottom:-90px;right:-70px;animation-delay:3s; }
    .auth-orb:nth-child(3){ width:160px;height:160px;top:60%;left:5%;animation-delay:5.5s; }
    .auth-orb:nth-child(4){ width:100px;height:100px;top:15%;right:8%;animation-delay:1.5s; }
    .auth-orb:nth-child(5){ width:60px;height:60px;bottom:20%;left:30%;animation-delay:4s; }
    @keyframes orbFloat {
      0%,100%{transform:translateY(0) rotate(0deg);}
      33%{transform:translateY(-20px) rotate(5deg);}
      66%{transform:translateY(10px) rotate(-3deg);}
    }
    .auth-card {
      position:relative; width:460px; background:#fff; border-radius:28px;
      box-shadow:0 30px 80px rgba(0,0,0,0.25),0 0 0 1px rgba(255,255,255,0.15);
      overflow:hidden; animation:cardEntrance 0.7s cubic-bezier(0.22,1,0.36,1) both; z-index:10;
    }
    @keyframes cardEntrance {
      from{opacity:0;transform:translateY(70px) scale(0.92);}
      to{opacity:1;transform:translateY(0) scale(1);}
    }
    .auth-banner {
      background:linear-gradient(135deg,#FF6600 0%,#ff8c00 50%,#FFB347 100%);
      padding:38px 40px 30px; text-align:center; position:relative; overflow:hidden;
    }
    .auth-banner::before {
      content:''; position:absolute; inset:0;
      background:radial-gradient(ellipse at 25% 40%,rgba(255,255,255,0.22) 0%,transparent 55%);
      pointer-events:none;
    }
    .auth-banner::after {
      content:''; position:absolute; bottom:-2px; left:0; right:0; height:20px;
      background:#fff; border-radius:50% 50% 0 0/100% 100% 0 0;
    }
    .banner-icon-ring {
      width:74px;height:74px; background:rgba(255,255,255,0.22);
      border:2px solid rgba(255,255,255,0.35); border-radius:50%;
      display:flex;align-items:center;justify-content:center; font-size:34px;
      margin:0 auto 14px; backdrop-filter:blur(10px); box-shadow:0 10px 28px rgba(0,0,0,0.12);
      animation:iconBounce 0.6s 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    @keyframes iconBounce {
      from{transform:scale(0) rotate(-40deg);opacity:0;}
      to{transform:scale(1) rotate(0deg);opacity:1;}
    }
    .banner-title { font-size:28px;font-weight:900;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,0.15);animation:slideDown 0.5s 0.45s ease both; }
    .banner-subtitle { font-size:13.5px;color:rgba(255,255,255,0.88);margin-top:5px;animation:slideDown 0.5s 0.55s ease both; }
    @keyframes slideDown { from{opacity:0;transform:translateY(-10px);}to{opacity:1;transform:translateY(0);} }
    .auth-body { padding:20px 20px 1px; }
    .auth-alert { border-radius:12px;padding:11px 14px;font-size:13px;font-weight:700;text-align:center;margin-bottom:18px; }
    .auth-alert.error { background:#fff2f2;border:1.5px solid #ffb3b3;color:#cc0000;animation:alertShake 0.4s ease; }
    .auth-alert.success { background:#f0fff4;border:1.5px solid #7ed9a0;color:#1a7a3a;animation:fadeSlide 0.35s ease both; }
    @keyframes alertShake { 0%,100%{transform:translateX(0);}20%{transform:translateX(-8px);}60%{transform:translateX(6px);} }
    @keyframes fadeSlide { from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);} }
    .auth-form { display:flex;flex-direction:column;gap:15px; }
    .field-wrap { position:relative;display:flex;align-items:center; }
    .field-wrap:nth-child(1){animation:fieldIn 0.4s 0.10s ease both;}
    .field-wrap:nth-child(2){animation:fieldIn 0.4s 0.18s ease both;}
    .field-wrap:nth-child(3){animation:fieldIn 0.4s 0.26s ease both;}
    .field-wrap:nth-child(4){animation:fieldIn 0.4s 0.34s ease both;}
    @keyframes fieldIn { from{opacity:0;transform:translateX(-18px);}to{opacity:1;transform:translateX(0);} }
    .field-prefix { position:absolute;left:14px;font-size:17px;pointer-events:none;z-index:1; }
    .field-suffix { position:absolute;right:14px;font-size:17px;cursor:pointer;transition:transform 0.25s;user-select:none; }
    .field-suffix:hover { transform:scale(1.2); }
    .auth-input {
      width:100%; padding:14px 44px; border:2px solid #ffe4c4; border-radius:14px;
      font-size:14.5px; font-family:'Nunito',sans-serif; font-weight:600;
      background:#fffaf5; color:#333; outline:none;
      transition:border-color 0.3s,box-shadow 0.3s,transform 0.2s,background 0.25s;
    }
    .auth-input:focus { border-color:#FF9933;box-shadow:0 0 0 4px rgba(255,153,51,0.18);transform:translateY(-2px);background:#fff; }
    .auth-input::placeholder { color:#c9b9a6;font-weight:500; }
    .pw-strength-bars { display:flex;gap:5px;margin-top:-6px; }
    .pw-bar { flex:1;height:4px;border-radius:4px;background:#f0ddc8;transition:background 0.4s; }
    .pw-bar.active-weak   { background:#e74c3c; }
    .pw-bar.active-medium { background:#f39c12; }
    .pw-bar.active-strong { background:#27ae60; }
    .pw-strength-label { font-size:11.5px;font-weight:800;text-align:right;margin-top:-6px;transition:color 0.3s; }
    .match-hint { font-size:12px;font-weight:700;text-align:right;margin-top:-8px; }
    .auth-submit {
      width:100%; padding:15px;
      background:linear-gradient(135deg,#1a9e36,#2ECC71);
      color:#fff; border:none; border-radius:14px;
      font-size:16px; font-weight:900; font-family:'Nunito',sans-serif;
      cursor:pointer; letter-spacing:0.4px;
      box-shadow:0 8px 24px rgba(26,158,54,0.4);
      transition:transform 0.2s,box-shadow 0.2s,background 0.3s;
      display:flex;align-items:center;justify-content:center;gap:8px;
      position:relative;overflow:hidden; animation:fieldIn 0.4s 0.5s ease both;
    }
    .auth-submit::before {
      content:'';position:absolute;inset:0;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
      transform:translateX(-100%);transition:transform 0.6s;
    }
    .auth-submit:hover::before { transform:translateX(100%); }
    .auth-submit:hover:not(:disabled) { transform:translateY(-3px);box-shadow:0 14px 36px rgba(26,158,54,0.48);background:linear-gradient(135deg,#178a2f,#25b861); }
    .auth-submit:active:not(:disabled) { transform:translateY(0); }
    .auth-submit:disabled { opacity:0.72;cursor:not-allowed; }
    .btn-spinner { width:20px;height:20px;border:3px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.75s linear infinite; }
    @keyframes spin { to{transform:rotate(360deg);} }
    .auth-divider { display:flex;align-items:center;gap:10px;animation:fieldIn 0.4s 0.58s ease both; }
    .divider-line { flex:1;height:1.5px;background:#ffe4c4;border-radius:2px; }
    .divider-or { font-size:12px;font-weight:800;color:#c9a882; }
    .auth-switch { text-align:center; padding-bottom:15px; font-size:13.5px;color:#aaa;animation:fieldIn 0.4s 0.65s ease both; }
    .switch-cta { color:#FF6600;font-weight:900;background:none;border:none;font-family:'Nunito',sans-serif;font-size:13.5px;cursor:pointer;transition:color 0.2s; }
    .switch-cta:hover { color:#cc4400;text-decoration:underline; }
    .terms-text { font-size:11.5px;color:#bbb;font-weight:600;text-align:center;line-height:1.6;animation:fieldIn 0.4s 0.7s ease both; }
    .terms-text a { color:#FF6600;text-decoration:none; }
    .terms-text a:hover { text-decoration:underline; }
    @media(max-width:500px) {
      .auth-card{width:95vw;} .auth-body{padding:17px 20px 20px;}
      .auth-banner{padding:30px 20px 24px;} .banner-title{font-size:24px;}
    }
  `;
  document.head.appendChild(style);
};

// ─── Password strength ────────────────────────────────────────────────────────
const pwStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 6)  s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#e74c3c", "#f39c12", "#27ae60", "#1a9e36"];
  return { score: Math.min(s, 4), label: labels[s] || "Weak", color: colors[s] || "#e74c3c" };
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Signup() {
  useEffect(() => { injectStyles(); }, []);

  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [showCf,   setShowCf]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const strength          = pwStrength(password);
  const passwordsMatch    = confirm && password === confirm;
  const passwordsMismatch = confirm && password !== confirm;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    // client-side validation
    if (!name)               return setError("Please enter your full name.");
    if (!email)              return setError("Please enter your email address.");
    if (!password)           return setError("Please enter a password.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match!");

    setLoading(true);
    try {
      // ✅ FIX: pass ONE object — matches AuthContext: signup(data)
      // which calls: API.post("/auth/signup", data)
      await signup({ name, email, password });

      toast.success(`Welcome, ${name}! 🎉`);
      setSuccess(`Account created! Welcome, ${name}! 🎉`);
      setTimeout(() => navigate("/"), 1300); // change to your dashboard route
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Signup failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-orb"/><div className="auth-orb"/>
      <div className="auth-orb"/><div className="auth-orb"/><div className="auth-orb"/>

      <div className="auth-card">
        <div className="auth-banner">
          <div className="banner-icon-ring">✨</div>
          <div className="banner-title">Create Account</div>
          <div className="banner-subtitle">Sign up and start your journey today</div>
        </div>

    <div className="min-h-screen flex">

      {/* LEFT ILLUSTRATION */}

      <div className="hidden lg:flex w-1/2 bg-orange-400 items-center justify-center relative overflow-hidden">

        <div className="absolute w-[600px] h-[600px] bg-orange-300 rounded-full bottom-[-200px] left-[-200px]" />



      </div>

      {/* RIGHT FORM */}

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white">

        <div className="w-full max-w-md p-10">

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>

          <p className="text-gray-500 mb-6">
            Signup to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              placeholder="Name"
              required
              className="w-full border-b-2 p-3 focus:outline-none focus:border-orange-400"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              required
              className="w-full border-b-2 p-3 focus:outline-none focus:border-orange-400"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="w-full border-b-2 p-3 focus:outline-none focus:border-orange-400"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full transition"
            >
              SIGNUP
            </button>

            <div className="terms-text">
              By signing up, you agree to our&nbsp;
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </div>

            <div className="auth-divider">
              <div className="divider-line"/>
              <span className="divider-or">OR</span>
              <div className="divider-line"/>
            </div>

            <div className="auth-switch">
              Already have an account?&nbsp;
              <button type="button" className="switch-cta" onClick={() => navigate("/login")}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
