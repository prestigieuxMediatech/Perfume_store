"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "./order-success.css";

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="success-page">
      <section className="success-hero">
        <div className="success-hero-glow" />
        <div className="success-wrap">
          <div className="success-eyebrow">
            <span />
            Order Confirmed
            <span />
          </div>
          <h1 className="success-heading">
            Thank You<em>For Your Order</em>
          </h1>
          <p className="success-sub">
            Your fragrance is being prepared with care. We will notify you when it ships.
          </p>
        </div>
        <div className="success-hero-orn">
          <span>*</span>
        </div>
      </section>

      <section className="success-content">
        <div className="success-wrap">
          <div className="success-card">
            <div className="success-id-label">Order ID</div>
            <div className="success-id">{orderId || "Pending"}</div>
            <p className="success-note">
              We have emailed the receipt and order details for your records.
            </p>
            <Link href="/shop" className="success-cta">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
