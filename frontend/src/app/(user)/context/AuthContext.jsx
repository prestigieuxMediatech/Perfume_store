"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const BASE = process.env.NEXT_PUBLIC_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    return !!localStorage.getItem("token");
  });

  const loadUser = async (token) => {
    const res = await axios.get(`${BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    loadUser(token)
      .then((data) => {
        if (data?.id) setUser(data);
        else localStorage.removeItem("token");
      })
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const authenticate = async (mode, payload) => {
    const endpoint = mode === "signup" ? "signup" : "login";
    const res = await axios.post(`${BASE}/api/auth/${endpoint}`, payload);
    const { token, user: userData } = res.data || {};

    if (!token || !userData?.id) {
      throw new Error("Authentication response is incomplete.");
    }

    login(token, userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, authenticate }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
