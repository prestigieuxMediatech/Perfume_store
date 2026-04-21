"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function EditBox() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    items_count: "",
    is_active: true,
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getHeaders = () => ({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [boxRes, catRes] = await Promise.all([
          axios.get(`${BASE}/api/admin/boxes/${id}`, { headers: getHeaders() }),
          axios.get(`${BASE}/api/admin/categories`, { headers: getHeaders() })
        ]);
        const box = boxRes.data;
        setForm({
          name: box.name ?? "",
          description: box.description ?? "",
          price: box.price ?? "",
          items_count: box.items_count ?? "",
          is_active: box.is_active !== false,
        });
        setSelectedCategories((box.categories || []).map(c => c.id));
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      } catch (err) {
        setError("Could not load box");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Box name is required");
    if (!form.price) return setError("Price is required");
    if (!form.items_count) return setError("Items per box is required");
    if (selectedCategories.length === 0) return setError("Select at least one category");

    setSaving(true);
    try {
      await axios.put(
        `${BASE}/api/admin/boxes/${id}`,
        { ...form, category_ids: selectedCategories },
        { headers: getHeaders() }
      );
      router.push("/admin/boxes");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update box");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p style={{ color:"#7A7264", fontSize:"0.72rem", letterSpacing:"0.1em" }}>
        Loading box...
      </p>
    );
  }

  return (
    <div style={{ maxWidth:"700px" }}>
      <Link
        href="/admin/boxes"
        style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", color:"#7A7264", textDecoration:"none", fontSize:"0.68rem", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1.5rem", transition:"color 0.2s" }}
        onMouseOver={e => e.currentTarget.style.color="#C9A84C"}
        onMouseOut={e  => e.currentTarget.style.color="#7A7264"}
      >
        <ArrowLeft size={13} strokeWidth={1.5}/> Back to Boxes
      </Link>

      <h2 style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1.6rem", fontWeight:300, letterSpacing:"0.1em", color:"#F5F0E8", marginBottom:"0.4rem" }}>
        Edit Build Your Box
      </h2>
      <div style={{ width:36, height:1, background:"#8A6F34", marginBottom:"2rem" }}/>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom:"1.2rem" }}>
          <label className="ad-label">Box Name</label>
          <input
            className="ad-input" type="text" name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div style={{ marginBottom:"1.2rem" }}>
          <label className="ad-label">Description</label>
          <textarea
            className="ad-input" name="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            style={{ resize:"vertical", lineHeight:"1.6" }}
          />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.2rem" }}>
          <div>
            <label className="ad-label">Price (₹)</label>
            <input
              className="ad-input" type="number" min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="ad-label">Items Per Box</label>
            <input
              className="ad-input" type="number" min="1"
              value={form.items_count}
              onChange={(e) => setForm({ ...form, items_count: e.target.value })}
            />
          </div>
        </div>

        <div style={{ marginBottom:"1.5rem" }}>
          <label className="ad-label">
            Allowed Categories
            <span style={{ color:"#4a4540", fontSize:"0.58rem", textTransform:"none", marginLeft:"0.4rem" }}>
              — customers can pick from these
            </span>
          </label>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:"0.6rem" }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`ad-btn ${selectedCategories.includes(cat.id) ? "primary" : ""}`}
                style={{ justifyContent:"center" }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:"1.5rem" }}>
          <label className="ad-label">Status</label>
          <select
            className="ad-input"
            value={form.is_active ? "true" : "false"}
            onChange={(e) => setForm({ ...form, is_active: e.target.value === "true" })}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {error && (
          <p style={{ color:"#E8472A", fontSize:"0.72rem", marginBottom:"1rem" }}>{error}</p>
        )}

        <div style={{ display:"flex", gap:"1rem" }}>
          <Link
            href="/admin/boxes"
            className="ad-btn"
            style={{ flex:1, justifyContent:"center", padding:"0.75rem", textAlign:"center" }}
          >
            Cancel
          </Link>
          <button
            type="submit" className="ad-btn primary" disabled={saving}
            style={{ flex:1, justifyContent:"center", padding:"0.75rem" }}
          >
            {saving ? "Updating..." : "Update Box"}
          </button>
        </div>
      </form>
    </div>
  );
}
