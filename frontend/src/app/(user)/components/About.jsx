"use client";
import React from "react";
import useReveal from "../hooks/useReveal";

const Keyframes = () => (
  <style>{`
    @keyframes fadeRiseAbout {
      from { opacity: 0; transform: translateY(36px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes lineGrow {
      from { height: 0; opacity: 0; }
      to   { height: 80px; opacity: 1; }
    }
    @keyframes revealImg {
      from { opacity: 0; transform: scale(1.04) translateX(-20px); }
      to   { opacity: 1; transform: scale(1) translateX(0); }
    }
    @keyframes shimmerBorder {
      0%,100% { opacity: 0.25; }
      50%     { opacity: 0.7;  }
    }
    @keyframes floatSlow {
      0%,100% { transform: translateY(0); }
      50%     { transform: translateY(-10px); }
    }

    /* ── Scroll-triggered visibility ── */
    .about-reveal {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity 0.85s ease, transform 0.85s ease;
    }
    .about-reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .about-reveal.delay-1 { transition-delay: 0.1s; }
    .about-reveal.delay-2 { transition-delay: 0.25s; }
    .about-reveal.delay-3 { transition-delay: 0.4s; }
    .about-reveal.delay-4 { transition-delay: 0.55s; }
    .about-reveal.delay-5 { transition-delay: 0.7s; }

    /* ── Section ── */
    .about-section {
      position: relative;
      background: var(--dark, #080808);
      color: var(--cream, #f5f0e8);
      overflow: hidden;
      /* Slightly tighter bottom padding so the gap before Products is smaller on desktop */
      padding: 7rem 6rem 4rem;
      display: flex;
      align-items: center;
      scroll-margin-top: 90px;
    }

    /* Background watermark text */
    .about-watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Cinzel', serif;
      font-size: clamp(6rem, 14vw, 16rem);
      font-weight: 300;
      letter-spacing: 0.2em;
      color: rgba(201,168,76,0.03);
      white-space: nowrap;
      pointer-events: none;
      user-select: none;
      z-index: 0;
    }

    /* ── Grid ── */
    .about-grid {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6rem;
      align-items: center;
      width: 100%;
      max-width: 1300px;
      margin: 0 auto;
    }

    /* ── LEFT: image side ── */
    .about-image-wrap {
      position: relative;
    }

    /* Decorative offset frame */
    .about-frame {
      position: absolute;
      inset: -18px -18px 18px 18px;
      border: 1px solid rgba(201,168,76,0.18);
      animation: shimmerBorder 4s ease-in-out infinite;
      pointer-events: none;
    }

    .about-img {
      position: relative;
      z-index: 1;
      width: 100%;
      aspect-ratio: 3/4;
      object-fit: cover;
      display: block;
      filter: grayscale(15%) brightness(0.9);
      transition: filter 0.6s ease;
      animation: revealImg 1.1s ease both 0.3s;
    }

    .about-image-wrap:hover .about-img {
      filter: grayscale(0%) brightness(1);
    }

    /* Gold vertical accent line left of image */
    .about-img-line {
      position: absolute;
      left: -28px;
      top: 10%;
      width: 1px;
      background: linear-gradient(to bottom, transparent, var(--gold, #c9a84c), transparent);
      animation: lineGrow 1s ease both 0.5s;
    }

    /* Floating label on image */
    .about-img-label {
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      padding: 2rem 1.5rem 1.5rem;
      background: linear-gradient(to top, rgba(var(--overlay-rgb),0.92) 0%, transparent 100%);
      z-index: 2;
    }

    .about-img-label span {
      font-family: 'Cinzel', serif;
      font-size: 0.55rem;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      color: rgba(201,168,76,0.65);
    }

    /* ── RIGHT: content side ── */
    .about-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .about-eyebrow {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: 'Cinzel', serif;
      font-size: 0.62rem;
      letter-spacing: 0.38em;
      text-transform: uppercase;
      color: var(--gold, #c9a84c);
    }

    .about-eyebrow::before {
      content: '';
      display: block;
      width: 40px;
      height: 1px;
      background: var(--gold, #c9a84c);
      flex-shrink: 0;
    }

    .about-heading {
      font-family: 'Cinzel', serif;
      font-weight: 300;
      font-size: clamp(2rem, 3.5vw, 3.2rem);
      line-height: 1.2;
      letter-spacing: 0.06em;
      color: var(--cream, #f5f0e8);
    }

    .about-heading em {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-weight: 300;
      color: var(--gold-light, #e8c97a);
      letter-spacing: 0.04em;
    }

    .about-divider {
      width: 48px;
      height: 1px;
      background: linear-gradient(90deg, var(--gold, #c9a84c), transparent);
    }

    .about-body {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.1rem;
      font-weight: 300;
      line-height: 1.9;
      color: var(--text-subtle);
      max-width: 460px;
    }

    .about-body strong {
      font-weight: 400;
      color: var(--text-strong);
    }

    /* Signature quote block */
    .about-quote {
      border-left: 1px solid rgba(201,168,76,0.3);
      padding: 0.75rem 0 0.75rem 1.5rem;
      margin-top: 0.5rem;
    }

    .about-quote p {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 1.15rem;
      font-weight: 300;
      line-height: 1.7;
      color: var(--text-muted);
    }

    .about-quote cite {
      display: block;
      margin-top: 0.6rem;
      font-family: 'Cinzel', serif;
      font-size: 0.55rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--gold, #c9a84c);
      font-style: normal;
    }

    /* Pillars row */
    .about-pillars {
      display: flex;
      gap: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
    }

    .pillar {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .pillar-icon {
      font-size: 1.1rem;
      color: var(--gold, #c9a84c);
      line-height: 1;
    }

    .pillar-title {
      font-family: 'Cinzel', serif;
      font-size: 0.6rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--cream, #f5f0e8);
    }

    .pillar-desc {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* CTA link */
    .about-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      font-family: 'Cinzel', serif;
      font-size: 0.62rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--gold, #c9a84c);
      text-decoration: none;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      transition: gap 0.3s, color 0.3s;
      width: fit-content;
    }

    .about-cta::after {
      content: '';
      display: block;
      width: 28px;
      height: 1px;
      background: var(--gold, #c9a84c);
      transition: width 0.4s ease;
    }

    .about-cta:hover { color: var(--gold-light, #e8c97a); gap: 1.2rem; }
    .about-cta:hover::after { width: 48px; background: var(--gold-light, #e8c97a); }

    /* ── Responsive ── */
    @media (max-width: 1024px) {
      .about-section { padding: 6rem 3rem 3.5rem; }
      .about-grid { gap: 4rem; }
    }

    @media (max-width: 768px) {
      .about-section { padding: 6rem 1.5rem 6rem; }
      .about-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
      .about-image-wrap { max-width: 420px; margin: 0 auto; }
      .about-img-line { display: none; }
      .about-pillars { flex-wrap: wrap; gap: 1.5rem; }
      .about-body { max-width: 100%; }
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

export default function About() {
  useReveal({ selector: ".about-reveal", visibleClass: "visible", threshold: 0.15 });

  return (
    <>
      <Keyframes />
      <section className="about-section" id="about">

        {/* Background watermark */}
        <span className="about-watermark">7EVEN</span>

        <div className="about-grid">

          {/* ── LEFT: Image ── */}
          <div className="about-image-wrap about-reveal">
            <div className="about-frame" />
            <div className="about-img-line" style={{ height: "80px" }} />
            <img
              src="/about.png"
              alt="Perfumer at work"
              className="about-img"
            />
            <div className="about-img-label">
              <span>Grasse, France · Since 1987</span>
            </div>
          </div>

          {/* ── RIGHT: Content ── */}
          <div className="about-content">

            <div className="about-reveal delay-1 about-eyebrow">
              Our Heritage
            </div>

            <h2 className="about-reveal delay-2 about-heading">
              Crafted with <em>patience,</em><br />
              Born from <em>obsession</em>
            </h2>

            <div className="about-reveal delay-2 about-divider" />

            <p className="about-reveal delay-3 about-body">
              Every bottle begins not in a lab, but in a field.
              We source <strong>rare botanicals</strong> from over 30 countries —
              handpicked at the precise hour their essence is fullest.
              Our master perfumers, trained across generations, then weave
              these ingredients into compositions that are <strong>never rushed,
              never replicated.</strong>
            </p>

            <div className="about-reveal delay-3 about-quote">
              <p>
                "Perfume is the art that makes memory speak —
                we make it speak in a language only you understand."
              </p>
              <cite>— Henri Marceau, Founder</cite>
            </div>

            <div className="about-reveal delay-4 about-pillars">
              {[
                { icon: "✦", title: "Rare Sourcing",  desc: "30+ countries, single-origin botanicals" },
                { icon: "◈", title: "Hand Crafted",   desc: "No automation in our atelier" },
                { icon: "◇", title: "Aged in Oak",    desc: "Minimum 18-month maceration" },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="pillar">
                  <span className="pillar-icon">{icon}</span>
                  <span className="pillar-title">{title}</span>
                  <span className="pillar-desc">{desc}</span>
                </div>
              ))}
            </div>

            <button className="about-reveal delay-5 about-cta">
              Discover Our Story
            </button>

          </div>
        </div>
      </section>
    </>
  );
}
