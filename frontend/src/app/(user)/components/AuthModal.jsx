"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./styles/AuthModal.css"

export default function AuthModal({ onClose }) {
  const overlayRef = useRef(null);
  const { authenticate } = useAuth();
  const [mode, setMode] = useState("login");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleGoogleLogin = () => {
    localStorage.setItem("returnTo", window.location.pathname);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  };

  const subtitle = useMemo(
    () =>
      mode === "login"
        ? "Sign in with email, password, or Google"
        : "Create your account in a few quick steps",
    [mode]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await authenticate(
        mode,
        mode === "signup"
          ? form
          : { email: form.email, password: form.password }
      );
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to continue right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="auth-modal">

        <button className="auth-close" onClick={onClose}>
          <X size={16} strokeWidth={1.5} />
        </button>

        <div className="auth-logo">7EVEN</div>
        <div className="auth-tagline">Luxury Perfumes</div>
        <div className="auth-divider-line" />

        <h2 className="auth-title">Welcome</h2>
        <p className="auth-sub">{subtitle}</p>

        <div className="auth-switcher" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={`auth-switch-btn${mode === "login" ? " active" : ""}`}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-switch-btn${mode === "signup" ? " active" : ""}`}
            onClick={() => {
              setMode("signup");
              setError("");
            }}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="auth-grid">
              <label className="auth-field">
                <span>First Name</span>
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="Aarav"
                  autoComplete="given-name"
                  required
                />
              </label>
              <label className="auth-field">
                <span>Last Name</span>
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Sharma"
                  autoComplete="family-name"
                  required
                />
              </label>
            </div>
          )}

          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </label>

          {mode === "signup" && (
            <label className="auth-field">
              <span>Phone Number</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                required
              />
            </label>
          )}

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={mode === "signup" ? "Minimum 8 characters" : "Enter your password"}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting
              ? mode === "signup"
                ? "Creating Account..."
                : "Signing In..."
              : mode === "signup"
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span />
          <small>Or continue with</small>
          <span />
        </div>

        <button className="auth-google-btn" onClick={handleGoogleLogin}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="auth-terms">
          By continuing you agree to our Terms & Privacy Policy
        </p>

      </div>
    </div>
  );
}
