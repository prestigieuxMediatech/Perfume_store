'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SizeSelector from "../components/SizeSelector";
import './shop.css'
import useReveal from "../hooks/useReveal";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const getProductImage = (product) => {
  if (product?.primary_image) return `${BASE}${product.primary_image}`;
  const imageUrl = product?.images?.[0]?.image_url || product?.images?.[0];
  return imageUrl ? `${BASE}${imageUrl}` : "";
};

/* ── helpers ── */
const getAuthConfig = () => ({
  withCredentials: true
});

const SORT_OPTS = [
  { val:'featured',   label:'Featured'          },
  { val:'newest',     label:'Newest First'       },
  { val:'price-asc',  label:'Price: Low → High'  },
  { val:'price-desc', label:'Price: High → Low'  },
  { val:'a-z',        label:'Name: A → Z'        },
];

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

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function ProductListing() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { addItem } = useCart();

  const [cat, setCat] = useState('all');
  const [activeBrand, setActiveBrand] = useState('all');
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(500000);
  const [checkedSizes, setCheckedSizes] = useState([]);

  const [view, setView] = useState('grid');
  const [wishlist, setWishlist] = useState([]);
  const [visible, setVisible] = useState(8);
  const [addingId, setAddingId] = useState(null);
  const [cartFeedback, setCartFeedback] = useState({ id: null, type: '', text: '' });
  const [selectorProduct, setSelectorProduct] = useState(null);

  useReveal();

  useEffect(() => {
    Promise.all([
      axios.get(`${BASE}/api/categories`),
      axios.get(`${BASE}/api/brands`),
    ])
      .then(([catRes, brandRes]) => {
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setBrands(Array.isArray(brandRes.data) ? brandRes.data : []);
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
      } catch {
        console.log('Wishlist not loaded (maybe not logged in)');
      }
    };

    fetchWishlist();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (cat !== 'all') params.category = cat;
      if (activeBrand !== 'all') params.brand = activeBrand;
      if (sort !== 'featured') params.sort = sort;

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
      if (sort === 'price-asc') return aP - bP;
      if (sort === 'price-desc') return bP - aP;
      return 0;
    });

  const shown = filtered.slice(0, visible);

  const toggleWish = async (id, e) => {
    e.stopPropagation();

    if (!user) {
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

  const toggleSize = s => setCheckedSizes(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const clearFilters = () => {
    setCat('all');
    setActiveBrand('all');
    setMaxPrice(500000);
    setCheckedSizes([]);
    setFilteredBrands(brands);
  };

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
              that have defined 7EVEN for thirty-seven years.
            </p>
            <p className="pl-result-count">{filtered.length} Fragrances</p>
          </div>
          <div className="pl-hero-orn"><span>◆</span></div>
        </div>

        <div className="pl-toolbar">
          <div className="pl-toolbar-inner">
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
            </div>
          </div>
        </div>

        <div className="pl-body">
          <div className="pl-filters">
            <div className="pl-filter-group">
              <div className="pl-filter-title">Price</div>
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
              <div className="pl-filter-group">
                <div className="pl-filter-title">Brand</div>
                <div className="pl-select-wrap">
                  <select
                    className="pl-select"
                    value={activeBrand}
                    onChange={(e) => setActiveBrand(e.target.value)}
                  >
                    <option value="all">All Brands</option>
                    {filteredBrands.map(b => (
                      <option key={b.id} value={b.slug}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <span className="pl-select-caret" aria-hidden="true" />
                </div>
              </div>
            )}

            {allSizes.length > 0 && (
              <div className="pl-filter-group">
                <div className="pl-filter-title">Size</div>
                <div className="pl-size-pills">
                  {allSizes.map(s => (
                    <button
                      key={s}
                      type="button"
                      className={`pl-size-pill${checkedSizes.includes(s) ? ' on' : ''}`}
                      onClick={() => toggleSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(cat !== 'all' || activeBrand !== 'all' || checkedSizes.length > 0 || maxPrice < maxProductPrice) && (
              <button className="pl-clear-btn" onClick={clearFilters}>
                ✕ Clear all filters
              </button>
            )}
          </div>

          <div className={`pl-grid${view === 'list' ? ' list-view' : ''}`}>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="pl-card" style={{ pointerEvents:'none' }}>
                  <div className="pl-card-img pl-skeleton" style={{ aspectRatio:'3/4' }}/>
                  <div className="pl-card-body">
                    <div className="pl-skeleton" style={{ height:8, width:'35%', marginBottom:10, borderRadius:2 }}/>
                    <div className="pl-skeleton" style={{ height:20, width:'85%', marginBottom:8, borderRadius:2 }}/>
                    <div className="pl-skeleton" style={{ height:14, width:'100%', marginBottom:6, borderRadius:2 }}/>
                    <div className="pl-skeleton" style={{ height:14, width:'60%', marginBottom:24, borderRadius:2 }}/>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div className="pl-skeleton" style={{ height:16, width:'30%', borderRadius:2 }}/>
                      <div className="pl-skeleton" style={{ height:10, width:'20%', borderRadius:2 }}/>
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
              shown.map((p) => (
                <article
                  key={p.id}
                  className="pl-card"
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(`/product/${p.id}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/product/${p.id}`); }}
                >
                  <div className="pl-card-img">
                    <button
                      className={`pl-wish${wishlist.includes(p.id) ? ' active' : ''}`}
                      onClick={e => toggleWish(p.id, e)}
                      aria-label="Add to wishlist"
                    >
                      <HeartIcon filled={wishlist.includes(p.id)}/>
                    </button>

                    {getProductImage(p) ? (
                      <img
                        src={getProductImage(p)}
                        alt={p.name}
                        loading="lazy"
                        data-pin-nopin="true"
                      />
                    ) : (
                      <div className="pl-card-fallback">
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
                      <Link
                        className="pl-quick-view"
                        href={`/product/${p.id}`}
                        onClick={e => e.stopPropagation()}
                        aria-label="View details"
                      >
                        View
                      </Link>
                    </div>
                  </div>

                  <div className="pl-card-body">
                    <div className="pl-card-meta-top">
                      <span className="pl-card-family">
                        {p.brand_name ?? p.category_name ?? '—'}
                      </span>
                      <span className="pl-card-size-badge">
                        {p.variants?.length > 0 ? `${p.variants.length} Sizes` : ''}
                      </span>
                    </div>
                    
                    <h3 className="pl-card-name">{p.name}</h3>
                    
                    <p className="pl-card-notes">
                      {p.description ?? ''}
                    </p>

                    <div className="pl-card-footer">
                      <span className="pl-card-price">
                        {p.starting_price
                          ? `₹${Number(p.starting_price).toLocaleString('en-IN')}`
                          : '—'
                        }
                      </span>
                      <span className="pl-card-sizes-text">
                        {p.variants?.slice(0,3).map(v => v.size).join(' · ')}
                        {p.variants?.length > 3 ? ' ...' : ''}
                      </span>
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
