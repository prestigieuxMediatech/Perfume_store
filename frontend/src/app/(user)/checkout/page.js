"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CheckoutForm from "../components/CheckoutForm";
import OrderSummary from "../components/OrderSummary";
import "./checkout.css";

const initialForm = {
  full_name: "",
  phone: "",
  email: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, loading, total, refresh } = useCart();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const [notice, setNotice] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      localStorage.setItem("returnTo", "/checkout");
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        full_name: prev.full_name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const subtotal = useMemo(() => Number(total) || 0, [total]);
  const shippingFee = 0;
  const grandTotal = subtotal + shippingFee;

  const validate = () => {
    const nextErrors = {};
    const required = [
      "full_name",
      "phone",
      "email",
      "address_line1",
      "city",
      "state",
      "postal_code",
      "country",
    ];

    required.forEach((field) => {
      if (!String(form[field] || "").trim()) {
        nextErrors[field] = "Required";
      }
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Invalid email";
    }

    return nextErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2800);
  };

  const handlePlaceOrder = async () => {
    setNotice("");
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;
    if (items.length === 0) {
      setNotice("Your cart is empty.");
      return;
    }

    setPlacing(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...form,
            payment_method: paymentMethod,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setNotice(data.message || "Could not place order");
        showToast("error", "Error placing order");
        return;
      }

      await refresh();
      showToast("success", "Order placed successfully");
      router.push(`/order-success?orderId=${data.order_id}`);
    } catch (err) {
      setNotice("Could not place order");
      showToast("error", "Error placing order");
    } finally {
      setPlacing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="checkout-loading">
        <div className="checkout-spinner" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="checkout-page">
      <section className="checkout-hero">
        <div className="checkout-hero-glow" />
        <div className="checkout-wrap">
          <div className="checkout-eyebrow">
            <span />
            Secure Checkout
            <span />
          </div>
          <h1 className="checkout-heading">
            Finalize<em>Your Order</em>
          </h1>
          <p className="checkout-sub">
            Share your delivery details and confirm your order securely.
          </p>
        </div>
        <div className="checkout-hero-orn">
          <span>*</span>
        </div>
      </section>

      <section className="checkout-content">
        <div className="checkout-wrap">
          {items.length === 0 && !loading ? (
            <div className="checkout-empty">
              <div className="checkout-empty-icon">*</div>
              <h3 className="checkout-empty-title">Your cart is empty</h3>
              <p className="checkout-empty-sub">
                Add your signature fragrance before checkout.
              </p>
              <Link href="/shop" className="checkout-browse-btn">
                Browse the Collection 
              </Link>
            </div>
          ) : (
            <div className="checkout-layout">
              <div className="checkout-left">
                <CheckoutForm values={form} errors={errors} onChange={handleChange} />

                <div className="checkout-card">
                  <div className="checkout-card-title">Payment Method</div>
                  <div className="checkout-payments">
                    <label className="checkout-radio">
                      <input
                        type="radio"
                        name="payment_method"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                      />
                      <span>Cash on Delivery</span>
                      <span className="checkout-badge">Available</span>
                    </label>

                    <label className="checkout-radio disabled">
                      <input type="radio" name="payment_method" disabled />
                      <span>Razorpay / Online</span>
                      <span className="checkout-badge muted">Coming Soon</span>
                    </label>
                  </div>
                </div>

                {notice && <div className="checkout-notice">{notice}</div>}
              </div>

              <aside className="checkout-right">
                <OrderSummary
                  items={items}
                  subtotal={subtotal}
                  shippingFee={shippingFee}
                  grandTotal={grandTotal}
                  loading={loading}
                />

                <button
                  className="checkout-place-btn"
                  onClick={handlePlaceOrder}
                  disabled={placing || items.length === 0}
                >
                  {placing ? "Placing Order..." : "Place Order"}
                </button>
              </aside>
            </div>
          )}
        </div>
      </section>

      {toast && (
        <div className={`checkout-toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}
