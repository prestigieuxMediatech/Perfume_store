"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function Categories() {

  // ── State ──────────────────────────────────────────────
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editData, setEditData]     = useState(null);
  const [form, setForm]             = useState({ name: "", slug: "" });
  const [formError, setFormError]   = useState("");
  const [saving, setSaving]         = useState(false);

  // ── Helpers ────────────────────────────────────────────
  const getHeaders = () => ({});

  const generateSlug = (name) =>
    name.toLowerCase().trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  // ── Fetch all categories ───────────────────────────────
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE}/api/admin/categories`,
        { headers: getHeaders() }
      );
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleOpenAdd = () => {
    setEditData(null);
    setForm({ name: "", slug: "" });
    setFormError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditData(cat);
    setForm({ name: cat.name, slug: cat.slug });
    setFormError("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditData(null);
    setForm({ name: "", slug: "" });
    setFormError("");
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm({ ...form, name, slug: generateSlug(name) });
  };

  const handleAdd = async () => {
    if (!form.name.trim()) { setFormError("Category name is required"); return; }
    if (!form.slug.trim()) { setFormError("Slug is required"); return; }

    setSaving(true);
    try {
      await axios.post(
        `${BASE}/api/admin/create-category`,
        { name: form.name, slug: form.slug },
        { headers: getHeaders() }
      );
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not add category");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!form.name.trim()) { setFormError("Category name is required"); return; }
    if (!form.slug.trim()) { setFormError("Slug is required"); return; }

    setSaving(true);
    try {
      await axios.put(
        `${BASE}/api/admin/categories/${editData.id}`,
        { name: form.name, slug: form.slug },
        { headers: getHeaders() }
      );
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not update category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category? Products under it will be uncategorized.")) return;
    try {
      await axios.delete(
        `${BASE}/api/admin/categories/${id}`,
        { headers: getHeaders() }
      );
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete category");
    }
  };

  const handleSave = () => {
    if (editData) {
      handleEdit();
    } else {
      handleAdd();
    }
  };

  return (
    <>
      {/* Header */}
      <div className="ad-section-head" style={{ marginBottom:"1.5rem" }}>
        <span className="ad-section-title">All Categories</span>
        <button className="ad-btn primary" onClick={handleOpenAdd}>
          <Plus size={12} strokeWidth={1.5}/>
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="ad-table-wrap">
      <table className="ad-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Products</th>
            <th>Brands</th>
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
          ) : categories.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign:"center", color:"#7A7264", padding:"2rem" }}>
                No categories yet — add your first one
              </td>
            </tr>
          ) : categories.map((cat, index) => (
            <tr key={cat.id}>
              <td style={{ color:"#7A7264" }}>{index + 1}</td>
              <td>{cat.name}</td>
              <td style={{ color:"#7A7264", fontSize:"0.68rem" }}>{cat.slug}</td>
              <td>{cat.product_count ?? 0}</td>
              <td>{cat.brand_count ?? 0}</td>
              <td style={{ color:"#7A7264" }}>
                {new Date(cat.created_at).toLocaleDateString("en-IN")}
              </td>
              <td>
                <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    style={{ background:"none", border:"none", color:"#7A7264", cursor:"pointer", padding:0, display:"flex", transition:"color 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.color="#C9A84C"}
                    onMouseOut={e  => e.currentTarget.style.color="#7A7264"}
                  >
                    <Pencil size={14} strokeWidth={1.5}/>
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
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

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position:       "fixed",
            inset:          0,
            background:     "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            zIndex:         1000,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            padding:        "1rem",
          }}
          onClick={(e) => {
            // Close on overlay click
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div style={{
            background:  "#111",
            border:      "1px solid #2a2418",
            padding:     "2.5rem 2.2rem",
            width:       "100%",
            maxWidth:    "460px",
            borderRadius:"6px",
            position:    "relative",
            boxShadow:   "0 20px 60px rgba(0,0,0,0.6)",
          }}>

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
            <h3 style={{
              fontFamily:    "Cormorant Garamond, serif",
              fontSize:      "1.4rem",
              fontWeight:    400,
              letterSpacing: "0.12em",
              color:         "#F5F0E8",
              marginBottom:  "0.5rem",
            }}>
              {editData ? "Edit Category" : "Add Category"}
            </h3>
            <div style={{ width:36, height:1, background:"#8A6F34", marginBottom:"2rem" }}/>

            {/* Name */}
            <div style={{ marginBottom:"1.4rem" }}>
              <label className="ad-label">Category Name</label>
              <input
                className="ad-input"
                type="text"
                placeholder="e.g. Woody, Floral, Oriental"
                value={form.name}
                onChange={handleNameChange}
                autoFocus
              />
            </div>

            {/* Slug */}
            <div style={{ marginBottom:"2rem" }}>
              <label className="ad-label">
                Slug
                <span style={{ color:"#4a4540", fontSize:"0.58rem", letterSpacing:"0.05em", textTransform:"none" }}>
                  {" "}— auto generated, you can edit
                </span>
              </label>
              <input
                className="ad-input"
                type="text"
                placeholder="e.g. woody"
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
                {saving ? "Saving..." : editData ? "Update" : "Add Category"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
