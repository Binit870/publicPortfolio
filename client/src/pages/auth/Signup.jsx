import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "./Authpage.css";

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

export default function Signup() {
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

  const strength       = pwStrength(password);
  const passwordsMatch = confirm && password === confirm;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!name)                return setError("Please enter your full name.");
    if (!email)               return setError("Please enter your email address.");
    if (!password)            return setError("Please enter a password.");
    if (password.length < 6)  return setError("Password must be at least 6 characters.");
    if (password !== confirm)  return setError("Passwords do not match!");

    setLoading(true);
    try {
      await signup({ name, email, password });
      toast.success(`Welcome, ${name}! 🎉`);
      setSuccess(`Account created! Welcome, ${name}! 🎉`);
      setTimeout(() => navigate("/"), 1300);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Signup failed. Please try again.";
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
        {/* ── Banner ── */}
        <div className="auth-banner">
          <div className="banner-icon-ring">✨</div>
          <div className="banner-title">Create Account</div>
          <div className="banner-subtitle">Sign up and start your journey today</div>
        </div>

        {/* ── Body ── */}
        <div className="auth-body">
          {error   && <div className="auth-alert error">{error}</div>}
          {success && <div className="auth-alert success">{success}</div>}

          <form className="auth-form" onSubmit={handleSignup}>
            {/* Name */}
            <div className="field-wrap">
              <span className="field-prefix">👤</span>
              <input
                className="auth-input"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className="field-wrap">
              <span className="field-prefix">📧</span>
              <input
                className="auth-input"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="field-wrap">
              <span className="field-prefix">🔒</span>
              <input
                className="auth-input"
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <span className="field-suffix" onClick={() => setShowPw(p => !p)}>
                {showPw ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Password strength bars */}
            {password && (
              <>
                <div className="pw-strength-bars">
                  {[1,2,3,4].map(i => (
                    <div
                      key={i}
                      className={`pw-bar ${
                        strength.score >= i
                          ? strength.score <= 1 ? "active-weak"
                          : strength.score <= 2 ? "active-medium"
                          : "active-strong"
                          : ""
                      }`}
                    />
                  ))}
                </div>
                <div className="pw-strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </div>
              </>
            )}

            {/* Confirm Password */}
            <div className="field-wrap">
              <span className="field-prefix">🔑</span>
              <input
                className="auth-input"
                type={showCf ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
              <span className="field-suffix" onClick={() => setShowCf(p => !p)}>
                {showCf ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Match hint */}
            {confirm && (
              <div className="match-hint" style={{ color: passwordsMatch ? "#27ae60" : "#e74c3c" }}>
                {passwordsMatch ? "✅ Passwords match" : "❌ Passwords don't match"}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <><div className="btn-spinner"/>Creating Account…</> : "🚀 Create Account"}
            </button>

            {/* Terms */}
            <div className="terms-text">
              By signing up, you agree to our&nbsp;
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </div>

            {/* Divider */}
            <div className="auth-divider">
              <div className="divider-line"/>
              <span className="divider-or">OR</span>
              <div className="divider-line"/>
            </div>

            {/* Switch to Login */}
            <div className="auth-switch">
              Already have an account?&nbsp;
              <button type="button" className="switch-cta" onClick={() => navigate("/login")}>Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}