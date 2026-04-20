"use client";
import { useState } from "react";

const formatDate = (value) => {
  if (!value) return "";
  const dt = new Date(value);
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export default function OrderCard({ order, onCancel, isCancelling }) {
  const [open, setOpen] = useState(false);
  const items = Array.isArray(order.items) ? order.items : [];
  const total = Number(order.grand_total || order.total_amount || 0);
  const cancellableStatuses = new Set(["pending", "confirmed", "processing"]);
  const canCancel = cancellableStatuses.has(order.status);

  return (
    <div className="orders-card">
      <div className="orders-card-header">
        <div>
          <div className="orders-id">Order #{order.id.slice(0, 8).toUpperCase()}</div>
          <div className="orders-meta">
            <span>{formatDate(order.created_at)}</span>
            <span className={`orders-status ${order.status}`}>{order.status}</span>
            <span className="orders-payment">{order.payment_status}</span>
          </div>
        </div>
        <div className="orders-total">Rs.{total.toLocaleString("en-IN")}</div>
      </div>

      <div className="orders-actions">
        <button type="button" className="orders-toggle" onClick={() => setOpen(!open)}>
          {open ? "Hide items" : `View items (${items.length})`}
        </button>
        {canCancel && onCancel && (
          <button
            type="button"
            className="orders-cancel-btn"
            onClick={() => onCancel(order.id)}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Cancel order"}
          </button>
        )}
      </div>

      {open && (
        <div className="orders-items">
          {items.map((item) => (
            <div key={item.id} className="orders-item">
              <div className="orders-item-img">
                {item.item_type !== "box" && item.image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`}
                    alt={item.product_name}
                  />
                ) : (
                  <div className="orders-no-img">{item.item_type === "box" ? "BOX" : "NO IMAGE"}</div>
                )}
              </div>
              <div className="orders-item-body">
                <div className="orders-item-name">
                  {item.item_type === "box" ? item.box_name : item.product_name}
                </div>
                <div className="orders-item-meta">
                  {item.item_type === "box"
                    ? `Custom box | Qty ${item.quantity}`
                    : `${item.size} | Qty ${item.quantity}`
                  }
                </div>
              </div>
              <div className="orders-item-price">
                Rs.{Number(item.line_total || 0).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
