"use client";
import React, { useEffect, useRef, useState } from "react";

// Inject Google Fonts + keyframe animations via a style tag
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cinzel:wght@300;400;500&family=Cormorant:ital,wght@0,300;1,300&display=swap');

    :root {
      --gold: #c9a84c;
      --gold-light: #e8c97a;
      --gold-glow: rgba(201,168,76,0.18);
      --cream: #f5f0e8;
      --dark: #080808;
      --dark2: #111;
      --text-muted: rgba(245,240,232,0.45);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body { background: var(--dark); }

    /* ── Floating perfume bottle ── */
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(-1deg); }
      50%       { transform: translateY(-22px) rotate(1deg); }
    }

    /* ── Slow pulse glow ── */
    @keyframes glowPulse {
      0%, 100% { opacity: 0.35; transform: scale(1); }
      50%       { opacity: 0.65; transform: scale(1.15); }
    }

    /* ── Orbit ring spin ── */
    @keyframes orbitSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    /* ── Orbit dot counter-spin so dot stays stationary in place ── */
    @keyframes dotCounter {
      from { transform: rotate(0deg); }
      to   { transform: rotate(-360deg); }
    }

    /* ── Fade + rise entrance ── */
    @keyframes fadeRise {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Shimmer line ── */
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }

    /* ── Particle drift ── */
    @keyframes particleDrift {
      0%   { transform: translateY(0)   translateX(0)   opacity(0); opacity: 0; }
      20%  { opacity: 0.6; }
      80%  { opacity: 0.3; }
      100% { transform: translateY(-180px) translateX(30px); opacity: 0; }
    }

    @keyframes particleDrift2 {
      0%   { transform: translateY(0) translateX(0); opacity: 0; }
      20%  { opacity: 0.5; }
      80%  { opacity: 0.2; }
      100% { transform: translateY(-220px) translateX(-40px); opacity: 0; }
    }

    /* ── Line draw ── */
    @keyframes lineDraw {
      from { width: 0; opacity: 0; }
      to   { width: 60px; opacity: 1; }
    }

    .hero-section {
      /* Avoid oversized empty space on tall desktop screens */
      min-height: clamp(640px, 92vh, 920px);
      padding: 6rem 4rem 3.5rem;
      background: var(--dark);
      color: var(--cream);
      display: flex;
      align-items: center;
      overflow: hidden;
      position: relative;
    }

    /* subtle grain overlay */
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

    /* ── LEFT ── */
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
      font-weight: 300;
      font-size: 1.05rem;
      line-height: 1.75;
      color: var(--text-muted);
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

    .btn-primary {
      font-family: 'Cinzel', serif;
      font-size: 0.65rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: black;
      font-weight: bold;
      background: var(--gold);
      border: none;
      padding: 0.95rem 2rem;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: color 0.35s;
    }

    .btn-primary::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%);
      background-size: 400px 100%;
      transform: translateX(-100%);
      transition: transform 0.6s ease;
    }

    .btn-primary:hover::after { transform: translateX(100%); }
    .btn-primary:hover { background: var(--gold-light); }

    .btn-ghost {
      font-family: 'Cinzel', serif;
      font-size: 0.62rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--text-muted);
      background: none;
      border: none;
      cursor: pointer;
      transition: color 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-ghost:hover { color: var(--gold-light); }

    .hero-metrics {
      display: flex;
      gap: 2.5rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(245,240,232,0.08);
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

    /* ── RIGHT IMAGE SHELL ── */
    .hero-right {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: fadeRise 1.1s ease both;
      animation-delay: 0.4s;
    }

    /* Background radial gradient atmosphere */
    .hero-atmosphere {
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, transparent 70%);
      animation: glowPulse 4s ease-in-out infinite;
    }

    /* Orbit ring 1 */
    .orbit-ring {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(201,168,76,0.15);
    }

    .orbit-ring--1 {
      width: 420px; height: 420px;
      animation: orbitSpin 18s linear infinite;
    }

    .orbit-ring--2 {
      width: 320px; height: 320px;
      animation: orbitSpin 12s linear infinite reverse;
      border-style: dashed;
      border-color: rgba(201,168,76,0.1);
    }

    .orbit-dot {
      position: absolute;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--gold);
      top: -3px; left: 50%;
      transform: translateX(-50%);
      animation: dotCounter 18s linear infinite;
    }

    .orbit-dot--2 {
      width: 4px; height: 4px;
      top: auto; bottom: -2px;
      background: var(--gold-light);
      animation: dotCounter 12s linear infinite reverse;
    }

    /* Particles */
    .particle {
      position: absolute;
      width: 3px; height: 3px;
      border-radius: 50%;
      background: var(--gold);
      pointer-events: none;
    }

    .p1 { bottom: 30%; left: 15%; animation: particleDrift  5s ease-in-out infinite; }
    .p2 { bottom: 20%; right: 18%; animation: particleDrift2 6.5s ease-in-out infinite 1s; }
    .p3 { bottom: 40%; left: 25%; animation: particleDrift  7s ease-in-out infinite 2s; width: 2px; height: 2px; }
    .p4 { bottom: 25%; right: 30%; animation: particleDrift2 5.5s ease-in-out infinite 0.5s; width: 2px; height: 2px; }

    .hero-bottle {
      position: relative;
      z-index: 2;
      width: clamp(280px, 38vw, 480px);
      animation: float 6s ease-in-out infinite;
      filter: drop-shadow(0 30px 60px rgba(201,168,76,0.2));
    }

    /* Corner decorative marks */
    .corner-mark {
      position: absolute;
      width: 28px; height: 28px;
      border-color: rgba(201,168,76,0.35);
      border-style: solid;
    }
    .corner-mark--tl { top: 10%; left: 8%; border-width: 1px 0 0 1px; }
    .corner-mark--tr { top: 10%; right: 8%; border-width: 1px 1px 0 0; }
    .corner-mark--bl { bottom: 10%; left: 8%; border-width: 0 0 1px 1px; }
    .corner-mark--br { bottom: 10%; right: 8%; border-width: 0 1px 1px 0; }

    /* Vertical text label */
    .vertical-label {
      position: absolute;
      right: -2rem;
      top: 50%;
      transform: translateY(-50%) rotate(90deg);
      font-family: 'Cinzel', serif;
      font-size: 0.5rem;
      letter-spacing: 0.4em;
      color: rgba(201,168,76,0.4);
      text-transform: uppercase;
      white-space: nowrap;
    }

    /* ── Responsive ── */
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
      .vertical-label { display: none; }
      .corner-mark { display: none; }
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

function Hero() {
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
                Explore Collection →
              </button>
              <button className="btn-ghost">
                Our Story →
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

            <div className="corner-mark corner-mark--tl" />
            <div className="corner-mark corner-mark--tr" />
            <div className="corner-mark corner-mark--bl" />
            <div className="corner-mark corner-mark--br" />

            <div className="hero-atmosphere" />

            <div className="orbit-ring orbit-ring--1">
              <span className="orbit-dot" />
            </div>
            <div className="orbit-ring orbit-ring--2">
              <span className="orbit-dot orbit-dot--2" />
            </div>

            {/* Floating particles */}
            <span className="particle p1" />
            <span className="particle p2" />
            <span className="particle p3" />
            <span className="particle p4" />

            {/* Bottle */}
            <img
              src="/bg.png"
              alt="Perfume Bottle"
              className="hero-bottle"
            />

            <span className="vertical-label">Eau de Parfum · 50ml</span>

          </div>

        </div>
      </section>
    </>
  );
}

export default Hero;
