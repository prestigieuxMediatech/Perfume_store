"use client";
import React, { useEffect } from "react";

const Keyframes = () => (
  <style>{`

    /* ── Scroll reveal ── */
    .prod-reveal {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .prod-reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .prod-reveal.d1 { transition-delay: 0.05s; }
    .prod-reveal.d2 { transition-delay: 0.18s; }
    .prod-reveal.d3 { transition-delay: 0.31s; }
    .prod-reveal.d4 { transition-delay: 0.44s; }
    .prod-reveal.d5 { transition-delay: 0.57s; }
    .prod-reveal.d6 { transition-delay: 0.70s; }

    /* ── Section ── */
    .products-section {
      position: relative;
      background: #080808;
      color: #f5f0e8;
      /* Tighter top padding so the gap after About feels balanced on desktop */
      padding: 4.25rem 6rem 6.5rem;
      overflow: hidden;
      scroll-margin-top: 90px;
    }

    /* Faint diagonal rule across bg */
    .products-section::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background:
        repeating-linear-gradient(
          -55deg,
          transparent,
          transparent 120px,
          rgba(201,168,76,0.018) 120px,
          rgba(201,168,76,0.018) 121px
        );
      pointer-events: none;
      z-index: 0;
    }

    .products-inner {
      position: relative;
      z-index: 1;
      max-width: 1320px;
      margin: 0 auto;
    }

    /* ── Section header ── */
    .products-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 3rem;
      gap: 2rem;
    }

    .products-header-left { display: flex; flex-direction: column; gap: 1.2rem; }

    .products-eyebrow {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: 'Cinzel', serif;
      font-size: 0.62rem;
      letter-spacing: 0.38em;
      text-transform: uppercase;
      color: #c9a84c;
    }
    .products-eyebrow::before {
      content: '';
      display: block;
      width: 36px;
      height: 1px;
      background: #c9a84c;
      flex-shrink: 0;
    }

    .products-heading {
      font-family: 'Cinzel', serif;
      font-weight: 300;
      font-size: clamp(2rem, 3.8vw, 3.6rem);
      line-height: 1.15;
      letter-spacing: 0.06em;
      color: #f5f0e8;
    }

    .products-heading em {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-weight: 300;
      color: #e8c97a;
    }

    /* filter tabs */
    .products-tabs {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-shrink: 0;
    }

    .prod-tab {
      font-family: 'Cinzel', serif;
      font-size: 0.58rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: rgba(245,240,232,0.35);
      background: none;
      border: 1px solid transparent;
      padding: 0.5rem 1.1rem;
      cursor: pointer;
      transition: color 0.3s, border-color 0.3s;
    }
    .prod-tab:hover { color: #e8c97a; border-color: rgba(201,168,76,0.3); }
    .prod-tab.active {
      color: #c9a84c;
      border-color: rgba(201,168,76,0.45);
    }

    /* ── Card grid ── */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }

    /* ── Card ── */
    .prod-card {
      position: relative;
      background: #0e0e0e;
      border: 1px solid rgba(245,240,232,0.06);
      overflow: hidden;
      cursor: pointer;
      transition: border-color 0.45s ease, transform 0.45s ease;
    }

    .prod-card:hover {
      border-color: rgba(201,168,76,0.35);
      transform: translateY(-6px);
    }

    /* image wrapper */
    .prod-img-wrap {
      position: relative;
      overflow: hidden;
      aspect-ratio: 3/4;
      background: #111;
    }

    .prod-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94),
                  filter 0.7s ease;
      filter: brightness(0.88) saturate(0.85);
    }

    .prod-card:hover .prod-img {
      transform: scale(1.07);
      filter: brightness(1) saturate(1);
    }

    /* Gold shimmer sweep on hover */
    .prod-img-wrap::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        115deg,
        transparent 30%,
        rgba(201,168,76,0.12) 50%,
        transparent 70%
      );
      transform: translateX(-100%);
      transition: transform 0.7s ease;
      pointer-events: none;
      z-index: 2;
    }
    .prod-card:hover .prod-img-wrap::after {
      transform: translateX(100%);
    }

    /* Badge */
    .prod-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      font-family: 'Cinzel', serif;
      font-size: 0.48rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      padding: 0.35rem 0.75rem;
      z-index: 3;
    }
    .prod-badge.new    { background: #c9a84c; color: #080808; }
    .prod-badge.rare   { background: transparent; border: 1px solid rgba(201,168,76,0.6); color: #c9a84c; }
    .prod-badge.limited { background: #1a1a1a; border: 1px solid rgba(245,240,232,0.15); color: rgba(245,240,232,0.5); }

    /* Quick-add overlay — slides up from bottom */
    .prod-overlay {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 1.2rem;
      background: linear-gradient(to top, rgba(8,8,8,0.97) 0%, transparent 100%);
      transform: translateY(100%);
      transition: transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94);
      z-index: 4;
      display: flex;
      gap: 0.5rem;
    }
    .prod-card:hover .prod-overlay { transform: translateY(0); }

    .btn-quick-add {
      flex: 1;
      font-family: 'Cinzel', serif;
      font-size: 0.55rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      background: #c9a84c;
      color: #080808;
      font-weight: bolder;
      border: none;
      padding: 0.75rem 0;
      cursor: pointer;
      transition: background 0.3s;
    }
    .btn-quick-add:hover { background: #e8c97a; }

    .btn-wishlist {
      width: 38px;
      background: rgba(245,240,232,0.08);
      border: 1px solid rgba(245,240,232,0.12);
      color: rgba(245,240,232,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.3s, color 0.3s, border-color 0.3s;
      flex-shrink: 0;
    }
    .btn-wishlist:hover {
      background: rgba(201,168,76,0.1);
      border-color: rgba(201,168,76,0.4);
      color: #c9a84c;
    }

    /* ── Card body ── */
    .prod-body {
      padding: 1.4rem 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      border-top: 1px solid rgba(245,240,232,0.05);
      position: relative;
    }

    /* Animated gold line grows from left on card hover */
    .prod-body::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      height: 1px;
      width: 0;
      background: #c9a84c;
      transition: width 0.5s ease;
    }
    .prod-card:hover .prod-body::before { width: 100%; }

    .prod-family {
      font-family: 'Cinzel', serif;
      font-size: 0.5rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: rgba(201,168,76,0.6);
    }

    .prod-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.2rem;
      font-weight: 300;
      letter-spacing: 0.04em;
      color: #f5f0e8;
      line-height: 1.25;
      transition: color 0.3s;
    }
    .prod-card:hover .prod-name { color: #e8c97a; }

    .prod-notes {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 0.82rem;
      color: rgba(245,240,232,0.35);
      line-height: 1.5;
    }

    .prod-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.5rem;
    }

    .prod-price {
      font-family: 'Cinzel', serif;
      font-size: 0.85rem;
      font-weight: 400;
      color: #c9a84c;
      letter-spacing: 0.1em;
    }

    .prod-size {
      font-family: 'Cinzel', serif;
      font-size: 0.48rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(245,240,232,0.25);
    }

    /* ── Rating dots ── */
    .prod-rating {
      display: flex;
      gap: 3px;
      align-items: center;
    }
    .rating-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: rgba(201,168,76,0.3);
    }
    .rating-dot.filled { background: #c9a84c; }

    /* ── Bottom CTA ── */
    .products-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      margin-top: 3rem;
    }

    /* Soft top divider so Products feels anchored to the content above */
    .products-inner::before {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      margin: 0 0 2.5rem;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(201,168,76,0.22),
        transparent
      );
    }

    .products-footer-line {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      width: 100%;
      max-width: 500px;
    }

    .products-footer-line::before,
    .products-footer-line::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(201,168,76,0.25), transparent);
    }

    .footer-diamond {
      font-size: 0.6rem;
      color: rgba(201,168,76,0.5);
    }

    .btn-explore-all {
      position: relative;
      font-family: 'Cinzel', serif;
      font-size: 0.68rem;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: #f5f0e8;
      background: transparent;
      border: 1px solid rgba(245,240,232,0.2);
      padding: 1.1rem 3.5rem;
      cursor: pointer;
      overflow: hidden;
      transition: color 0.4s, border-color 0.4s;
    }

    /* Fill sweep on hover */
    .btn-explore-all::before {
      content: '';
      position: absolute;
      inset: 0;
      background: #c9a84c;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94);
      z-index: 0;
    }
    .btn-explore-all:hover::before { transform: scaleX(1); }
    .btn-explore-all:hover { color: #080808; font-weight: bolder; border-color: #c9a84c; }

    .btn-explore-all span {
      position: relative;
      z-index: 1;
    }

    .products-footer-sub {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 0.85rem;
      color: rgba(245,240,232,0.3);
      letter-spacing: 0.05em;
    }

    /* ── Responsive ── */
    @media (max-width: 1200px) {
      .products-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 900px) {
      .products-section { padding: 7rem 3rem; }
      .products-header { flex-direction: column; align-items: flex-start; }
    }
    @media (max-width: 600px) {
      .products-section { padding: 5rem 1.25rem; }
      .products-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
      .products-heading { font-size: 1.8rem; }
      .prod-body { padding: 1rem; }
      .prod-name { font-size: 1rem; }
    }
    @media (max-width: 420px) {
      .products-grid { grid-template-columns: 1fr; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
      }
    }
  `}</style>
);

const PRODUCTS = [
  {
    id: 1,
    family: "Floral · Oriental",
    name: "Velours Noir",
    notes: "Black rose, oud, amber & dark vanilla",
    price: "₹18,500",
    size: "50 ml",
    badge: "new",
    badgeLabel: "New",
    rating: 5,
    img: "/one.webp",
  },
  {
    id: 2,
    family: "Woody · Spiced",
    name: "Santal Impérial",
    notes: "Mysore sandalwood, cardamom & leather",
    price: "₹22,000",
    size: "50 ml",
    badge: "rare",
    badgeLabel: "Rare",
    rating: 5,
    img: "/two.jpg",
  },
  {
    id: 3,
    family: "Aquatic · Fresh",
    name: "Brume d'Aube",
    notes: "Sea salt, iris, white cedar & musk",
    price: "₹15,800",
    size: "50 ml",
    badge: null,
    rating: 4,
    img: "/three.jpg",
  },
  {
    id: 4,
    family: "Gourmand · Warm",
    name: "Or Épicé",
    notes: "Saffron, tonka bean, honey & vetiver",
    price: "₹26,500",
    size: "50 ml",
    badge: "limited",
    badgeLabel: "Limited",
    rating: 5,
    img: "/four.webp",
  },
];

function RatingDots({ count, filled }) {
  return (
    <div className="prod-rating">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={`rating-dot${i < filled ? " filled" : ""}`} />
      ))}
    </div>
  );
}

function IconHeart() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function useReveal(selector) {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector]);
}


export default function Products() {
  const [activeTab, setActiveTab] = React.useState("All");
  useReveal(".prod-reveal");

  return (
    <>
      <Keyframes />
      <section className="products-section" id="shop">
        <div className="products-inner">

          <div className="products-header">
            <div className="products-header-left">
              <div className="prod-reveal products-eyebrow">
                The Collection
              </div>
              <h2 className="prod-reveal d1 products-heading">
                Signature <em>Fragrances</em><br />
                Distilled to <em>Perfection</em>
              </h2>
            </div>

            
          </div>

          {/* ── Cards ── */}
          <div className="products-grid">
            {PRODUCTS.map((p, i) => (
              <div
                key={p.id}
                className={`prod-card prod-reveal d${i + 2}`}
              >
                {/* Image */}
                <div className="prod-img-wrap">
                  {p.badge && (
                    <span className={`prod-badge ${p.badge}`}>{p.badgeLabel}</span>
                  )}
                  <img src={p.img} alt={p.name} className="prod-img" />

                  {/* Hover overlay */}
                  <div className="prod-overlay">
                    <button className="btn-quick-add">Add to Cart</button>
                    <button className="btn-wishlist" aria-label="Wishlist">
                      <IconHeart />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="prod-body">
                  <span className="prod-family">{p.family}</span>
                  <span className="prod-name">{p.name}</span>
                  <span className="prod-notes">{p.notes}</span>
                  <div className="prod-footer">
                    <span className="prod-price">{p.price}</span>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                      <RatingDots count={5} filled={p.rating} />
                      <span className="prod-size">{p.size}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Footer CTA ── */}
          <div className="products-footer">
            <div className="prod-reveal products-footer-line">
              <span className="footer-diamond">◆</span>
            </div>
            <button className="prod-reveal d1 btn-explore-all">
              <span>Explore All Categories →</span>
            </button>
            <p className="prod-reveal d2 products-footer-sub">
              37 years · 150+ rare ingredients · 4 signature families
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
