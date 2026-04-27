"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const Styles = () => (
  <style>{`
    .journal-section {
      position: relative;
      background: var(--dark);
      color: var(--cream);
      padding: 4.5rem 6rem 5rem;
      border-top: 1px solid var(--border);
      overflow: hidden;
    }

    .journal-inner {
      max-width: 1180px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 3rem;
      position: relative;
      z-index: 1;
    }

    .journal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 2rem;
    }

    .journal-eyebrow {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: 'Cinzel', serif;
      font-size: 0.6rem;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      color: var(--gold);
    }

    .journal-eyebrow::before {
      content: '';
      display: block;
      width: 34px;
      height: 1px;
      background: var(--gold);
    }

    .journal-heading {
      font-family: 'Cinzel', serif;
      font-weight: 300;
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      letter-spacing: 0.05em;
      line-height: 1.25;
    }

    .journal-heading em {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-weight: 300;
      color: var(--gold-light);
    }

    .journal-sub {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.98rem;
      line-height: 1.8;
      color: var(--text-subtle);
      max-width: 360px;
    }

    .journal-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 2rem;
      align-items: stretch;
    }

    .journal-articles {
      display: grid;
      grid-template-columns: repeat(2, minmax(0,1fr));
      gap: 1.4rem;
    }

    .journal-card {
      position: relative;
      background: radial-gradient(circle at 0% 0%, rgba(201,168,76,0.18), transparent 60%), var(--dark2);
      border-radius: 18px;
      border: 1px solid var(--border);
      padding: 1.4rem 1.4rem 1.6rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      overflow: hidden;
      cursor: pointer;
      transition: border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease;
      text-decoration: none;
    }

    .journal-card:hover {
      transform: translateY(-4px);
      border-color: rgba(201,168,76,0.45);
      box-shadow: 0 24px 60px rgba(0,0,0,0.65);
    }

    .journal-tag {
      font-family: 'Cinzel', serif;
      font-size: 0.5rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: rgba(201,168,76,0.8);
    }

    .journal-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.1rem;
      letter-spacing: 0.02em;
      color: var(--cream);
    }

    .journal-meta {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .journal-link {
      margin-top: auto;
      font-family: 'Cinzel', serif;
      font-size: 0.6rem;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--text-subtle);
      display: inline-flex;
      align-items: center;
      gap: 0.7rem;
    }

    .journal-link-line {
      width: 26px;
      height: 1px;
      background: linear-gradient(90deg, rgba(201,168,76,0.1), rgba(201,168,76,0.8));
      transition: width 0.35s ease;
    }

    .journal-card:hover .journal-link-line {
      width: 42px;
    }

    .journal-newsletter {
      border-radius: 18px;
      border: 1px solid var(--border);
      padding: 1.8rem 1.6rem 1.9rem;
      background: radial-gradient(circle at 100% 0%, rgba(201,168,76,0.25), transparent 60%), var(--dark2);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: relative;
      overflow: hidden;
    }

    .journal-newsletter::before {
      content: 'SEVENEVEN Notes';
      position: absolute;
      bottom: -24px;
      left: -40px;
      font-family: 'Cinzel', serif;
      font-size: 2rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.04);
      transform: rotate(6deg);
      pointer-events: none;
    }

    .journal-newsletter-label {
      font-family: 'Cinzel', serif;
      font-size: 0.55rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: rgba(201,168,76,0.85);
    }

    .journal-newsletter-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.2rem;
      line-height: 1.6;
      color: var(--cream);
    }

    .journal-newsletter-copy {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.9rem;
      color: var(--text-subtle);
      line-height: 1.7;
    }

    .journal-form {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.4rem;
    }

    .journal-input {
      flex: 1;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(var(--overlay-rgb),0.9);
      padding: 0.75rem 1rem;
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.9rem;
      color: var(--cream);
      outline: none;
    }

    .journal-input::placeholder {
      color: var(--text-muted);
    }

    .journal-submit {
      border-radius: 999px;
      border: none;
      background: var(--gold);
      color: var(--badge-text);
      font-family: 'Cinzel', serif;
      font-size: 0.58rem;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      padding: 0.8rem 1.6rem;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.35s ease;
    }

    .journal-submit:hover {
      background: var(--gold-light);
    }

    .journal-small-print {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-top: 0.3rem;
    }

    @media (max-width: 1024px) {
      .journal-section {
        padding: 4rem 3rem 4.25rem;
      }
      .journal-grid {
        grid-template-columns: 1fr;
      }
      .journal-newsletter {
        max-width: 480px;
      }
    }

    @media (max-width: 768px) {
      .journal-section {
        padding: 3.75rem 1.5rem 4rem;
      }
      .journal-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1.25rem;
      }
      .journal-sub {
        max-width: none;
      }
      .journal-articles {
        grid-template-columns: 1fr;
      }
      .journal-form {
        flex-direction: column;
      }
      .journal-submit {
        width: 100%;
        text-align: center;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .journal-section {
        padding-top: 3.25rem;
      }
    }
  `}</style>
);

export default function Journal() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/blogs`)
      .then((res) => res.json())
      .then((data) => setArticles(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => setArticles([]));
  }, []);

  return (
    <>
      <Styles />
      <section className="journal-section" id="journal">
        <div className="journal-inner">
          <header className="journal-header">
            <div>
              <div className="journal-eyebrow">SEVENEVEN Journal</div>
              <h2 className="journal-heading">
                Stories from the <em>atelier</em>
              </h2>
            </div>
            <p className="journal-sub">
              Essays, rituals and field notes from the perfumers behindSEVENEVEN,
              written to help you wear fragrance with intention.
            </p>
          </header>

          <div className="journal-grid">
            <div className="journal-articles">
              {articles.length > 0 ? articles.map((article) => (
                <Link key={article.slug} href={`/blog/${article.slug}`} className="journal-card">
                  <span className="journal-tag">{article.category_label || "Journal"}</span>
                  <h3 className="journal-title">{article.title}</h3>
                  <span className="journal-meta">{article.read_time_minutes || 4} min read</span>
                  <span className="journal-link">
                    <span>Read</span>
                    <span className="journal-link-line" />
                  </span>
                </Link>
              )) : (
                <Link href="/blog" className="journal-card" style={{ gridColumn: "1 / -1" }}>
                  <span className="journal-tag">SEVENEVEN Journal</span>
                  <h3 className="journal-title">New editorial stories will appear here soon.</h3>
                  <span className="journal-meta">Publish the first blog from admin to bring this section live.</span>
                  <span className="journal-link">
                    <span>Open Blog</span>
                    <span className="journal-link-line" />
                  </span>
                </Link>
              )}
            </div>

            <aside className="journal-newsletter">
              <span className="journal-newsletter-label">Scent letters</span>
              <h3 className="journal-newsletter-title">
                Be the first to know about private releases and atelier evenings.
              </h3>
              <p className="journal-newsletter-copy">
                We write only when we have something rare to share, usually no
                more than twice a month.
              </p>
              <form
                className="journal-form"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  className="journal-input"
                />
                <button type="submit" className="journal-submit">
                  Join List
                </button>
              </form>
              <p className="journal-small-print">
                No promotions, ever, only invitations and stories from the SEVENEVEN.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
