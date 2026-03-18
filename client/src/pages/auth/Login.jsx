import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "./Authpage.css"; // ← adjust path to match your project

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

// ─── Role-based redirect helper ───────────────────────────────────────────────
const redirectByRole = (role, navigate) => {
  if (role === "superadmin") navigate("/superadmin/dashboard");
  else if (role === "admin") navigate("/admin/dashboard");
  else navigate("/");
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Login() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const strength = pwStrength(password);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!email)    return setError("Please enter your email address.");
    if (!password) return setError("Please enter your password.");

    setLoading(true);
    try {
      const user = await login({ email, password });
      toast.success(`Welcome back, ${user.name}! 🎉`);
      setSuccess(`Welcome back, ${user.name}! Redirecting...`);
      redirectByRole(user.role, navigate);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
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
        {/* ─ Banner ─ */}
        <div className="auth-banner">
          <div className="banner-icon-ring">🔐</div>
          <div className="banner-title">Welcome Back!</div>
          <div className="banner-subtitle">Login to continue your journey</div>
        </div>

        {/* ─ Body ─ */}
        <div className="auth-body auth-body--login">
          {error   && <div className="auth-alert error">{error}</div>}
          {success && <div className="auth-alert success">{success}</div>}

          <form className="auth-form auth-form--login" onSubmit={handleLogin} noValidate>
            {/* Email */}
            <div className="field-wrap">
              <span className="field-prefix">📧</span>
              <input
                className="auth-input"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <span className="field-suffix" onClick={() => setShowPw(p => !p)}>
                {showPw ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Password strength */}
            {password && (
              <>
                <div className="pw-strength-bars">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`pw-bar ${
                      i <= strength.score
                        ? strength.score <= 1 ? "active-weak"
                        : strength.score <= 2 ? "active-medium"
                        : "active-strong" : ""
                    }`}/>
                  ))}
                </div>
                <div className="pw-strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </div>
              </>
            )}

            {/* Forgot */}
            <div className="forgot-row">
              <a href="#">Forgot Password?</a>
            </div>

            {/* Submit */}
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? <span className="btn-spinner"/> : "Login →"}
            </button>

            <div className="auth-divider">
              <div className="divider-line"/>
              <span className="divider-or">OR</span>
              <div className="divider-line"/>
            </div>

            <div className="auth-switch">
              Don't have an account?&nbsp;
              <button type="button" className="switch-cta" onClick={() => navigate("/signup")}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}