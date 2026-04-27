"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { X, Upload, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

const BASE         = process.env.NEXT_PUBLIC_API_URL;
const SIZE_OPTIONS = ["25ml", "50ml", "75ml", "100ml", "150ml", "200ml"];
const DETAIL_LIST_FIELDS = [
  ["why_love_it", "Why They'll Love It", "One highlight per line"],
  ["top_notes", "Top Notes", "One note per line"],
  ["heart_notes", "Heart Notes", "One note per line"],
  ["base_notes", "Base Notes", "One note per line"],
  ["performance", "Performance", "One point per line"],
  ["who_is_this_for", "Who Is This For?", "One point per line"],
  ["product_details", "Product Details", "One point per line"],
  ["shipping_returns", "Shipping & Returns", "One point per line"],
];
const slugifyGroup = (value) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const createEmptyDetails = () => ({
  subtitle: "",
  why_love_it: "",
  detailed_description: "",
  top_notes: "",
  heart_notes: "",
  base_notes: "",
  performance: "",
  who_is_this_for: "",
  product_details: "",
  shipping_returns: "",
  disclaimer: "",
  cta_text: "",
});

const textFromList = (value) => Array.isArray(value) ? value.join("\n") : "";

const deserializeDetails = (value) => ({
  subtitle: value?.subtitle ?? "",
  why_love_it: textFromList(value?.why_love_it),
  detailed_description: value?.detailed_description ?? "",
  top_notes: textFromList(value?.top_notes),
  heart_notes: textFromList(value?.heart_notes),
  base_notes: textFromList(value?.base_notes),
  performance: textFromList(value?.performance),
  who_is_this_for: textFromList(value?.who_is_this_for),
  product_details: textFromList(value?.product_details),
  shipping_returns: textFromList(value?.shipping_returns),
  disclaimer: value?.disclaimer ?? "",
  cta_text: value?.cta_text ?? "",
});

const serializeDetails = (details) => JSON.stringify({
  subtitle: details.subtitle.trim(),
  why_love_it: details.why_love_it.split("\n").map((item) => item.trim()).filter(Boolean),
  detailed_description: details.detailed_description.trim(),
  top_notes: details.top_notes.split("\n").map((item) => item.trim()).filter(Boolean),
  heart_notes: details.heart_notes.split("\n").map((item) => item.trim()).filter(Boolean),
  base_notes: details.base_notes.split("\n").map((item) => item.trim()).filter(Boolean),
  performance: details.performance.split("\n").map((item) => item.trim()).filter(Boolean),
  who_is_this_for: details.who_is_this_for.split("\n").map((item) => item.trim()).filter(Boolean),
  product_details: details.product_details.split("\n").map((item) => item.trim()).filter(Boolean),
  shipping_returns: details.shipping_returns.split("\n").map((item) => item.trim()).filter(Boolean),
  disclaimer: details.disclaimer.trim(),
  cta_text: details.cta_text.trim(),
});

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();

  // ── State ──────────────────────────────────────────────
  const [form, setForm] = useState({
    name:        "",
    group_name:  "",
    description: "",
    category_id: "",
    brand_id:    "",
    show_on_home: false,
    home_display_order: "",
  });
  const [variants, setVariants]         = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removeImageIds, setRemoveImageIds] = useState([]);
  const [newImages, setNewImages]           = useState([]);
  const [newPreviews, setNewPreviews]       = useState([]);
  const [categories, setCategories]         = useState([]);
  const [errors, setErrors]                 = useState({});
  const [saving, setSaving]                 = useState(false);
  const [loading, setLoading]               = useState(true);
  const [serverError, setServerError]       = useState("");
  const [brands, setBrands]         = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [groupTouched, setGroupTouched] = useState(false);
  const [details, setDetails]       = useState(createEmptyDetails());

  const fileInputRef = useRef(null);

  const getHeaders = () => ({});

  // ── Fetch product + categories ─────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          axios.get(`${BASE}/api/admin/products/${id}`, { headers: getHeaders() }),
          axios.get(`${BASE}/api/admin/categories`,     { headers: getHeaders() }),
        ]);

        const p = productRes.data;

        setForm({
          name:        p.name        ?? "",
          group_name:  p.group_name  ?? "",
          description: p.description ?? "",
          category_id: p.category_id ?? "",
          brand_id:    p.brand_id    ?? "",
          show_on_home: Boolean(p.show_on_home),
          home_display_order: p.home_display_order ?? "",
        });
        setDetails(deserializeDetails(p.details));

        // Load existing variants
        setVariants(
          Array.isArray(p.variants) && p.variants.length > 0
            ? p.variants.map(v => ({
                id:             v.id,
                size:           v.size           ?? "",
                price:          v.price          ?? "",
                discount_price: v.discount_price ?? "",
              }))
            : [{ size: "50ml", price: "", discount_price: "" }]
        );

        setExistingImages(p.images ?? []);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);

      } catch (err) {
        setServerError("Could not load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    axios.get(`${BASE}/api/admin/brands`, { headers: getHeaders() })
      .then(res => setBrands(Array.isArray(res.data) ? res.data : []))
      .catch(() => setBrands([]));
  }, []);
  // Add this useEffect
  useEffect(() => {
    if (form.category_id) {
      setFilteredBrands(brands.filter(b => b.category_id === form.category_id));
    } else {
      setFilteredBrands([]);
    }
  }, [form.category_id, brands]);

  // ── Form change ────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === "checkbox" ? checked : value;
    if (name === "category_id") {
      setForm({ ...form, category_id: value, brand_id: "" });
      setErrors({ ...errors, [name]: "" });
      return;
    }
    if (name === "show_on_home") {
      setForm((prev) => ({
        ...prev,
        show_on_home: checked,
        home_display_order: checked ? prev.home_display_order : "",
      }));
      return;
    }
    if (name === "name" && !groupTouched) {
      setForm({ ...form, name: value, group_name: value ? slugifyGroup(value) : "" });
    } else {
      setForm({ ...form, [name]: nextValue });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleGroupChange = (e) => {
    setGroupTouched(true);
    setForm({ ...form, group_name: e.target.value });
    setErrors({ ...errors, group_name: "" });
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  // ── Variant handlers ───────────────────────────────────
  const handleVariantChange = (index, field, value) => {
    setVariants(variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    ));
  };

  const handleAddVariant = () => {
    if (variants.length >= 6) return;
    setVariants([...variants, { size: "", price: "", discount_price: "" }]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  // ── Image handlers ─────────────────────────────────────
  const handleRemoveExisting = (imageId) => {
    setRemoveImageIds([...removeImageIds, imageId]);
    setExistingImages(existingImages.filter(img => img.id !== imageId));
  };

  const handleNewImageSelect = (e) => {
    const files       = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;
    if (totalImages > 3) { alert("Maximum 3 images allowed total"); return; }
    const updated = [...newImages, ...files];
    setNewImages(updated);
    setNewPreviews(updated.map(f => URL.createObjectURL(f)));
  };

  const handleRemoveNew = (index) => {
    const updated = newImages.filter((_, i) => i !== index);
    setNewImages(updated);
    setNewPreviews(updated.map(f => URL.createObjectURL(f)));
  };

  // ── Validate ───────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (existingImages.length + newImages.length === 0)
      newErrors.images = "At least one image is required";

    variants.forEach((v, i) => {
      if (!v.size)  newErrors[`variant_size_${i}`]  = "Size required";
      if (!v.price) newErrors[`variant_price_${i}`] = "Price required";
      if (v.discount_price && Number(v.discount_price) >= Number(v.price))
        newErrors[`variant_discount_${i}`] = "Must be less than price";
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
      if (form.group_name) formData.append("group_name", form.group_name);
      formData.append("description", form.description);
      if (form.category_id) formData.append("category_id", form.category_id);
      if (form.brand_id) formData.append("brand_id", form.brand_id);
      formData.append("show_on_home", form.show_on_home ? "true" : "false");
      if (form.show_on_home && form.home_display_order) {
        formData.append("home_display_order", form.home_display_order);
      }
      formData.append("details_json", serializeDetails(details));
      formData.append("variants",    JSON.stringify(variants));
      if (removeImageIds.length > 0)
        formData.append("remove_images", JSON.stringify(removeImageIds));
      newImages.forEach(img => formData.append("images", img));

      await axios.put(
        `${BASE}/api/admin/products/${id}`,
        formData,
        { headers: { ...getHeaders(), "Content-Type": "multipart/form-data" } }
      );

      router.push("/admin/products");

    } catch (err) {
      setServerError(err.response?.data?.message || "Could not update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <p style={{ color:"#7A7264", fontSize:"0.72rem", letterSpacing:"0.1em" }}>
      Loading product...
    </p>
  );

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
        Edit Product
      </h2>
      <div style={{ width:36, height:1, background:"#8A6F34", marginBottom:"2rem" }}/>

      <form onSubmit={handleSubmit}>

        {/* Name */}
        <div style={{ marginBottom:"1.2rem" }}>
          <label className="ad-label">Product Name</label>
          <input
            className="ad-input" type="text" name="name"
            value={form.name} onChange={handleChange}
          />
          {errors.name && <p style={{ color:"#E8472A", fontSize:"0.68rem", marginTop:"0.3rem" }}>{errors.name}</p>}
        </div>

        {/* Group Name */}
        <div style={{ marginBottom:"1.2rem" }}>
          <label className="ad-label">
            Group Name
            <span style={{ color:"#4a4540", fontSize:"0.58rem", textTransform:"none", marginLeft:"0.4rem" }}>
              — same value for related types (perfume/mist/wash)
            </span>
          </label>
          <input
            className="ad-input" type="text" name="group_name"
            value={form.group_name} onChange={handleGroupChange}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom:"1.2rem" }}>
          <label className="ad-label">Description</label>
          <textarea
            className="ad-input" name="description"
            value={form.description} onChange={handleChange}
            rows={4} style={{ resize:"vertical", lineHeight:"1.6" }}
          />
        </div>

        <div style={{ marginBottom:"1.2rem" }}>
          <label className="ad-label">Tagline</label>
          <input
            className="ad-input" type="text" name="subtitle"
            placeholder="e.g. Bold. Addictive. Unforgettable."
            value={details.subtitle} onChange={handleDetailsChange}
          />
        </div>

        <div style={{ marginBottom:"1.2rem" }}>
          <label className="ad-label">Detailed Description</label>
          <textarea
            className="ad-input" name="detailed_description"
            placeholder="Long-form story for the product page"
            value={details.detailed_description} onChange={handleDetailsChange}
            rows={5} style={{ resize:"vertical", lineHeight:"1.6" }}
          />
        </div>

        {DETAIL_LIST_FIELDS.map(([key, label, helper]) => (
          <div key={key} style={{ marginBottom:"1.2rem" }}>
            <label className="ad-label">
              {label}
              <span style={{ color:"#4a4540", fontSize:"0.58rem", textTransform:"none", marginLeft:"0.4rem" }}>
                {helper}
              </span>
            </label>
            <textarea
              className="ad-input" name={key}
              placeholder={helper}
              value={details[key]} onChange={handleDetailsChange}
              rows={4} style={{ resize:"vertical", lineHeight:"1.6" }}
            />
          </div>
        ))}

        <div style={{ marginBottom:"1.2rem" }}>
          <label className="ad-label">Disclaimer</label>
          <textarea
            className="ad-input" name="disclaimer"
            placeholder="Inspired product disclaimer"
            value={details.disclaimer} onChange={handleDetailsChange}
            rows={3} style={{ resize:"vertical", lineHeight:"1.6" }}
          />
        </div>

        <div style={{ marginBottom:"1.8rem" }}>
          <label className="ad-label">Closing CTA</label>
          <textarea
            className="ad-input" name="cta_text"
            placeholder="Final call to action shown on the product page"
            value={details.cta_text} onChange={handleDetailsChange}
            rows={2} style={{ resize:"vertical", lineHeight:"1.6" }}
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

        {false && (
        <div style={{ marginBottom:"1.8rem", padding:"1rem", border:"1px solid #2a2418", background:"#0f0d0b" }}>
          <label className="ad-label" style={{ display:"flex", alignItems:"center", gap:"0.75rem", cursor:"pointer" }}>
            <input
              type="checkbox"
              name="show_on_home"
              checked={form.show_on_home}
              onChange={handleChange}
            />
            Display on home page
          </label>
          <p style={{ color:"#7A7264", fontSize:"0.68rem", marginTop:"0.4rem" }}>
            Checked products are used in both the hero and collection sections.
          </p>
          {form.show_on_home && (
            <div style={{ marginTop:"1rem" }}>
              <label className="ad-label">Home Display Order</label>
              <input
                className="ad-input"
                type="number"
                min="1"
                name="home_display_order"
                placeholder="1 = featured, then 2, 3, 4"
                value={form.home_display_order}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
        )}
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
                type="button" onClick={handleAddVariant}
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
                      <span style={{ color:"#4a4540", fontSize:"0.55rem", textTransform:"none", marginLeft:"0.3rem" }}>
                        optional
                      </span>
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

                {/* Remove */}
                <div style={{ paddingTop: i === 0 ? "1.6rem" : "0" }}>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(i)}
                    disabled={variants.length === 1}
                    style={{
                      background: "none", border:"none",
                      color:      variants.length === 1 ? "#2a2418" : "#7A7264",
                      cursor:     variants.length === 1 ? "not-allowed" : "pointer",
                      padding:    0, display:"flex", transition:"color 0.2s",
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
              — max 3 total
            </span>
          </label>

          <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", marginBottom:"0.75rem" }}>

            {/* Existing images */}
            {existingImages.map((img) => (
              <div key={img.id} style={{ position:"relative" }}>
                <img
                  src={`${BASE}${img.image_url}`} alt="product"
                  style={{ width:90, height:90, objectFit:"cover", border: img.is_primary ? "1px solid #C9A84C" : "1px solid #2a2418", borderRadius:"2px" }}
                />
                {img.is_primary && (
                  <span style={{ position:"absolute", bottom:4, left:4, background:"rgba(201,168,76,0.85)", color:"#0A0A0A", fontSize:"0.5rem", padding:"1px 4px", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                    Main
                  </span>
                )}
                <button
                  type="button" onClick={() => handleRemoveExisting(img.id)}
                  style={{ position:"absolute", top:-6, right:-6, background:"#E8472A", border:"none", borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", padding:0 }}
                >
                  <X size={10} color="#fff" strokeWidth={2}/>
                </button>
              </div>
            ))}

            {/* New image previews */}
            {newPreviews.map((src, i) => (
              <div key={`new-${i}`} style={{ position:"relative" }}>
                <img
                  src={src} alt="new"
                  style={{ width:90, height:90, objectFit:"cover", border:"1px dashed #8A6F34", borderRadius:"2px", opacity:0.8 }}
                />
                <button
                  type="button" onClick={() => handleRemoveNew(i)}
                  style={{ position:"absolute", top:-6, right:-6, background:"#E8472A", border:"none", borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", padding:0 }}
                >
                  <X size={10} color="#fff" strokeWidth={2}/>
                </button>
              </div>
            ))}

            {/* Upload button */}
            {existingImages.length + newImages.length < 3 && (
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
            multiple onChange={handleNewImageSelect}
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
            {saving ? "Updating..." : "Update Product"}
          </button>
        </div>

      </form>
    </div>
  );
}
