'use client';
import Image from 'next/image';
import './about.css';
import useReveal from '../hooks/useReveal';

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
  useReveal({ threshold: 0.12 });

  return (
    <div className="about-page">

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
            alt="7EVEN atelier"
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

