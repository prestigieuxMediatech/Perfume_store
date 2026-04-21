"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft, Upload, X } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function AddBlogPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category_label: "Journal",
    excerpt: "",
    content: "",
    author_name: "7EVEN Editorial",
    read_time_minutes: "4",
    is_published: true,
  });

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === "title" && !slugTouched) {
        return { ...prev, title: value, slug: slugify(value) };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSlugChange = (e) => {
    setSlugTouched(true);
    setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) return setError("Title is required");
    if (!form.slug.trim()) return setError("Slug is required");
    if (!form.excerpt.trim()) return setError("Excerpt is required");
    if (!form.content.trim()) return setError("Content is required");

    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (image) formData.append("cover_image", image);

      await axios.post(`${BASE}/api/admin/blogs`, formData, {
        headers: {
          ...getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/admin/blogs");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create blog");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "820px" }}>
      <Link
        href="/admin/blogs"
        style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#7A7264", textDecoration: "none", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem", transition: "color 0.2s" }}
        onMouseOver={(e) => (e.currentTarget.style.color = "#C9A84C")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#7A7264")}
      >
        <ArrowLeft size={13} strokeWidth={1.5} /> Back to Blogs
      </Link>

      <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.6rem", fontWeight: 300, letterSpacing: "0.1em", color: "#F5F0E8", marginBottom: "0.4rem" }}>
        Add Blog
      </h2>
      <div style={{ width: 36, height: 1, background: "#8A6F34", marginBottom: "2rem" }} />

      <form onSubmit={handleSubmit}>
        <div className="ad-form-grid" style={{ marginBottom: "1.2rem" }}>
          <div>
            <label className="ad-label">Title</label>
            <input className="ad-input" name="title" value={form.title} onChange={handleChange} />
          </div>
          <div>
            <label className="ad-label">Slug</label>
            <input className="ad-input" name="slug" value={form.slug} onChange={handleSlugChange} />
          </div>
        </div>

        <div className="ad-form-grid" style={{ marginBottom: "1.2rem" }}>
          <div>
            <label className="ad-label">Category Label</label>
            <input className="ad-input" name="category_label" value={form.category_label} onChange={handleChange} />
          </div>
          <div>
            <label className="ad-label">Author</label>
            <input className="ad-input" name="author_name" value={form.author_name} onChange={handleChange} />
          </div>
        </div>

        <div className="ad-form-grid" style={{ marginBottom: "1.2rem" }}>
          <div>
            <label className="ad-label">Read Time (Minutes)</label>
            <input className="ad-input" type="number" min="1" name="read_time_minutes" value={form.read_time_minutes} onChange={handleChange} />
          </div>
          <div>
            <label className="ad-label">Status</label>
            <select className="ad-input" name="is_published" value={String(form.is_published)} onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.value === "true" }))}>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <label className="ad-label">Excerpt</label>
          <textarea className="ad-input" rows={4} name="excerpt" value={form.excerpt} onChange={handleChange} style={{ resize: "vertical", lineHeight: "1.7" }} />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label className="ad-label">Content</label>
          <textarea className="ad-input" rows={14} name="content" value={form.content} onChange={handleChange} style={{ resize: "vertical", lineHeight: "1.8" }} placeholder="Write the full article here. Paragraph breaks will be preserved on the blog page." />
        </div>

        <div style={{ marginBottom: "1.8rem" }}>
          <label className="ad-label">Cover Image</label>
          <div style={{ display: "flex", gap: "0.9rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            {preview ? (
              <div style={{ position: "relative" }}>
                <img src={preview} alt="Blog cover preview" style={{ width: 220, height: 140, objectFit: "cover", borderRadius: "6px", border: "1px solid #2a2418" }} />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{ position: "absolute", top: 8, right: 8, background: "#E8472A", border: "none", width: 24, height: 24, borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <X size={12} color="#fff" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ width: 220, height: 140, borderRadius: "6px", border: "1px dashed #8A6F34", background: "#0e0d0b", color: "#7A7264", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "pointer" }}
              >
                <Upload size={20} strokeWidth={1.5} />
                Upload Cover
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={handleImageSelect}
          />
        </div>

        {error && <p style={{ color: "#E8472A", fontSize: "0.72rem", marginBottom: "1rem" }}>{error}</p>}

        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/admin/blogs" className="ad-btn" style={{ flex: 1, justifyContent: "center", padding: "0.75rem" }}>
            Cancel
          </Link>
          <button type="submit" className="ad-btn primary" disabled={saving} style={{ flex: 1, justifyContent: "center", padding: "0.75rem" }}>
            {saving ? "Saving..." : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}
