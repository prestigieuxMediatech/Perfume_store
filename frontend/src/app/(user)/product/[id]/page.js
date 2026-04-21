'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import AuthModal from "../../components/AuthModal";
import ProductReviews from "../../components/ProductReviews";
import './product.css';

const BASE = process.env.NEXT_PUBLIC_API_URL;
const hasItems = (items) => Array.isArray(items) && items.length > 0;

const formatPrice = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return `₹ ${Number(value).toLocaleString('en-IN')}`;
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [adding, setAdding] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [wishlistIds, setWishlistIds] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const loadProduct = async () => {
    setLoading(true);
    setError('');
    setImageLoaded(false);
    try {
      const res = await axios.get(`${BASE}/api/products/${id}`);
      setProduct(res.data);
    } catch {
      setError('Unable to load this product right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE}/api/products/${id}`);
        if (!mounted) return;
        setProduct(res.data);
      } catch {
        if (!mounted) return;
        setError('Unable to load this product right now.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => { mounted = false; };
  }, [id]);

  useEffect(() => {
    if (!user) {
      setWishlistIds([]);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${BASE}/api/auth/wishlist/ids`);
        setWishlistIds(res.data || []);
      } catch {
        setWishlistIds([]);
      }
    };
    fetchWishlist();
  }, [user]);

  const images = useMemo(() => {
    if (!product) return [];
    const imgs = Array.isArray(product.images) ? product.images : [];
    const normalized = imgs.map((img) => ({
      id: img.id ?? img.image_url,
      url: `${BASE}${img.image_url}`,
      is_primary: !!img.is_primary,
    }));

    if (normalized.length === 0 && product.primary_image) {
      normalized.push({
        id: 'primary',
        url: `${BASE}${product.primary_image}`,
        is_primary: true,
      });
    }
    return normalized;
  }, [product]);

  useEffect(() => {
    if (!product) return;
    if (product.variants?.length === 1) {
      setSelectedSize(product.variants[0].size ?? null);
    }
    if (images.length > 0) {
      const primaryIndex = images.findIndex((img) => img.is_primary);
      setActiveImage(primaryIndex >= 0 ? primaryIndex : 0);
    }
  }, [product, images]);

  const selectedVariant = product?.variants?.find((v) => v.size === selectedSize) ||
    (product?.variants?.length === 1 ? product.variants[0] : null);

  const priceDisplay = selectedVariant
    ? formatPrice(selectedVariant.discount_price || selectedVariant.price)
    : (product?.starting_price ? `From ${formatPrice(product.starting_price)}` : '-');

  const originalPrice = selectedVariant?.discount_price ? formatPrice(selectedVariant.price) : null;
  const details = product?.details || {};

  const handleAddToCart = async () => {
    setActionMsg('');
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!selectedVariant) {
      setActionMsg('Please select a size to proceed.');
      return;
    }

    setAdding(true);
    const res = await addItem({
      product_id: product.id,
      variant_id: selectedVariant.id,
      quantity: 1,
    });
    setAdding(false);
    setActionMsg(res.ok ? 'Added to cart' : (res.message || 'Could not add to cart'));
    
    setTimeout(() => setActionMsg(''), 3000);
  };

  const toggleWishlist = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    const isSaved = wishlistIds.includes(product.id);
    setWishlistIds((prev) => (isSaved ? prev.filter((x) => x !== product.id) : [...prev, product.id]));

    try {
      if (isSaved) {
        await axios.delete(`${BASE}/api/auth/shop/wishlist/${product.id}`);
      } else {
        await axios.post(`${BASE}/api/auth/wishlist`, { product_id: product.id });
      }
    } catch {
      setWishlistIds((prev) => (isSaved ? [...prev, product.id] : prev.filter((x) => x !== product.id)));
    }
  };

  if (loading) {
    return (
      <div className="pd-page">
        <div className="pd-shell">
          <div className="pd-skeleton-container">
            <div className="pd-skeleton-image" />
            <div className="pd-skeleton-info">
              <div className="pd-skeleton-text short" />
              <div className="pd-skeleton-text" />
              <div className="pd-skeleton-text long" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pd-page">
        <div className="pd-shell pd-error-container">
          <p className="pd-error">{error || 'Product not found.'}</p>
          <Link href="/shop" className="pd-back-link">← Back to collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pd-page">
      <div className="pd-shell">
        {/* Breadcrumb Navigation */}
        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <Link href="/shop" className="pd-breadcrumb-link">Shop</Link>
          <span className="pd-breadcrumb-separator">/</span>
          <span className="pd-breadcrumb-current">{product.name}</span>
        </nav>

        <div className="pd-grid">
          {/* Image Gallery - Now more compact */}
          <div className="pd-gallery">
            <div className={`pd-main-image ${imageLoaded ? 'loaded' : ''}`}>
              {images.length > 0 ? (
                <img 
                  src={images[activeImage]?.url} 
                  alt={product.name}
                  onLoad={() => setImageLoaded(true)}
                  style={{ 
                    objectFit: 'cover', // Ensure cover is applied inline as fallback
                    width: '100%',
                    height: '100%'
                  }}
                />
              ) : (
                <div className="pd-image-fallback">
                  <span>No Image</span>
                </div>
              )}
            </div>


            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    className={`pd-thumb${index === activeImage ? ' active' : ''}`}
                    onClick={() => setActiveImage(index)}
                    aria-label={`View ${product.name} image ${index + 1}`}
                  >
                    <img src={img.url} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="pd-info">
            <div className="pd-meta-header">
              <span className="pd-brand">{product.brand_name || '7EVEN'}</span>
              <span className="pd-divider-dot">·</span>
              <span className="pd-category">{product.category_name}</span>
            </div>

            <h1 className="pd-title">{product.name}</h1>

            <div className="pd-price-block">
              <span className="pd-price">{priceDisplay}</span>
              {originalPrice && <span className="pd-price-original">{originalPrice}</span>}
            </div>

            <div className="pd-desc-divider" />

            {details.subtitle && (
              <p className="pd-subtitle">{details.subtitle}</p>
            )}

            <p className="pd-description">
              {product.description || 'A refined fragrance crafted to linger beautifully, embodying elegance and timeless sophistication.'}
            </p>

            {details.detailed_description && (
              <div className="pd-story">
                <div className="pd-story-title">Description</div>
                <p className="pd-story-copy">{details.detailed_description}</p>
              </div>
            )}

            {/* Size Selection */}
            {product.variants?.length > 0 && (
              <div className="pd-variants">
                <div className="pd-section-label">
                  Select Size
                  {selectedSize && <span className="pd-selected-label">— {selectedSize}</span>}
                </div>
                <div className="pd-variants-grid">
                  {product.variants.map((variant) => {
                    const isSelected = selectedSize === variant.size;
                    const isDiscounted = !!variant.discount_price;
                    
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        className={`pd-variant${isSelected ? ' active' : ''}`}
                        onClick={() => setSelectedSize(variant.size)}
                      >
                        <span className="pd-variant-size">{variant.size}</span>
                        <div className="pd-variant-prices">
                          <span className="pd-variant-price">
                            {formatPrice(variant.discount_price || variant.price)}
                          </span>
                          {isDiscounted && (
                            <span className="pd-variant-original">{formatPrice(variant.price)}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {actionMsg && (
              <div className={`pd-feedback ${actionMsg.includes('cart') ? 'success' : 'error'}`}>
                {actionMsg}
              </div>
            )}

            {/* Refined Actions */}
            <div className="pd-actions">
              <button 
                className="pd-add-btn" 
                onClick={handleAddToCart} 
                disabled={adding}
              >
                <span className="pd-btn-text">{adding ? 'Adding...' : 'Add to Bag'}</span>
                <span className="pd-btn-icon">→</span>
              </button>
              
              <button 
                className={`pd-wish-btn${wishlistIds.includes(product.id) ? ' active' : ''}`} 
                onClick={toggleWishlist}
                aria-label={wishlistIds.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span>Wishlist</span>
              </button>
            </div>

            {/* Product Details Accordion-style */}
            <div className="pd-details">
              <div className="pd-details-item">
                <span className="pd-details-label">Category</span>
                <span className="pd-details-value">{product.category_name || 'Fragrance'}</span>
              </div>
              <div className="pd-details-item">
                <span className="pd-details-label">Brand</span>
                <span className="pd-details-value">{product.brand_name || '7EVEN'}</span>
              </div>
              {product.variants?.length > 0 && (
                <div className="pd-details-item">
                  <span className="pd-details-label">Sizes</span>
                  <span className="pd-details-value">{product.variants.map(v => v.size).join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {(hasItems(details.why_love_it) ||
          hasItems(details.top_notes) ||
          hasItems(details.heart_notes) ||
          hasItems(details.base_notes) ||
          hasItems(details.performance) ||
          hasItems(details.who_is_this_for) ||
          hasItems(details.product_details) ||
          hasItems(details.shipping_returns) ||
          details.disclaimer ||
          details.cta_text) && (
          <section className="pd-extra">
            <div className="pd-extra-grid">
              {hasItems(details.why_love_it) && (
                <article className="pd-extra-card">
                  <h2 className="pd-extra-title">Why You&apos;ll Love It</h2>
                  <ul className="pd-extra-list">
                    {details.why_love_it.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              )}

              {(hasItems(details.top_notes) || hasItems(details.heart_notes) || hasItems(details.base_notes)) && (
                <article className="pd-extra-card">
                  <h2 className="pd-extra-title">Fragrance Notes</h2>
                  <div className="pd-note-groups">
                    {hasItems(details.top_notes) && (
                      <div>
                        <h3 className="pd-note-label">Top Notes</h3>
                        <p className="pd-note-copy">{details.top_notes.join(', ')}</p>
                      </div>
                    )}
                    {hasItems(details.heart_notes) && (
                      <div>
                        <h3 className="pd-note-label">Heart Notes</h3>
                        <p className="pd-note-copy">{details.heart_notes.join(', ')}</p>
                      </div>
                    )}
                    {hasItems(details.base_notes) && (
                      <div>
                        <h3 className="pd-note-label">Base Notes</h3>
                        <p className="pd-note-copy">{details.base_notes.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </article>
              )}

              {hasItems(details.performance) && (
                <article className="pd-extra-card">
                  <h2 className="pd-extra-title">Performance</h2>
                  <ul className="pd-extra-list">
                    {details.performance.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              )}

              {hasItems(details.who_is_this_for) && (
                <article className="pd-extra-card">
                  <h2 className="pd-extra-title">Who Is This For?</h2>
                  <ul className="pd-extra-list">
                    {details.who_is_this_for.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              )}

              {hasItems(details.product_details) && (
                <article className="pd-extra-card">
                  <h2 className="pd-extra-title">Product Details</h2>
                  <ul className="pd-extra-list">
                    {details.product_details.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              )}

              {hasItems(details.shipping_returns) && (
                <article className="pd-extra-card">
                  <h2 className="pd-extra-title">Shipping &amp; Returns</h2>
                  <ul className="pd-extra-list">
                    {details.shipping_returns.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              )}
            </div>

            {(details.disclaimer || details.cta_text) && (
              <div className="pd-extra-footer">
                {details.disclaimer && (
                  <p className="pd-disclaimer">{details.disclaimer}</p>
                )}
                {details.cta_text && (
                  <p className="pd-cta-copy">{details.cta_text}</p>
                )}
              </div>
            )}
          </section>
        )}

        {/* Related Products */}
        {product.group_products?.length > 1 && (
          <section className="pd-related">
            <div className="pd-related-header">
              <h2 className="pd-related-title">You May Also Like</h2>
            </div>
            <div className="pd-related-grid">
              {product.group_products.map((item) => {
                if (item.id === product.id) return null;
                return (
                  <Link 
                    key={item.id} 
                    href={`/product/${item.id}`}
                    className="pd-related-card"
                  >
                    <div className="pd-related-content">
                      <h3 className="pd-related-name">{item.name}</h3>
                      <p className="pd-related-meta">{item.brand_name || '7EVEN'} · {item.category_name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <ProductReviews
          productId={product.id}
          user={user}
          reviews={product.reviews}
          reviewSummary={product.review_summary}
          onAuthRequired={() => setAuthModalOpen(true)}
          onReviewSaved={loadProduct}
        />
      </div>

      {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
    </div>
  );
}





















































/*

'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import './product.css';

const BASE = process.env.NEXT_PUBLIC_API_URL;

const formatPrice = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return `Rs. ${Number(value).toLocaleString('en-IN')}`;
};

const getProductImage = (product) => {
  if (product?.primary_image) return `${BASE}${product.primary_image}`;
  const imageUrl = product?.images?.[0]?.image_url || product?.images?.[0];
  return imageUrl ? `${BASE}${imageUrl}` : "";
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [adding, setAdding] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${BASE}/api/products/${id}`);
        if (!mounted) return;
        setProduct(res.data);
      } catch {
        if (!mounted) return;
        setError('Unable to load this product right now.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${BASE}/api/auth/wishlist/ids`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setWishlistIds(res.data || []);
      } catch {
        setWishlistIds([]);
      }
    };

    fetchWishlist();
  }, []);

  const images = useMemo(() => {
    if (!product) return [];
    const imgs = Array.isArray(product.images) ? product.images : [];
    const normalized = imgs.map((img) => ({
      id: img.id ?? img.image_url,
      url: `${BASE}${img.image_url}`,
      is_primary: !!img.is_primary,
    }));

    if (normalized.length === 0 && product.primary_image) {
      normalized.push({
        id: 'primary',
        url: `${BASE}${product.primary_image}`,
        is_primary: true,
      });
    }

    return normalized;
  }, [product]);

  useEffect(() => {
    if (!product) return;

    if (product.variants?.length === 1) {
      setSelectedSize(product.variants[0].size ?? null);
    }

    if (images.length > 0) {
      const primaryIndex = images.findIndex((img) => img.is_primary);
      setActiveImage(primaryIndex >= 0 ? primaryIndex : 0);
    }
  }, [product, images]);

  const selectedVariant =
    product?.variants?.find((variant) => variant.size === selectedSize) ||
    (product?.variants?.length === 1 ? product.variants[0] : null);

  const priceDisplay = selectedVariant
    ? formatPrice(selectedVariant.discount_price || selectedVariant.price)
    : (product?.starting_price ? `From ${formatPrice(product.starting_price)}` : '-');

  const originalPrice = selectedVariant?.discount_price
    ? formatPrice(selectedVariant.price)
    : null;

  const handleAddToCart = async () => {
    setActionMsg('');
    if (!user) {
      alert('Please login first');
      return;
    }
    if (!selectedVariant) {
      setActionMsg('Please choose a size before adding to cart.');
      return;
    }

    setAdding(true);
    const res = await addItem({
      product_id: product.id,
      variant_id: selectedVariant.id,
      quantity: 1,
    });
    setAdding(false);
    setActionMsg(res.ok ? 'Added to cart.' : (res.message || 'Could not add to cart.'));
  };

  const toggleWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    const isSaved = wishlistIds.includes(product.id);
    setWishlistIds((prev) => (isSaved ? prev.filter((x) => x !== product.id) : [...prev, product.id]));

    try {
      if (isSaved) {
        await axios.delete(`${BASE}/api/auth/shop/wishlist/${product.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          `${BASE}/api/auth/wishlist`,
          { product_id: product.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch {
      setWishlistIds((prev) => (isSaved ? [...prev, product.id] : prev.filter((x) => x !== product.id)));
    }
  };

  if (loading) {
    return (
      <div className="pd-page">
        <div className="pd-shell">
          <p className="pd-loading">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pd-page">
        <div className="pd-shell">
          <p className="pd-error">{error || 'Product not found.'}</p>
          <Link href="/shop" className="pd-back-link">Back to shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pd-page">
      <div className="pd-shell">
        <div className="pd-topbar">
          <Link href="/shop" className="pd-back-link">Back to shop</Link>
          <div className="pd-breadcrumbs">
            <span>Shop</span>
            <span className="pd-dot">|</span>
            <span>{product.brand_name ?? product.category_name ?? 'Fragrance'}</span>
          </div>
        </div>

        <div className="pd-grid">
          <div className="pd-gallery">
            <div className="pd-main-image">
              {images.length > 0 ? (
                <img src={images[activeImage]?.url} alt={product.name} />
              ) : (
                <div className="pd-image-fallback">No image available</div>
              )}
            </div>

            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    className={`pd-thumb${index === activeImage ? ' active' : ''}`}
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={img.url} alt={`${product.name} thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pd-info">
            <div className="pd-family">{product.brand_name ?? product.category_name ?? 'Signature'}</div>
            <h1 className="pd-title">{product.name}</h1>

            <div className="pd-price-row">
              <div className="pd-price">{priceDisplay}</div>
              {originalPrice && <div className="pd-price-old">{originalPrice}</div>}
            </div>

            <p className="pd-desc">
              {product.description || 'A refined fragrance crafted to linger beautifully.'}
            </p>

            {product.variants?.length > 0 && (
              <div className="pd-variants">
                <div className="pd-variants-title">Select Size</div>
                <div className="pd-variants-grid">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      className={`pd-variant${selectedSize === variant.size ? ' active' : ''}`}
                      onClick={() => setSelectedSize(variant.size)}
                    >
                      <span className="pd-variant-size">{variant.size}</span>
                      <span className="pd-variant-price">
                        {formatPrice(variant.discount_price || variant.price)}
                      </span>
                      {variant.discount_price && (
                        <span className="pd-variant-old">{formatPrice(variant.price)}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {actionMsg && <div className="pd-action-msg">{actionMsg}</div>}

            <div className="pd-actions">
              <button className="pd-add" onClick={handleAddToCart} disabled={adding}>
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button className="pd-wish" onClick={toggleWishlist}>
                {wishlistIds.includes(product.id) ? 'Saved' : 'Save for Later'}
              </button>
            </div>

            <div className="pd-divider" />

            <div className="pd-details">
              <div className="pd-detail-row">
                <span>Category</span>
                <span>{product.category_name ?? '-'}</span>
              </div>
              <div className="pd-detail-row">
                <span>Brand</span>
                <span>{product.brand_name ?? '-'}</span>
              </div>
              <div className="pd-detail-row">
                <span>Available Sizes</span>
                <span>{product.variants?.map((variant) => variant.size).join(' - ') || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {product.group_products?.length > 1 && (
          <div className="pd-group">
            <div className="pd-variants-title">Explore Matching Products</div>
            <div className="pd-group-grid">
              {product.group_products.map((item) => {
                const itemImage = getProductImage(item);
                const sizeLabel =
                  item.id === product.id
                    ? (product.variants?.map((variant) => variant.size).join(' - ') || '-')
                    : (item.sizes || '-');

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`pd-group-item${item.id === product.id ? ' active' : ''}`}
                    onClick={() => {
                      if (item.id !== product.id) router.push(`/product/${item.id}`);
                    }}
                  >
                    <div className="pd-group-media">
                      {itemImage ? (
                        <img src={itemImage} alt={item.name} className="pd-group-image" />
                      ) : (
                        <div className="pd-group-placeholder">No Image</div>
                      )}
                      <span className="pd-group-chip">
                        {item.category_name ?? 'Fragrance'}
                      </span>
                    </div>

                    <div className="pd-group-content">
                      <div className="pd-group-head">
                        <span className="pd-group-brand">{item.brand_name ?? '7EVEN'}</span>
                        <span className="pd-group-title">{item.name}</span>
                      </div>
                      <p className="pd-group-desc">
                        {item.description || 'Designed to complement the same fragrance family.'}
                      </p>
                      <div className="pd-group-meta">
                        <span className="pd-group-label">Available Sizes</span>
                        <span className="pd-group-size">{sizeLabel}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
*/
