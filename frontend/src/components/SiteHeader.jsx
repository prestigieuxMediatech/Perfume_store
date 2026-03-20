"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import "./styles/layout.css";

// Letter avatar component
function Avatar({ name, size = 28 }) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  const colors = [
    "#E8472A", "#2A7BE8", "#2AE8A0", "#E8A02A",
    "#8A2AE8", "#E82A72", "#2AE8E8", "#72E82A"
  ];
  const bg = colors[name ? name.charCodeAt(0) % colors.length : 0];

  return (
    <div style={{
      width:           size,
      height:          size,
      borderRadius:    "50%",
      background:      bg,
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "center",
      fontSize:        size * 0.42,
      fontWeight:      500,
      color:           "#fff",
      fontFamily:      "Tenor Sans, sans-serif",
      flexShrink:      0,
      userSelect:      "none",
    }}>
      {initial}
    </div>
  );
}

export default function SiteHeader() {
  const pathname                  = usePathname();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout }          = useAuth();

  const isActive = (path) => (pathname === path ? "active" : "");

  const handleUserClick = () => {
    if (user) {
      setDropdownOpen(!dropdownOpen);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <header className="site-header">

        <Link href="/" className="site-logo">Aurum</Link>

        <nav>
          <ul className="site-nav">
            <li><Link href="/"        className={isActive("/")}>Home</Link></li>
            <li><Link href="/about"   className={isActive("/about")}>About</Link></li>
            <li><Link href="/shop"    className={isActive("/shop")}>Shop</Link></li>
            <li><Link href="/contact" className={isActive("/contact")}>Contact</Link></li>
          </ul>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="site-icons">

            <button aria-label="Wishlist">
              <Heart size={18} strokeWidth={1.5} />
            </button>

            <div className="icon-wrap">
              <button aria-label="Cart">
                <ShoppingCart size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div style={{ position: "relative" }}>
              <button
                aria-label="Account"
                onClick={handleUserClick}
                style={{
                  display:    "flex",
                  alignItems: "center",
                  gap:        "5px",
                  background: "transparent",
                  border:     "none",
                  cursor:     "pointer",
                  padding:    0,
                }}
              >
                {user ? (
                  <>
                    <Avatar name={user.name} size={28} />
                    <ChevronDown size={12} strokeWidth={1.5} color="#7A7264" />
                  </>
                ) : (
                  <User size={18} strokeWidth={1.5} />
                )}
              </button>

              {user && dropdownOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-name">{user.name}</div>
                  <div className="user-dropdown-email">{user.email}</div>
                  <div className="user-dropdown-divider" />
                  <Link
                    href="/account/orders"
                    className="user-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/account/wishlist"
                    className="user-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <div className="user-dropdown-divider" />
                  <button
                    className="user-dropdown-logout"
                    onClick={() => { logout(); setDropdownOpen(false); }}
                  >
                    <LogOut size={13} strokeWidth={1.5} />
                    Sign out
                  </button>
                </div>
              )}
            </div>

          </div>

          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span /><span /><span />
          </button>
        </div>

      </header>

      <nav className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <Link href="/"        className={isActive("/")}        onClick={() => setMenuOpen(false)}>Home</Link>
        <Link href="/about"   className={isActive("/about")}   onClick={() => setMenuOpen(false)}>About</Link>
        <Link href="/shop"    className={isActive("/shop")}    onClick={() => setMenuOpen(false)}>Shop</Link>
        <Link href="/contact" className={isActive("/contact")} onClick={() => setMenuOpen(false)}>Contact</Link>
      </nav>

      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </>
  );
}