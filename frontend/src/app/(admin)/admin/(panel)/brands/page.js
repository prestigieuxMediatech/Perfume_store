"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function Brands() {

  const [brands, setBrands]         = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editData, setEditData]     = useState(null);
  const [form, setForm]             = useState({ name: "", slug: "", category_id: "" });
  const [formError, setFormError]   = useState("");
  const [saving, setSaving]         = useState(false);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
  });

  const generateSlug = (name) =>
    name.toLowerCase().trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  // ── Fetch ──────────────────────────────────────────────
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/admin/brands`, { headers: getHeaders() });
      setBrands(Array.isArray(res.data) ? res.data : []);
    } catch { setBrands([]); }
    finally  { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE}/api/admin/categories`, { headers: getHeaders() });
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch { setCategories([]); }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  // ── Modal handlers ─────────────────────────────────────
  const handleOpenAdd = () => {
    setEditData(null);
    setForm({ name: "", slug: "", category_id: "" });
    setFormError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setEditData(brand);
    setForm({
      name:        brand.name,
      slug:        brand.slug,
      category_id: brand.category_id ?? "",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditData(null);
    setForm({ name: "", slug: "", category_id: "" });
    setFormError("");
  };

  // ── Name change + auto slug ────────────────────────────
  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm({ ...form, name, slug: generateSlug(name) });
  };

  // ── Add ────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!form.name.trim())    { setFormError("Brand name is required");  return; }
    if (!form.slug.trim())    { setFormError("Slug is required");        return; }
    if (!form.category_id)    { setFormError("Category is required");    return; }

    setSaving(true);
    try {
      await axios.post(
        `${BASE}/api/admin/brands`,
        form,
        { headers: getHeaders() }
      );
      handleCloseModal();
      fetchBrands();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not add brand");
    } finally {
      setSaving(false);
    }
  };

  // ── Edit ───────────────────────────────────────────────
  const handleEdit = async () => {
    if (!form.name.trim())    { setFormError("Brand name is required");  return; }
    if (!form.slug.trim())    { setFormError("Slug is required");        return; }
    if (!form.category_id)    { setFormError("Category is required");    return; }

    setSaving(true);
    try {
      await axios.put(
        `${BASE}/api/admin/brands/${editData.id}`,
        form,
        { headers: getHeaders() }
      );
      handleCloseModal();
      fetchBrands();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not update brand");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm("Delete this brand? Products under it will be unbranded.")) return;
    try {
      await axios.delete(
        `${BASE}/api/admin/brands/${id}`,
        { headers: getHeaders() }
      );
      fetchBrands();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete brand");
    }
  };

  // ── Save dispatcher ────────────────────────────────────
  const handleSave = () => {
    if (editData) handleEdit();
    else          handleAdd();
  };

  return (
    <>
      {/* Header */}
      <div className="ad-section-head" style={{ marginBottom:"1.5rem" }}>
        <span className="ad-section-title">All Brands</span>
        <button className="ad-btn primary" onClick={handleOpenAdd}>
          <Plus size={12} strokeWidth={1.5}/>
          Add Brand
        </button>
      </div>

      {/* Table */}
      <table className="ad-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Category</th>
            <th>Products</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} style={{ textAlign:"center", color:"#7A7264", padding:"2rem" }}>
                Loading...
              </td>
            </tr>
          ) : brands.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign:"center", color:"#7A7264", padding:"2rem" }}>
                No brands yet — add your first one
              </td>
            </tr>
          ) : brands.map((brand, index) => (
            <tr key={brand.id}>
              <td style={{ color:"#7A7264" }}>{index + 1}</td>
              <td>{brand.name}</td>
              <td style={{ color:"#7A7264", fontSize:"0.68rem" }}>{brand.slug}</td>
              <td style={{ color:"#7A7264" }}>{brand.category_name ?? "—"}</td>
              <td>{brand.product_count ?? 0}</td>
              <td style={{ color:"#7A7264" }}>
                {new Date(brand.created_at).toLocaleDateString("en-IN")}
              </td>
              <td>
                <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
                  <button
                    onClick={() => handleOpenEdit(brand)}
                    style={{ background:"none", border:"none", color:"#7A7264", cursor:"pointer", padding:0, display:"flex", transition:"color 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.color="#C9A84C"}
                    onMouseOut={e  => e.currentTarget.style.color="#7A7264"}
                  >
                    <Pencil size={14} strokeWidth={1.5}/>
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
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

      {/* Modal */}
      {modalOpen && (
        <div
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
        >
          <div style={{ background:"#111", border:"1px solid #2a2418", padding:"2.5rem 2.2rem", width:"100%", maxWidth:"460px", borderRadius:"6px", position:"relative", boxShadow:"0 20px 60px rgba(0,0,0,0.6)" }}>

            {/* Corner accents */}
            <span style={{ position:"absolute", top:10, left:10, width:24, height:24, borderTop:"1px solid #8A6F34", borderLeft:"1px solid #8A6F34" }}/>
            <span style={{ position:"absolute", bottom:10, right:10, width:24, height:24, borderBottom:"1px solid #8A6F34", borderRight:"1px solid #8A6F34" }}/>

            {/* Close */}
            <button
              onClick={handleCloseModal}
              style={{ position:"absolute", top:14, right:14, background:"none", border:"none", color:"#7A7264", cursor:"pointer", transition:"color 0.2s" }}
              onMouseOver={e => e.currentTarget.style.color="#C9A84C"}
              onMouseOut={e  => e.currentTarget.style.color="#7A7264"}
            >
              <X size={15} strokeWidth={1.5}/>
            </button>

            {/* Title */}
            <h3 style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1.4rem", fontWeight:400, letterSpacing:"0.12em", color:"#F5F0E8", marginBottom:"0.5rem" }}>
              {editData ? "Edit Brand" : "Add Brand"}
            </h3>
            <div style={{ width:36, height:1, background:"#8A6F34", marginBottom:"2rem" }}/>

            {/* Category — first so admin thinks category first then brand */}
            <div style={{ marginBottom:"1.2rem" }}>
              <label className="ad-label">Category</label>
              <select
                className="ad-input"
                value={form.category_id}
                onChange={e => setForm({ ...form, category_id: e.target.value })}
                style={{ cursor:"pointer" }}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div style={{ marginBottom:"1.2rem" }}>
              <label className="ad-label">Brand Name</label>
              <input
                className="ad-input"
                type="text"
                placeholder="e.g. Maison Margiela"
                value={form.name}
                onChange={handleNameChange}
                autoFocus
              />
            </div>

            {/* Slug */}
            <div style={{ marginBottom:"1.8rem" }}>
              <label className="ad-label">
                Slug
                <span style={{ color:"#4a4540", fontSize:"0.58rem", letterSpacing:"0.05em", textTransform:"none" }}>
                  {" "}— auto generated, you can edit
                </span>
              </label>
              <input
                className="ad-input"
                type="text"
                placeholder="e.g. maison-margiela"
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })}
              />
            </div>

            {/* Error */}
            {formError && (
              <p style={{ color:"#E8472A", fontSize:"0.7rem", marginBottom:"1rem", letterSpacing:"0.05em" }}>
                {formError}
              </p>
            )}

            {/* Buttons */}
            <div style={{ display:"flex", gap:"1rem" }}>
              <button
                className="ad-btn"
                onClick={handleCloseModal}
                style={{ flex:1, justifyContent:"center", padding:"0.65rem" }}
              >
                Cancel
              </button>
              <button
                className="ad-btn primary"
                onClick={handleSave}
                disabled={saving}
                style={{ flex:1, justifyContent:"center", padding:"0.65rem" }}
              >
                {saving ? "Saving..." : editData ? "Update" : "Add Brand"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}