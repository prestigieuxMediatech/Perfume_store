"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats]             = useState({ revenue:0, orders:0, products:0, pending:0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading]         = useState(true);


  return (
    <>
      {/* Stats */}
      <div className="ad-stats">
        <div className="ad-stat highlight">
          <div className="ad-stat-label">Total Revenue</div>
          <div className="ad-stat-value gold">
            ₹{Number(stats.revenue).toLocaleString("en-IN")}
          </div>
          <div className="ad-stat-sub">All time</div>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-label">Total Orders</div>
          <div className="ad-stat-value">{stats.orders}</div>
          <div className="ad-stat-sub">All time</div>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-label">Products</div>
          <div className="ad-stat-value">{stats.products}</div>
          <div className="ad-stat-sub">Active listings</div>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-label">Pending Orders</div>
          <div className="ad-stat-value danger">{stats.pending}</div>
          <div className="ad-stat-sub">Needs attention</div>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="ad-section-head">
        <span className="ad-section-title">Recent Orders</span>
        <Link href="/admin/orders" className="ad-btn">View All</Link>
      </div>

      <table className="ad-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ color:"#7A7264", textAlign:"center", padding:"2rem" }}>
                No orders yet
              </td>
            </tr>
          ) : recentOrders.map(order => (
            <tr key={order.id}>
              <td style={{ color:"#C9A84C" }}>
                #{order.id.slice(0,8).toUpperCase()}
              </td>
              <td>{order.user_name}</td>
              <td>₹{Number(order.total_amount).toLocaleString("en-IN")}</td>
              <td>
                <span className={`badge ${order.status}`}>
                  {order.status}
                </span>
              </td>
              <td>
                {new Date(order.created_at).toLocaleDateString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}