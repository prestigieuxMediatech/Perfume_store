"use client";
import { useEffect, useState } from "react";

const STATUSES = ["all","pending","paid","processing","shipped","delivered","cancelled"];

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [filter, setFilter]   = useState("all");
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined"
    ? localStorage.getItem("adminToken") : "";

  useEffect(() => { fetchOrders(); }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = filter === "all"
        ? `/api/admin/orders`
        : `/api/admin/orders?status=${filter}`;
      const res  = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch { setOrders([]); }
    finally  { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${id}/status`,
      {
        method:  "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      }
    );
    fetchOrders();
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

      <table className="ad-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} style={{ color:"#7A7264", textAlign:"center", padding:"2rem" }}>Loading...</td></tr>
          ) : orders.length === 0 ? (
            <tr><td colSpan={6} style={{ color:"#7A7264", textAlign:"center", padding:"2rem" }}>No orders found</td></tr>
          ) : orders.map(order => (
            <tr key={order.id}>
              <td style={{ color:"#C9A84C" }}>#{order.id.slice(0,8).toUpperCase()}</td>
              <td>{order.user_name}</td>
              <td>₹{Number(order.total_amount).toLocaleString("en-IN")}</td>
              <td><span className={`badge ${order.status}`}>{order.status}</span></td>
              <td>{new Date(order.created_at).toLocaleDateString("en-IN")}</td>
              <td>
                <select
                  defaultValue={order.status}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  style={{
                    background:   "#0e0d0b",
                    border:       "1px solid #2a2418",
                    color:        "#F5F0E8",
                    fontSize:     "0.68rem",
                    padding:      "0.3rem 0.5rem",
                    fontFamily:   "Tenor Sans, sans-serif",
                    cursor:       "pointer",
                    letterSpacing:"0.05em",
                    outline:      "none",
                  }}
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
    </>
  );
}