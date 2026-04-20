"use client";
import QuantityControl from "./QuantityControl";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
  busy = false,
  maxQty = 10,
}) {
  const unit = Number(item.discount_price || item.price) || 0;
  const subtotal = unit * (Number(item.quantity) || 0);
  const isBox = item.item_type === "box";
  const selections = (() => {
    if (!isBox || !item.selections_json) return [];
    try {
      const parsed = JSON.parse(item.selections_json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  return (
    <div className="cart-item">
      <div className="cart-item-img">
        {item.image && !isBox ? (
          <img src={`${BASE}${item.image}`} alt={item.name} />
        ) : (
          <div className="cart-no-img">{isBox ? "BOX" : "NO IMAGE"}</div>
        )}
      </div>

      <div className="cart-item-body">
        <div className="cart-item-top">
          <div>
            <span className="cart-item-brand">
              {isBox ? "Build Your Box" : (item.brand_name ?? item.category_name ?? "—")}
            </span>
            <h3 className="cart-item-name">{item.name}</h3>
            <div className="cart-item-meta">
              {isBox ? (
                <span>{selections.length} items selected</span>
              ) : (
                <span>{item.size}</span>
              )}
            </div>
          </div>
          <button
            className="cart-remove"
            onClick={onRemove}
            disabled={busy}
          >
            Remove
          </button>
        </div>

        <div className="cart-item-bottom">
          <div className="cart-price">
            {item.discount_price ? (
              <>
                <span className="cart-price-now">
                  ₹{Number(item.discount_price).toLocaleString("en-IN")}
                </span>
                <span className="cart-price-old">
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </span>
              </>
            ) : (
              <span className="cart-price-now">
                ₹{Number(item.price).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <QuantityControl
            value={Number(item.quantity) || 1}
            onChange={onQuantityChange}
            disabled={busy}
            max={maxQty}
          />

          <div className="cart-subtotal">
            ₹{Number(subtotal).toLocaleString("en-IN")}
          </div>
        </div>
      </div>
    </div>
  );
}
