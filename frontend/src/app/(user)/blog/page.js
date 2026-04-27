"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./blog.css";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/blogs`)
      .then((res) => res.json())
      .then((data) => setBlogs(Array.isArray(data) ? data : []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="blog-page">
      <div className="blog-shell">
        <header className="blog-hero">
          <div className="blog-eyebrow">SEVENEVEN Journal</div>
          <h1 className="blog-title">Stories, rituals and quiet notes fromSEVENEVEN.</h1>
          <p className="blog-sub">
            The editorial side of the house: fragrance rituals, ingredient stories,
            seasonal dressing and the slower details that make scent feel personal.
          </p>
        </header>

        <div className="blog-grid">
          <div className="blog-list">
            {loading ? (
              <div className="blog-empty" style={{ gridColumn: "1 / -1" }}>Loading stories...</div>
            ) : blogs.length === 0 ? (
              <div className="blog-empty" style={{ gridColumn: "1 / -1" }}>
                No published blogs yet. Add your first article from the admin panel and it will appear here.
              </div>
            ) : (
              blogs.map((blog) => (
                <Link href={`/blog/${blog.slug}`} className="blog-card" key={blog.id}>
                  {blog.cover_image ? (
                    <img src={`${BASE}${blog.cover_image}`} alt={blog.title} className="blog-card-image" />
                  ) : (
                    <div className="blog-card-image" />
                  )}
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span>{blog.category_label || "Journal"}</span>
                      <span>{blog.read_time_minutes || 4} min read</span>
                    </div>
                    <h2 className="blog-card-title">{blog.title}</h2>
                    <p className="blog-card-excerpt">{blog.excerpt}</p>
                    <div className="blog-card-meta">
                      <span>{blog.author_name || "7EVEN Editorial"}</span>
                      <span>{formatDate(blog.published_at || blog.created_at)}</span>
                    </div>
                    <span className="blog-card-link">Read Article</span>
                  </div>
                </Link>
              ))
            )}
          </div>

          <aside className="blog-side">
            <div className="blog-side-card">
              <div className="blog-side-label">Editorial Notes</div>
              <h2 className="blog-side-title">The same elegance as the storefront, now in story form.</h2>
              <p className="blog-side-copy">
                Every article is designed to feel like part of the SEVENEVEN, not a disconnected blog template.
              </p>
            </div>

            <div className="blog-side-card">
              <div className="blog-side-label">Admin Ready</div>
              <p className="blog-side-copy">
                Draft, publish and manage posts directly from the admin panel with cover images, excerpts and full article content.
              </p>
              <Link href="/contact" className="blog-side-link">Private inquiries</Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
