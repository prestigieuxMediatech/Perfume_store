"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  LayoutDashboard, Package,
  ShoppingBag, LogOut, Menu, X, Tag, Layers, Gift, FileText
} from "lucide-react";
import "./admin.css";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Categories", href: "/admin/categories", icon: Tag           },
  { label: "Brands",     href: "/admin/brands",     icon: Layers          },
  { label: "Products",  href: "/admin/products",  icon: Package          },
  { label: "Boxes",     href: "/admin/boxes",     icon: Gift             },
  { label: "Blogs",     href: "/admin/blogs",     icon: FileText         },
  { label: "Orders",    href: "/admin/orders",    icon: ShoppingBag      },
];

export default function AdminPanelLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [admin, setAdmin]         = useState(null);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => {
    let isActive = true;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/me`)
      .then((res) => {
        if (!isActive) return;

        const adminData = res.data?.admin || null;
        if (!adminData?.id) {
          router.push("/admin/login");
          return;
        }

        setAdmin(adminData);
        localStorage.setItem("adminName", adminData.name);
        localStorage.setItem("adminEmail", adminData.email);
      })
      .catch(() => {
        if (isActive) router.push("/admin/login");
      })
      .finally(() => {
        if (isActive) setMounted(true);
      });

    return () => {
      isActive = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/logout`);
    } finally {
      localStorage.removeItem("adminName");
      localStorage.removeItem("adminEmail");
      router.push("/admin/login");
    }
  };

  if (!mounted) {
    return (
      <div style={{
        minHeight:      "100vh",
        background:     "#0A0A0A",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
      }}>
        <div style={{
          width:        36,
          height:       36,
          borderRadius: "50%",
          border:       "2px solid #2a2418",
          borderTop:    "2px solid #C9A84C",
          animation:    "spin 0.8s linear infinite",
        }}/>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="ad-layout">

      <aside className={`ad-sidebar ${collapsed ? "collapsed" : ""}`}>

        <div className="ad-sb-head">
          {!collapsed && <span className="ad-logo">7EVEN</span>}
          <button
            className="ad-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed
              ? <Menu size={14} strokeWidth={1.5}/>
              : <X    size={14} strokeWidth={1.5}/>
            }
          </button>
        </div>

        <nav className="ad-nav">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`ad-nav-item ${pathname === href ? "active" : ""}`}
            >
              <Icon size={14} strokeWidth={1.5} style={{ flexShrink:0 }}/>
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        <div className="ad-sb-foot">
          {!collapsed && admin && (
            <div className="ad-admin-info">
              <div className="ad-admin-name">{admin.name}</div>
              <div className="ad-admin-role">Administrator</div>
            </div>
          )}
          <button className="ad-logout" onClick={handleLogout}>
            <LogOut size={14} strokeWidth={1.5} style={{ flexShrink:0 }}/>
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

      </aside>

      <div className="ad-main">
        <div className="ad-topbar">
          <span className="ad-page-title">
            {navItems.find(n => n.href === pathname)?.label ?? "Admin"}
          </span>
          <span className="ad-date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long", year: "numeric",
              month:   "long", day:  "numeric"
            })}
          </span>
        </div>
        <div className="ad-content">
          {children}
        </div>
      </div>

    </div>
  );
}
