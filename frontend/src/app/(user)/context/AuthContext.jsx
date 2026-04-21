"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const BASE = process.env.NEXT_PUBLIC_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const res = await axios.get(`${BASE}/api/auth/me`);
    return res.data;
  };

  useEffect(() => {
    loadUser()
      .then((data) => {
        if (data?.id) setUser(data);
        else setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const authenticate = async (mode, payload) => {
    const endpoint = mode === "signup" ? "signup" : "login";
    const res = await axios.post(`${BASE}/api/auth/${endpoint}`, payload);
    const { user: userData } = res.data || {};

    if (!userData?.id) {
      throw new Error("Authentication response is incomplete.");
    }

    login(userData);
    return userData;
  };

  const logout = async () => {
    await axios.post(`${BASE}/api/auth/logout`);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, authenticate }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
