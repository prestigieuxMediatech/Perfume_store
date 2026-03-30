"use client";

export default function CheckoutForm({ values, errors, onChange }) {
  return (
    <div className="checkout-card">
      <div className="checkout-card-title">Shipping Details</div>
      <div className="checkout-grid">
        <div className="checkout-field">
          <label>Full Name</label>
          <input
            name="full_name"
            value={values.full_name}
            onChange={onChange}
            placeholder="Full name"
          />
          {errors.full_name && <span className="checkout-error">{errors.full_name}</span>}
        </div>

        <div className="checkout-field">
          <label>Phone</label>
          <input
            name="phone"
            value={values.phone}
            onChange={onChange}
            placeholder="Mobile number"
          />
          {errors.phone && <span className="checkout-error">{errors.phone}</span>}
        </div>

        <div className="checkout-field">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={values.email}
            onChange={onChange}
            placeholder="Email address"
          />
          {errors.email && <span className="checkout-error">{errors.email}</span>}
        </div>

        <div className="checkout-field">
          <label>Address Line 1</label>
          <input
            name="address_line1"
            value={values.address_line1}
            onChange={onChange}
            placeholder="House, street, area"
          />
          {errors.address_line1 && (
            <span className="checkout-error">{errors.address_line1}</span>
          )}
        </div>

        <div className="checkout-field">
          <label>Address Line 2</label>
          <input
            name="address_line2"
            value={values.address_line2}
            onChange={onChange}
            placeholder="Apartment, suite, landmark"
          />
        </div>

        <div className="checkout-field">
          <label>City</label>
          <input
            name="city"
            value={values.city}
            onChange={onChange}
            placeholder="City"
          />
          {errors.city && <span className="checkout-error">{errors.city}</span>}
        </div>

        <div className="checkout-field">
          <label>State</label>
          <input
            name="state"
            value={values.state}
            onChange={onChange}
            placeholder="State"
          />
          {errors.state && <span className="checkout-error">{errors.state}</span>}
        </div>

        <div className="checkout-field">
          <label>Postal Code</label>
          <input
            name="postal_code"
            value={values.postal_code}
            onChange={onChange}
            placeholder="Postal code"
          />
          {errors.postal_code && (
            <span className="checkout-error">{errors.postal_code}</span>
          )}
        </div>

        <div className="checkout-field">
          <label>Country</label>
          <input
            name="country"
            value={values.country}
            onChange={onChange}
            placeholder="Country"
          />
          {errors.country && <span className="checkout-error">{errors.country}</span>}
        </div>
      </div>
    </div>
  );
}
