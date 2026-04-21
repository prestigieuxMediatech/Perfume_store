"use client";
import React from "react";

const HERO_PRODUCTS = [
  {
    id: 1,
    family: "Floral / Oriental",
    name: "Velours Noir",
    notes: "Black rose, oud, amber and dark vanilla",
    price: "INR 18,500",
    img: "/one.webp",
  },
  {
    id: 2,
    family: "Woody / Spiced",
    name: "Santal Imperial",
    notes: "Mysore sandalwood, cardamom and leather",
    price: "INR 22,000",
    img: "/two.jpg",
  },
  {
    id: 3,
    family: "Aquatic / Fresh",
    name: "Brume d'Aube",
    notes: "Sea salt, iris, white cedar and musk",
    price: "INR 15,800",
    img: "/three.jpg",
  },
  {
    id: 4,
    family: "Gourmand / Warm",
    name: "Or Epice",
    notes: "Saffron, tonka bean, honey and vetiver",
    price: "INR 26,500",
    img: "/four.webp",
  },
];

const GlobalStyles = () => (
  <style>{`
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(22px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmerLine {
      from { transform: translateX(-100%); }
      to   { transform: translateX(200%); }
    }

    .hero-section {
      min-height: clamp(580px, 84vh, 820px);
      padding: 6.5rem 5rem 4rem;
      background: var(--bg);
      color: var(--text);
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
    }

    /* radial glow backdrop */
    .hero-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 8% -10%, rgba(199,164,90,0.13), transparent 48%),
        radial-gradient(ellipse at 92% 15%, rgba(199,164,90,0.06), transparent 52%);
      pointer-events: none;
      z-index: 0;
    }

    /* diagonal rule */
    .hero-section::after {
      content: '';
      position: absolute; inset: 0; z-index: 0; pointer-events: none;
      background: repeating-linear-gradient(
        -52deg, transparent, transparent 110px,
        rgba(199,164,90,.012) 110px, rgba(199,164,90,.012) 111px
      );
    }

    :root[data-theme="light"] .hero-section::before {
      background:
        radial-gradient(ellipse at 8% -10%, rgba(168,112,48,0.11), transparent 48%),
        radial-gradient(ellipse at 92% 15%, rgba(168,112,48,0.06), transparent 52%);
    }

    .hero-grid {
      width: 100%;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 4rem;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    /* ── LEFT ── */
    .hero-left { display: flex; flex-direction: column; gap: 1.5rem; }

    .hero-eyebrow {
      font-family: 'Cinzel', serif;
      font-size: 0.58rem;
      letter-spacing: 0.36em;
      text-transform: uppercase;
      color: var(--gold);
      display: inline-flex;
      align-items: center;
      gap: 0.85rem;
      animation: fadeUp 0.8s ease both;
    }
    .hero-eyebrow::before,
    .hero-eyebrow::after {
      content: '';
      width: 28px; height: 1px;
      background: var(--gold);
      opacity: .7;
    }

    .hero-heading {
      font-family: 'Cinzel', serif;
      font-weight: 300;
      font-size: clamp(2.4rem, 4.6vw, 4.6rem);
      line-height: 1.1;
      letter-spacing: 0.06em;
      color: var(--text);
      animation: fadeUp 0.8s ease both .08s;
    }
    .hero-heading em {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-weight: 300;
      color: var(--gold-light);
      letter-spacing: 0.04em;
      display: block;
    }

    .hero-sub {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.05rem;
      line-height: 1.85;
      color: var(--text-subtle);
      max-width: 440px;
      animation: fadeUp 0.8s ease both .16s;
    }

    .hero-cta {
      display: flex;
      gap: 1rem;
      align-items: center;
      animation: fadeUp 0.8s ease both .24s;
    }

    /* ── Metrics strip ── */
    .hero-metrics {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0;
      padding-top: 1.8rem;
      border-top: 1px solid var(--border);
      animation: fadeUp 0.8s ease both .32s;
    }
    .hero-metric {
      padding-right: 1.4rem;
      border-right: 1px solid var(--border);
    }
    .hero-metric:last-child { border-right: none; padding-left: 1.4rem; padding-right: 0; }
    .hero-metric:nth-child(2) { padding-left: 1.4rem; }

    .metric-value {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem;
      font-weight: 300;
      color: var(--gold);
      line-height: 1;
    }
    .metric-label {
      font-family: 'Cinzel', serif;
      font-size: 0.5rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--text-subtle);
      margin-top: 0.4rem;
    }

    /* ── RIGHT ── */
    .hero-right {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      animation: fadeUp 0.9s ease both .12s;
    }

    /* ── Feature card ── */
    .hero-feature {
      position: relative;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid var(--border);
      background: var(--surface);
      box-shadow: 0 20px 50px rgba(0,0,0,0.28);
      display: grid;
      grid-template-columns: 200px 1fr;
      align-items: stretch;
      transition: border-color .35s, box-shadow .35s;
    }
    .hero-feature:hover {
      border-color: var(--border-mid);
      box-shadow: 0 24px 60px rgba(0,0,0,0.38);
    }

    /* shimmer sweep on hover */
    .hero-feature::before {
      content: '';
      position: absolute; inset: 0; z-index: 2; pointer-events: none;
      background: linear-gradient(105deg, transparent 30%, rgba(199,164,90,.08) 50%, transparent 70%);
      transform: translateX(-100%);
      transition: transform .7s ease;
    }
    .hero-feature:hover::before { transform: translateX(100%); }

    .hero-feature-img {
      position: relative;
      overflow: hidden;
      background: var(--surface-2);
    }
    .hero-feature-img img {
      width: 100%; height: 100%;
      object-fit: cover; display: block;
      transition: transform .6s cubic-bezier(.25,.46,.45,.94), filter .6s;
      filter: brightness(.88) saturate(.9);
    }
    .hero-feature:hover .hero-feature-img img {
      transform: scale(1.05);
      filter: brightness(.96) saturate(1);
    }

    /* gold top-edge line */
    .hero-feature-img::after {
      content: '';
      position: absolute; top: 0; left: 0;
      height: 2px; width: 0;
      background: var(--gold);
      transition: width .55s ease;
      z-index: 1;
    }
    .hero-feature:hover .hero-feature-img::after { width: 100%; }

    .hero-feature-info {
      padding: 1.5rem 1.4rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.45rem;
      border-left: 1px solid var(--border);
    }

    .hero-feature-badge {
      display: inline-block;
      font-family: 'Cinzel', serif;
      font-size: 0.44rem;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--gold);
      border: 1px solid var(--border-mid);
      padding: .22rem .7rem;
      align-self: flex-start;
      margin-bottom: .1rem;
    }

    .hero-feature-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.45rem;
      font-weight: 300;
      color: var(--text);
      letter-spacing: 0.02em;
      line-height: 1.2;
      transition: color .3s;
    }
    .hero-feature:hover .hero-feature-name { color: var(--gold-light); }

    .hero-feature-notes {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 0.85rem;
      color: var(--text-subtle);
      line-height: 1.55;
    }

    .hero-feature-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: .4rem;
      padding-top: .75rem;
      border-top: 1px solid var(--border);
    }

    .hero-feature-price {
      font-family: 'Cinzel', serif;
      font-size: 0.7rem;
      letter-spacing: 0.18em;
      color: var(--gold);
    }

    .hero-feature-cta {
      font-family: 'Cinzel', serif;
      font-size: 0.5rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--text-faint);
      background: none;
      border: 1px solid var(--border);
      padding: .32rem .8rem;
      cursor: pointer;
      transition: border-color .25s, color .25s;
    }
    .hero-feature-cta:hover { border-color: var(--border-mid); color: var(--gold); }

    /* ── Thumb strip ── */
    .hero-thumbs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .hero-thumb {
      position: relative;
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
      background: var(--surface);
      cursor: pointer;
      transition: border-color .3s, transform .3s, box-shadow .3s;
    }
    .hero-thumb:hover {
      border-color: var(--border-mid);
      transform: translateY(-3px);
      box-shadow: 0 12px 28px rgba(0,0,0,.3);
    }
    .hero-thumb::before {
      content: '';
      position: absolute; top: 0; left: 0;
      height: 1px; width: 0;
      background: var(--gold);
      transition: width .45s ease; z-index: 1;
    }
    .hero-thumb:hover::before { width: 100%; }

    .hero-thumb-img {
      width: 100%;
      aspect-ratio: 3 / 2;
      background: var(--surface-2);
      overflow: hidden;
    }
    .hero-thumb-img img {
      width: 100%; height: 100%;
      object-fit: cover; display: block;
      transition: transform .6s ease, filter .6s;
      filter: brightness(.85) saturate(.88);
    }
    .hero-thumb:hover .hero-thumb-img img {
      transform: scale(1.06);
      filter: brightness(.96) saturate(1);
    }

    .hero-thumb-info {
      padding: .6rem .7rem .65rem;
      border-top: 1px solid var(--border);
    }

    .hero-thumb-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.9rem;
      color: var(--text);
      line-height: 1.2;
      transition: color .3s;
    }
    .hero-thumb:hover .hero-thumb-name { color: var(--gold-light); }

    .hero-thumb-family {
      font-family: 'Cinzel', serif;
      font-size: 0.42rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--text-faint);
      margin-top: 0.2rem;
    }

    /* ── Responsive ── */
    @media (max-width: 1100px) {
      .hero-section { padding: 6rem 3rem 4rem; }
      .hero-grid { grid-template-columns: 1fr; gap: 3rem; }
      .hero-right { max-width: 580px; }
    }

    @media (max-width: 768px) {
      .hero-section { padding: 5.5rem 1.5rem 3rem; }
      .hero-feature { grid-template-columns: 140px 1fr; }
      .hero-thumbs { grid-template-columns: repeat(3, 1fr); gap: .5rem; }
      .hero-thumb-info { padding: .5rem; }
      .hero-thumb-name { font-size: .82rem; }
    }

    @media (max-width: 480px) {
      .hero-feature { grid-template-columns: 1fr; }
      .hero-feature-img { aspect-ratio: 16 / 9; max-height: 200px; }
      .hero-feature-info { border-left: none; border-top: 1px solid var(--border); }
      .hero-thumbs { grid-template-columns: repeat(3, 1fr); }
      .hero-metric:nth-child(2) { padding-left: .9rem; }
      .hero-metric { padding-right: .9rem; }
    }
  `}</style>
);

export default function Hero() {
  const featured = HERO_PRODUCTS[0];
  const thumbs   = HERO_PRODUCTS.slice(1, 4);

  return (
    <>
      <GlobalStyles />
      <section className="hero-section">
        <div className="hero-grid">

          {/* ── LEFT ── */}
          <div className="hero-left">
            <div className="hero-eyebrow">7EVEN — Est. 1987</div>

            <h1 className="hero-heading">
              A Signature of
              <em>Quiet Luxury</em>
            </h1>

            <p className="hero-sub">
              Crafted in small batches with rare botanicals and precise maceration,
              each fragrance is composed to linger with elegance, not noise.
            </p>

            <div className="hero-cta">
              <button className="btn-primary">Explore Collection</button>
              
            </div>

            <div className="hero-metrics">
              <div className="hero-metric">
                <div className="metric-value">37</div>
                <div className="metric-label">Years of Excellence</div>
              </div>
              <div className="hero-metric">
                <div className="metric-value">150+</div>
                <div className="metric-label">Rare Botanicals</div>
              </div>
              <div className="hero-metric">
                <div className="metric-value">4</div>
                <div className="metric-label">Signature Families</div>
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="hero-right">

            {/* Featured card — horizontal layout, shorter image */}
            <div className="hero-feature">
              <div className="hero-feature-img">
                <img src={featured.img} alt={featured.name} />
              </div>
              <div className="hero-feature-info">
                <div className="hero-feature-badge">{featured.family}</div>
                <div className="hero-feature-name">{featured.name}</div>
                <div className="hero-feature-notes">{featured.notes}</div>
                <div className="hero-feature-footer">
                  <div className="hero-feature-price">{featured.price}</div>
                  <button className="hero-feature-cta">View →</button>
                </div>
              </div>
            </div>

            {/* Three thumbnails */}
            <div className="hero-thumbs">
              {thumbs.map(p => (
                <div className="hero-thumb" key={p.id}>
                  <div className="hero-thumb-img">
                    <img src={p.img} alt={p.name} />
                  </div>
                  <div className="hero-thumb-info">
                    <div className="hero-thumb-name">{p.name}</div>
                    <div className="hero-thumb-family">{p.family}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
