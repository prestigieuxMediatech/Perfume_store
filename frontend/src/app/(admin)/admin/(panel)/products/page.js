"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [savingHomeId, setSavingHomeId] = useState(null);

  const getHeaders = () => ({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/admin/products`, { headers: getHeaders() });
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch { setProducts([]); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`${BASE}/api/admin/products/${id}`, { headers: getHeaders() });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete product");
    }
  };

  const handleHomeToggle = async (product, checked) => {
    setSavingHomeId(product.id);
    try {
      await axios.patch(
        `${BASE}/api/admin/products/${product.id}/home-display`,
        {
          show_on_home: checked,
          home_display_order: checked ? (product.home_display_order || "") : "",
        },
        { headers: getHeaders() }
      );
      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                show_on_home: checked,
                home_display_order: checked ? item.home_display_order : null,
              }
            : item
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Could not update home display");
    } finally {
      setSavingHomeId(null);
    }
  };

  const handleHomeOrderChange = (id, value) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, home_display_order: value } : item
      )
    );
  };

  const handleHomeOrderSave = async (product) => {
    setSavingHomeId(product.id);
    try {
      await axios.patch(
        `${BASE}/api/admin/products/${product.id}/home-display`,
        {
          show_on_home: true,
          home_display_order: product.home_display_order || "",
        },
        { headers: getHeaders() }
      );
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update home order");
    } finally {
      setSavingHomeId(null);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <div className="ad-section-head" style={{ marginBottom:"1.2rem" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="ad-input"
          style={{ width:"260px" }}
        />
        <Link href="/admin/products/new" className="ad-btn primary">
          <Plus size={12} strokeWidth={1.5}/>
          Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="ad-table-wrap">
      <table className="ad-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Starting Price</th>
            <th>Sizes</th>
            <th>Home</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} style={{ color:"#7A7264", textAlign:"center", padding:"2rem" }}>
                Loading...
              </td>
            </tr>
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ color:"#7A7264", textAlign:"center", padding:"2rem" }}>
                No products found
              </td>
            </tr>
          ) : filtered.map((p, index) => (
            <tr key={p.id}>
              <td style={{ color:"#7A7264" }}>{index + 1}</td>
              <td>
                {p.primary_image ? (
                  <img
                    src={`${BASE}${p.primary_image}`}
                    alt={p.name}
                    style={{
                      width:        40,
                      height:       40,
                      objectFit:    "cover",
                      border:       "1px solid #2a2418",
                      borderRadius: "2px",
                    }}
                  />
                ) : (
                  <div style={{
                    width:        40,
                    height:       40,
                    background:   "#161412",
                    border:       "1px solid #2a2418",
                    borderRadius: "2px",
                    display:      "flex",
                    alignItems:   "center",
                    justifyContent:"center",
                    fontSize:     "0.6rem",
                    color:        "#7A7264",
                  }}>
                    No img
                  </div>
                )}
              </td>
              <td>{p.name}</td>
              <td style={{ color:"#7A7264" }}>{p.category_name ?? "—"}</td>
              <td>
                {p.variants && p.variants.length > 0
                  ? `₹${Number(p.variants[0].price).toLocaleString("en-IN")}`
                  : "—"
                }
              </td>
              <td style={{ color:"#7A7264" }}>
                {p.variants && p.variants.length > 0
                  ? p.variants.map(v => v.size).join(", ")
                  : "—"
                }
              </td>
              <td>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem", minWidth:"120px" }}>
                  <label style={{ display:"flex", alignItems:"center", gap:"0.45rem", color:"#F5F0E8", fontSize:"0.74rem" }}>
                    <input
                      type="checkbox"
                      checked={Boolean(p.show_on_home)}
                      disabled={savingHomeId === p.id}
                      onChange={(e) => handleHomeToggle(p, e.target.checked)}
                    />
                    Home
                  </label>
                  {p.show_on_home ? (
                    <div style={{ display:"flex", gap:"0.4rem", alignItems:"center" }}>
                      <input
                        type="number"
                        min="1"
                        value={p.home_display_order ?? ""}
                        onChange={(e) => handleHomeOrderChange(p.id, e.target.value)}
                        className="ad-input"
                        style={{ width:"64px", padding:"0.45rem 0.55rem" }}
                      />
                      <button
                        type="button"
                        className="ad-btn"
                        onClick={() => handleHomeOrderSave(p)}
                        disabled={savingHomeId === p.id}
                        style={{ padding:"0.45rem 0.7rem" }}
                      >
                        Save
                      </button>
                    </div>
                  ) : null}
                </div>
              </td>
              <td>
                <span className={`badge ${p.is_active ? "active" : "inactive"}`}>
                  {p.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    style={{ color:"#7A7264", transition:"color 0.2s", display:"flex" }}
                    onMouseOver={e => e.currentTarget.style.color="#C9A84C"}
                    onMouseOut={e  => e.currentTarget.style.color="#7A7264"}
                  >
                    <Pencil size={14} strokeWidth={1.5}/>
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
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
