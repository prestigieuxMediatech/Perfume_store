'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cinzel:wght@300;400;500&display=swap');

    :root {
      --gold:   #c9a84c;
      --goldL:  #e8c97a;
      --cream:  #f5f0e8;
      --dark:   #080808;
      --dark2:  #0d0d0e;
      --dark3:  #111113;
      --muted:  rgba(245,240,232,0.42);
      --border: rgba(245,240,232,0.07);
      --goldB:  rgba(201,168,76,0.16);
    }

    @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes glowPulse{ 0%,100%{opacity:.22;transform:scale(1)} 50%{opacity:.45;transform:scale(1.1)} }
    @keyframes lineDraw { from{width:0;opacity:0} to{opacity:1} }
    @keyframes slideUp  { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shimmer  { 0%,100%{opacity:.14} 50%{opacity:.48} }
    @keyframes filterPop{ from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

    .r { opacity:0; transform:translateY(28px); transition:opacity .8s ease, transform .8s ease; }
    .r.on { opacity:1; transform:translateY(0); }
    .r.t1{transition-delay:.06s} .r.t2{transition-delay:.14s}
    .r.t3{transition-delay:.22s} .r.t4{transition-delay:.30s}
    .r.t5{transition-delay:.38s} .r.t6{transition-delay:.46s}
    .r.t7{transition-delay:.54s} .r.t8{transition-delay:.62s}

    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    /* ── Page shell ── */
    .pl-page {
      min-height:100svh;
      background:var(--dark);
      color:var(--cream);
      font-family:'Cormorant Garamond',serif;
      overflow-x:hidden;
      position:relative;
    }

    /* grain */
    .pl-page::before {
      content:''; position:fixed; inset:0; z-index:999; pointer-events:none;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.035'/%3E%3C/svg%3E");
      opacity:.55;
    }

    /* diagonal stripes */
    .pl-page::after {
      content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
      background:repeating-linear-gradient(
        -52deg, transparent, transparent 110px,
        rgba(201,168,76,.014) 110px, rgba(201,168,76,.014) 111px
      );
    }

    .pl-content { position:relative; z-index:1; }

    /* ══════════════════════════════
       HERO BAND
    ══════════════════════════════ */
    .pl-hero {
      padding:8.5rem 0 0;
      text-align:center;
      border-bottom:1px solid var(--border);
      position:relative;
      overflow:hidden;
    }

    /* ambient glow */
    .pl-hero-glow {
      position:absolute; width:600px; height:600px;
      border-radius:50%; top:50%; left:50%;
      transform:translate(-50%,-50%);
      background:radial-gradient(ellipse at center, rgba(201,168,76,.07) 0%, transparent 68%);
      animation:glowPulse 5s ease-in-out infinite;
      pointer-events:none;
    }

    .pl-hero-inner { position:relative; z-index:1; }

    .pl-hero-eyebrow {
      display:inline-flex; align-items:center; gap:.9rem;
      font-family:'Cinzel',serif; font-size:.6rem;
      letter-spacing:.38em; text-transform:uppercase; color:var(--gold);
      animation:fadeUp .9s ease both .1s;
    }
    .pl-hero-eyebrow span { display:block; width:36px; height:1px; background:var(--gold); }

    .pl-hero-heading {
      font-family:'Cinzel',serif; font-weight:300;
      font-size:clamp(3rem,7vw,7rem);
      letter-spacing:.1em; line-height:1.06; color:var(--cream);
      margin-top:1.5rem;
      animation:fadeUp .9s ease both .25s;
    }
    .pl-hero-heading em {
      font-family:'Cormorant Garamond',serif;
      font-style:italic; font-weight:300; color:var(--goldL);
      display:block; font-size:.72em; letter-spacing:.05em; margin-top:.05em;
    }

    .pl-hero-sub {
      font-style:italic; font-size:1.1rem; color:var(--muted);
      line-height:1.8; max-width:480px; margin:1.8rem auto 0;
      animation:fadeUp .9s ease both .42s;
    }

    /* result count */
    .pl-result-count {
      font-family:'Cinzel',serif; font-size:.55rem;
      letter-spacing:.25em; text-transform:uppercase;
      color:rgba(201,168,76,.5);
      margin:2rem 0 0;
      animation:fadeUp .9s ease both .5s;
    }

    /* hero ornament */
    .pl-hero-orn {
      display:flex; align-items:center; gap:1.2rem;
      justify-content:center; margin:2rem 0 0;
      animation:fadeUp .9s ease both .55s;
    }
    .pl-hero-orn::before, .pl-hero-orn::after {
      content:''; flex:0 0 60px; height:1px;
      background:linear-gradient(to right, transparent, rgba(201,168,76,.3), transparent);
    }
    .pl-hero-orn span { font-size:.55rem; color:rgba(201,168,76,.4); }

    /* ══════════════════════════════
       TOOLBAR — filter + sort + view
    ══════════════════════════════ */
    .pl-toolbar {
      position:sticky; top:72px; z-index:50;
      background:rgba(8,8,8,.88);
      backdrop-filter:blur(20px);
      -webkit-backdrop-filter:blur(20px);
      border-bottom:1px solid var(--border);
    }

    .pl-toolbar-inner {
      max-width:1320px; margin:0 auto; padding:0 5rem;
      display:flex; align-items:center;
      justify-content:space-between; gap:2rem;
      height:60px;
    }

    /* category pills */
    .pl-cats {
      display:flex; align-items:center; gap:.35rem;
      overflow-x:auto; -ms-overflow-style:none; scrollbar-width:none;
    }
    .pl-cats::-webkit-scrollbar { display:none; }

    .pl-cat {
      font-family:'Cinzel',serif; font-size:.56rem;
      letter-spacing:.22em; text-transform:uppercase;
      color:var(--muted); background:none;
      border:1px solid transparent;
      padding:.45rem 1.1rem; cursor:pointer;
      white-space:nowrap;
      transition:color .3s, border-color .3s;
    }
    .pl-cat:hover { color:var(--goldL); border-color:rgba(201,168,76,.2); }
    .pl-cat.on {
      color:var(--gold); border-color:rgba(201,168,76,.4);
      background:rgba(201,168,76,.04);
    }

    /* right controls */
    .pl-controls { display:flex; align-items:center; gap:1.2rem; flex-shrink:0; }

    .pl-sort {
      font-family:'Cinzel',serif; font-size:.56rem;
      letter-spacing:.18em; text-transform:uppercase;
      color:var(--muted); background:none;
      border:1px solid var(--border); padding:.4rem 1rem;
      cursor:pointer; appearance:none;
      transition:border-color .3s, color .3s;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(201,168,76,0.5)'/%3E%3C/svg%3E");
      background-repeat:no-repeat;
      background-position:right .7rem center;
      padding-right:2rem;
    }
    .pl-sort:hover, .pl-sort:focus { border-color:rgba(201,168,76,.4); color:var(--goldL); outline:none; }
    .pl-sort option { background:var(--dark2); color:var(--cream); }

    /* view toggle */
    .pl-view-toggle { display:flex; gap:.3rem; }
    .pl-view-btn {
      width:32px; height:32px; background:none;
      border:1px solid var(--border);
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; transition:border-color .3s;
      color:var(--muted);
    }
    .pl-view-btn.on { border-color:rgba(201,168,76,.5); color:var(--gold); }
    .pl-view-btn:hover { border-color:rgba(201,168,76,.3); color:var(--goldL); }

    /* grid icon */
    .ico-grid, .ico-list { width:14px; height:14px; position:relative; }
    .ico-grid::before  { content:''; position:absolute; inset:0; background:repeating-linear-gradient(90deg,currentColor 0,currentColor 5px,transparent 5px,transparent 9px), repeating-linear-gradient(0deg,currentColor 0,currentColor 5px,transparent 5px,transparent 9px); }
    .ico-list::before  { content:''; position:absolute; left:0; right:0; height:2px; top:3px; background:currentColor; box-shadow:0 4px 0 currentColor, 0 8px 0 currentColor; }

    /* ══════════════════════════════
       MAIN GRID AREA
    ══════════════════════════════ */
    .pl-body {
      max-width:1320px; margin:0 auto;
      padding:4rem 5rem 7rem;
      display:grid;
      grid-template-columns:220px 1fr;
      gap:3.5rem;
      align-items:start;
    }

    /* ── SIDEBAR ── */
    .pl-sidebar {
      position:sticky; top:calc(72px + 60px + 2rem);
      display:flex; flex-direction:column; gap:2rem;
    }

    .pl-sidebar-section { display:flex; flex-direction:column; gap:1rem; }

    .pl-sidebar-title {
      font-family:'Cinzel',serif; font-size:.58rem;
      letter-spacing:.28em; text-transform:uppercase;
      color:var(--gold); padding-bottom:.6rem;
      border-bottom:1px solid var(--border);
    }

    /* price range */
    .pl-price-range {
      display:flex; flex-direction:column; gap:.8rem;
    }
    .pl-range {
      -webkit-appearance:none; appearance:none;
      width:100%; height:1px; background:var(--border);
      outline:none; cursor:pointer;
    }
    .pl-range::-webkit-slider-thumb {
      -webkit-appearance:none; appearance:none;
      width:12px; height:12px; border-radius:50%;
      background:var(--gold); cursor:pointer;
      border:1px solid rgba(201,168,76,.6);
    }
    .pl-range::-moz-range-thumb {
      width:12px; height:12px; border-radius:50%;
      background:var(--gold); cursor:pointer; border:none;
    }
    .pl-price-labels {
      display:flex; justify-content:space-between;
      font-family:'Cinzel',serif; font-size:.52rem;
      letter-spacing:.15em; color:var(--muted);
    }

    /* checkboxes */
    .pl-check-list { display:flex; flex-direction:column; gap:.55rem; }

    .pl-check-item {
      display:flex; align-items:center; gap:.7rem;
      cursor:pointer; padding:.25rem 0;
    }
    .pl-check-box {
      width:14px; height:14px; flex-shrink:0;
      border:1px solid rgba(201,168,76,.3);
      position:relative; transition:border-color .3s;
    }
    .pl-check-box.checked { border-color:var(--gold); background:rgba(201,168,76,.08); }
    .pl-check-box.checked::after {
      content:''; position:absolute;
      top:2px; left:4px; width:4px; height:6px;
      border-right:1px solid var(--gold); border-bottom:1px solid var(--gold);
      transform:rotate(45deg);
    }
    .pl-check-label {
      font-family:'Cinzel',serif; font-size:.56rem;
      letter-spacing:.18em; text-transform:uppercase;
      color:var(--muted); transition:color .3s; flex:1;
    }
    .pl-check-item:hover .pl-check-label { color:var(--goldL); }
    .pl-check-item:hover .pl-check-box   { border-color:rgba(201,168,76,.6); }
    .pl-check-count {
      font-family:'Cinzel',serif; font-size:.48rem;
      color:rgba(201,168,76,.4); letter-spacing:.1em;
    }

    /* clear filters */
    .pl-clear-btn {
      font-family:'Cinzel',serif; font-size:.54rem;
      letter-spacing:.22em; text-transform:uppercase;
      color:var(--muted); background:none; border:none;
      cursor:pointer; text-align:left; padding:0;
      transition:color .3s; margin-top:.5rem;
    }
    .pl-clear-btn:hover { color:var(--gold); }

    /* ── PRODUCT GRID ── */
    .pl-grid {
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:1.5rem;
    }
    .pl-grid.list-view {
      grid-template-columns:1fr;
    }

    /* ────────────────────────────
       PRODUCT CARD
    ──────────────────────────── */
    .pl-card {
      position:relative; background:var(--dark2);
      border:1px solid var(--border);
      overflow:hidden; cursor:pointer;
      transition:border-color .45s, transform .45s, box-shadow .45s;
    }
    .pl-card:hover {
      border-color:rgba(201,168,76,.32);
      transform:translateY(-6px);
      box-shadow:0 24px 55px rgba(0,0,0,.55), 0 0 0 1px rgba(201,168,76,.06);
    }

    /* top gold line draw on hover */
    .pl-card::before {
      content:''; position:absolute; top:0; left:0;
      height:1px; width:0; background:var(--gold);
      transition:width .55s ease; z-index:2;
    }
    .pl-card:hover::before { width:100%; }

    /* ── image area ── */
    .pl-card-img {
      position:relative; overflow:hidden;
      aspect-ratio:3/4; background:var(--dark3);
    }

    .pl-card-img img {
      width:100%; height:100%; object-fit:cover; display:block;
      transition:transform .7s cubic-bezier(.25,.46,.45,.94), filter .7s;
      filter:brightness(.88) saturate(.85);
    }
    .pl-card:hover .pl-card-img img {
      transform:scale(1.07);
      filter:brightness(1) saturate(1);
    }

    /* shimmer sweep */
    .pl-card-img::after {
      content:''; position:absolute; inset:0;
      background:linear-gradient(115deg,transparent 30%,rgba(201,168,76,.1) 50%,transparent 70%);
      transform:translateX(-100%); transition:transform .7s ease;
      pointer-events:none; z-index:1;
    }
    .pl-card:hover .pl-card-img::after { transform:translateX(100%); }

    /* badge */
    .pl-badge {
      position:absolute; top:1rem; left:1rem; z-index:3;
      font-family:'Cinzel',serif; font-size:.46rem;
      letter-spacing:.22em; text-transform:uppercase;
      padding:.3rem .7rem;
    }
    .pl-badge--new     { background:var(--gold); color:var(--dark); }
    .pl-badge--rare    { border:1px solid rgba(201,168,76,.6); color:var(--gold); }
    .pl-badge--limited { border:1px solid rgba(245,240,232,.15); color:var(--muted); }
    .pl-badge--sold    { background:rgba(245,240,232,.08); color:var(--muted); border:1px solid var(--border); }

    /* wishlist btn — top right */
    .pl-wish {
      position:absolute; top:1rem; right:1rem; z-index:3;
      width:34px; height:34px; border-radius:50%;
      background:rgba(8,8,8,.6); border:1px solid rgba(245,240,232,.12);
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; color:var(--muted);
      transition:background .3s, border-color .3s, color .3s, transform .25s;
    }
    .pl-wish:hover, .pl-wish.active {
      background:rgba(201,168,76,.12);
      border-color:rgba(201,168,76,.5);
      color:var(--gold); transform:scale(1.1);
    }

    /* quick-add overlay */
    .pl-overlay {
      position:absolute; bottom:0; left:0; right:0;
      padding:1.1rem;
      background:linear-gradient(to top, rgba(8,8,8,.96), transparent);
      display:flex; gap:.5rem; z-index:3;
      transform:translateY(100%);
      transition:transform .42s cubic-bezier(.25,.46,.45,.94);
    }
    .pl-card:hover .pl-overlay { transform:translateY(0); }

    .pl-add-btn {
      flex:1; font-family:'Cinzel',serif; font-size:.54rem;
      letter-spacing:.22em; text-transform:uppercase;
      background:var(--gold); color:var(--dark); border:none;
      padding:.7rem 0; cursor:pointer; transition:background .3s;
    }
    .pl-add-btn:hover { background:var(--goldL); }

    .pl-quick-view {
      width:36px; background:rgba(245,240,232,.08);
      border:1px solid rgba(245,240,232,.12); color:var(--muted);
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; font-size:.75rem;
      transition:background .3s, border-color .3s, color .3s;
    }
    .pl-quick-view:hover {
      background:rgba(201,168,76,.1);
      border-color:rgba(201,168,76,.4); color:var(--gold);
    }

    /* ── card body ── */
    .pl-card-body {
      padding:1.4rem 1.25rem 1.6rem;
      position:relative;
    }

    /* gold line draws across top of body on hover */
    .pl-card-body::before {
      content:''; position:absolute; top:0; left:0;
      height:1px; width:0; background:rgba(201,168,76,.35);
      transition:width .55s ease .1s;
    }
    .pl-card:hover .pl-card-body::before { width:100%; }

    .pl-card-family {
      font-family:'Cinzel',serif; font-size:.5rem;
      letter-spacing:.28em; text-transform:uppercase;
      color:rgba(201,168,76,.55); margin-bottom:.5rem; display:block;
    }
    .pl-card-name {
      font-family:'Cormorant Garamond',serif;
      font-size:1.22rem; font-weight:300;
      letter-spacing:.03em; color:var(--cream);
      line-height:1.22; margin-bottom:.4rem;
      transition:color .3s;
    }
    .pl-card:hover .pl-card-name { color:var(--goldL); }

    .pl-card-notes {
      font-style:italic; font-size:.82rem;
      color:var(--muted); line-height:1.55;
      margin-bottom:1.1rem;
    }

    .pl-card-footer {
      display:flex; align-items:center; justify-content:space-between;
    }
    .pl-card-price {
      font-family:'Cinzel',serif; font-size:.88rem;
      font-weight:400; color:var(--gold); letter-spacing:.1em;
    }
    .pl-card-meta {
      display:flex; flex-direction:column; align-items:flex-end; gap:4px;
    }
    .pl-card-size {
      font-family:'Cinzel',serif; font-size:.48rem;
      letter-spacing:.18em; text-transform:uppercase; color:rgba(245,240,232,.25);
    }

    /* rating dots */
    .pl-dots { display:flex; gap:3px; }
    .pl-dot {
      width:5px; height:5px; border-radius:50%;
      background:rgba(201,168,76,.22);
    }
    .pl-dot.on { background:var(--gold); }

    /* ────────────────────────────
       LIST VIEW CARD
    ──────────────────────────── */
    .pl-grid.list-view .pl-card { display:grid; grid-template-columns:180px 1fr; }
    .pl-grid.list-view .pl-card-img { aspect-ratio:unset; min-height:180px; }
    .pl-grid.list-view .pl-card-body {
      display:flex; flex-direction:column;
      justify-content:center; padding:2rem;
    }
    .pl-grid.list-view .pl-card-name { font-size:1.5rem; }
    .pl-grid.list-view .pl-card-notes { font-size:.95rem; margin-bottom:1.5rem; }
    .pl-grid.list-view .pl-card-footer { justify-content:flex-start; gap:2rem; }
    .pl-grid.list-view .pl-overlay { display:none; }
    .pl-grid.list-view .pl-list-cta {
      display:flex; gap:.75rem; margin-top:1rem;
    }
    .pl-list-cta { display:none; }
    .pl-list-add {
      font-family:'Cinzel',serif; font-size:.55rem;
      letter-spacing:.25em; text-transform:uppercase;
      background:var(--gold); color:var(--dark); border:none;
      padding:.7rem 1.5rem; cursor:pointer; transition:background .3s;
    }
    .pl-list-add:hover { background:var(--goldL); }
    .pl-list-wish {
      font-family:'Cinzel',serif; font-size:.55rem;
      letter-spacing:.25em; text-transform:uppercase;
      background:none; color:var(--muted);
      border:1px solid var(--border);
      padding:.7rem 1.2rem; cursor:pointer; transition:border-color .3s, color .3s;
    }
    .pl-list-wish:hover { border-color:rgba(201,168,76,.4); color:var(--gold); }

    /* ── EMPTY STATE ── */
    .pl-empty {
      grid-column:1/-1; text-align:center;
      padding:6rem 2rem; display:flex; flex-direction:column;
      align-items:center; gap:1.5rem;
    }
    .pl-empty-icon { font-size:2rem; color:rgba(201,168,76,.3); }
    .pl-empty-title {
      font-family:'Cinzel',serif; font-size:1rem;
      letter-spacing:.15em; color:var(--muted);
    }
    .pl-empty-sub { font-style:italic; font-size:.9rem; color:rgba(245,240,232,.25); }

    /* ── LOAD MORE ── */
    .pl-load-more {
      grid-column:1/-1; display:flex;
      flex-direction:column; align-items:center; gap:1.5rem;
      padding-top:2.5rem; border-top:1px solid var(--border);
    }
    .pl-load-rule {
      display:flex; align-items:center; gap:1rem; width:180px;
    }
    .pl-load-rule::before, .pl-load-rule::after {
      content:''; flex:1; height:1px;
      background:linear-gradient(to right,transparent,rgba(201,168,76,.25),transparent);
    }
    .pl-load-rule span { font-size:.5rem; color:rgba(201,168,76,.4); }

    .pl-load-btn {
      position:relative; font-family:'Cinzel',serif;
      font-size:.62rem; letter-spacing:.35em; text-transform:uppercase;
      color:var(--cream); background:transparent;
      border:1px solid rgba(245,240,232,.18);
      padding:1rem 3rem; cursor:pointer; overflow:hidden;
      transition:color .4s, border-color .4s;
    }
    .pl-load-btn::before {
      content:''; position:absolute; inset:0;
      background:var(--gold); transform:scaleX(0);
      transform-origin:left; transition:transform .45s cubic-bezier(.25,.46,.45,.94);
      z-index:0;
    }
    .pl-load-btn:hover::before { transform:scaleX(1); }
    .pl-load-btn:hover { color:var(--dark); border-color:var(--gold); }
    .pl-load-btn span { position:relative; z-index:1; }

    .pl-load-info {
      font-family:'Cinzel',serif; font-size:.52rem;
      letter-spacing:.2em; text-transform:uppercase;
      color:rgba(245,240,232,.2);
    }

    /* ══════════════════════════════
       QUICK VIEW MODAL
    ══════════════════════════════ */
    .pl-modal-bg {
      position:fixed; inset:0; z-index:500;
      background:rgba(0,0,0,.85);
      backdrop-filter:blur(8px);
      display:flex; align-items:center; justify-content:center;
      padding:2rem;
      animation:fadeIn .3s ease;
    }

    .pl-modal {
      background:var(--dark2); border:1px solid rgba(201,168,76,.2);
      max-width:820px; width:100%;
      display:grid; grid-template-columns:1fr 1fr;
      position:relative; overflow:hidden;
      animation:fadeUp .4s ease;
      max-height:90svh; overflow-y:auto;
    }

    .pl-modal-close {
      position:absolute; top:1.2rem; right:1.2rem; z-index:10;
      width:32px; height:32px; background:none;
      border:1px solid var(--border); color:var(--muted);
      cursor:pointer; display:flex; align-items:center;
      justify-content:center; font-size:.9rem;
      transition:border-color .3s, color .3s;
    }
    .pl-modal-close:hover { border-color:rgba(201,168,76,.5); color:var(--gold); }

    .pl-modal-img {
      aspect-ratio:3/4; position:relative; background:var(--dark3);
    }
    .pl-modal-img img {
      width:100%; height:100%; object-fit:cover;
      filter:brightness(.9);
    }

    .pl-modal-info {
      padding:3rem 2.5rem;
      display:flex; flex-direction:column; gap:1.5rem;
    }

    .pl-modal-family {
      font-family:'Cinzel',serif; font-size:.52rem;
      letter-spacing:.3em; text-transform:uppercase; color:var(--gold);
    }
    .pl-modal-name {
      font-family:'Cormorant Garamond',serif;
      font-size:2rem; font-weight:300; color:var(--cream); line-height:1.2;
    }
    .pl-modal-price {
      font-family:'Cinzel',serif; font-size:1.1rem;
      font-weight:400; color:var(--gold); letter-spacing:.1em;
    }
    .pl-modal-divider { height:1px; background:var(--border); }
    .pl-modal-desc {
      font-style:italic; font-size:1rem; color:var(--muted); line-height:1.85;
    }
    .pl-modal-notes-label {
      font-family:'Cinzel',serif; font-size:.52rem;
      letter-spacing:.22em; text-transform:uppercase; color:var(--cream);
      margin-bottom:.5rem; display:block;
    }
    .pl-modal-notes {
      font-style:italic; font-size:.88rem; color:rgba(201,168,76,.7); line-height:1.7;
    }

    /* size selector */
    .pl-modal-sizes { display:flex; gap:.6rem; flex-wrap:wrap; }
    .pl-size-opt {
      font-family:'Cinzel',serif; font-size:.5rem; letter-spacing:.18em;
      text-transform:uppercase; background:none;
      border:1px solid var(--border); color:var(--muted);
      padding:.4rem .9rem; cursor:pointer;
      transition:border-color .3s, color .3s;
    }
    .pl-size-opt.on { border-color:var(--gold); color:var(--gold); background:rgba(201,168,76,.05); }
    .pl-size-opt:hover { border-color:rgba(201,168,76,.4); color:var(--goldL); }

    .pl-modal-actions { display:flex; flex-direction:column; gap:.7rem; }
    .pl-modal-add {
      font-family:'Cinzel',serif; font-size:.6rem; letter-spacing:.3em;
      text-transform:uppercase; background:var(--gold); color:var(--dark);
      border:none; padding:1rem; cursor:pointer; position:relative; overflow:hidden;
      transition:background .3s;
    }
    .pl-modal-add::after {
      content:''; position:absolute; inset:0;
      background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.22) 50%,transparent 70%);
      transform:translateX(-100%); transition:transform .6s;
    }
    .pl-modal-add:hover::after { transform:translateX(100%); }
    .pl-modal-add:hover { background:var(--goldL); }

    .pl-modal-wish-btn {
      font-family:'Cinzel',serif; font-size:.6rem; letter-spacing:.3em;
      text-transform:uppercase; background:none; color:var(--muted);
      border:1px solid var(--border); padding:1rem; cursor:pointer;
      transition:border-color .3s, color .3s;
    }
    .pl-modal-wish-btn:hover { border-color:rgba(201,168,76,.4); color:var(--gold); }

    /* ══════════════════════════════
       RESPONSIVE
    ══════════════════════════════ */
    @media (max-width:1100px) {
      .pl-body { padding:4rem 3rem 6rem; gap:2.5rem; }
      .pl-toolbar-inner { padding:0 3rem; }
      .pl-grid { grid-template-columns:repeat(2,1fr); }
    }
    @media (max-width:860px) {
      .pl-body {
        grid-template-columns:1fr;
        padding:3rem 2rem 5rem;
      }
      .pl-sidebar { position:static; }
      .pl-sidebar-static {
        display:grid; grid-template-columns:1fr 1fr;
        gap:1.5rem;
      }
      .pl-toolbar-inner { padding:0 2rem; }
      .pl-hero { padding-top:7.5rem; }
      .pl-modal { grid-template-columns:1fr; }
      .pl-modal-img { aspect-ratio:16/9; }
    }
    @media (max-width:640px) {
      .pl-grid { grid-template-columns:repeat(2,1fr); gap:1rem; }
      .pl-grid.list-view .pl-card { grid-template-columns:120px 1fr; }
      .pl-grid.list-view .pl-card-img { min-height:120px; }
      .pl-sidebar-static { grid-template-columns:1fr; }
    }
    @media (max-width:420px) {
      .pl-grid { grid-template-columns:1fr; }
    }
  `}</style>
);

/* ── Data ── */
const PRODUCTS = [
  { id:1,  family:'Floral · Oriental',  name:'Velours Noir',     notes:'Black rose, oud, amber & dark vanilla',          price:'₹18,500', size:'50ml', badge:'new',     badgeLabel:'New',     rating:5, img:'/images/perfume-removebg.png', desc:'A velvet darkness wrapped in black petals. Opens with the richest rose and settles into a smouldering oud and amber that lingers through the night.' },
  { id:2,  family:'Woody · Spiced',     name:'Santal Impérial',  notes:'Mysore sandalwood, cardamom & leather',          price:'₹22,000', size:'50ml', badge:'rare',    badgeLabel:'Rare',    rating:5, img:'/images/perfume-removebg.png', desc:'The finest Mysore sandalwood, warmed by green cardamom and finished with aged leather. A scent that feels more like a tailored suit than a perfume.' },
  { id:3,  family:'Aquatic · Fresh',    name:"Brume d'Aube",     notes:'Sea salt, iris, white cedar & musk',             price:'₹15,800', size:'50ml', badge:null,      badgeLabel:null,      rating:4, img:'/images/perfume-removebg.png', desc:'Morning mist over cold water. Sea salt and iris open with crystalline clarity; white cedar and musk bring quiet warmth to the drydown.' },
  { id:4,  family:'Gourmand · Warm',    name:'Or Épicé',         notes:'Saffron, tonka bean, honey & vetiver',           price:'₹26,500', size:'50ml', badge:'limited', badgeLabel:'Limited', rating:5, img:'/images/perfume-removebg.png', desc:'Liquid gold in a bottle. Saffron and honey open the composition, while tonka bean and vetiver ground it in something ancient and unforgettable.' },
  { id:5,  family:'Chypre · Mossy',     name:'Mousse de Soie',   notes:'Bergamot, labdanum, oakmoss & patchouli',        price:'₹19,200', size:'50ml', badge:null,      badgeLabel:null,      rating:4, img:'/images/perfume-removebg.png', desc:'A walk through a rain-drenched forest floor. Bergamot lights the top while labdanum and oakmoss create a rich, earthy foundation.' },
  { id:6,  family:'Floral · Powdery',   name:'Iris Céleste',     notes:'Orris root, violet, white musk & cashmere',      price:'₹21,000', size:'50ml', badge:'new',     badgeLabel:'New',     rating:5, img:'/images/perfume-removebg.png', desc:'Pure iris in its most celestial form. Orris root and violet are wrapped in the softest white musk and cashmere wood — cool, quiet, exquisite.' },
  { id:7,  family:'Oriental · Resinous','name':'Encens Royal',   notes:'Frankincense, myrrh, rose & amber',              price:'₹29,000', size:'50ml', badge:'rare',    badgeLabel:'Rare',    rating:5, img:'/images/perfume-removebg.png', desc:'Sacred incense from ancient trade routes. Frankincense and myrrh open with cathedral resonance; rose and amber soften into reverent warmth.' },
  { id:8,  family:'Fougère · Aromatic', name:'Vétiver Argent',   notes:'Silver vetiver, lavender, tobacco & cedar',      price:'₹17,500', size:'50ml', badge:null,      badgeLabel:null,      rating:4, img:'/images/perfume-removebg.png', desc:'Silver vetiver cut with lavender and a whisper of tobacco. A deeply masculine composition that wears like a second skin.' },
];

const CATEGORIES = ['All', 'Floral', 'Woody', 'Aquatic', 'Gourmand', 'Chypre', 'Oriental', 'Fougère'];
const SORT_OPTS   = [
  { val:'featured',  label:'Featured'         },
  { val:'price-asc', label:'Price: Low → High' },
  { val:'price-desc',label:'Price: High → Low' },
  { val:'newest',    label:'Newest First'      },
  { val:'rating',    label:'Top Rated'         },
];
const SIZES_FILTER  = ['30ml','50ml','100ml'];
const NOTES_FILTER  = ['Floral','Woody','Oriental','Fresh','Gourmand','Chypre'];

/* ── helpers ── */
function RatingDots({ rating }) {
  return (
    <div className="pl-dots">
      {Array.from({length:5}).map((_,i) => (
        <span key={i} className={`pl-dot${i < rating ? ' on' : ''}`} />
      ))}
    </div>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.r');
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── Component ── */
export default function ProductListing() {
  const [cat,        setCat]        = useState('All');
  const [sort,       setSort]       = useState('featured');
  const [view,       setView]       = useState('grid');    // 'grid' | 'list'
  const [wishlist,   setWishlist]   = useState([]);
  const [checkedSizes, setCheckedSizes] = useState([]);
  const [checkedNotes, setCheckedNotes] = useState([]);
  const [maxPrice,   setMaxPrice]   = useState(30000);
  const [quickView,  setQuickView]  = useState(null);      // product or null
  const [modalSize,  setModalSize]  = useState('50ml');
  const [visible,    setVisible]    = useState(8);

  useReveal();

  /* close modal on Escape */
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setQuickView(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* filter + sort */
  const filtered = PRODUCTS
    .filter(p => cat === 'All' || p.family.split(' · ').some(f => f === cat))
    .filter(p => {
      const priceNum = parseInt(p.price.replace(/[^\d]/g,''));
      return priceNum <= maxPrice;
    })
    .filter(p => checkedNotes.length === 0 || checkedNotes.some(n => p.family.toLowerCase().includes(n.toLowerCase())))
    .sort((a,b) => {
      const aP = parseInt(a.price.replace(/[^\d]/g,'')), bP = parseInt(b.price.replace(/[^\d]/g,''));
      if (sort === 'price-asc')  return aP - bP;
      if (sort === 'price-desc') return bP - aP;
      if (sort === 'rating')     return b.rating - a.rating;
      if (sort === 'newest')     return b.id - a.id;
      return 0;
    });

  const shown = filtered.slice(0, visible);

  const toggleWish = (id, e) => {
    e.stopPropagation();
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  };
  const toggleSize  = s => setCheckedSizes(p => p.includes(s) ? p.filter(x=>x!==s) : [...p, s]);
  const toggleNote  = n => setCheckedNotes(p => p.includes(n) ? p.filter(x=>x!==n) : [...p, n]);
  const clearFilters = () => { setCat('All'); setCheckedSizes([]); setCheckedNotes([]); setMaxPrice(30000); };

  return (
    <div className="pl-page">
      <Styles />
      <div className="pl-content">

        {/* ════ HERO ════ */}
        <div className="pl-hero">
          <div className="pl-hero-glow" />
          <div className="pl-hero-inner">
            <div className="pl-hero-eyebrow">
              <span/> The Collection <span/>
            </div>
            <h1 className="pl-hero-heading">
              SIGNATURE
              <em>Fragrances</em>
            </h1>
            <p className="pl-hero-sub">
              Each scent a chapter. Each bottle a world. Discover the compositions
              that have defined Aurum for thirty-seven years.
            </p>
            <p className="pl-result-count">{filtered.length} Fragrances</p>
          </div>
          <div className="pl-hero-orn"><span>◆</span></div>
        </div>

        {/* ════ TOOLBAR ════ */}
        <div className="pl-toolbar">
          <div className="pl-toolbar-inner">
            {/* category pills */}
            <div className="pl-cats">
              {CATEGORIES.map(c => (
                <button key={c} className={`pl-cat${cat===c?' on':''}`} onClick={() => setCat(c)}>
                  {c}
                </button>
              ))}
            </div>

            {/* controls */}
            <div className="pl-controls">
              <select
                className="pl-sort" value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {SORT_OPTS.map(o => (
                  <option key={o.val} value={o.val}>{o.label}</option>
                ))}
              </select>

              <div className="pl-view-toggle">
                <button className={`pl-view-btn${view==='grid'?' on':''}`} onClick={() => setView('grid')} aria-label="Grid view">
                  <span className="ico-grid" />
                </button>
                <button className={`pl-view-btn${view==='list'?' on':''}`} onClick={() => setView('list')} aria-label="List view">
                  <span className="ico-list" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ════ BODY ════ */}
        <div className="pl-body">

          {/* ── SIDEBAR ── */}
          <aside className="pl-sidebar">
            <div className="pl-sidebar-static">

              {/* Price range */}
              <div className="pl-sidebar-section">
                <div className="pl-sidebar-title">Price Range</div>
                <div className="pl-price-range">
                  <input type="range" className="pl-range"
                    min={10000} max={30000} step={500}
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                  />
                  <div className="pl-price-labels">
                    <span>₹10,000</span>
                    <span>Up to ₹{maxPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Fragrance Notes */}
              <div className="pl-sidebar-section">
                <div className="pl-sidebar-title">Fragrance Family</div>
                <div className="pl-check-list">
                  {NOTES_FILTER.map(n => {
                    const cnt = PRODUCTS.filter(p => p.family.toLowerCase().includes(n.toLowerCase())).length;
                    return (
                      <div key={n} className="pl-check-item" onClick={() => toggleNote(n)}>
                        <div className={`pl-check-box${checkedNotes.includes(n)?' checked':''}`} />
                        <span className="pl-check-label">{n}</span>
                        <span className="pl-check-count">{cnt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Size */}
              <div className="pl-sidebar-section">
                <div className="pl-sidebar-title">Size</div>
                <div className="pl-check-list">
                  {SIZES_FILTER.map(s => (
                    <div key={s} className="pl-check-item" onClick={() => toggleSize(s)}>
                      <div className={`pl-check-box${checkedSizes.includes(s)?' checked':''}`} />
                      <span className="pl-check-label">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {(checkedSizes.length > 0 || checkedNotes.length > 0 || maxPrice < 30000 || cat !== 'All') && (
                <button className="pl-clear-btn" onClick={clearFilters}>
                  ✕ Clear all filters
                </button>
              )}

            </div>
          </aside>

          {/* ── PRODUCT GRID ── */}
          <div className={`pl-grid${view==='list'?' list-view':''}`}>

            {shown.length === 0 ? (
              <div className="pl-empty">
                <div className="pl-empty-icon">◈</div>
                <p className="pl-empty-title">No fragrances match your selection</p>
                <p className="pl-empty-sub">Try adjusting the filters above</p>
                <button className="pl-clear-btn" onClick={clearFilters} style={{color:'var(--gold)'}}>
                  Clear all filters →
                </button>
              </div>
            ) : (
              shown.map((p, i) => (
                <article
                  key={p.id}
                  className={`r t${(i%8)+1} pl-card`}
                  onClick={() => { setQuickView(p); setModalSize('50ml'); }}
                >
                  {/* image */}
                  <div className="pl-card-img">
                    {p.badge && (
                      <span className={`pl-badge pl-badge--${p.badge}`}>{p.badgeLabel}</span>
                    )}
                    <button
                      className={`pl-wish${wishlist.includes(p.id)?' active':''}`}
                      onClick={e => toggleWish(p.id, e)}
                      aria-label="Add to wishlist"
                    >
                      <HeartIcon filled={wishlist.includes(p.id)} />
                    </button>
                    <Image
                      src={p.img} alt={p.name}
                      fill style={{objectFit:'cover'}}
                    />
                    <div className="pl-overlay">
                      <button className="pl-add-btn" onClick={e => { e.stopPropagation(); }}>
                        Add to Cart
                      </button>
                      <button className="pl-quick-view" aria-label="Quick view">⤢</button>
                    </div>
                  </div>

                  {/* body */}
                  <div className="pl-card-body">
                    <span className="pl-card-family">{p.family}</span>
                    <div className="pl-card-name">{p.name}</div>
                    <div className="pl-card-notes">{p.notes}</div>
                    <div className="pl-card-footer">
                      <span className="pl-card-price">{p.price}</span>
                      <div className="pl-card-meta">
                        <RatingDots rating={p.rating} />
                        <span className="pl-card-size">{p.size}</span>
                      </div>
                    </div>

                    <div className="pl-list-cta">
                      <button className="pl-list-add" onClick={e => e.stopPropagation()}>Add to Cart</button>
                      <button className="pl-list-wish" onClick={e => toggleWish(p.id, e)}>
                        {wishlist.includes(p.id) ? '♥ Saved' : '♡ Wishlist'}
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}

            {shown.length > 0 && visible < filtered.length && (
              <div className="pl-load-more">
                <div className="pl-load-rule"><span>◆</span></div>
                <button className="pl-load-btn" onClick={() => setVisible(v => v + 4)}>
                  <span>Discover More →</span>
                </button>
                <p className="pl-load-info">
                  Showing {shown.length} of {filtered.length} fragrances
                </p>
              </div>
            )}

          </div>
        </div>

        {/* ════ QUICK-VIEW MODAL ════ */}
        {quickView && (
          <div className="pl-modal-bg" onClick={() => setQuickView(null)}>
            <div className="pl-modal" onClick={e => e.stopPropagation()}>
              <button className="pl-modal-close" onClick={() => setQuickView(null)}>✕</button>

              {/* image */}
              <div className="pl-modal-img">
                <Image src={quickView.img} alt={quickView.name} fill style={{objectFit:'cover'}} />
              </div>

              <div className="pl-modal-info">
                <div>
                  <span className="pl-modal-family">{quickView.family}</span>
                  <h2 className="pl-modal-name">{quickView.name}</h2>
                  <div className="pl-modal-price">{quickView.price}</div>
                </div>

                <div className="pl-modal-divider" />

                <p className="pl-modal-desc">{quickView.desc}</p>

                <div>
                  <span className="pl-modal-notes-label">Scent Notes</span>
                  <p className="pl-modal-notes">{quickView.notes}</p>
                </div>

                <div>
                  <span className="pl-modal-notes-label">Choose Size</span>
                  <div className="pl-modal-sizes">
                    {['30ml','50ml','100ml'].map(s => (
                      <button key={s}
                        className={`pl-size-opt${modalSize===s?' on':''}`}
                        onClick={() => setModalSize(s)}
                      >{s}</button>
                    ))}
                  </div>
                </div>

                <div className="pl-modal-actions">
                  <button className="pl-modal-add">Add to Cart — {quickView.price}</button>
                  <button className="pl-modal-wish-btn"
                    onClick={() => setWishlist(w => w.includes(quickView.id) ? w.filter(x=>x!==quickView.id) : [...w, quickView.id])}
                  >
                    {wishlist.includes(quickView.id) ? '♥ Saved to Wishlist' : '♡ Add to Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}