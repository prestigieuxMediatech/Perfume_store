import "./components/styles/layout.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";

import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export default function UserLayout({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="user-shell">
            <SiteHeader />
            <main className="user-content">{children}</main>
            <SiteFooter />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
