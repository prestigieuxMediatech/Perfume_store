"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import SizeSelector from "./SizeSelector";
import useReveal from "../hooks/useReveal";
import { fetchHomeProducts } from "./homeProducts";

const BASE = process.env.NEXT_PUBLIC_API_URL;
const getAuthConfig = () => ({ withCredentials: true });

const Keyframes = () => (
  <style>{`
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

    /* ══════════════════════════════════════════
       SECTION
    ══════════════════════════════════════════ */
    .products-section {
      position: relative;
      background: var(--bg);
      color: var(--text);
      padding: 3.75rem 5rem 6rem;
      overflow: hidden;
      scroll-margin-top: 90px;
    }

    .products-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
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

    .products-inner::before {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      margin: 0 0 2.5rem;
      background: linear-gradient(90deg, transparent, rgba(201,168,76,0.22), transparent);
    }

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
      color: var(--gold);
    }
    .products-eyebrow::before {
      content: '';
      display: block;
      width: 36px;
      height: 1px;
      background: var(--gold);
      flex-shrink: 0;
    }

    .products-heading {
      font-family: 'Cinzel', serif;
      font-weight: 300;
      font-size: clamp(2rem, 3.8vw, 3.6rem);
      line-height: 1.15;
      letter-spacing: 0.06em;
      color: var(--text);
    }

    .products-heading em {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-weight: 300;
      color: var(--gold-light);
    }

    /* ══════════════════════════════════════════
       GRID — matches shop pl-grid
    ══════════════════════════════════════════ */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      align-items: start;
    }

    /* ══════════════════════════════════════════
       CARD — matches shop pl-card
    ══════════════════════════════════════════ */
    .prod-card {
      position: relative;
      background: linear-gradient(180deg, rgba(26,24,22,0.9) 0%, rgba(16,14,12,0.98) 100%);
      border: 1px solid rgba(201,168,76,0.12);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 14px rgba(0,0,0,0.28);
    }

    .prod-card:hover {
      border-color: rgba(201,168,76,0.28);
      transform: translateY(-3px);
      box-shadow: 0 16px 36px rgba(0,0,0,0.42), 0 0 0 1px rgba(201,168,76,0.07);
    }

    /* Gold sweep on top edge */
    .prod-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      height: 1px;
      width: 0;
      background: linear-gradient(90deg, transparent, #C9A84C, transparent);
      transition: width 0.55s ease;
      z-index: 2;
    }
    .prod-card:hover::before { width: 100%; }

    /* ── IMAGE BOX — square, contain, no crop ── */
    .prod-img-wrap {
      position: relative;
      overflow: hidden;
      width: 100%;
      aspect-ratio: 1 / 1;
      background: #0e0c0a;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .prod-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center center;
      display: block;
      transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.7s;
      filter: brightness(0.96);
    }

    .prod-card:hover .prod-img {
      transform: scale(1.05);
      filter: brightness(1.05);
    }

    /* Shimmer sweep */
    .prod-img-wrap::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(115deg, transparent 40%, rgba(201,168,76,0.07) 50%, transparent 60%);
      transform: translateX(-100%);
      transition: transform 0.75s ease;
      pointer-events: none;
      z-index: 1;
    }
    .prod-card:hover .prod-img-wrap::after { transform: translateX(100%); }

    /* ── BADGE ── */
    .prod-badge {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      font-family: 'Cinzel', serif;
      font-size: 0.42rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      padding: 0.22rem 0.55rem;
      border-radius: 3px;
      z-index: 3;
      font-weight: 700;
    }
    .prod-badge.new     { background: #C9A84C; color: #0F0E0D; }
    .prod-badge.rare    { background: transparent; border: 1px solid rgba(201,168,76,0.6); color: #C9A84C; }
    .prod-badge.limited { background: rgba(26,24,22,0.85); border: 1px solid rgba(201,168,76,0.12); color: #6B6559; }

    /* ── HOVER OVERLAY ── */
    .prod-overlay {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 0.85rem;
      background: linear-gradient(to top, rgba(10,9,8,0.97) 0%, rgba(10,9,8,0.72) 55%, transparent 100%);
      display: flex;
      gap: 0.45rem;
      z-index: 4;
      transform: translateY(100%);
      transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .prod-card:hover .prod-overlay { transform: translateY(0); }

    .btn-quick-add {
      flex: 1;
      font-family: 'Cinzel', serif;
      font-size: 0.5rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      background: #C9A84C;
      color: #0F0E0D;
      border: none;
      padding: 0.65rem 0;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 5px;
      font-weight: 700;
    }
    .btn-quick-add:hover  { background: #E0C070; box-shadow: 0 3px 10px rgba(201,168,76,0.28); }
    .btn-quick-add:disabled { opacity: .55; cursor: not-allowed; }

    .btn-wishlist {
      padding: 0 0.85rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(201,168,76,0.2);
      color: #A8A095;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 5px;
    }
    .btn-wishlist.active { background: rgba(201,168,76,0.14); border-color: rgba(201,168,76,0.5); color: #C9A84C; }
    .btn-wishlist:hover { background: rgba(201,168,76,0.09); border-color: rgba(201,168,76,0.4); color: #C9A84C; }

    /* ── CARD BODY ── */
    .prod-body {
      padding: 0.95rem 1.05rem 1rem;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 0.28rem;
      position: relative;
      border-top: none;
    }

    /* Divider on hover */
    .prod-body::before {
      content: '';
      position: absolute;
      top: 0; left: 1.05rem; right: 1.05rem;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(201,168,76,0.14), transparent);
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    .prod-card:hover .prod-body::before { opacity: 1; }

    .prod-family {
      font-family: 'Cinzel', serif;
      font-size: 0.46rem;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: rgba(201,168,76,0.65);
      font-weight: 600;
    }

    .prod-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.08rem;
      font-weight: 400;
      letter-spacing: 0.015em;
      color: var(--text);
      line-height: 1.25;
      text-decoration: none;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      transition: color 0.3s ease;
    }
    .prod-card:hover .prod-name { color: #E0C070; }

    .prod-notes {
      display: none;
    }

    .prod-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 0.6rem;
      border-top: 1px solid rgba(201,168,76,0.06);
    }

    .prod-price {
      font-family: 'Cinzel', serif;
      font-size: 0.82rem;
      font-weight: 500;
      color: #C9A84C;
      letter-spacing: 0.04em;
    }

    .prod-size {
      font-family: 'Cinzel', serif;
      font-size: 0.44rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #6B6559;
      text-align: right;
    }

    .prod-rating {
      display: flex;
      gap: 3px;
      align-items: center;
    }
    .rating-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: rgba(201,168,76,0.3);
    }
    .rating-dot.filled { background: #C9A84C; }

    /* List CTA — hidden on desktop, shown on mobile */
    .prod-list-cta {
      display: none;
      gap: 0.45rem;
      margin-top: 0.65rem;
    }

    .prod-cart-msg {
      margin-top: 0.4rem;
      font-family: 'Cinzel', serif;
      font-size: 0.48rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      padding: 0.35rem 0.75rem;
      border-radius: 4px;
      display: inline-block;
    }
    .prod-cart-msg.success { color: #2AE880; background: rgba(42,232,128,0.08); border: 1px solid rgba(42,232,128,0.2); }
    .prod-cart-msg.error   { color: #E8472A; background: rgba(232,71,42,0.08);  border: 1px solid rgba(232,71,42,0.2); }

    /* ══════════════════════════════════════════
       FOOTER
    ══════════════════════════════════════════ */
    .products-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      margin-top: 3rem;
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
    .footer-diamond { font-size: 0.6rem; color: rgba(201,168,76,0.5); }

    .btn-explore-all {
      position: relative;
      font-family: 'Cinzel', serif;
      font-size: 0.68rem;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: var(--text);
      background: transparent;
      border: 1px solid rgba(201,168,76,0.12);
      padding: 1.1rem 3.5rem;
      overflow: hidden;
      transition: color 0.4s, border-color 0.4s;
      text-decoration: none;
      border-radius: 999px;
    }
    .btn-explore-all::before {
      content: '';
      position: absolute;
      inset: 0;
      background: #C9A84C;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94);
      z-index: 0;
    }
    .btn-explore-all:hover::before { transform: scaleX(1); }
    .btn-explore-all:hover { color: #0F0E0D; border-color: #C9A84C; }
    .btn-explore-all span { position: relative; z-index: 1; }

    .products-footer-sub {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 0.85rem;
      color: #6B6559;
      letter-spacing: 0.05em;
    }

    /* ══════════════════════════════════════════
       RESPONSIVE
    ══════════════════════════════════════════ */
    @media (max-width: 1200px) {
      .products-grid { grid-template-columns: repeat(3, 1fr); gap: 1.1rem; }
    }
    @media (max-width: 900px) {
      .products-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
      .products-section { padding: 3.5rem 3rem 5rem; }
      .products-header { flex-direction: column; align-items: flex-start; }
    }
    @media (max-width: 768px) {
      .products-section { padding: 3rem 1rem 4.5rem; }

      /* 2-column grid — same as shop page */
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }

      /* Vertical card — no horizontal layout */
      .prod-card {
        display: flex;
        flex-direction: column;
        border-radius: 10px;
      }

      /* Square image, contain, no crop, no letterbox */
      .prod-img-wrap {
        aspect-ratio: 1 / 1;
        width: 100%;
        height: auto;
        min-height: unset;
      }

      .prod-img {
        object-fit: contain;
        object-position: center center;
      }

      /* Compact body */
      .prod-body {
        padding: 0.7rem 0.75rem 0.75rem;
        gap: 0.2rem;
      }

      .prod-family { font-size: 0.42rem; letter-spacing: 0.16em; }

      .prod-name {
        font-size: 0.9rem;
        -webkit-line-clamp: 2;
        min-height: 2.3em;
      }

      .prod-footer { margin-top: 0.45rem; padding-top: 0.4rem; }
      .prod-price { font-size: 0.76rem; }
      .prod-size  { display: none; }

      /* Hide desktop overlay, show mobile CTA */
      .prod-overlay   { display: none; }
      .prod-list-cta  { display: flex; }

      .btn-quick-add {
        font-size: 0.44rem;
        padding: 0.5rem 0;
        letter-spacing: 0.12em;
        border-radius: 4px;
        width: 100%;
        text-align: center;
      }

      .btn-wishlist { width: 34px; padding: 0; border-radius: 4px; }

      .products-header { margin-bottom: 1.5rem; }
      .products-heading { font-size: clamp(1.6rem, 7vw, 2.4rem); }
    }

    @media (max-width: 420px) {
      .products-grid { gap: 8px; }
      .prod-body { padding: 0.6rem 0.65rem 0.7rem; }
      .prod-name  { font-size: 0.82rem; }
      .prod-price { font-size: 0.7rem; }
    }
  `}</style>
);

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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function Products() {
  const router = useRouter();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addingId, setAddingId] = useState(null);
  const [cartFeedback, setCartFeedback] = useState({ id: null, type: "", text: "" });
  const [selectorProduct, setSelectorProduct] = useState(null);

  useReveal({ selector: ".prod-reveal", visibleClass: "visible", threshold: 0.12, watch: products.length });

  useEffect(() => {
    fetchHomeProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlist([]);
        return;
      }
      try {
        const res = await axios.get(`${BASE}/api/auth/wishlist/ids`, getAuthConfig());
        setWishlist(Array.isArray(res.data) ? res.data : []);
      } catch {
        setWishlist([]);
      }
    };

    fetchWishlist();
  }, [user]);

  const showCartFeedback = (id, type, text) => {
    setCartFeedback({ id, type, text });
    setTimeout(() => setCartFeedback({ id: null, type: "", text: "" }), 2200);
  };

  const handleQuickAdd = async (productId) => {
    if (!user) { alert("Please login first"); return; }
    setAddingId(productId);
    try {
      const res = await axios.get(`${BASE}/api/products/${productId}`);
      const product = res.data;
      const variants = product?.variants || [];
      if (variants.length === 0) { showCartFeedback(productId, "error", "No sizes available"); return; }
      if (variants.length > 1)   { setSelectorProduct(product); return; }
      const addRes = await addItem({ product_id: product.id, variant_id: variants[0].id, quantity: 1 });
      if (addRes.ok) showCartFeedback(productId, "success", "Added to cart");
      else           showCartFeedback(productId, "error", addRes.message || "Could not add");
    } catch {
      showCartFeedback(productId, "error", "Could not load sizes");
    } finally {
      setAddingId(null);
    }
  };

  const toggleWish = async (productId) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    const isSaved = wishlist.includes(productId);
    setWishlist((prev) => (isSaved ? prev.filter((id) => id !== productId) : [...prev, productId]));

    try {
      if (isSaved) {
        await axios.delete(`${BASE}/api/auth/shop/wishlist/${productId}`, getAuthConfig());
      } else {
        await axios.post(
          `${BASE}/api/auth/wishlist`,
          { product_id: productId },
          getAuthConfig()
        );
      }
    } catch {
      setWishlist((prev) => (isSaved ? [...prev, productId] : prev.filter((id) => id !== productId)));
    }
  };

  return (
    <>
      <Keyframes />
      <section className="products-section" id="shop">
        <div className="products-inner">
          <div className="products-header">
            <div className="products-header-left">
              <div className="prod-reveal products-eyebrow">The Collection</div>
              <h2 className="prod-reveal d1 products-heading">
                Signature <em>Fragrances</em><br />
                Distilled to <em>Perfection</em>
              </h2>
            </div>
          </div>

          <div className="products-grid">
            {products.map((product, index) => {
              const badge =
                index === 0 ? { key: "new",     label: "New"     } :
                index === 1 ? { key: "rare",    label: "Rare"    } :
                index === 3 ? { key: "limited", label: "Limited" } :
                null;

              return (
                <div
                  key={product.id}
                  className={`prod-card prod-reveal d${Math.min(index + 2, 5)}`}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(`/product/${product.id}`)}
                  onKeyDown={(e) => { if (e.key === "Enter") router.push(`/product/${product.id}`); }}
                >
                  <div className="prod-img-wrap">
                    {badge && <span className={`prod-badge ${badge.key}`}>{badge.label}</span>}
                    <img src={product.img} alt={product.name} className="prod-img" />
                    <div className="prod-overlay">
                      <button
                        className="btn-quick-add"
                        onClick={(e) => { e.stopPropagation(); handleQuickAdd(product.id); }}
                        disabled={addingId === product.id}
                      >
                        {addingId === product.id ? "Adding..." : "Add to Cart"}
                      </button>
                      <button
                        className={`btn-wishlist${wishlist.includes(product.id) ? " active" : ""}`}
                        aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                        onClick={(e) => { e.stopPropagation(); toggleWish(product.id); }}
                      >
                        <IconHeart />
                      </button>
                    </div>
                  </div>

                  <div className="prod-body">
                    <span className="prod-family">{product.family}</span>
                    <Link href={`/product/${product.id}`} className="prod-name">{product.name}</Link>
                    <div className="prod-footer">
                      <span className="prod-price">{product.price || "View Product"}</span>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"4px" }}>
                        <RatingDots count={5} filled={product.rating || 5} />
                        <span className="prod-size">{product.size || "Available now"}</span>
                      </div>
                    </div>

                    {/* Mobile CTA — shown instead of hover overlay */}
                    <div className="prod-list-cta">
                      <button
                        className="btn-quick-add"
                        onClick={(e) => { e.stopPropagation(); handleQuickAdd(product.id); }}
                        disabled={addingId === product.id}
                      >
                        {addingId === product.id ? "Adding..." : "Add to Cart"}
                      </button>
                      <button
                        className={`btn-wishlist${wishlist.includes(product.id) ? " active" : ""}`}
                        aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                        onClick={(e) => { e.stopPropagation(); toggleWish(product.id); }}
                      >
                        <IconHeart />
                      </button>
                    </div>

                    {cartFeedback.id === product.id && (
                      <div className={`prod-cart-msg ${cartFeedback.type}`}>{cartFeedback.text}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="products-footer">
            <div className="prod-reveal products-footer-line">
              <span className="footer-diamond">◆</span>
            </div>
            <Link href="/shop" className="prod-reveal d1 btn-explore-all">
              <span>Explore All Categories →</span>
            </Link>
            <p className="prod-reveal d2 products-footer-sub">
              37 years · 150+ rare ingredients · 4 signature families
            </p>
          </div>
        </div>
      </section>

      {selectorProduct && (
        <SizeSelector
          product={selectorProduct}
          onClose={() => setSelectorProduct(null)}
          onAuthRequired={() => alert("Please login first")}
        />
      )}
    </>
  );
}
