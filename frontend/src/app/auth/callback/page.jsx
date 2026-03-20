"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallback() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { login }    = useAuth();

  useEffect(() => {
    const token    = searchParams.get("token");
    const error    = searchParams.get("error");
    const returnTo = localStorage.getItem("returnTo") || "/";

    if (error || !token) {
      router.push("/");
      return;
    }

    // ✅ Save token immediately before anything else
    localStorage.setItem("token", token);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // ✅ Handle both array and object response
        const userData = Array.isArray(data) ? data[0] : data;

        if (userData && userData.id) {
          login(token, userData);
          localStorage.removeItem("returnTo");
          router.push(returnTo);
        } else {
          localStorage.removeItem("token");
          router.push("/");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/");
      });
  }, []);

  return (
    <div style={{
      minHeight:      "100vh",
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      background:     "#0A0A0A",
      gap:            "1rem",
    }}>
      <div style={{
        width:        40,
        height:       40,
        borderRadius: "50%",
        border:       "2px solid #2a2418",
        borderTop:    "2px solid #C9A84C",
        animation:    "spin 0.8s linear infinite",
      }} />
      <p style={{
        color:         "#7A7264",
        fontFamily:    "Tenor Sans, sans-serif",
        fontSize:      "0.7rem",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
      }}>
        Signing you in...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}