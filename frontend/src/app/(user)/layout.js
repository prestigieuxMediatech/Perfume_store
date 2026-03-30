import "./components/styles/layout.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export default function UserLayout({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <SiteHeader />
        {children}
        <SiteFooter />
      </CartProvider>
    </AuthProvider>
  );
}
