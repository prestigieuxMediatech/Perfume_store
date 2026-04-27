"use client";
import Link from "next/link";

const resolveImageUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${process.env.NEXT_PUBLIC_API_URL}${value}`;
};

const parseSelections = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function OrderSummary({ items, subtotal, shippingFee, grandTotal, loading }) {
  return (
    <div className="checkout-card">
      <div className="checkout-card-title">Order Summary</div>

      {loading ? (
        <div className="checkout-skeletons">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="checkout-skeleton" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="checkout-empty">No items in cart.</div>
      ) : (
        <div className="checkout-items">
          {items.map((item) => {
            const price = Number(item.discount_price || item.price) || 0;
            const selections = item.item_type === "box"
              ? parseSelections(item.selections_json)
              : [];
            const imageUrl = item.item_type === "box"
              ? resolveImageUrl(item.cover_image)
              : resolveImageUrl(item.image);

            return (
              <div key={item.id} className="checkout-item">
                <div className="checkout-item-img">
                  {imageUrl ? (
                    <img src={imageUrl} alt={item.name} />
                  ) : (
                    <div className="checkout-no-img">
                      {item.item_type === "box" ? "BOX" : "NO IMAGE"}
                    </div>
                  )}
                </div>
                <div className="checkout-item-body">
                  {item.item_type === "box" ? (
                    <div className="checkout-item-name">{item.name}</div>
                  ) : (
                    <Link
                      href={`/product/${item.product_id}`}
                      className="checkout-item-name checkout-item-link"
                    >
                      {item.quantity} x {item.name}
                    </Link>
                  )}
                  <div className="checkout-item-meta">
                    {item.item_type === "box"
                      ? `Custom box | Qty ${item.quantity}`
                      : `${item.size} | Qty ${item.quantity}`}
                  </div>
                  {item.item_type === "box" && selections.length > 0 && (
                    <div className="checkout-box-selection-list">
                      {selections.map((selection, index) => (
                        <Link
                          key={`${selection.product_id || selection.variant_id || selection.name || "selection"}-${index}`}
                          href={selection.product_id ? `/product/${selection.product_id}` : "/shop"}
                          className="checkout-box-selection checkout-box-selection-link"
                        >
                          {`1 x ${selection.name || "Selected item"}${selection.size ? ` (${selection.size})` : ""}`}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <div className="checkout-item-price">
                  Rs.{(price * Number(item.quantity || 0)).toLocaleString("en-IN")}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="checkout-summary-row">
        <span>Subtotal</span>
        <span>Rs.{Number(subtotal).toLocaleString("en-IN")}</span>
      </div>
      <div className="checkout-summary-row muted">
        <span>Shipping</span>
        <span>{shippingFee > 0 ? `Rs.${Number(shippingFee).toLocaleString("en-IN")}` : "Free"}</span>
      </div>
      <div className="checkout-summary-divider" />
      <div className="checkout-summary-total">
        <span>Grand Total</span>
        <span>Rs.{Number(grandTotal).toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
