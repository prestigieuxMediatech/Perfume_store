"use client";
import React, { useEffect, useState } from "react";

const HERO_PRODUCTS = [
  {
    id: 1,
    family: "Floral · Oriental",
    name: "Velours Noir",
    notes: "Black rose, oud, amber & dark vanilla",
    price: "₹18,500",
    img: "/one.webp",
  },
  {
    id: 2,
    family: "Woody · Spiced",
    name: "Santal Impérial",
    notes: "Mysore sandalwood, cardamom & leather",
    price: "₹22,000",
    img: "/two.jpg",
  },
  {
    id: 3,
    family: "Aquatic · Fresh",
    name: "Brume d'Aube",
    notes: "Sea salt, iris, white cedar & musk",
    price: "₹15,800",
    img: "/three.jpg",
  },
  {
    id: 4,
    family: "Gourmand · Warm",
    name: "Or Épicé",
    notes: "Saffron, tonka bean, honey & vetiver",
    price: "₹26,500",
    img: "/four.webp",
  },
];

const chunk = (items, size) => {
  const result = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
};

const GlobalStyles = () => (
  <style>{`
    /* €€ Fade + rise entrance €€ */
    @keyframes fadeRise {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* €€ Shimmer line €€ */
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }

    /* €€ Line draw €€ */
    @keyframes lineDraw {
      from { width: 0; opacity: 0; }
      to   { width: 60px; opacity: 1; }
    }

    .hero-section {
      min-height: clamp(640px, 92vh, 920px);
      padding: 6rem 4rem 3.5rem;
      background: var(--dark);
      color: var(--cream);
      display: flex;
      align-items: center;
      overflow: hidden;
      position: relative;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
      opacity: 0.55;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
      width: 100%;
      position: relative;
      z-index: 1;
    }

    .hero-left { display: flex; flex-direction: column; gap: 2rem; }

    .hero-eyebrow {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: 'Cinzel', serif;
      font-size: 0.65rem;
      letter-spacing: 0.35em;
      color: var(--gold);
      text-transform: uppercase;
      animation: fadeRise 0.9s ease both;
      animation-delay: 0.1s;
    }

    .hero-eyebrow::before {
      content: '';
      display: block;
      height: 1px;
      background: var(--gold);
      animation: lineDraw 0.8s ease both;
      animation-delay: 0.2s;
    }

    .hero-heading {
      font-family: 'Cinzel', serif;
      font-weight: 300;
      font-size: clamp(2.8rem, 5.5vw, 5.5rem);
      line-height: 1.12;
      letter-spacing: 0.06em;
      color: var(--cream);
      animation: fadeRise 0.9s ease both;
      animation-delay: 0.3s;
    }

    .hero-heading .accent {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-weight: 300;
      color: var(--gold-light);
      letter-spacing: 0.04em;
    }

    .hero-divider {
      width: 60px;
      height: 1px;
      background: linear-gradient(90deg, var(--gold), transparent);
      animation: lineDraw 1s ease both;
      animation-delay: 0.5s;
    }

    .hero-sub {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-weight: 550;
      font-size: 1.05rem;
      line-height: 1.75;
      color: var(--cream);
      max-width: 380px;
      border-left: 1px solid rgba(201,168,76,0.3);
      padding-left: 1.25rem;
      animation: fadeRise 0.9s ease both;
      animation-delay: 0.5s;
    }

    .hero-cta {
      display: flex;
      gap: 1.5rem;
      align-items: center;
      animation: fadeRise 0.9s ease both;
      animation-delay: 0.7s;
    }

    .hero-metrics {
      display: flex;
      gap: 2.5rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border);
      animation: fadeRise 0.9s ease both;
      animation-delay: 0.9s;
    }

    .metric-value {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem;
      font-weight: 300;
      color: var(--gold);
      line-height: 1;
    }

    .metric-label {
      font-family: 'Cinzel', serif;
      font-size: 0.55rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-top: 0.35rem;
    }

    .hero-right {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: fadeRise 1.1s ease both;
      animation-delay: 0.4s;
    }

    .hero-carousel {
      width: 100%;
      max-width: 540px;
      border: 1px solid var(--border);
      background: var(--dark2);
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(0,0,0,0.35);
    }

    .hero-carousel::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 0% 0%, rgba(201,168,76,0.14), transparent 55%);
      pointer-events: none;
    }

    .hero-carousel-viewport {
      overflow: hidden;
      position: relative;
      z-index: 1;
    }

    .hero-carousel-track {
      display: flex;
      transition: transform 0.7s ease;
      gap: 1.2rem;
    }

    .hero-slide {
      min-width: 100%;
    }

    .hero-slide-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.2rem;
    }

    .hero-card {
      background: var(--dark3);
      border: 1px solid var(--border);
      overflow: hidden;
    }

    .hero-card-img {
      aspect-ratio: 3/4;
      overflow: hidden;
      background: var(--dark3);
    }

    .hero-card-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .hero-card-body {
      padding: 0.9rem 0.9rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .hero-card-family {
      font-family: 'Cinzel', serif;
      font-size: 0.45rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: rgba(201,168,76,0.7);
    }

    .hero-card-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1rem;
      color: var(--cream);
      letter-spacing: 0.02em;
    }

    .hero-card-notes {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 0.75rem;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .hero-card-price {
      font-family: 'Cinzel', serif;
      font-size: 0.65rem;
      letter-spacing: 0.18em;
      color: var(--gold);
      margin-top: 0.2rem;
    }

    .hero-dots {
      display: flex;
      gap: 6px;
      margin-top: 1rem;
      justify-content: center;
    }

    .hero-dot {
      width: 5px;
      height: 5px;
      border-radius: 999px;
      background: rgba(var(--text-rgb),0.2);
      transition: width 0.35s ease, background 0.35s ease;
    }

    .hero-dot.active {
      width: 22px;
      background: var(--gold);
    }

    @media (min-width: 1024px) {
      .hero-section {
        min-height: clamp(640px, 86vh, 880px);
        padding: 5.5rem 4rem 3rem;
      }
    }

    @media (max-width: 768px) {
      .hero-section { padding: 5rem 1.5rem 3rem; }
      .hero-grid { grid-template-columns: 1fr; }
      .hero-right { margin-top: 2rem; }
      .hero-slide-grid { grid-template-columns: 1fr; }
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

export default function Hero() {
  const slides = chunk(HERO_PRODUCTS, 2);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <>
      <GlobalStyles />
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-eyebrow">
              Maison de Parfum · Est. 1987
            </div>

            <h1 className="hero-heading">
              WHERE<br />
              <span className="accent">SCENT</span><br />
              BECOMES<br />
              ARTISTRY
            </h1>

            <div className="hero-divider" />

            <p className="hero-sub">
              "A singular journey through rare botanical gardens
              and ancient trade routes — bottled in silence."
            </p>

            <div className="hero-cta">
              <button className="btn-primary">
                Explore Collection 
              </button>
              
            </div>

            <div className="hero-metrics">
              <div>
                <div className="metric-value">37</div>
                <div className="metric-label">Years of Excellence</div>
              </div>
              <div>
                <div className="metric-value">4</div>
                <div className="metric-label">Signature Fragrances</div>
              </div>
              <div>
                <div className="metric-value">150+</div>
                <div className="metric-label">Rare Ingredients</div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-carousel">
              <div className="hero-carousel-viewport">
                <div
                  className="hero-carousel-track"
                  style={{ transform: `translateX(-${index * 100}%)` }}
                >
                  {slides.map((group, slideIndex) => (
                    <div className="hero-slide" key={`slide-${slideIndex}`}>
                      <div className="hero-slide-grid">
                        {group.map((item) => (
                          <div className="hero-card" key={item.id}>
                            <div className="hero-card-img">
                              <img src={item.img} alt={item.name} />
                            </div>
                            <div className="hero-card-body">
                              <div className="hero-card-family">{item.family}</div>
                              <div className="hero-card-name">{item.name}</div>
                              <div className="hero-card-notes">{item.notes}</div>
                              <div className="hero-card-price">{item.price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hero-dots">
                {slides.map((_, dotIndex) => (
                  <span
                    key={`dot-${dotIndex}`}
                    className={`hero-dot ${dotIndex === index ? "active" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
