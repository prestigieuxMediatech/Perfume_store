"use client";
import React, { useState } from "react";
import './login.css';
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setServerError("");

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Invalid email format");
        valid = false;
      }
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("adminName",res.data.admin.name);
      localStorage.setItem("adminEmail",res.data.admin.email);
      router.push("/admin/dashboard");
    } catch (err) {
      // Show server error
      setServerError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <div className="login-monogram">
          <span className="sigil">N O I R</span>
        </div>

        <h2>Admin Login</h2>
        <p className="subtitle">Welcome back</p>

        <div className="login-divider">
          <span />
          <em>enter</em>
          <span />
        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="text"
              name="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <span className="error">{emailError}</span>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <span className="error">{passwordError}</span>}
          </div>

          {serverError && <span className="error">{serverError}</span>}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}
