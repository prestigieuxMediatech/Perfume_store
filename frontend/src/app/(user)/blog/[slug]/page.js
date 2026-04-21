"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import "./blog-detail.css";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/blogs/${slug}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => setBlog(data))
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const paragraphs = blog?.content
    ? blog.content.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean)
    : [];

  return (
    <section className="blog-detail-page">
      <div className="blog-detail-shell">
        <Link href="/blog" className="blog-detail-back">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to Journal
        </Link>

        {loading ? (
          <div className="blog-detail-state">Loading article...</div>
        ) : !blog ? (
          <div className="blog-detail-state">This article could not be found.</div>
        ) : (
          <>
            <div className="blog-detail-hero">
              <div className="blog-detail-copy">
                <div className="blog-detail-tag">{blog.category_label || "Journal"}</div>
                <h1 className="blog-detail-title">{blog.title}</h1>
                <p className="blog-detail-excerpt">{blog.excerpt}</p>
                <div className="blog-detail-meta">
                  <span>{blog.author_name || "7EVEN Editorial"}</span>
                  <span>{blog.read_time_minutes || 4} min read</span>
                  <span>{formatDate(blog.published_at || blog.created_at)}</span>
                </div>
              </div>

              {blog.cover_image ? (
                <img src={`${BASE}${blog.cover_image}`} alt={blog.title} className="blog-detail-image" />
              ) : (
                <div className="blog-detail-image" />
              )}
            </div>

            <div className="blog-detail-body">
              <article className="blog-detail-article">
                {paragraphs.map((paragraph, index) => (
                  <p key={`${index}-${paragraph.slice(0, 20)}`} className="blog-detail-paragraph">
                    {paragraph}
                  </p>
                ))}
              </article>

              <aside className="blog-detail-side">
                <div className="blog-detail-side-card">
                  <div className="blog-detail-side-label">About This Piece</div>
                  <h2 className="blog-detail-side-title">Written to feel like part of the maison.</h2>
                  <p className="blog-detail-excerpt" style={{ fontSize: "0.98rem", marginTop: "0.7rem" }}>
                    The blog experience uses the same visual language as the storefront so it feels intentional across the whole site.
                  </p>
                </div>

                {blog.related?.length > 0 && (
                  <div className="blog-detail-side-card">
                    <div className="blog-detail-side-label">More Reading</div>
                    <div className="blog-detail-related">
                      {blog.related.map((item) => (
                        <Link key={item.id} href={`/blog/${item.slug}`} className="blog-detail-related-item">
                          <span className="blog-detail-related-title">{item.title}</span>
                          <span className="blog-detail-related-meta">
                            {item.read_time_minutes || 4} min read
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
