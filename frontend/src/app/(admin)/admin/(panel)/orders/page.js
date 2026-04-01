"use client";
import { useEffect, useState } from "react";

const STATUSES = ["all","pending","paid","processing","shipped","delivered","cancelled"];

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [filter, setFilter]   = useState("all");
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getToken = () => (
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : ""
  );

  const formatMoney = (value) =>
    `\u20B9${Number(value || 0).toLocaleString("en-IN")}`;

  const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString("en-IN") : "-";

  useEffect(() => { fetchOrders(); }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = filter === "all"
        ? `/api/admin/orders`
        : `/api/admin/orders?status=${filter}`;
      const res  = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${id}/status`,
      {
        method:  "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status })
      }
    );
    fetchOrders();
  };

  const openDetails = async (orderId) => {
    setDetailsLoading(true);
    setDetailsError("");
    setDetailsOpen(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (!res.ok) throw new Error("Failed to load order");
      const data = await res.json();
      setSelectedOrder(data);
    } catch (err) {
      setDetailsError(err.message || "Failed to load order");
      setSelectedOrder(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedOrder(null);
    setDetailsError("");
  };

  return (
    <>
      {/* Filter tabs */}
      <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`ad-btn ${filter === s ? "primary" : ""}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Details</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ color:"#7A7264", textAlign:"center", padding:"2rem" }}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} style={{ color:"#7A7264", textAlign:"center", padding:"2rem" }}>No orders found</td></tr>
            ) : orders.map(order => (
              <tr key={order.id}>
                <td style={{ color:"#C9A84C", cursor:"pointer" }} onClick={() => openDetails(order.id)}>
                  #{order.id.slice(0,8).toUpperCase()}
                </td>
                <td>{order.user_name}</td>
                <td>{formatMoney(order.total_amount)}</td>
                <td><span className={`badge ${order.status}`}>{order.status}</span></td>
                <td>{formatDate(order.created_at)}</td>
                <td>
                  <button className="ad-btn" onClick={() => openDetails(order.id)}>
                    View
                  </button>
                </td>
                <td>
                  <select
                    defaultValue={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    className="ad-select"
                  >
                    {["pending","paid","processing","shipped","delivered","cancelled"]
                      .map(s => <option key={s} value={s}>{s}</option>)
                    }
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detailsOpen && (
        <div className="ad-modal" onClick={(e) => {
          if (e.target === e.currentTarget) closeDetails();
        }}>
          <div className="ad-modal-card">
            <div className="ad-modal-head">
              <div>
                <div className="ad-modal-title">Order Details</div>
                <div className="ad-modal-sub">
                  {selectedOrder ? `#${selectedOrder.id.slice(0, 8).toUpperCase()}` : "Loading..."}
                </div>
              </div>
              <button className="ad-modal-close" onClick={closeDetails}>Close</button>
            </div>

            {detailsLoading ? (
              <div className="ad-modal-loading">Loading order details...</div>
            ) : detailsError ? (
              <div className="ad-modal-error">{detailsError}</div>
            ) : selectedOrder ? (
              <>
                <div className="ad-detail-grid">
                  <div>
                    <div className="ad-detail-label">Customer</div>
                    <div className="ad-detail-value">{selectedOrder.full_name}</div>
                  </div>
                  <div>
                    <div className="ad-detail-label">Email</div>
                    <div className="ad-detail-value">{selectedOrder.email || selectedOrder.user_email || "-"}</div>
                  </div>
                  <div>
                    <div className="ad-detail-label">Phone</div>
                    <div className="ad-detail-value">{selectedOrder.phone || "-"}</div>
                  </div>
                  <div>
                    <div className="ad-detail-label">Payment</div>
                    <div className="ad-detail-value">
                      {selectedOrder.payment_method || "COD"} / {selectedOrder.payment_status || "unpaid"}
                    </div>
                  </div>
                  <div>
                    <div className="ad-detail-label">Address</div>
                    <div className="ad-detail-value">
                      {selectedOrder.address_line1}
                      {selectedOrder.address_line2 ? `, ${selectedOrder.address_line2}` : ""}
                    </div>
                  </div>
                  <div>
                    <div className="ad-detail-label">City / State</div>
                    <div className="ad-detail-value">
                      {selectedOrder.city}, {selectedOrder.state} {selectedOrder.postal_code}
                    </div>
                  </div>
                  <div>
                    <div className="ad-detail-label">Country</div>
                    <div className="ad-detail-value">{selectedOrder.country}</div>
                  </div>
                  <div>
                    <div className="ad-detail-label">Placed</div>
                    <div className="ad-detail-value">{formatDate(selectedOrder.created_at)}</div>
                  </div>
                </div>

                <div className="ad-modal-section">
                  <div className="ad-detail-label">Items</div>
                  <div className="ad-items">
                    {selectedOrder.items?.length ? selectedOrder.items.map((item) => (
                      <div key={item.id} className="ad-item-row">
                        <div className="ad-item-name">{item.product_name}</div>
                        <div className="ad-item-meta">
                          {item.size ? `Size: ${item.size}` : "Size: -"} · Qty {item.quantity}
                        </div>
                        <div className="ad-item-price">{formatMoney(item.line_total)}</div>
                      </div>
                    )) : (
                      <div className="ad-item-empty">No items found</div>
                    )}
                  </div>
                </div>

                <div className="ad-total-row">
                  <span>Total</span>
                  <strong>{formatMoney(selectedOrder.total_amount)}</strong>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}

