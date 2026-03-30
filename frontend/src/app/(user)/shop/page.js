'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SizeSelector from "../components/SizeSelector";
import './shop.css'

const BASE = process.env.NEXT_PUBLIC_API_URL;

/* ─────────────────────────────────────────────
   STYLES — unchanged from your original
───────────────────────────────────────────── */
const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

const SORT_OPTS = [
  { val:'featured',   label:'Featured'          },
  { val:'newest',     label:'Newest First'       },
  { val:'price-asc',  label:'Price: Low → High'  },
  { val:'price-desc', label:'Price: High → Low'  },
  { val:'a-z',        label:'Name: A → Z'        },
];

/* ── helpers ── */
function HeartIcon({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.r');
    const obs = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}


/* ── get selected variant price ── */
function getVariantPrice(variants, size) {
  const v = variants?.find(v => v.size === size);
  if (!v) return null;
  return v.discount_price
    ? { display: `₹${Number(v.discount_price).toLocaleString('en-IN')}`, original: `₹${Number(v.price).toLocaleString('en-IN')}`, discounted: true }
    : { display: `₹${Number(v.price).toLocaleString('en-IN')}`, original: null, discounted: false };
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function ProductListing() {

  // ── Data state ─────────────────────────
  const [products, setProducts]           = useState([]);
  const [categories, setCategories]       = useState([]);
  const [brands, setBrands]               = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loading, setLoading]             = useState(true);

  const { user } = useAuth();
  const { addItem } = useCart();

  // ── Filter state ───────────────────────
  const [cat, setCat]               = useState('all');
  const [activeBrand, setActiveBrand] = useState('all');
  const [sort, setSort]             = useState('featured');
  const [maxPrice, setMaxPrice]     = useState(500000);
  const [checkedSizes, setCheckedSizes] = useState([]);

  // ── UI state ───────────────────────────
  const [view, setView]           = useState('list');
  const [wishlist, setWishlist]   = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [modalSize, setModalSize] = useState(null);
  const [visible, setVisible]     = useState(8);
  const [addingId, setAddingId]   = useState(null);
  const [cartFeedback, setCartFeedback] = useState({ id: null, type: '', text: '' });
  const [selectorProduct, setSelectorProduct] = useState(null);
  const [modalAdding, setModalAdding] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalAdded, setModalAdded] = useState(false);

  useReveal();

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setQuickView(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    setModalAdding(false);
    setModalError('');
    setModalAdded(false);
  }, [quickView]);

  useEffect(() => {
    Promise.all([
      axios.get(`${BASE}/api/categories`),
      axios.get(`${BASE}/api/brands`),
    ])
      .then(([catRes, brandRes]) => {
        setCategories(Array.isArray(catRes.data)   ? catRes.data   : []);
        setBrands(Array.isArray(brandRes.data)     ? brandRes.data : []);
        setFilteredBrands(Array.isArray(brandRes.data) ? brandRes.data : []);
      })
      .catch(console.error);
  }, []);


  useEffect(() => {
    fetchProducts();
  }, [cat, activeBrand, sort]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${BASE}/api/auth/wishlist/ids`, getAuthConfig());
        setWishlist(res.data || []);
      } catch (err) {
        console.log('Wishlist not loaded (maybe not logged in)');
      }
    };

    fetchWishlist();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (cat !== 'all')         params.category = cat;
      if (activeBrand !== 'all') params.brand    = activeBrand;
      if (sort !== 'featured')   params.sort     = sort;

      const res = await axios.get(`${BASE}/api/products`, { params });
      setProducts(Array.isArray(res.data) ? res.data : []);
      setVisible(8);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const showCartFeedback = (id, type, text) => {
    setCartFeedback({ id, type, text });
    setTimeout(() => {
      setCartFeedback({ id: null, type: '', text: '' });
    }, 2200);
  };

  const handleAddToCart = async (product, preferredSize) => {
    if (!user) {
      alert('Please login first');
      return;
    }
    const variants = product?.variants || [];
    if (variants.length === 0) {
      showCartFeedback(product.id, 'error', 'No sizes available');
      return;
    }

    let variant = preferredSize
      ? variants.find(v => v.size === preferredSize)
      : null;

    if (!variant && variants.length === 1) variant = variants[0];
    if (!variant) {
      setSelectorProduct(product);
      return;
    }

    setAddingId(product.id);
    const res = await addItem({
      product_id: product.id,
      variant_id: variant.id,
      quantity: 1,
    });
    setAddingId(null);

    if (res.ok) showCartFeedback(product.id, 'success', 'Added to cart');
    else showCartFeedback(product.id, 'error', res.message || 'Could not add');
  };

  const handleModalAdd = async () => {
    if (!quickView) return;
    if (!user) {
      alert('Please login first');
      return;
    }
    const variant = quickView.variants?.find(v => v.size === modalSize)
      || quickView.variants?.[0];
    if (!variant) {
      setModalError('Please select a size');
      return;
    }
    setModalAdding(true);
    setModalError('');
    const res = await addItem({
      product_id: quickView.id,
      variant_id: variant.id,
      quantity: 1,
    });
    setModalAdding(false);
    if (!res.ok) {
      setModalError(res.message || 'Could not add to cart');
      return;
    }
    setModalAdded(true);
    showCartFeedback(quickView.id, 'success', 'Added to cart');
    setTimeout(() => setModalAdded(false), 1800);
  };

  // ── Category change ────────────────────
  const handleCatChange = (slug) => {
    setCat(slug);
    setActiveBrand('all');
    if (slug === 'all') {
      setFilteredBrands(brands);
    } else {
      const found = categories.find(c => c.slug === slug);
      setFilteredBrands(found ? brands.filter(b => b.category_id === found.id) : brands);
    }
  };

  // ── Client-side filters ────────────────
  const filtered = products
    .filter(p => {
      if (!p.starting_price) return true;
      return Number(p.starting_price) <= maxPrice;
    })
    .filter(p => {
      if (checkedSizes.length === 0) return true;
      return p.variants?.some(v => checkedSizes.includes(v.size));
    })
    .sort((a, b) => {
      const aP = Number(a.starting_price) || 0;
      const bP = Number(b.starting_price) || 0;
      if (sort === 'price-asc')  return aP - bP;
      if (sort === 'price-desc') return bP - aP;
      return 0;
    });

  const shown = filtered.slice(0, visible);

  // ── Helpers ────────────────────────────
  const toggleWish = async (id, e) => {
      e.stopPropagation();

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        return;
      }

      const isSaved = wishlist.includes(id);

      setWishlist(w =>
        isSaved ? w.filter(x => x !== id) : [...w, id]
      );

      try {
        if (isSaved) {
          await axios.delete(`${BASE}/api/auth/shop/wishlist/${id}`, getAuthConfig());
        } else {
          await axios.post(
            `${BASE}/api/auth/wishlist`,
            { product_id: id },
            getAuthConfig()
          );
        }
      } catch (err) {
        console.error(err);

        setWishlist(w =>
          isSaved ? [...w, id] : w.filter(x => x !== id)
        );
      }
  };
  const toggleSize   = s => setCheckedSizes(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const clearFilters = () => { setCat('all'); setActiveBrand('all'); setMaxPrice(500000); setCheckedSizes([]); setFilteredBrands(brands); };

  const allSizes = [...new Set(products.flatMap(p => p.variants?.map(v => v.size) ?? []))].sort();

  const minProductPrice = products.length > 0
    ? Math.min(...products.map(p => Number(p.starting_price) || 0))
    : 0;
  const maxProductPrice = products.length > 0
    ? Math.max(...products.map(p => Number(p.starting_price) || 500000))
    : 500000;

  return (
    <div className="pl-page">
      
      <div className="pl-content">

        <div className="pl-hero">
          <div className="pl-hero-glow"/>
          <div className="pl-hero-inner">
            <div className="pl-hero-eyebrow"><span/> The Collection <span/></div>
            <h1 className="pl-hero-heading">
              SIGNATURE
              <em>Fragrances</em>
            </h1>
            <p className="pl-hero-sub">
              Each scent a chapter. Each bottle a world. Discover the compositions
              that have defined Aurum for thirty-seven years.
            </p>
            <p className="pl-result-count">{filtered.length} Fragrances</p>
          </div>
          <div className="pl-hero-orn"><span>◆</span></div>
        </div>

        <div className="pl-toolbar">
          <div className="pl-toolbar-inner">

            {/* Category pills */}
            <div className="pl-cats">
              <button
                className={`pl-cat${cat === 'all' ? ' on' : ''}`}
                onClick={() => handleCatChange('all')}
              >
                All
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  className={`pl-cat${cat === c.slug ? ' on' : ''}`}
                  onClick={() => handleCatChange(c.slug)}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="pl-controls">
              <select
                className="pl-sort"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {SORT_OPTS.map(o => (
                  <option key={o.val} value={o.val}>{o.label}</option>
                ))}
              </select>

              <div className="pl-view-toggle">
                <button
                  className={`pl-view-btn${view === 'grid' ? ' on' : ''}`}
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                >
                  <span className="ico-grid"/>
                </button>
                <button
                  className={`pl-view-btn${view === 'list' ? ' on' : ''}`}
                  onClick={() => setView('list')}
                  aria-label="List view"
                >
                  <span className="ico-list"/>
                </button>
              </div>
            </div>

          </div>
        </div>

        <div className="pl-body">

          <aside className="pl-sidebar">
            <div className="pl-sidebar-static">

              <div className="pl-sidebar-section">
                <div className="pl-sidebar-title">Price Range</div>
                <div className="pl-price-range">
                  <input
                    type="range" className="pl-range"
                    min={minProductPrice}
                    max={maxProductPrice}
                    step={500}
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                  />
                  <div className="pl-price-labels">
                    <span>₹{minProductPrice.toLocaleString('en-IN')}</span>
                    <span>Up to ₹{maxPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {filteredBrands.length > 0 && (
                <div className="pl-sidebar-section">
                  <div className="pl-sidebar-title">Brand</div>
                  <div className="pl-check-list">
                    <div className="pl-check-item" onClick={() => setActiveBrand('all')}>
                      <div className={`pl-check-box${activeBrand === 'all' ? ' checked' : ''}`}/>
                      <span className="pl-check-label">All Brands</span>
                    </div>
                    {filteredBrands.map(b => (
                      <div
                        key={b.id}
                        className="pl-check-item"
                        onClick={() => setActiveBrand(b.slug)}
                      >
                        <div className={`pl-check-box${activeBrand === b.slug ? ' checked' : ''}`}/>
                        <span className="pl-check-label">{b.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

        
              {allSizes.length > 0 && (
                <div className="pl-sidebar-section">
                  <div className="pl-sidebar-title">Size</div>
                  <div className="pl-check-list">
                    {allSizes.map(s => (
                      <div key={s} className="pl-check-item" onClick={() => toggleSize(s)}>
                        <div className={`pl-check-box${checkedSizes.includes(s) ? ' checked' : ''}`}/>
                        <span className="pl-check-label">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear filters */}
              {(cat !== 'all' || activeBrand !== 'all' || checkedSizes.length > 0 || maxPrice < maxProductPrice) && (
                <button className="pl-clear-btn" onClick={clearFilters}>
                  ✕ Clear all filters
                </button>
              )}

            </div>
          </aside>

          {/* ── PRODUCT GRID ── */}
          <div className={`pl-grid${view === 'list' ? ' list-view' : ''}`}>

            {loading ? (
              /* Loading skeletons */
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="pl-card" style={{ pointerEvents:'none' }}>
                  <div className="pl-card-img pl-skeleton" style={{ aspectRatio:'3/4' }}/>
                  <div className="pl-card-body">
                    <div className="pl-skeleton" style={{ height:10, width:'40%', marginBottom:12, borderRadius:2 }}/>
                    <div className="pl-skeleton" style={{ height:18, width:'80%', marginBottom:8, borderRadius:2 }}/>
                    <div className="pl-skeleton" style={{ height:12, width:'100%', marginBottom:4, borderRadius:2 }}/>
                    <div className="pl-skeleton" style={{ height:12, width:'70%', marginBottom:20, borderRadius:2 }}/>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <div className="pl-skeleton" style={{ height:14, width:'35%', borderRadius:2 }}/>
                      <div className="pl-skeleton" style={{ height:14, width:'25%', borderRadius:2 }}/>
                    </div>
                  </div>
                </div>
              ))
            ) : shown.length === 0 ? (
              <div className="pl-empty">
                <div className="pl-empty-icon">◈</div>
                <p className="pl-empty-title">No fragrances match your selection</p>
                <p className="pl-empty-sub">Try adjusting the filters above</p>
                <button className="pl-clear-btn" onClick={clearFilters} style={{ color:'var(--gold)' }}>
                  Clear all filters →
                </button>
              </div>
            ) : (
              shown.map((p, i) => (
                <article
                  key={p.id}
                  className="pl-card"
                  onClick={() => {
                    setQuickView(p);
                    setModalSize(p.variants?.[0]?.size ?? null);
                  }}
                >
                  {/* Image */}
                  <div className="pl-card-img">
                    <button
                      className={`pl-wish${wishlist.includes(p.id) ? ' active' : ''}`}
                      onClick={e => toggleWish(p.id, e)}
                      aria-label="Add to wishlist"
                    >
                      <HeartIcon filled={wishlist.includes(p.id)}/>
                    </button>

                    {p.primary_image ? (
                      <img
                        src={`${BASE}${p.primary_image}`}
                        alt={p.name}
                        loading="lazy"
                      />
                    ) : (
                      <div style={{
                        width:'100%', height:'100%',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        color:'rgba(201,168,76,0.2)', fontSize:'.6rem',
                        letterSpacing:'.2em', fontFamily:'Cinzel,serif',
                      }}>
                        NO IMAGE
                      </div>
                    )}

                    <div className="pl-overlay">
                      <button
                        className="pl-add-btn"
                        onClick={e => { e.stopPropagation(); handleAddToCart(p); }}
                        disabled={addingId === p.id}
                      >
                        {addingId === p.id ? 'Adding...' : 'Add to Cart'}
                      </button>
                      <button
                        className="pl-quick-view"
                        aria-label="Quick view"
                        onClick={e => { e.stopPropagation(); setQuickView(p); setModalSize(p.variants?.[0]?.size ?? null); }}
                      >
                        ⤢
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="pl-card-body">
                    <span className="pl-card-family">
                      {p.brand_name ?? p.category_name ?? '—'}
                    </span>
                    <div className="pl-card-name">{p.name}</div>
                    <div className="pl-card-notes">
                      {p.description ?? ''}
                    </div>
                    <div className="pl-card-footer">
                      <span className="pl-card-price">
                        {p.starting_price
                          ? `From ₹${Number(p.starting_price).toLocaleString('en-IN')}`
                          : '—'
                        }
                      </span>
                      <div className="pl-card-meta">
                        <span className="pl-card-size">
                          {p.variants?.map(v => v.size).join(' · ') ?? ''}
                        </span>
                      </div>
                    </div>

                    <div className="pl-list-cta">
                      <button
                        className="pl-list-add"
                        onClick={e => { e.stopPropagation(); handleAddToCart(p); }}
                        disabled={addingId === p.id}
                      >
                        {addingId === p.id ? 'Adding...' : 'Add to Cart'}
                      </button>
                    </div>

                    {cartFeedback.id === p.id && (
                      <div className={`pl-cart-msg ${cartFeedback.type}`}>
                        {cartFeedback.text}
                      </div>
                    )}
                  </div>
                </article>
              ))
            )}

            {/* Load more */}
            {!loading && shown.length > 0 && visible < filtered.length && (
              <div className="pl-load-more">
                <div className="pl-load-rule"><span>◆</span></div>
                <button className="pl-load-btn" onClick={() => setVisible(v => v + 4)}>
                  <span>Discover More →</span>
                </button>
                <p className="pl-load-info">
                  Showing {shown.length} of {filtered.length} fragrances
                </p>
              </div>
            )}

          </div>
        </div>

        {/* ════ QUICK VIEW MODAL ════ */}
        {quickView && (
          <div className="pl-modal-bg" onClick={() => setQuickView(null)}>
            <div className="pl-modal" onClick={e => e.stopPropagation()}>
              <button className="pl-modal-close" onClick={() => setQuickView(null)}>✕</button>

              {/* Image */}
              <div className="pl-modal-img">
                {quickView.primary_image ? (
                  <img
                    src={`${BASE}${quickView.primary_image}`}
                    alt={quickView.name}
                  />
                ) : (
                  <div style={{
                    width:'100%', height:'100%',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'rgba(201,168,76,0.2)', fontSize:'.6rem',
                    letterSpacing:'.2em', fontFamily:'Cinzel,serif',
                    background:'var(--dark3)',
                  }}>
                    NO IMAGE
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="pl-modal-info">
                <div>
                  <span className="pl-modal-family">
                    {quickView.brand_name ?? quickView.category_name ?? '—'}
                  </span>
                  <h2 className="pl-modal-name">{quickView.name}</h2>
                  <div className="pl-modal-price">
                    {(() => {
                      const info = getVariantPrice(quickView.variants, modalSize);
                      if (!info) return quickView.starting_price
                        ? `From ₹${Number(quickView.starting_price).toLocaleString('en-IN')}`
                        : '—';
                      return info.display;
                    })()}
                  </div>
                </div>

                <div className="pl-modal-divider"/>

                <p className="pl-modal-desc">
                  {quickView.description ?? ''}
                </p>

                {/* Size selector */}
                {quickView.variants && quickView.variants.length > 0 && (
                  <div>
                    <span className="pl-modal-notes-label">Choose Size</span>
                    <div className="pl-modal-sizes">
                      {quickView.variants.map(v => (
                        <button
                          key={v.id}
                          className={`pl-size-opt${modalSize === v.size ? ' on' : ''}`}
                          onClick={() => setModalSize(v.size)}
                        >
                          <span>{v.size}</span>
                          <span className="pl-size-price">
                            ₹{Number(v.discount_price || v.price).toLocaleString('en-IN')}
                          </span>
                          {v.discount_price && (
                            <span className="pl-size-original">
                              ₹{Number(v.price).toLocaleString('en-IN')}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {modalError && (
                  <div className="pl-modal-error">{modalError}</div>
                )}

                <div className="pl-modal-actions">
                  <button
                    className="pl-modal-add"
                    onClick={handleModalAdd}
                    disabled={modalAdding || modalAdded}
                  >
                    {modalAdded
                      ? "✓ Added to Cart"
                      : modalAdding
                        ? "Adding..."
                        : `Add to Cart${modalSize ? ` — ${modalSize}` : ''}`
                    }
                  </button>
                  <button
                    className="pl-modal-wish-btn"
                    onClick={(e) => toggleWish(quickView.id, e)}
                  >
                    {wishlist.includes(quickView.id) ? '♥ Saved to Wishlist' : '♡ Add to Wishlist'}
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {selectorProduct && (
          <SizeSelector
            product={selectorProduct}
            onClose={() => setSelectorProduct(null)}
            onAuthRequired={() => alert('Please login first')}
          />
        )}

      </div>
    </div>
  );
}
