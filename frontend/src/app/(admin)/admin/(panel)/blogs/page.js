"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getHeaders = () => ({});

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/admin/blogs`, { headers: getHeaders() });
      setBlogs(Array.isArray(res.data) ? res.data : []);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await axios.delete(`${BASE}/api/admin/blogs/${id}`, { headers: getHeaders() });
      fetchBlogs();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete blog");
    }
  };

  const filtered = blogs.filter((blog) => {
    const value = search.toLowerCase();
    return (
      blog.title?.toLowerCase().includes(value) ||
      blog.slug?.toLowerCase().includes(value) ||
      blog.category_label?.toLowerCase().includes(value)
    );
  });

  return (
    <>
      <div className="ad-section-head" style={{ marginBottom: "1.2rem", gap: "1rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search blogs..."
          className="ad-input"
          style={{ width: "260px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link href="/admin/blogs/new" className="ad-btn primary">
          <Plus size={12} strokeWidth={1.5} />
          Add Blog
        </Link>
      </div>

      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Article</th>
              <th>Category</th>
              <th>Author</th>
              <th>Read Time</th>
              <th>Status</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ color: "#7A7264", textAlign: "center", padding: "2rem" }}>
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ color: "#7A7264", textAlign: "center", padding: "2rem" }}>
                  No blogs found
                </td>
              </tr>
            ) : (
              filtered.map((blog, index) => (
                <tr key={blog.id}>
                  <td style={{ color: "#7A7264" }}>{index + 1}</td>
                  <td>
                    <div style={{ display: "grid", gap: "0.25rem" }}>
                      <span>{blog.title}</span>
                      <span style={{ color: "#7A7264", fontSize: "0.62rem", letterSpacing: "0.08em" }}>
                        /{blog.slug}
                      </span>
                    </div>
                  </td>
                  <td style={{ color: "#7A7264" }}>{blog.category_label || "Journal"}</td>
                  <td>{blog.author_name || "7EVEN Editorial"}</td>
                  <td>{blog.read_time_minutes || 4} min</td>
                  <td>
                    <span className={`badge ${blog.is_published ? "active" : "inactive"}`}>
                      {blog.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ color: "#7A7264" }}>
                    {blog.published_at
                      ? new Date(blog.published_at).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <Link
                        href={`/admin/blogs/${blog.id}/edit`}
                        style={{ color: "#7A7264", transition: "color 0.2s", display: "flex" }}
                        onMouseOver={(e) => (e.currentTarget.style.color = "#C9A84C")}
                        onMouseOut={(e) => (e.currentTarget.style.color = "#7A7264")}
                      >
                        <Pencil size={14} strokeWidth={1.5} />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        style={{ background: "none", border: "none", color: "#7A7264", cursor: "pointer", padding: 0, display: "flex", transition: "color 0.2s" }}
                        onMouseOver={(e) => (e.currentTarget.style.color = "#E8472A")}
                        onMouseOut={(e) => (e.currentTarget.style.color = "#7A7264")}
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
