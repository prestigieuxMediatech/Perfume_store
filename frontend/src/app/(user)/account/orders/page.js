"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import OrderCard from "../../components/OrderCard";
import "./orders.css";

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      localStorage.setItem("returnTo", "/account/orders");
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/orders`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load orders");
          setOrders([]);
        } else {
          const items = Array.isArray(data) ? data : [];
          setOrders(items);
        }
      } catch (err) {
        setError("Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancel = async (orderId) => {
    if (!orderId || !user) return;
    const ok = window.confirm("Are you sure you want to cancel this order?");
    if (!ok) return;

    setActionError("");
    setCancellingId(orderId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/orders/${orderId}/cancel`,
        {
          method: "PUT",
          credentials: "include"
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.message || "Failed to cancel order");
        return;
      }
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: data.status || "cancelled" } : order
        )
      );
    } catch (err) {
      setActionError("Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="orders-loading">
        <div className="orders-spinner" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="orders-page">
      <section className="orders-hero">
        <div className="orders-hero-glow" />
        <div className="orders-wrap">
          <div className="orders-eyebrow">
            <span />
            My Orders
            <span />
          </div>
          <h1 className="orders-heading">
            Your<em>Orders</em>
          </h1>
          <p className="orders-sub">
            Track each order and revisit the fragrances you loved.
          </p>
        </div>
        <div className="orders-hero-orn">
          <span>*</span>
        </div>
      </section>

      <section className="orders-content">
        <div className="orders-wrap">
          {actionError ? (
            <div className="orders-action-error">{actionError}</div>
          ) : null}
          {loading ? (
            <div className="orders-skeletons">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="orders-skeleton" />
              ))}
            </div>
          ) : error ? (
            <div className="orders-empty">
              <div className="orders-empty-icon">*</div>
              <h3 className="orders-empty-title">Could not load orders</h3>
              <p className="orders-empty-sub">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="orders-empty">
              <div className="orders-empty-icon">*</div>
              <h3 className="orders-empty-title">No orders yet</h3>
              <p className="orders-empty-sub">
                Discover your next fragrance and place your first order.
              </p>
              <Link href="/shop" className="orders-browse-btn">
                Browse the Collection
              </Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancel={handleCancel}
                  isCancelling={cancellingId === order.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
