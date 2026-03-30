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
        background:     "rgba(0,0,0,.88)",
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
        background:   "#0d0d0e",
        border:       "1px solid rgba(201,168,76,.22)",
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
        <span style={{ position:"absolute", top:10, left:10, width:24, height:24, borderTop:"1px solid #8A6F34", borderLeft:"1px solid #8A6F34", opacity:.7 }}/>
        <span style={{ position:"absolute", bottom:10, right:10, width:24, height:24, borderBottom:"1px solid #8A6F34", borderRight:"1px solid #8A6F34", opacity:.7 }}/>

        {/* Close */}
        <button
          onClick={onClose}
          style={{ position:"absolute", top:12, right:12, background:"none", border:"none", color:"#7A7264", cursor:"pointer", transition:"color .2s", padding:4 }}
          onMouseOver={e => e.currentTarget.style.color="#C9A84C"}
          onMouseOut={e  => e.currentTarget.style.color="#7A7264"}
        >
          <X size={15} strokeWidth={1.5}/>
        </button>

        {/* Product info */}
        <p style={{ fontSize:".46rem", letterSpacing:".28em", textTransform:"uppercase", color:"rgba(201,168,76,.55)", marginBottom:".4rem", fontFamily:"Cinzel,serif" }}>
          {product.brand_name ?? product.category_name ?? '—'}
        </p>
        <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.6rem", fontWeight:300, color:"#F5F0E8", marginBottom:".4rem", letterSpacing:".04em", lineHeight:1.2 }}>
          {product.name}
        </h3>
        <div style={{ width:32, height:1, background:"#8A6F34", marginBottom:"2rem", opacity:.7 }}/>

        {/* Choose size label */}
        <p style={{ fontSize:".5rem", letterSpacing:".22em", textTransform:"uppercase", color:"#F5F0E8", marginBottom:".9rem", fontFamily:"Cinzel,serif" }}>
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
                    background:    isOn ? "rgba(201,168,76,.08)" : "none",
                    border:        isOn ? "1px solid #C9A84C" : "1px solid rgba(245,240,232,.08)",
                    color:         isOn ? "#C9A84C" : "#7A7264",
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
                  <span style={{ color: v.discount_price ? "#C9A84C" : "rgba(201,168,76,.6)", fontSize:".5rem" }}>
                    ₹{Number(v.discount_price || v.price).toLocaleString("en-IN")}
                  </span>
                  {v.discount_price && (
                    <span style={{ color:"rgba(245,240,232,.25)", fontSize:".42rem", textDecoration:"line-through" }}>
                      ₹{Number(v.price).toLocaleString("en-IN")}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <p style={{ color:"#7A7264", fontSize:".65rem", marginBottom:"2rem", fontStyle:"italic" }}>
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
            background:    added ? "rgba(42,232,128,.12)" : "#C9A84C",
            color:         added ? "#2AE880" : "#080808",
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
