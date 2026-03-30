"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import "./cart.css";

const MAX_QTY = 10;

export default function CartPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, loading, error, total, updateItem, removeItem, clearCart } =
    useCart();

  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      localStorage.setItem("returnTo", "/cart");
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleQtyChange = async (item, qty) => {
    if (qty < 1 || qty > MAX_QTY) return;
    setBusyId(item.id);
    setNotice("");
    const res = await updateItem(item.id, qty);
    if (!res.ok) setNotice(res.message || "Could not update quantity");
    setBusyId(null);
  };

  const handleRemove = async (item) => {
    setBusyId(item.id);
    setNotice("");
    const res = await removeItem(item.id);
    if (!res.ok) setNotice(res.message || "Could not remove item");
    setBusyId(null);
  };

  const handleClear = async () => {
    setNotice("");
    const res = await clearCart();
    if (!res.ok) setNotice(res.message || "Could not clear cart");
  };

  if (authLoading) {
    return (
      <div className="cart-loading">
        <div className="cart-spinner" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="cart-page">
      <section className="cart-hero">
        <div className="cart-hero-glow" />
        <div className="cart-wrap">
          <div className="cart-eyebrow">
            <span />
            Your Selections
            <span />
          </div>
          <h1 className="cart-heading">
            Shopping<em>Cart</em>
          </h1>
          <p className="cart-sub">
            Review your selections and refine the quantities before checkout.
          </p>
          {!loading && (
            <p className="cart-count">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </p>
          )}
        </div>
        <div className="cart-hero-orn">
          <span>◇</span>
        </div>
      </section>

      <section className="cart-content">
        <div className="cart-wrap">
          {loading ? (
            <div className="cart-skeletons">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="cart-skeleton" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">◇</div>
              <h3 className="cart-empty-title">Your cart is empty</h3>
              <p className="cart-empty-sub">
                Explore the collection and add your next signature scent.
              </p>
              <Link href="/shop" className="cart-browse-btn">
                Browse the Collection →
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    busy={busyId === item.id}
                    maxQty={MAX_QTY}
                    onQuantityChange={(qty) => handleQtyChange(item, qty)}
                    onRemove={() => handleRemove(item)}
                  />
                ))}
                {(notice || error) && (
                  <div className="cart-notice">
                    {notice || error}
                  </div>
                )}
              </div>

              <aside className="cart-summary">
                <div className="cart-summary-card">
                  <div className="cart-summary-title">Order Summary</div>
                  <div className="cart-summary-row">
                    <span>Subtotal</span>
                    <span>₹{Number(total).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="cart-summary-row muted">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="cart-summary-divider" />
                  <div className="cart-summary-total">
                    <span>Total</span>
                    <span>₹{Number(total).toLocaleString("en-IN")}</span>
                  </div>
                  <button
                    className="cart-checkout-btn"
                    onClick={() => router.push("/checkout")}
                  >
                    Proceed to Checkout
                  </button>
                  <button className="cart-clear-btn" onClick={handleClear}>
                    Clear Cart
                  </button>
                  <p className="cart-summary-note">
                    Secure payments. Free returns within 7 days.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
