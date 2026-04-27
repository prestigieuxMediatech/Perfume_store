"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./build-box.css";

const BASE = process.env.NEXT_PUBLIC_API_URL;
const resolveImageUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${BASE}${value}`;
};

export default function BuildYourBoxPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addBox } = useCart();
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBox, setSelectedBox] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchBoxes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE}/api/boxes`);
        const list = Array.isArray(res.data) ? res.data : [];
        setBoxes(list);
      } catch {
        setBoxes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBoxes();
  }, []);

  useEffect(() => {
    if (!selectedBox) return;
    const slugs = (selectedBox.category_slugs || "").split(",").filter(Boolean);
    setActiveCategory(slugs[0] || "");
    setSelectedItems([]);
    setMessage("");
  }, [selectedBox]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!activeCategory) {
        setProducts([]);
        return;
      }
      try {
        const res = await axios.get(`${BASE}/api/products`, {
          params: { category: activeCategory },
        });
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch {
        setProducts([]);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  const maxItems = Number(selectedBox?.items_count || 0);

  const chosenIds = useMemo(
    () => new Set(selectedItems.map((i) => i.product_id)),
    [selectedItems]
  );

  const getProductImage = (product) => {
    if (product?.primary_image) return resolveImageUrl(product.primary_image);
    const imageUrl = product?.images?.[0]?.image_url || product?.images?.[0];
    return resolveImageUrl(imageUrl);
  };

  const handleSelect = (product) => {
    const existing = selectedItems.find((i) => i.product_id === product.id);
    if (existing) {
      setSelectedItems((prev) => prev.filter((i) => i.product_id !== product.id));
      return;
    }
    if (selectedItems.length >= maxItems) {
      setMessage(`You can only pick ${maxItems} items for this box.`);
      return;
    }
    const variant = product.variants?.[0];
    if (!variant) {
      setMessage("This product has no size available.");
      return;
    }
    setMessage("");
    setSelectedItems((prev) => [
      ...prev,
      {
        product_id: product.id,
        variant_id: variant.id,
        name: product.name,
        size: variant.size,
        image: getProductImage(product),
      },
    ]);
  };

  const handleAddBox = async () => {
    setMessage("");
    if (!user) {
      setMessage("Please login to add a box.");
      return;
    }
    if (!selectedBox) return;
    if (selectedItems.length !== maxItems) {
      setMessage(`Please choose ${maxItems} items to continue.`);
      return;
    }
    setAdding(true);
    const res = await addBox({
      box_id: selectedBox.id,
      selections: selectedItems.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
      })),
      quantity: 1,
    });
    setAdding(false);
    if (!res.ok) {
      setMessage(res.message || "Could not add box to cart.");
      return;
    }
    setMessage("Box added to cart.");
  };

  return (
    <div className="byb-page">
      <section className="byb-hero">
        <div className="byb-hero-inner">
          <div className="byb-eyebrow">Build Your Own Box</div>
          <h1 className="byb-title">
            Curate your <em>signature set</em>
          </h1>
          <p className="byb-sub">
            Choose a box, pick your favorites, and enjoy a fixed bundle price.
          </p>
        </div>
      </section>

      <section className="byb-content">
        <div className="byb-wrap">
          {loading ? (
            <div className="byb-loading">Loading boxes...</div>
          ) : boxes.length === 0 ? (
            <div className="byb-empty">No boxes available right now.</div>
          ) : (
            <div className="byb-boxes">
              {boxes.map((box) => (
                <button
                  key={box.id}
                  type="button"
                  className={`byb-box-card${selectedBox?.id === box.id ? " active" : ""}`}
                  onClick={() => setSelectedBox(box)}
                >
                  <div className="byb-box-cover">
                    {resolveImageUrl(box.cover_image) ? (
                      <img
                        src={resolveImageUrl(box.cover_image)}
                        alt={box.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="byb-box-cover-fallback">BOX</div>
                    )}
                  </div>
                  <div className="byb-box-name">{box.name}</div>
                  <div className="byb-box-meta">
                    Pick {box.items_count} at {Number(box.price).toLocaleString("en-IN")}
                  </div>
                  <div className="byb-box-cats">{box.category_names || "All categories"}</div>
                </button>
              ))}
            </div>
          )}

          {selectedBox && (
            <div className="byb-builder">
              <div className="byb-builder-head">
                <div className="byb-builder-identity">
                  <div className="byb-builder-cover">
                    {resolveImageUrl(selectedBox.cover_image) ? (
                      <img
                        src={resolveImageUrl(selectedBox.cover_image)}
                        alt={selectedBox.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="byb-box-cover-fallback">BOX</div>
                    )}
                  </div>
                  <div>
                    <div className="byb-builder-title">{selectedBox.name}</div>
                    <div className="byb-builder-sub">
                      Select {maxItems} items from allowed categories.
                    </div>
                  </div>
                </div>
                <div className="byb-price">
                  at {Number(selectedBox.price).toLocaleString("en-IN")}
                </div>
              </div>

              <div className="byb-tabs">
                {(selectedBox.category_slugs || "")
                  .split(",")
                  .filter(Boolean)
                  .map((slug, index) => (
                    <button
                      key={slug}
                      type="button"
                      className={`byb-tab${activeCategory === slug ? " active" : ""}`}
                      onClick={() => setActiveCategory(slug)}
                    >
                      {(selectedBox.category_names || "").split(", ")[index] || slug}
                    </button>
                  ))}
              </div>

              <div className="byb-products">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className={`byb-product${chosenIds.has(product.id) ? " selected" : ""}`}
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(`/product/${product.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") router.push(`/product/${product.id}`);
                    }}
                  >
                    <div className="byb-product-image">
                      {getProductImage(product) ? (
                        <img src={getProductImage(product)} alt={product.name} loading="lazy" />
                      ) : (
                        <div className="byb-product-fallback">NO IMAGE</div>
                      )}
                    </div>
                    <div className="byb-product-body">
                      <div className="byb-product-name">{product.name}</div>
                      <div className="byb-product-meta">
                        {product.brand_name ?? product.category_name ?? "-"}
                      </div>
                      <div className="byb-product-size">
                        Size: {product.variants?.[0]?.size || "-"}
                      </div>
                      <div className="byb-product-price">
                        {product.starting_price
                          ? `Rs ${Number(product.starting_price).toLocaleString("en-IN")}`
                          : "-"}
                      </div>
                      <div className="byb-product-actions">
                        <button
                          type="button"
                          className={`byb-product-select${chosenIds.has(product.id) ? " selected" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(product);
                          }}
                        >
                          {chosenIds.has(product.id) ? "Selected" : "Select for Box"}
                        </button>
                        <button
                          type="button"
                          className="byb-product-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/product/${product.id}`);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="byb-summary">
                <div className="byb-summary-left">
                  <div className="byb-summary-title">Your selections</div>
                  <div className="byb-summary-count">
                    {selectedItems.length} / {maxItems} selected
                  </div>
                  <div className="byb-summary-list">
                    {selectedItems.map((item) => (
                      <span key={item.product_id} className="byb-chip">
                        {item.name} - {item.size}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  className="byb-cta"
                  type="button"
                  onClick={handleAddBox}
                  disabled={adding}
                >
                  {adding ? "Adding..." : "Add Box to Cart"}
                </button>
              </div>

              {message && <div className="byb-message">{message}</div>}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
