"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SizeSelector from "../components/SizeSelector";
import './wishlist.css';

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [wishlist, setWishlist]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [removing, setRemoving]   = useState(null);
  const [addingId, setAddingId]   = useState(null);
  const [cartFeedback, setCartFeedback] = useState({ id: null, type: '', text: '' });
  const [selectorProduct, setSelectorProduct] = useState(null);


  const { addItem } = useCart();

  useEffect(() => {
    if (!authLoading && !user) {
      localStorage.setItem("returnTo", "/wishlist");
      router.push("/");
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/auth/wishlist`, { headers: getHeaders() });
      setWishlist(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    setRemoving(id);
    try {
      await axios.delete(`${BASE}/api/auth/wishlist/${id}`, { headers: getHeaders() });
      setWishlist(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setRemoving(null);
    }
  };

  const showCartFeedback = (id, type, text) => {
    setCartFeedback({ id, type, text });
    setTimeout(() => setCartFeedback({ id: null, type: '', text: '' }), 2200);
  };

  const handleAddToCart = async (item) => {
    if (!user) {
      alert('Please login first');
      return;
    }
    setAddingId(item.id);
    try {
      const res = await axios.get(`${BASE}/api/products/${item.product_id}`);
      const product = res.data;
      const variants = product?.variants || [];
      if (variants.length === 0) {
        showCartFeedback(item.id, 'error', 'No sizes available');
        return;
      }
      if (variants.length > 1) {
        setSelectorProduct(product);
        return;
      }
      const addRes = await addItem({
        product_id: product.id,
        variant_id: variants[0].id,
        quantity: 1,
      });
      if (addRes.ok) showCartFeedback(item.id, 'success', 'Added to cart');
      else showCartFeedback(item.id, 'error', addRes.message || 'Could not add');
    } catch (err) {
      showCartFeedback(item.id, 'error', 'Could not load sizes');
    } finally {
      setAddingId(null);
    }
  };

  // Show spinner while checking auth
  if (authLoading) {
    return (
      <div className="wl-loading">
        <div className="wl-spinner"/>
      </div>
    );
  }

  // Don't render if not logged in (redirect handles it)
  if (!user) return null;

  return (
    <div className="wl-page">

      {/* HERO */}
      <section className="wl-hero">
        <div className="wl-hero-glow"/>
        <div className="wl-wrap">
          <div className="wl-eyebrow">
            <span className="wl-eyebrow-line"/>
            Personal Collection
            <span className="wl-eyebrow-line"/>
          </div>
          <h1 className="wl-heading">
            Your<em>Wishlist</em>
          </h1>
          <p className="wl-sub">
            A curated selection of fragrances you've chosen to remember.
          </p>
          {!loading && (
            <p className="wl-count">
              {wishlist.length} {wishlist.length === 1 ? 'Fragrance' : 'Fragrances'} saved
            </p>
          )}
        </div>
        <div className="wl-hero-orn"><span>◆</span></div>
      </section>

      {/* CONTENT */}
      <section className="wl-content">
        <div className="wl-wrap">

          {loading ? (
            // Skeletons
            <div className="wl-grid">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="wl-card wl-skeleton-card">
                  <div className="wl-img wl-skeleton"/>
                  <div className="wl-body">
                    <div className="wl-skeleton" style={{ height:10, width:'40%', marginBottom:12, borderRadius:2 }}/>
                    <div className="wl-skeleton" style={{ height:22, width:'80%', marginBottom:8, borderRadius:2 }}/>
                    <div className="wl-skeleton" style={{ height:14, width:'30%', marginBottom:24, borderRadius:2 }}/>
                    <div style={{ display:'flex', gap:'0.75rem' }}>
                      <div className="wl-skeleton" style={{ height:40, flex:1, borderRadius:2 }}/>
                      <div className="wl-skeleton" style={{ height:40, width:80, borderRadius:2 }}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : wishlist.length === 0 ? (
            // Empty state
            <div className="wl-empty">
              <div className="wl-empty-icon">◈</div>
              <h3 className="wl-empty-title">Nothing saved yet</h3>
              <p className="wl-empty-sub">
                Your wishlist is a place for scents that linger in memory.
              </p>
              <Link href="/shop" className="wl-browse-btn">
              <span>
                    Browse the Collection →
              </span>
              </Link>
            </div>
          ) : (
            // Wishlist grid
            <div className="wl-grid">
              {wishlist.map((item, i) => (
                <div key={item.id} className={`wl-card wl-in t${(i % 5) + 1}`}>

                  {/* Image */}
                  <div className="wl-img">
                    {item.image ? (
                      <img
                        src={`${BASE}${item.image}`}
                        alt={item.name}
                        className="wl-img-el"
                      />
                    ) : (
                      <div className="wl-no-img">NO IMAGE</div>
                    )}
                    {/* Remove button on image */}
                    <button
                      className="wl-img-remove"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove from wishlist"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body */}
                  <div className="wl-body">
                    <span className="wl-brand">
                      {item.brand_name ?? item.category_name ?? '—'}
                    </span>
                    <h3 className="wl-name">{item.name}</h3>
                    {item.description && (
                      <p className="wl-desc">{item.description}</p>
                    )}
                    <div className="wl-price">
                      {item.price
                        ? `From ₹${Number(item.price).toLocaleString("en-IN")}`
                        : '—'
                      }
                    </div>
                    <div className="wl-actions">
                      <button
                        className="wl-add"
                        onClick={() => handleAddToCart(item)}
                        disabled={addingId === item.id}
                      >
                        {addingId === item.id ? 'Adding...' : 'Add to Cart'}
                      </button>
                      <button
                        className="wl-remove"
                        onClick={() => removeItem(item.id)}
                        disabled={removing === item.id}
                      >
                        {removing === item.id ? '...' : 'Remove'}
                      </button>
                    </div>
                    {cartFeedback.id === item.id && (
                      <div className={`wl-cart-msg ${cartFeedback.type}`}>
                        {cartFeedback.text}
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {selectorProduct && (
        <SizeSelector
          product={selectorProduct}
          onClose={() => setSelectorProduct(null)}
          onAuthRequired={() => alert('Please login first')}
        />
      )}

    </div>
  );
}
