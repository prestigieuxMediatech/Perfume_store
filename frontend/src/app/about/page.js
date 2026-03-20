'use client';
import { useEffect } from 'react';
import Image from 'next/image';

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
      --goldB:  rgba(201,168,76,0.18);
    }

    @keyframes fadeUp  { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes drawH   { from{width:0;opacity:0} to{width:36px;opacity:1} }
    @keyframes pulse   { 0%,100%{opacity:.22;transform:scale(1)} 50%{opacity:.45;transform:scale(1.12)} }
    @keyframes shimmer { 0%,100%{opacity:.15} 50%{opacity:.5} }

    .r { opacity:0; transform:translateY(28px); transition:opacity .8s ease, transform .8s ease; }
    .r.on { opacity:1; transform:translateY(0); }
    .r.t1{transition-delay:.08s} .r.t2{transition-delay:.18s}
    .r.t3{transition-delay:.28s} .r.t4{transition-delay:.38s}
    .r.t5{transition-delay:.48s}

    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    .about-page {
      background:var(--dark);
      color:var(--cream);
      font-family:'Cormorant Garamond',serif;
      overflow-x:hidden;
      position:relative;
    }
    .about-page::before {
      content:'';
      position:fixed; inset:0; z-index:999; pointer-events:none;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.035'/%3E%3C/svg%3E");
      opacity:.55;
    }

    .wrap { max-width:1280px; margin:0 auto; padding:0 5rem; }

    .eyebrow {
      display:inline-flex; align-items:center; gap:.9rem;
      font-family:'Cinzel',serif; font-size:.6rem;
      letter-spacing:.38em; text-transform:uppercase; color:var(--gold);
    }
    .eyebrow-line { display:block; width:36px; height:1px; background:var(--gold); flex-shrink:0; }

    .section-title {
      font-family:'Cinzel',serif; font-weight:300;
      line-height:1.18; letter-spacing:.06em; color:var(--cream);
    }
    .section-title em {
      font-family:'Cormorant Garamond',serif;
      font-style:italic; font-weight:300; color:var(--goldL);
    }
    .gold-line { width:48px; height:1px; background:linear-gradient(90deg,var(--gold),transparent); }

    /* ═══ HERO ═══ */
    .ah-hero {
      display:grid; grid-template-columns:1fr 1fr;
      min-height:100svh; align-items:center;
     position:relative; overflow:hidden;
    }
    .ah-hero::before {
      content:''; position:absolute; inset:0; pointer-events:none;
      background:repeating-linear-gradient(-52deg,transparent,transparent 110px,rgba(201,168,76,.016) 110px,rgba(201,168,76,.016) 111px);
    }

    .ah-hero-text {
      padding:7rem 4rem 7rem 0;
      display:flex; flex-direction:column; gap:2rem;
      position:relative; z-index:1;
    }
    .ah-eyebrow-anim { animation:fadeUp .9s ease both .1s; }

    .ah-hero-heading {
      font-family:'Cinzel',serif; font-weight:300;
      font-size:clamp(3rem,6vw,6.5rem);
      letter-spacing:.08em; line-height:1.06; color:var(--cream);
      animation:fadeUp .9s ease both .25s;
    }
    .ah-hero-heading em {
      font-family:'Cormorant Garamond',serif;
      font-style:italic; font-weight:300; color:var(--goldL);
      display:block; font-size:.78em; letter-spacing:.04em; margin-top:.08em;
    }

    .ah-hero-quote {
      font-style:italic; font-size:1.1rem; line-height:1.85;
      color:var(--muted); max-width:400px;
      border-left:1px solid var(--goldB); padding-left:1.4rem;
      animation:fadeUp .9s ease both .45s;
    }

    .ah-hero-meta {
      display:flex; gap:2.5rem;
      padding-top:1.8rem; border-top:1px solid var(--border);
      animation:fadeUp .9s ease both .6s;
    }
    .ah-hero-meta-num {
      font-family:'Cormorant Garamond',serif;
      font-size:2.2rem; font-weight:300; color:var(--gold);
      line-height:1; display:block;
    }
    .ah-hero-meta-lbl {
      font-family:'Cinzel',serif; font-size:.52rem;
      letter-spacing:.2em; text-transform:uppercase;
      color:var(--muted); margin-top:.3rem; display:block;
    }

    /* right image fills column */
    .ah-hero-img-col {
      position:relative; height:100%; min-height:100svh;
      display:flex; align-items:stretch;
    }
    .ah-hero-img {
      width:100%; height:100%; min-height:100svh;
      object-fit:cover; display:block;
      filter:brightness(.72) saturate(.75);
      animation:fadeIn 1.2s ease both .2s;
    }
    /* left fade — blends text col into image */
    .ah-hero-img-col::before {
      content:''; position:absolute; inset:0;
      background:linear-gradient(90deg,var(--dark) 0%,transparent 52%);
      z-index:1; pointer-events:none;
    }
    .ah-hero-img-col::after {
      content:''; position:absolute; bottom:0; left:0; right:0;
      height:200px;
      background:linear-gradient(to top,var(--dark),transparent);
      z-index:1; pointer-events:none;
    }
    .ah-hero-img-tag {
      position:absolute; bottom:3rem; right:2rem; z-index:2;
      font-family:'Cinzel',serif; font-size:.5rem;
      letter-spacing:.4em; text-transform:uppercase; color:rgba(201,168,76,.5);
      writing-mode:vertical-rl; animation:fadeIn 1.4s ease both .8s;
    }

    .ah-scroll {
      position:absolute; bottom:2.5rem; left:5rem; z-index:2;
      display:flex; align-items:center; gap:1rem;
      font-family:'Cinzel',serif; font-size:.5rem;
      letter-spacing:.35em; text-transform:uppercase;
      color:rgba(201,168,76,.35); animation:fadeIn 1.2s ease both 1.2s;
    }
    .ah-scroll::after {
      content:''; display:block; width:40px; height:1px;
      background:linear-gradient(90deg,rgba(201,168,76,.35),transparent);
    }

    /* ═══ STATS BAND ═══ */
    .ah-stats { border-top:1px solid var(--border); border-bottom:1px solid var(--border); position:relative; }
    .ah-stats::before {
      content:''; position:absolute; inset:0;
      background:linear-gradient(90deg,transparent,rgba(201,168,76,.025) 50%,transparent);
      pointer-events:none;
    }
    .ah-stats-inner { display:grid; grid-template-columns:repeat(4,1fr); }
    .ah-stat {
      padding:3.5rem 0; text-align:center;
      border-right:1px solid var(--border); position:relative; overflow:hidden;
    }
    .ah-stat:last-child { border-right:none; }
    .ah-stat::after {
      content:''; position:absolute; top:0; left:50%;
      transform:translateX(-50%); width:0; height:2px;
      background:var(--gold); transition:width .5s;
    }
    .ah-stat:hover::after { width:55%; }
    .ah-stat-n {
      font-family:'Cormorant Garamond',serif;
      font-size:clamp(2.2rem,3.5vw,3.4rem); font-weight:300;
      color:var(--gold); line-height:1; display:block;
    }
    .ah-stat-l {
      font-family:'Cinzel',serif; font-size:.52rem;
      letter-spacing:.22em; text-transform:uppercase;
      color:var(--muted); display:block; margin-top:.55rem;
    }

    /* ═══ STORY ═══ */
    .ah-story { padding:9rem 0; }
    .ah-story-inner {
      display:grid; grid-template-columns:1fr 1fr;
      gap:6rem; align-items:center;
    }
    .ah-story-text { display:flex; flex-direction:column; gap:1.8rem; }
    .ah-story-heading { font-size:clamp(1.7rem,2.8vw,2.6rem); }

    .ah-story-body {
      font-size:1.05rem; font-weight:300; line-height:1.95;
      color:rgba(245,240,232,.58);
    }
    .ah-story-body strong { font-weight:400; color:rgba(245,240,232,.85); }

    .ah-pillars {
      display:grid; grid-template-columns:repeat(3,1fr);
      gap:.9rem; padding-top:2rem; border-top:1px solid var(--border);
    }
    .ah-pillar {
      padding:1.2rem 1rem; border:1px solid var(--border);
      position:relative; overflow:hidden;
      transition:border-color .4s, transform .35s;
    }
    .ah-pillar::before {
      content:''; position:absolute; top:0; left:0;
      height:1px; width:0; background:var(--gold); transition:width .5s;
    }
    .ah-pillar:hover { border-color:rgba(201,168,76,.3); transform:translateY(-4px); }
    .ah-pillar:hover::before { width:100%; }
    .ah-pillar-i { font-size:.95rem; color:var(--gold); margin-bottom:.55rem; }
    .ah-pillar-t {
      font-family:'Cinzel',serif; font-size:.58rem;
      letter-spacing:.2em; text-transform:uppercase;
      color:var(--cream); display:block; margin-bottom:.3rem;
    }
    .ah-pillar-d { font-size:.82rem; color:var(--muted); line-height:1.55; }

    .ah-story-img-wrap { position:relative; }
    .ah-story-frame {
      position:absolute; top:20px; right:-20px; bottom:-20px; left:20px;
      border:1px solid rgba(201,168,76,.14);
      animation:shimmer 4s ease-in-out infinite; pointer-events:none;
    }
    .ah-story-img {
      position:relative; z-index:1; width:100%; aspect-ratio:3/4;
      object-fit:cover; display:block;
      filter:grayscale(12%) brightness(.85); transition:filter .65s;
    }
    .ah-story-img-wrap:hover .ah-story-img { filter:grayscale(0%) brightness(1); }
    .ah-story-caption {
      position:absolute; bottom:0; left:0; right:0; z-index:2;
      padding:2.5rem 1.5rem 1.25rem;
      background:linear-gradient(to top,rgba(8,8,8,.92),transparent);
      font-family:'Cinzel',serif; font-size:.5rem;
      letter-spacing:.35em; text-transform:uppercase; color:rgba(201,168,76,.55);
    }
    .ah-story-vline {
      position:absolute; left:-22px; top:8%;
      width:1px; height:80px;
      background:linear-gradient(to bottom,transparent,var(--gold),transparent);
      z-index:1;
    }

    /* ═══ PHILOSOPHY BAND ═══ */
    .ah-phil {
      background:var(--dark2);
      border-top:1px solid var(--border); border-bottom:1px solid var(--border);
      padding:7rem 0; position:relative; overflow:hidden;
    }
    .ah-phil::before {
      content:''; position:absolute; inset:0;
      background:repeating-linear-gradient(-52deg,transparent,transparent 110px,rgba(201,168,76,.013) 110px,rgba(201,168,76,.013) 111px);
      pointer-events:none;
    }
    .ah-phil-inner {
      display:grid; grid-template-columns:1fr 2fr;
      gap:6rem; align-items:start;
    }
    .ah-phil-left { display:flex; flex-direction:column; gap:1.5rem; }
    .ah-phil-heading { font-size:clamp(1.7rem,2.8vw,2.5rem); }
    .ah-phil-sub {
      font-style:italic; font-size:1rem;
      color:var(--muted); line-height:1.85; max-width:300px;
    }
    .ah-phil-quote {
      position:relative;
      padding:2.5rem 2.5rem 2.5rem 3.5rem;
      border:1px solid var(--border);
      background:rgba(201,168,76,.02);
    }
    .ah-phil-quote::before {
      content:'"'; position:absolute; top:-1.2rem; left:1.8rem;
      font-family:'Cormorant Garamond',serif;
      font-size:5rem; color:rgba(201,168,76,.28);
      line-height:1; font-style:italic;
    }
    .ah-phil-quote-text {
      font-style:italic; font-size:1.12rem;
      line-height:1.88; color:rgba(245,240,232,.72);
    }
    .ah-phil-cite {
      display:block; margin-top:1.25rem;
      font-family:'Cinzel',serif; font-size:.55rem;
      letter-spacing:.28em; text-transform:uppercase;
      color:var(--gold); font-style:normal;
    }

    /* ═══ TIMELINE ═══ */
    .ah-tl { padding:9rem 0; }
    .ah-tl-header { text-align:center; margin-bottom:6rem; }
    .ah-tl-eyebrow {
      display:inline-flex; align-items:center; gap:.9rem;
      font-family:'Cinzel',serif; font-size:.6rem;
      letter-spacing:.38em; text-transform:uppercase; color:var(--gold);
    }
    .ah-tl-heading { font-size:clamp(1.7rem,2.8vw,2.6rem); margin-top:1rem; }

    .ah-tl-track {
      position:relative; max-width:860px; margin:0 auto;
    }
    .ah-tl-track::before {
      content:''; position:absolute;
      left:50%; top:0; bottom:0; width:1px;
      background:linear-gradient(to bottom,transparent,rgba(201,168,76,.22) 8%,rgba(201,168,76,.22) 92%,transparent);
      transform:translateX(-50%);
    }
    .ah-tl-item {
      display:grid; grid-template-columns:1fr 56px 1fr;
      align-items:start; margin-bottom:4.5rem;
    }
    .ah-tl-item:last-child { margin-bottom:0; }
    .ah-tl-a { text-align:right; padding-right:2rem; }
    .ah-tl-b { text-align:left;  padding-left:2rem; }

    .ah-tl-item:nth-child(odd)  .ah-tl-a { order:1; }
    .ah-tl-item:nth-child(odd)  .ah-tl-c { order:2; }
    .ah-tl-item:nth-child(odd)  .ah-tl-b { order:3; }
    .ah-tl-item:nth-child(even) .ah-tl-a { order:3; text-align:left;  padding-left:2rem; padding-right:0; }
    .ah-tl-item:nth-child(even) .ah-tl-c { order:2; }
    .ah-tl-item:nth-child(even) .ah-tl-b { order:1; text-align:right; padding-right:2rem; padding-left:0; }

    .ah-tl-year {
      font-family:'Cinzel',serif; font-size:2rem; font-weight:300;
      color:var(--gold); display:block; line-height:1;
    }
    .ah-tl-title {
      font-family:'Cinzel',serif; font-size:.58rem;
      letter-spacing:.22em; text-transform:uppercase;
      color:var(--cream); display:block; margin-top:.4rem;
    }
    .ah-tl-desc {
      font-style:italic; font-size:.95rem;
      color:var(--muted); line-height:1.72;
    }
    .ah-tl-c { display:flex; align-items:flex-start; justify-content:center; padding-top:.38rem; z-index:1; }
    .ah-tl-dot {
      width:13px; height:13px; border-radius:50%;
      border:1px solid var(--gold); background:var(--dark);
      position:relative; transition:background .3s; flex-shrink:0;
    }
    .ah-tl-dot::after {
      content:''; position:absolute; inset:3px;
      border-radius:50%; background:var(--gold);
      transform:scale(0); transition:transform .3s;
    }
    .ah-tl-item:hover .ah-tl-dot::after { transform:scale(1); }

    /* ═══ TEAM ═══ */
    .ah-team {
      background:var(--dark3);
      border-top:1px solid var(--border); border-bottom:1px solid var(--border);
      padding:9rem 0;
    }
    .ah-team-header { text-align:center; margin-bottom:5rem; }
    .ah-team-heading { font-size:clamp(1.7rem,2.8vw,2.6rem); margin-top:1rem; }
    .ah-team-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }

    .ah-team-card {
      position:relative; background:var(--dark2);
      border:1px solid var(--border);
      padding:3rem 2rem 2.5rem; text-align:center;
      overflow:hidden; transition:border-color .4s, transform .4s, box-shadow .4s;
    }
    .ah-team-card::before {
      content:''; position:absolute; top:0; left:0;
      width:100%; height:1px; background:var(--gold);
      transform:scaleX(0); transform-origin:left; transition:transform .5s;
    }
    .ah-team-card::after {
      content:''; position:absolute; inset:0;
      background:radial-gradient(ellipse at 50% 0%,rgba(201,168,76,.06),transparent 65%);
      opacity:0; transition:opacity .4s;
    }
    .ah-team-card:hover { border-color:rgba(201,168,76,.28); transform:translateY(-8px); box-shadow:0 30px 60px rgba(0,0,0,.5); }
    .ah-team-card:hover::before { transform:scaleX(1); }
    .ah-team-card:hover::after  { opacity:1; }
    .ah-team-icon {
      width:76px; height:76px; border-radius:50%;
      border:1px solid rgba(201,168,76,.25);
      background:rgba(201,168,76,.05);
      display:flex; align-items:center; justify-content:center;
      font-size:1.6rem; margin:0 auto 1.5rem;
      position:relative; z-index:1; transition:border-color .4s;
    }
    .ah-team-card:hover .ah-team-icon { border-color:rgba(201,168,76,.65); }
    .ah-team-name {
      font-family:'Cinzel',serif; font-size:.82rem;
      letter-spacing:.18em; text-transform:uppercase;
      color:var(--cream); display:block; position:relative; z-index:1;
    }
    .ah-team-role {
      font-family:'Cinzel',serif; font-size:.52rem;
      letter-spacing:.22em; text-transform:uppercase;
      color:var(--gold); display:block; margin-top:.4rem;
      position:relative; z-index:1;
    }
    .ah-team-spec {
      font-style:italic; font-size:.88rem;
      color:var(--muted); display:block; margin-top:.55rem;
      line-height:1.5; position:relative; z-index:1;
    }

    /* ═══ CTA ═══ */
    .ah-cta { padding:9rem 0; text-align:center; position:relative; overflow:hidden; }
    .ah-cta-glow {
      position:absolute; inset:0;
      background:radial-gradient(ellipse at center,rgba(201,168,76,.07),transparent 65%);
      animation:pulse 5s ease-in-out infinite; pointer-events:none;
    }
    .ah-cta-c { position:absolute; width:28px; height:28px; border-color:rgba(201,168,76,.25); border-style:solid; }
    .ah-cta-c--tl { top:2.5rem;    left:2.5rem;  border-width:1px 0 0 1px; }
    .ah-cta-c--tr { top:2.5rem;    right:2.5rem; border-width:1px 1px 0 0; }
    .ah-cta-c--bl { bottom:2.5rem; left:2.5rem;  border-width:0 0 1px 1px; }
    .ah-cta-c--br { bottom:2.5rem; right:2.5rem; border-width:0 1px 1px 0; }
    .ah-cta-inner {
      position:relative; z-index:1;
      display:flex; flex-direction:column; align-items:center; gap:1.8rem;
    }
    .ah-cta-heading {
      font-family:'Cinzel',serif; font-weight:300;
      font-size:clamp(2.2rem,4.5vw,4.8rem);
      letter-spacing:.08em; line-height:1.12;
    }
    .ah-cta-heading em {
      font-family:'Cormorant Garamond',serif;
      font-style:italic; color:var(--goldL); display:block;
    }
    .ah-cta-desc {
      font-style:italic; font-size:1.08rem; color:var(--muted);
      max-width:400px; line-height:1.82;
    }
    .ah-cta-rule {
      display:flex; align-items:center; gap:1rem; width:220px;
    }
    .ah-cta-rule::before, .ah-cta-rule::after {
      content:''; flex:1; height:1px;
      background:linear-gradient(to right,transparent,rgba(201,168,76,.28),transparent);
    }
    .ah-cta-rule span { font-size:.5rem; color:rgba(201,168,76,.45); }
    .ah-cta-btn {
      position:relative; font-family:'Cinzel',serif;
      font-size:.65rem; letter-spacing:.35em; text-transform:uppercase;
      color:var(--dark); background:var(--gold); border:none;
      padding:1.05rem 3.2rem; cursor:pointer; overflow:hidden; transition:background .35s;
    }
    .ah-cta-btn::after {
      content:''; position:absolute; inset:0;
      background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.22) 50%,transparent 70%);
      transform:translateX(-100%); transition:transform .6s;
    }
    .ah-cta-btn:hover::after { transform:translateX(100%); }
    .ah-cta-btn:hover { background:var(--goldL); }

    /* ═══ RESPONSIVE ═══ */
    @media (max-width:1100px) {
      .wrap { padding:0 3rem; }
      .ah-hero-text { padding:7rem 3rem 7rem 0; }
      .ah-story-inner { gap:4rem; }
      .ah-phil-inner  { gap:4rem; }
    }
    @media (max-width:860px) {
      .wrap { padding:0 2rem; }

      .ah-hero { grid-template-columns:1fr; min-height:auto; padding-top:5.5rem; }
      .ah-hero-text { padding:3.5rem 0 3rem; gap:1.6rem; order:2; }
      .ah-hero-img-col { min-height:60vw; max-height:500px; order:1; }
      .ah-hero-img { min-height:60vw; max-height:500px; }
      .ah-hero-img-col::before { background:linear-gradient(to top,var(--dark) 0%,transparent 50%); }
      .ah-scroll { display:none; }

      .ah-stats-inner { grid-template-columns:repeat(2,1fr); }
      .ah-stat:nth-child(1), .ah-stat:nth-child(2) { border-bottom:1px solid var(--border); }
      .ah-stat:nth-child(2) { border-right:none; }

      .ah-story-inner { grid-template-columns:1fr; gap:3.5rem; }
      .ah-story-img-wrap { max-width:480px; margin:0 auto; }
      .ah-story-vline { display:none; }

      .ah-phil-inner { grid-template-columns:1fr; gap:3rem; }
      .ah-phil-sub   { max-width:100%; }

      .ah-tl-track::before { left:22px; }
      .ah-tl-item { grid-template-columns:44px 1fr; }
      .ah-tl-item:nth-child(odd)  .ah-tl-a,
      .ah-tl-item:nth-child(even) .ah-tl-a { display:none; }
      .ah-tl-item:nth-child(odd)  .ah-tl-c,
      .ah-tl-item:nth-child(even) .ah-tl-c { order:1; }
      .ah-tl-item:nth-child(odd)  .ah-tl-b,
      .ah-tl-item:nth-child(even) .ah-tl-b { order:2; text-align:left; padding-left:1.5rem; padding-right:0; }

      .ah-team-grid { grid-template-columns:1fr; max-width:420px; margin:0 auto; }
      .ah-pillars   { grid-template-columns:1fr; }

      .ah-story { padding:6rem 0; }
      .ah-phil  { padding:5.5rem 0; }
      .ah-tl    { padding:6rem 0; }
      .ah-team  { padding:6rem 0; }
      .ah-cta   { padding:6rem 0; }
    }
    @media (max-width:520px) {
      .wrap { padding:0 1.25rem; }
      .ah-hero-meta { gap:1.4rem; flex-wrap:wrap; }
      .ah-stats-inner { grid-template-columns:1fr; }
      .ah-stat { border-right:none !important; border-bottom:1px solid var(--border) !important; }
      .ah-stat:last-child { border-bottom:none !important; }
    }
  `}</style>
);

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.r');
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const STATS    = [
  { n:'37',   l:'Years of Excellence' },
  { n:'4',    l:'Signature Families'  },
  { n:'150+', l:'Rare Ingredients'    },
  { n:'30+',  l:'Countries Sourced'   },
];
const PILLARS  = [
  { i:'✦', t:'Craftsmanship', d:'Hand-blended in our Grasse atelier' },
  { i:'◈', t:'Natural',       d:'150+ single-origin botanicals'       },
  { i:'◇', t:'Unhurried',     d:'18-month minimum maceration'         },
];
const TIMELINE = [
  { y:'1987', t:'Founded',   d:'Our first three scents were blended by hand in a small Grasse atelier and sold out within a fortnight.' },
  { y:'1995', t:'Expansion', d:'Boutiques opened in Paris, Milan, and London. A second generation of perfumers joined the house.' },
  { y:'2005', t:'Signature', d:'Launch of the four-pillar collection that defined modern niche perfumery for a decade.' },
  { y:'2024', t:'Heritage',  d:'Thirty-seven years on, every bottle is still blended by hand — nothing automated, nothing rushed.' },
];
const TEAM     = [
  { n:'Henri Marceau',  r:'Founder & Master Perfumer', s:'Oriental & Woody accords', i:'◈' },
  { n:'Isabelle Voss',  r:'Head Alchemist',            s:'Floral heart notes',       i:'✦' },
  { n:'Pierre Laurent', r:'Heritage Keeper',           s:'Classic & Vintage blends', i:'◇' },
];

export default function AboutPage() {
  useReveal();

  return (
    <div className="about-page">
      <Styles />

      <section className="ah-hero">
        <div className="wrap">
          <div className="ah-hero-text">
            <span className="eyebrow ah-eyebrow-anim">
              <span className="eyebrow-line" />
              Maison de Parfum · Est. 1987
            </span>
            <h1 className="ah-hero-heading">
              OUR
              <em>Legacy</em>
            </h1>
            <p className="ah-hero-quote">
              Thirty-seven years of rare botanicals, ancient craft, and a singular
              obsession with the invisible art of scent.
            </p>
            <div className="ah-hero-meta">
              {STATS.map(({ n, l }) => (
                <div key={l}>
                  <span className="ah-hero-meta-num">{n}</span>
                  <span className="ah-hero-meta-lbl">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ah-hero-img-col">
          <Image
            src="/ab1.png"
            alt="Aurum atelier"
            fill
            className="ah-hero-img"
            priority
          />
          <span className="ah-hero-img-tag">Grasse Atelier · Since 1987</span>
        </div>

        <div className="ah-scroll">Scroll</div>
      </section>

      <div className="ah-stats">
        <div className="wrap">
          <div className="ah-stats-inner">
            {STATS.map(({ n, l }, i) => (
              <div key={l} className={`r t${i+1} ah-stat`}>
                <span className="ah-stat-n">{n}</span>
                <span className="ah-stat-l">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="ah-story">
        <div className="wrap">
          <div className="ah-story-inner">
            <div className="ah-story-text">
              <span className="r eyebrow"><span className="eyebrow-line"/>Our Heritage</span>
              <h2 className="r t1 section-title ah-story-heading">
                Founded on <em>Excellence,</em><br/>Built on <em>Obsession</em>
              </h2>
              <div className="r t1 gold-line" />
              <p className="r t2 ah-story-body">
                Since 1987 we have been the artisans of fine fragrance — blending
                <strong> rare botanical ingredients</strong> with ancient craft techniques
                passed down across generations. Our perfumes are not merely scents;
                they are stories, emotions, and memories, captured in glass.
              </p>
              <p className="r t2 ah-story-body">
                Every fragrance is born in our Grasse atelier, where master perfumers
                believe true luxury lives in the smallest details: the balance of a note,
                the weight of a stopper, <strong>the silence between two accords.</strong>
              </p>
              <div className="r t3 ah-pillars">
                {PILLARS.map(({ i, t, d }) => (
                  <div key={t} className="ah-pillar">
                    <div className="ah-pillar-i">{i}</div>
                    <span className="ah-pillar-t">{t}</span>
                    <span className="ah-pillar-d">{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="r t2 ah-story-img-wrap">
              <div className="ah-story-frame" />
              <div className="ah-story-vline" />
              <Image
                src="/ab2.png"
                alt="Perfume crafting"
                width={480} height={640}
                className="ah-story-img"
              />
              <div className="ah-story-caption">Grasse Atelier · Since 1987</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="ah-phil">
        <div className="wrap">
          <div className="ah-phil-inner">
            <div className="ah-phil-left">
              <span className="r eyebrow"><span className="eyebrow-line"/>Our Philosophy</span>
              <h2 className="r t1 section-title ah-phil-heading">
                Patience as a <em>Practice</em>
              </h2>
              <p className="r t2 ah-phil-sub">
                Every decision we make begins with one question: does this serve
                the scent, or merely serve convenience?
              </p>
            </div>
            <blockquote className="r t2 ah-phil-quote">
              <p className="ah-phil-quote-text">
                Perfume is the art that makes memory speak — we make it speak in a language
                only you understand. We do not rush. We do not compromise. We wait for the moment
                a composition is ready, not the moment it is finished.
              </p>
              <cite className="ah-phil-cite">— Henri Marceau, Founder</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="ah-tl">
        <div className="wrap">
          <div className="ah-tl-header">
            <div className="r ah-tl-eyebrow">
              <span style={{display:'block',width:'30px',height:'1px',background:'var(--gold)'}}/>
              Our Journey
              <span style={{display:'block',width:'30px',height:'1px',background:'var(--gold)'}}/>
            </div>
            <h2 className="r t1 section-title ah-tl-heading">Milestones in <em>Time</em></h2>
          </div>
          <div className="ah-tl-track">
            {TIMELINE.map(({ y, t, d }, i) => (
              <div key={y} className={`r t${(i%3)+1} ah-tl-item`}>
                <div className="ah-tl-a">
                  <span className="ah-tl-year">{y}</span>
                  <span className="ah-tl-title">{t}</span>
                </div>
                <div className="ah-tl-c"><div className="ah-tl-dot" /></div>
                <div className="ah-tl-b"><p className="ah-tl-desc">{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="ah-team">
        <div className="wrap">
          <div className="ah-team-header">
            <div className="r ah-tl-eyebrow">
              <span style={{display:'block',width:'30px',height:'1px',background:'var(--gold)'}}/>
              The Artisans
              <span style={{display:'block',width:'30px',height:'1px',background:'var(--gold)'}}/>
            </div>
            <h2 className="r t1 section-title ah-team-heading">Master <em>Perfumers</em></h2>
          </div>
          <div className="ah-team-grid">
            {TEAM.map(({ n, r, s, i }, idx) => (
              <div key={n} className={`r t${idx+1} ah-team-card`}>
                <div className="ah-team-icon">{i}</div>
                <span className="ah-team-name">{n}</span>
                <span className="ah-team-role">{r}</span>
                <span className="ah-team-spec">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ah-cta">
        <div className="ah-cta-glow" />
        <div className="ah-cta-c ah-cta-c--tl"/><div className="ah-cta-c ah-cta-c--tr"/>
        <div className="ah-cta-c ah-cta-c--bl"/><div className="ah-cta-c ah-cta-c--br"/>
        <div className="ah-cta-inner">
          <div className="r ah-tl-eyebrow">
            <span style={{display:'block',width:'30px',height:'1px',background:'var(--gold)'}}/>
            Begin Your Journey
            <span style={{display:'block',width:'30px',height:'1px',background:'var(--gold)'}}/>
          </div>
          <h2 className="r t1 ah-cta-heading">Experience <em>Luxury</em></h2>
          <p className="r t2 ah-cta-desc">
            Discover our exclusive collection and find the scent that was always meant to be yours.
          </p>
          <div className="r t3 ah-cta-rule"><span>◆</span></div>
          <button className="r t4 ah-cta-btn">Explore Collection →</button>
        </div>
      </section>

    </div>
  );
}
