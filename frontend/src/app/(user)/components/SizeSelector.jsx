"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function SizeSelector({ product, onClose, onAuthRequired }) {
  const { user } = useAuth();
  const { addItem } = useCart();

  const [selected, setSelected] = useState(null);
  const [adding, setAdding]     = useState(false);
  const [added, setAdded]       = useState(false);
  const [error, setError]       = useState("");

  const handleAdd = async () => {
    // Not logged in
    if (!user) {
      onClose();
      onAuthRequired?.();
      return;
    }
    if (!selected) {
      setError("Please select a size first");
      return;
    }

    setAdding(true);
    setError("");
    try {
      const res = await addItem({
        product_id: product.id,
        variant_id: selected.id,
        quantity: 1,
      });
      if (!res.ok) {
        setError(res.message || "Could not add to cart");
        return;
      }
      setAdded(true);
      setTimeout(() => onClose(), 1400);
    } catch (err) {
      setError("Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      style={{
        position:       "fixed",
        inset:          0,
        background:     "rgba(var(--overlay-rgb),0.88)",
        backdropFilter: "blur(12px)",
        zIndex:         9999,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "1.5rem",
        fontFamily:     "Cinzel, serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background:   "var(--dark2)",
        border:       "1px solid var(--border)",
        padding:      "2.8rem 2.4rem",
        width:        "100%",
        maxWidth:     "440px",
        position:     "relative",
        boxShadow:    "0 40px 80px rgba(0,0,0,.75)",
        animation:    "ssFadeUp .3s ease",
      }}>
        <style>{`
          @keyframes ssFadeUp {
            from { opacity:0; transform:translateY(16px); }
            to   { opacity:1; transform:translateY(0); }
          }
        `}</style>

        {/* Corner accents */}
        <span style={{ position:"absolute", top:10, left:10, width:24, height:24, borderTop:"1px solid var(--gold)", borderLeft:"1px solid var(--gold)", opacity:.7 }}/>
        <span style={{ position:"absolute", bottom:10, right:10, width:24, height:24, borderBottom:"1px solid var(--gold)", borderRight:"1px solid var(--gold)", opacity:.7 }}/>

        {/* Close */}
        <button
          onClick={onClose}
          style={{ position:"absolute", top:12, right:12, background:"none", border:"none", color:"var(--text-muted)", cursor:"pointer", transition:"color .2s", padding:4 }}
          onMouseOver={e => e.currentTarget.style.color="var(--gold)"}
          onMouseOut={e  => e.currentTarget.style.color="var(--text-muted)"}
        >
          <X size={15} strokeWidth={1.5}/>
        </button>

        {/* Product info */}
        <p style={{ fontSize:".46rem", letterSpacing:".28em", textTransform:"uppercase", color:"var(--gold)", marginBottom:".4rem", fontFamily:"Cinzel,serif", opacity:0.7 }}>
          {product.brand_name ?? product.category_name ?? '—'}
        </p>
        <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.6rem", fontWeight:300, color:"var(--cream)", marginBottom:".4rem", letterSpacing:".04em", lineHeight:1.2 }}>
          {product.name}
        </h3>
        <div style={{ width:32, height:1, background:"var(--gold)", marginBottom:"2rem", opacity:.7 }}/>

        {/* Choose size label */}
        <p style={{ fontSize:".5rem", letterSpacing:".22em", textTransform:"uppercase", color:"var(--cream)", marginBottom:".9rem", fontFamily:"Cinzel,serif", opacity:0.7 }}>
          Choose Size
        </p>

        {/* Variants */}
        {product.variants && product.variants.length > 0 ? (
          <div style={{ display:"flex", gap:".55rem", flexWrap:"wrap", marginBottom:"2rem" }}>
            {product.variants.map(v => {
              const isOn = selected?.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => { setSelected(v); setError(""); }}
                  style={{
                    fontFamily:    "Cinzel, serif",
                    fontSize:      ".48rem",
                    letterSpacing: ".15em",
                    textTransform: "uppercase",
                    background:    isOn ? "var(--goldB)" : "none",
                    border:        isOn ? "1px solid var(--gold)" : "1px solid var(--border)",
                    color:         isOn ? "var(--gold)" : "var(--text-muted)",
                    padding:       ".6rem .95rem",
                    cursor:        "pointer",
                    transition:    "all .22s",
                    display:       "flex",
                    flexDirection: "column",
                    alignItems:    "center",
                    gap:           ".28rem",
                    minWidth:      "72px",
                  }}
                >
                  <span>{v.size}</span>
                  <span style={{ color: v.discount_price ? "var(--gold)" : "var(--gold-light)", fontSize:".5rem" }}>
                    ₹{Number(v.discount_price || v.price).toLocaleString("en-IN")}
                  </span>
                  {v.discount_price && (
                    <span style={{ color:"var(--text-muted)", fontSize:".42rem", textDecoration:"line-through" }}>
                      ₹{Number(v.price).toLocaleString("en-IN")}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <p style={{ color:"var(--text-muted)", fontSize:".65rem", marginBottom:"2rem", fontStyle:"italic" }}>
            No sizes available for this product.
          </p>
        )}

        {/* Error */}
        {error && (
          <p style={{ color:"#E8472A", fontSize:".68rem", marginBottom:"1rem", letterSpacing:".05em", fontFamily:"Tenor Sans,sans-serif" }}>
            {error}
          </p>
        )}

        {/* Add to cart button */}
        <button
          onClick={handleAdd}
          disabled={adding || added || !product.variants?.length}
          style={{
            width:         "100%",
            fontFamily:    "Cinzel, serif",
            fontSize:      ".58rem",
            letterSpacing: ".28em",
            textTransform: "uppercase",
            background:    added ? "rgba(42,232,128,.12)" : "var(--gold)",
            color:         added ? "#2AE880" : "var(--badge-text)",
            border:        added ? "1px solid rgba(42,232,128,.3)" : "none",
            padding:       "1.05rem",
            cursor:        (adding || added) ? "default" : "pointer",
            transition:    "background .3s",
            fontWeight:    500,
            position:      "relative",
            overflow:      "hidden",
          }}
        >
          {added
            ? "✓ Added to Cart"
            : adding
              ? "Adding..."
              : selected
                ? `Add to Cart — ${selected.size} (₹${Number(selected.discount_price || selected.price).toLocaleString("en-IN")})`
                : "Select a Size"
          }
        </button>

      </div>
    </div>
  );
}



