"use client";
import Link from "next/link";
import QuantityControl from "./QuantityControl";

const BASE = process.env.NEXT_PUBLIC_API_URL;
const resolveImageUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${BASE}${value}`;
};

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
  const imageLabel = isBox ? "BOX" : "NO IMAGE";
  const selections = (() => {
    if (!isBox || !item.selections_json) return [];
    try {
      const parsed = JSON.parse(item.selections_json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();
  const boxImage = resolveImageUrl(item.cover_image);
  const productImage = resolveImageUrl(item.image);

  return (
    <div className="cart-item">
      <div className="cart-item-img">
        {!isBox ? (
          <Link
            href={`/product/${item.product_id}`}
            className="cart-item-link"
            aria-label={`View ${item.name}`}
          >
            {productImage ? (
              <img src={productImage} alt={item.name} />
            ) : (
              <div className="cart-no-img">{imageLabel}</div>
            )}
          </Link>
        ) : (
          <>
            {boxImage ? (
              <img src={boxImage} alt={item.name} />
            ) : (
              <div className="cart-no-img">{imageLabel}</div>
            )}
          </>
        )}
      </div>

      <div className="cart-item-body">
        <div className="cart-item-top">
          <div className="cart-item-copy">
            <span className="cart-item-brand">
              {isBox ? "Build Your Box" : (item.brand_name ?? item.category_name ?? "-")}
            </span>
            {!isBox ? (
              <Link href={`/product/${item.product_id}`} className="cart-item-link cart-item-name-link">
                <h3 className="cart-item-name">{item.name}</h3>
              </Link>
            ) : (
              <h3 className="cart-item-name">{item.name}</h3>
            )}
            <div className="cart-item-meta">
              {isBox ? (
                <span>{selections.length} items selected</span>
              ) : (
                <span>{item.size}</span>
              )}
            </div>
            {isBox && selections.length > 0 && (
              <div className="cart-box-selection-list">
                {selections.map((selection, index) => (
                  <Link
                    key={`${selection.product_id || selection.variant_id || selection.name || "selection"}-${index}`}
                    href={selection.product_id ? `/product/${selection.product_id}` : "/shop"}
                    className="cart-box-selection cart-box-selection-link"
                  >
                    {`1 x ${selection.name || "Selected item"}${selection.size ? ` (${selection.size})` : ""}`}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="cart-item-bottom">
          <div className="cart-item-pricing">
            <div className="cart-price">
              {item.discount_price ? (
                <>
                  <span className="cart-price-now">
                    Rs {Number(item.discount_price).toLocaleString("en-IN")}
                  </span>
                  <span className="cart-price-old">
                    Rs {Number(item.price).toLocaleString("en-IN")}
                  </span>
                </>
              ) : (
                <span className="cart-price-now">
                  Rs {Number(item.price).toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {/* <div className="cart-subtotal">
              Rs {Number(subtotal).toLocaleString("en-IN")}
            </div> */}
          </div>

          <div className="cart-item-actions">
            <QuantityControl
              value={Number(item.quantity) || 1}
              onChange={onQuantityChange}
              disabled={busy}
              max={maxQty}
            />
            <button
              className="cart-remove"
              onClick={onRemove}
              disabled={busy}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
