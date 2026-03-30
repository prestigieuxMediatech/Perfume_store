"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { X, Upload, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

const BASE         = process.env.NEXT_PUBLIC_API_URL;
const SIZE_OPTIONS = ["25ml", "50ml", "75ml", "100ml", "150ml", "200ml"];

export default function AddProduct() {
  const router = useRouter();

  const [form, setForm] = useState({
    name:        "",
    description: "",
    category_id: "",
    brand_id:    "",
  });

  const [variants, setVariants]     = useState([
    { size: "50ml", price: "", discount_price: "" }
  ]);
  const [images, setImages]         = useState([]);
  const [previews, setPreviews]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors]         = useState({});
  const [saving, setSaving]         = useState(false);
  const [serverError, setServerError] = useState("");
  const [brands, setBrands]         = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);

  const fileInputRef = useRef(null);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
  });

  useEffect(() => {
    axios.get(`${BASE}/api/admin/brands`, { headers: getHeaders() })
      .then(res => setBrands(Array.isArray(res.data) ? res.data : []))
      .catch(() => setBrands([]));
  }, []);

  useEffect(() => {
    axios.get(`${BASE}/api/admin/categories`, { headers: getHeaders() })
      .then(res => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCategories([]));
  }, []);

  // Add this useEffect
  useEffect(() => {
    if (form.category_id) {
      setFilteredBrands(brands.filter(b => b.category_id === form.category_id));
      setForm(prev => ({ ...prev, brand_id: "" })); // reset brand when category changes
    } else {
      setFilteredBrands([]);
    }
  }, [form.category_id, brands]);

  // ── Form change ────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // ── Variant handlers ───────────────────────────────────
  const handleVariantChange = (index, field, value) => {
    const updated = variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    );
    setVariants(updated);
  };

  const handleAddVariant = () => {
    if (variants.length >= 6) return;
    setVariants([...variants, { size: "", price: "", discount_price: "" }]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length === 1) return; // keep at least one
    setVariants(variants.filter((_, i) => i !== index));
  };

  // ── Image handlers ─────────────────────────────────────
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert("Maximum 3 images allowed");
      return;
    }
    const updated  = [...images, ...files];
    setPreviews(updated.map(f => URL.createObjectURL(f)));
    setImages(updated);
  };

  const handleRemoveImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setPreviews(updated.map(f => URL.createObjectURL(f)));
    setImages(updated);
  };

  // ── Validate ───────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (images.length === 0) newErrors.images = "At least one image is required";

    variants.forEach((v, i) => {
      if (!v.size)  newErrors[`variant_size_${i}`]  = "Size required";
      if (!v.price) newErrors[`variant_price_${i}`] = "Price required";
      if (v.discount_price && Number(v.discount_price) >= Number(v.price)) {
        newErrors[`variant_discount_${i}`] = "Must be less than price";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name",        form.name);
      formData.append("description", form.description);
      if (form.category_id) formData.append("category_id", form.category_id);
      if (form.brand_id) formData.append("brand_id", form.brand_id);
      formData.append("variants",    JSON.stringify(variants));
      images.forEach(img => formData.append("images", img));

      await axios.post(
        `${BASE}/api/admin/products`,
        formData,
        { headers: { ...getHeaders(), "Content-Type": "multipart/form-data" } }
      );

      router.push("/admin/products");

    } catch (err) {
      setServerError(err.response?.data?.message || "Could not add product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth:"700px" }}>

      {/* Back */}
      <Link
        href="/admin/products"
        style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", color:"#7A7264", textDecoration:"none", fontSize:"0.68rem", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1.5rem", transition:"color 0.2s" }}
        onMouseOver={e => e.currentTarget.style.color="#C9A84C"}
        onMouseOut={e  => e.currentTarget.style.color="#7A7264"}
      >
        <ArrowLeft size={13} strokeWidth={1.5}/> Back to Products
      </Link>

      <h2 style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1.6rem", fontWeight:300, letterSpacing:"0.1em", color:"#F5F0E8", marginBottom:"0.4rem" }}>
        Add Product
      </h2>
      <div style={{ width:36, height:1, background:"#8A6F34", marginBottom:"2rem" }}/>

      <form onSubmit={handleSubmit}>

        {/* Name */}
        <div style={{ marginBottom:"1.2rem" }}>
          <label className="ad-label">Product Name</label>
          <input
            className="ad-input" type="text" name="name"
            placeholder="e.g. Oud Noir"
            value={form.name} onChange={handleChange}
          />
          {errors.name && <p style={{ color:"#E8472A", fontSize:"0.68rem", marginTop:"0.3rem" }}>{errors.name}</p>}
        </div>

        {/* Description */}
        <div style={{ marginBottom:"1.2rem" }}>
          <label className="ad-label">Description</label>
          <textarea
            className="ad-input" name="description"
            placeholder="Describe the fragrance, notes, occasion..."
            value={form.description} onChange={handleChange}
            rows={4} style={{ resize:"vertical", lineHeight:"1.6" }}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom:"1.8rem" }}>
          <label className="ad-label">Category</label>
          <select
            className="ad-input" name="category_id"
            value={form.category_id} onChange={handleChange}
            style={{ cursor:"pointer" }}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Brand — only shows after category is selected */}
        <div style={{ marginBottom:"1.8rem" }}>
          <label className="ad-label">
            Brand
            <span style={{ color:"#4a4540", fontSize:"0.58rem", textTransform:"none", marginLeft:"0.4rem" }}>
              — select category first
            </span>
          </label>
          <select
            className="ad-input"
            name="brand_id"
            value={form.brand_id}
            onChange={handleChange}
            disabled={!form.category_id}
            style={{ cursor: form.category_id ? "pointer" : "not-allowed", opacity: form.category_id ? 1 : 0.4 }}
          >
            <option value="">
              {form.category_id ? "Select a brand" : "Select category first"}
            </option>
            {filteredBrands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>

        {/* Variants */}
        <div style={{ marginBottom:"1.8rem" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.8rem" }}>
            <label className="ad-label" style={{ margin:0 }}>
              Variants
              <span style={{ color:"#4a4540", fontSize:"0.58rem", textTransform:"none", marginLeft:"0.4rem" }}>
                — size + price per variant
              </span>
            </label>
            {variants.length < 6 && (
              <button
                type="button"
                onClick={handleAddVariant}
                className="ad-btn"
                style={{ padding:"0.3rem 0.8rem", display:"flex", alignItems:"center", gap:"0.4rem" }}
              >
                <Plus size={11} strokeWidth={1.5}/> Add Size
              </button>
            )}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            {variants.map((v, i) => (
              <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto", gap:"0.75rem", alignItems:"start" }}>

                {/* Size */}
                <div>
                  {i === 0 && <label className="ad-label">Size</label>}
                  <select
                    className="ad-input"
                    value={v.size}
                    onChange={e => handleVariantChange(i, "size", e.target.value)}
                    style={{ cursor:"pointer" }}
                  >
                    <option value="">Select</option>
                    {SIZE_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors[`variant_size_${i}`] && (
                    <p style={{ color:"#E8472A", fontSize:"0.62rem", marginTop:"0.2rem" }}>
                      {errors[`variant_size_${i}`]}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  {i === 0 && <label className="ad-label">Price (₹)</label>}
                  <input
                    className="ad-input" type="number" placeholder="e.g. 4500"
                    value={v.price} min="0"
                    onChange={e => handleVariantChange(i, "price", e.target.value)}
                  />
                  {errors[`variant_price_${i}`] && (
                    <p style={{ color:"#E8472A", fontSize:"0.62rem", marginTop:"0.2rem" }}>
                      {errors[`variant_price_${i}`]}
                    </p>
                  )}
                </div>

                {/* Discount price */}
                <div>
                  {i === 0 && (
                    <label className="ad-label">
                      Discount (₹)
                      <span style={{ color:"#4a4540", fontSize:"0.55rem", textTransform:"none", marginLeft:"0.3rem" }}>optional</span>
                    </label>
                  )}
                  <input
                    className="ad-input" type="number" placeholder="optional"
                    value={v.discount_price} min="0"
                    onChange={e => handleVariantChange(i, "discount_price", e.target.value)}
                  />
                  {errors[`variant_discount_${i}`] && (
                    <p style={{ color:"#E8472A", fontSize:"0.62rem", marginTop:"0.2rem" }}>
                      {errors[`variant_discount_${i}`]}
                    </p>
                  )}
                </div>

                {/* Remove button */}
                <div style={{ paddingTop: i === 0 ? "1.6rem" : "0" }}>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(i)}
                    disabled={variants.length === 1}
                    style={{
                      background:  "none",
                      border:      "none",
                      color:       variants.length === 1 ? "#2a2418" : "#7A7264",
                      cursor:      variants.length === 1 ? "not-allowed" : "pointer",
                      padding:     0,
                      display:     "flex",
                      transition:  "color 0.2s",
                    }}
                    onMouseOver={e => { if (variants.length > 1) e.currentTarget.style.color="#E8472A"; }}
                    onMouseOut={e  => { if (variants.length > 1) e.currentTarget.style.color="#7A7264"; }}
                  >
                    <Trash2 size={14} strokeWidth={1.5}/>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div style={{ marginBottom:"1.8rem" }}>
          <label className="ad-label">
            Product Images
            <span style={{ color:"#4a4540", fontSize:"0.58rem", textTransform:"none", marginLeft:"0.4rem" }}>
              — max 3, jpg/png/webp, 5MB each
            </span>
          </label>

          <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", marginBottom:"0.75rem" }}>
            {previews.map((src, i) => (
              <div key={i} style={{ position:"relative" }}>
                <img
                  src={src} alt={`preview ${i}`}
                  style={{ width:90, height:90, objectFit:"cover", border: i === 0 ? "1px solid #C9A84C" : "1px solid #2a2418", borderRadius:"2px" }}
                />
                {i === 0 && (
                  <span style={{ position:"absolute", bottom:4, left:4, background:"rgba(201,168,76,0.85)", color:"#0A0A0A", fontSize:"0.5rem", padding:"1px 4px", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                    Main
                  </span>
                )}
                <button
                  type="button" onClick={() => handleRemoveImage(i)}
                  style={{ position:"absolute", top:-6, right:-6, background:"#E8472A", border:"none", borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", padding:0 }}
                >
                  <X size={10} color="#fff" strokeWidth={2}/>
                </button>
              </div>
            ))}

            {images.length < 3 && (
              <button
                type="button" onClick={() => fileInputRef.current.click()}
                style={{ width:90, height:90, background:"#0e0d0b", border:"1px dashed #2a2418", borderRadius:"2px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.4rem", cursor:"pointer", color:"#7A7264", fontSize:"0.6rem", letterSpacing:"0.08em", transition:"border-color 0.2s" }}
                onMouseOver={e => e.currentTarget.style.borderColor="#8A6F34"}
                onMouseOut={e  => e.currentTarget.style.borderColor="#2a2418"}
              >
                <Upload size={16} strokeWidth={1.5}/> Upload
              </button>
            )}
          </div>

          <input
            ref={fileInputRef} type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple onChange={handleImageSelect}
            style={{ display:"none" }}
          />
          {errors.images && <p style={{ color:"#E8472A", fontSize:"0.68rem", marginTop:"0.3rem" }}>{errors.images}</p>}
        </div>

        {serverError && (
          <p style={{ color:"#E8472A", fontSize:"0.72rem", marginBottom:"1rem" }}>{serverError}</p>
        )}

        <div style={{ display:"flex", gap:"1rem" }}>
          <Link
            href="/admin/products"
            className="ad-btn"
            style={{ flex:1, justifyContent:"center", padding:"0.75rem", textAlign:"center" }}
          >
            Cancel
          </Link>
          <button
            type="submit" className="ad-btn primary" disabled={saving}
            style={{ flex:1, justifyContent:"center", padding:"0.75rem" }}
          >
            {saving ? "Adding Product..." : "Add Product"}
          </button>
        </div>

      </form>
    </div>
  );
}