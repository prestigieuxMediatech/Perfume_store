"use client";
import React, { useEffect, useState, useRef } from "react";

const Styles = () => (
  <style>{`
    /* ── Section ── */
    .reviews-section {
      position: relative;
      background: var(--dark);
      color: var(--cream);
      padding: 10rem 0 10rem;
      border-top: 1px solid var(--border);
      overflow: hidden;
    }

    /* Subtle radial glow */
    .reviews-section::before {
      content: '';
      position: absolute;
      top: -30%;
      left: -10%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }
    .reviews-section::after {
      content: '';
      position: absolute;
      bottom: -20%;
      right: -5%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .reviews-inner {
      position: relative;
      z-index: 1;
      max-width: 1320px;
      margin: 0 auto;
      padding: 0 6rem;
    }

    /* ── Header ── */
    .reviews-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 2rem;
      margin-bottom: 5rem;
    }

    .reviews-eyebrow {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: 'Cinzel', serif;
      font-size: 0.62rem;
      letter-spacing: 0.38em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 1.2rem;
    }
    .reviews-eyebrow::before {
      content: '';
      display: block;
      width: 36px;
      height: 1px;
      background: var(--gold);
      flex-shrink: 0;
    }

    .reviews-heading {
      font-family: 'Cinzel', serif;
      font-weight: 300;
      font-size: clamp(2rem, 3.2vw, 3rem);
      letter-spacing: 0.06em;
      line-height: 1.2;
      color: var(--cream);
    }
    .reviews-heading em {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-weight: 300;
      color: var(--gold-light);
    }

    .reviews-sub {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1rem;
      line-height: 1.85;
      color: var(--text-muted);
      max-width: 340px;
      text-align: right;
    }

    /* ── Track wrapper: clips the sliding strip ── */
    .reviews-track-wrap {
      overflow: hidden;
      margin: 0 -1rem;
      padding: 1.5rem 0 2rem;  /* breathing room for card shadows */
    }

    /* ── Sliding strip ── */
    .reviews-track {
      display: flex;
      gap: 1.5rem;
      will-change: transform;
      transition: transform 0.72s cubic-bezier(0.25, 0.8, 0.25, 1);
      padding: 0 1rem;
    }

    /* ── Individual review card ── */
    .review-card {
      flex: 0 0 calc(33.333% - 1rem);
      max-width: calc(33.333% - 1rem);
      background: var(--dark2);
      border: 1px solid var(--border);
      padding: 2.25rem 2rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      position: relative;
      overflow: hidden;
      transition: border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease;
      cursor: default;
    }

    /* Gold corner accent top-left */
    .review-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 40px; height: 1px;
      background: var(--gold);
      opacity: 0;
      transition: opacity 0.4s ease, width 0.5s ease;
    }
    .review-card::after {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 1px; height: 40px;
      background: var(--gold);
      opacity: 0;
      transition: opacity 0.4s ease, height 0.5s ease;
    }

    .review-card:hover {
      border-color: rgba(201,168,76,0.28);
      transform: translateY(-6px);
      box-shadow: 0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.06);
    }
    .review-card:hover::before,
    .review-card:hover::after { opacity: 1; }

    /* Shimmer sweep on hover */
    .review-card-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        115deg,
        transparent 30%,
        rgba(201,168,76,0.05) 50%,
        transparent 70%
      );
      transform: translateX(-100%);
      transition: transform 0.7s ease;
      pointer-events: none;
    }
    .review-card:hover .review-card-shimmer { transform: translateX(100%); }

    /* Quote mark */
    .review-quote {
      font-family: 'Cormorant Garamond', serif;
      font-size: 3.5rem;
      line-height: 0.6;
      color: rgba(201,168,76,0.35);
      font-style: italic;
      user-select: none;
    }

    /* Review text */
    .review-text {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.05rem;
      line-height: 1.9;
      color: var(--text-strong);
      flex: 1;
    }

    /* Divider */
    .review-divider {
      height: 1px;
      background: linear-gradient(90deg, rgba(201,168,76,0.3), transparent);
    }

    /* Meta row */
    .review-meta {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1rem;
    }

    .review-meta-left { display: flex; flex-direction: column; gap: 0.25rem; }

    .review-name {
      font-family: 'Cinzel', serif;
      font-size: 0.7rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--gold);
    }

    .review-detail {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    /* Star rating */
    .review-stars {
      display: flex;
      gap: 3px;
    }
    .star {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: rgba(201,168,76,0.25);
    }
    .star.on { background: var(--gold); }

    /* ── Controls ── */
    .reviews-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 3rem;
      padding: 0;
    }

    .reviews-stat {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .reviews-dots-arrows {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .reviews-dots {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .r-dot {
      border: none;
      padding: 0;
      cursor: pointer;
      background: transparent;
    }

    .r-dot-inner {
      display: block;
      height: 5px;
      border-radius: 999px;
      background: rgba(var(--text-rgb),0.2);
      transition: background 0.35s ease, width 0.35s ease;
      width: 5px;
    }
    .r-dot.active .r-dot-inner {
      background: var(--gold);
      width: 24px;
    }

    .reviews-arrows {
      display: flex;
      gap: 0.6rem;
    }

    .r-arrow {
      width: 40px; height: 40px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--text-subtle);
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.3s, border-color 0.3s, color 0.3s, transform 0.25s;
    }
    .r-arrow:hover {
      background: rgba(201,168,76,0.1);
      border-color: rgba(201,168,76,0.5);
      color: var(--gold);
      transform: scale(1.08);
    }

    /* ── Progress bar ── */
    .reviews-progress-wrap {
      height: 1px;
      background: rgba(var(--text-rgb),0.06);
      margin-bottom: 0;
      position: relative;
      overflow: hidden;
    }
    .reviews-progress-bar {
      position: absolute;
      top: 0; left: 0;
      height: 100%;
      background: linear-gradient(90deg, var(--gold), var(--gold-light));
      transition: width 0.2s linear;
    }

    /* ── Responsive ── */
    @media (max-width: 1100px) {
      .reviews-inner { padding: 0 3rem; }
      .review-card { flex: 0 0 calc(50% - 0.75rem); max-width: calc(50% - 0.75rem); }
    }
    @media (max-width: 768px) {
      .reviews-section { padding: 6rem 0; }
      .reviews-inner { padding: 0 1.5rem; }
      .reviews-header { flex-direction: column; align-items: flex-start; }
      .reviews-sub { text-align: left; max-width: 100%; }
      .review-card { flex: 0 0 calc(100% - 0rem); max-width: calc(100% - 0rem); }
    }
  `}</style>
);

const REVIEWS = [
  {
    name: "Ishita M.",
    detail: "Mumbai · 7EVEN Bespoke No. 03",
    rating: 5,
    text: "I have never owned a fragrance that feels this personal. Strangers stop me to ask what I'm wearing — and I almost don't want to tell them.",
  },
  {
    name: "Louis D.",
    detail: "Paris · Velours Noir",
    rating: 5,
    text: "The dry-down is extraordinary. Eight hours later there is still this soft, smoky warmth on my cuffs and the inside of my coat.",
  },
  {
    name: "Ananya R.",
    detail: "Delhi · Or Épicé",
    rating: 5,
    text: "It smells like saffron threads, honey and old books. I wear it when I need to feel like the main character.",
  },
  {
    name: "Sara K.",
    detail: "London · Brume d'Aube",
    rating: 4,
    text: "Airy but memorable. It has become my everyday scent because it never overwhelms the room, only lingers softly.",
  },
  {
    name: "Yusuf A.",
    detail: "Dubai · Santal Impérial",
    rating: 5,
    text: "This is how sandalwood should smell — deep, elegant and modern. It feels more like a tailored suit than a perfume.",
  },
  {
    name: "Elena V.",
    detail: "Milan · 7EVEN Discovery Set",
    rating: 5,
    text: "Even the sample vials feel like jewelry. The curation is thoughtful and every scent tells a different story.",
  },
  {
    name: "Rohan S.",
    detail: "Bangalore · Atelier Session",
    rating: 5,
    text: "The atelier experience was unlike anything I've done. We built a scent around my childhood monsoon memories — it was emotional in the best way.",
  },
  {
    name: "Claire B.",
    detail: "New York · Gifted Or Épicé",
    rating: 5,
    text: "I received Or Épicé as a gift and immediately ordered another bottle. It's become the fragrance my friends associate with me.",
  },
];

const INTERVAL = 4500; // ms per slide
const CARDS_PER_SLIDE_DESKTOP = 3;
const CARDS_PER_SLIDE_TABLET  = 2;
const CARDS_PER_SLIDE_MOBILE  = 1;

export default function Reviews() {
  const [index, setIndex]       = useState(0);
  const [perSlide, setPerSlide] = useState(CARDS_PER_SLIDE_DESKTOP);
  const [progress, setProgress] = useState(0);
  const progressRef             = useRef(null);
  const startRef                = useRef(null);

  const totalSlides = Math.ceil(REVIEWS.length / perSlide);

  /* Responsive perSlide */
  useEffect(() => {
    const calc = () => {
      if (window.innerWidth <= 768)  setPerSlide(CARDS_PER_SLIDE_MOBILE);
      else if (window.innerWidth <= 1100) setPerSlide(CARDS_PER_SLIDE_TABLET);
      else setPerSlide(CARDS_PER_SLIDE_DESKTOP);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  /* Auto-advance + progress bar */
  useEffect(() => {
    setProgress(0);
    startRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      setProgress(pct);
      if (elapsed < INTERVAL) {
        progressRef.current = requestAnimationFrame(tick);
      } else {
        setIndex((prev) => (prev + 1) % totalSlides);
      }
    };

    progressRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progressRef.current);
  }, [index, totalSlides]);

  const goTo = (i) => {
    cancelAnimationFrame(progressRef.current);
    setIndex(i);
  };
  const prev = () => goTo((index - 1 + totalSlides) % totalSlides);
  const next = () => goTo((index + 1) % totalSlides);

  /* Cards for current slide */
  const visibleCards = REVIEWS.slice(
    index * perSlide,
    index * perSlide + perSlide
  );

  /* Track offset: move by 100% each slide */
  const trackOffset = index * (100 / perSlide) * perSlide;

  return (
    <>
      <Styles />
      <section className="reviews-section" id="reviews">
        <div className="reviews-inner">

          {/* Header */}
          <header className="reviews-header">
            <div>
              <div className="reviews-eyebrow">Client Reviews</div>
              <h2 className="reviews-heading">
                Whispers of <em>gold</em><br />on the skin
              </h2>
            </div>
            <p className="reviews-sub">
              Words from clients who have invited 7EVEN into their daily
              rituals, celebrations and quiet moments in between.
            </p>
          </header>

          {/* Progress bar */}
          <div className="reviews-progress-wrap">
            <div
              className="reviews-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Track */}
          <div className="reviews-track-wrap">
            <div
              className="reviews-track"
              style={{
                transform: `translateX(calc(-${index * 100}% - ${index * 1.5}rem))`,
              }}
            >
              {REVIEWS.map((review, i) => (
                <article key={i} className="review-card">
                  <div className="review-card-shimmer" />

                  <div className="review-quote">"</div>

                  <p className="review-text">{review.text}</p>

                  <div className="review-divider" />

                  <div className="review-meta">
                    <div className="review-meta-left">
                      <span className="review-name">{review.name}</span>
                      <span className="review-detail">{review.detail}</span>
                    </div>
                    <div className="review-stars">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <span key={si} className={`star${si < review.rating ? " on" : ""}`} />
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="reviews-controls">
            <span className="reviews-stat">
              97% would recommend 7EVEN to a loved one
            </span>

            <div className="reviews-dots-arrows">
              <div className="reviews-dots">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    className={`r-dot${i === index ? " active" : ""}`}
                    onClick={() => goTo(i)}
                    aria-label={`Slide ${i + 1}`}
                  >
                    <span className="r-dot-inner" />
                  </button>
                ))}
              </div>

              <div className="reviews-arrows">
                <button className="r-arrow" onClick={prev} aria-label="Previous">‹</button>
                <button className="r-arrow" onClick={next} aria-label="Next">›</button>
              </div>
            </div>
          </div>  

        </div>
      </section>
    </>
  );
}

