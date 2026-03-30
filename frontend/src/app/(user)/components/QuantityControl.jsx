"use client";

export default function QuantityControl({
  value,
  min = 1,
  max = 10,
  onChange,
  disabled = false,
}) {
  const decDisabled = disabled || value <= min;
  const incDisabled = disabled || value >= max;

  return (
    <div className="cart-qty">
      <button
        className="cart-qty-btn"
        onClick={() => !decDisabled && onChange(value - 1)}
        disabled={decDisabled}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="cart-qty-value">{value}</span>
      <button
        className="cart-qty-btn"
        onClick={() => !incDisabled && onChange(value + 1)}
        disabled={incDisabled}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
