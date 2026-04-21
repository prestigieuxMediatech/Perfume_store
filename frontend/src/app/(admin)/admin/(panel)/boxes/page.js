"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function Boxes() {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  const getHeaders = () => ({});

  const fetchBoxes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/admin/boxes`, { headers: getHeaders() });
      setBoxes(Array.isArray(res.data) ? res.data : []);
    } catch {
      setBoxes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBoxes(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this box?")) return;
    try {
      await axios.delete(`${BASE}/api/admin/boxes/${id}`, { headers: getHeaders() });
      fetchBoxes();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete box");
    }
  };

  return (
    <>
      <div className="ad-section-head" style={{ marginBottom:"1.2rem" }}>
        <div style={{ color:"#7A7264", fontSize:"0.72rem", letterSpacing:"0.08em", textTransform:"uppercase" }}>
          Build Your Box Configurations
        </div>
        <Link href="/admin/boxes/new" className="ad-btn primary">
          <Plus size={12} strokeWidth={1.5}/>
          Add Box
        </Link>
      </div>

      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Items</th>
              <th>Price</th>
              <th>Categories</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ color:"#7A7264", textAlign:"center", padding:"2rem" }}>
                  Loading...
                </td>
              </tr>
            ) : boxes.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ color:"#7A7264", textAlign:"center", padding:"2rem" }}>
                  No boxes found
                </td>
              </tr>
            ) : boxes.map((box, index) => (
              <tr key={box.id}>
                <td style={{ color:"#7A7264" }}>{index + 1}</td>
                <td>{box.name}</td>
                <td>{box.items_count}</td>
                <td>₹{Number(box.price).toLocaleString("en-IN")}</td>
                <td style={{ color:"#7A7264" }}>{box.category_names || "—"}</td>
                <td>
                  <span className={`badge ${box.is_active ? "active" : "inactive"}`}>
                    {box.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
                    <Link
                      href={`/admin/boxes/${box.id}/edit`}
                      style={{ color:"#7A7264", transition:"color 0.2s", display:"flex" }}
                      onMouseOver={e => e.currentTarget.style.color="#C9A84C"}
                      onMouseOut={e  => e.currentTarget.style.color="#7A7264"}
                    >
                      <Pencil size={14} strokeWidth={1.5}/>
                    </Link>
                    <button
                      onClick={() => handleDelete(box.id)}
                      style={{ background:"none", border:"none", color:"#7A7264", cursor:"pointer", padding:0, display:"flex", transition:"color 0.2s" }}
                      onMouseOver={e => e.currentTarget.style.color="#E8472A"}
                      onMouseOut={e  => e.currentTarget.style.color="#7A7264"}
                    >
                      <Trash2 size={14} strokeWidth={1.5}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
