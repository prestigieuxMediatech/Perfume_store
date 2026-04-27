"use client";
import React from "react";

const Styles = () => (
  <style>{`
    .experience-section {
      position: relative;
      background: var(--dark);
      color: var(--cream);
      padding: 5.5rem 6rem 5rem;
      overflow: hidden;
      border-top: 1px solid var(--border);
    }

    .experience-inner {
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 4rem;
      align-items: center;
      z-index: 1;
    }

    .experience-bg-orbit {
      position: absolute;
      inset: -40%;
      background:
        radial-gradient(circle at 10% 0%, rgba(201,168,76,0.16), transparent 55%),
        radial-gradient(circle at 90% 100%, rgba(201,168,76,0.07), transparent 60%);
      opacity: 0.7;
      pointer-events: none;
      z-index: 0;
    }

    .experience-left {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .experience-eyebrow {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: 'Cinzel', serif;
      font-size: 0.62rem;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: var(--gold, #c9a84c);
    }

    .experience-eyebrow::before {
      content: '';
      display: block;
      width: 38px;
      height: 1px;
      background: var(--gold, #c9a84c);
    }

    .experience-heading {
      font-family: 'Cinzel', serif;
      font-weight: 300;
      font-size: clamp(2rem, 3.2vw, 3rem);
      line-height: 1.2;
      letter-spacing: 0.06em;
      color: var(--cream);
    }

    .experience-heading em {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-weight: 300;
      color: var(--gold-light, #e8c97a);
      letter-spacing: 0.04em;
    }

    .experience-body {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.05rem;
      line-height: 1.9;
      color: var(--text-subtle);
      max-width: 480px;
    }

    .experience-body strong {
      color: var(--text-strong);
      font-weight: 400;
    }

    .experience-steps {
      display: grid;
      grid-template-columns: repeat(3, minmax(0,1fr));
      gap: 1.75rem;
      margin-top: 1.5rem;
      padding-top: 1.75rem;
      border-top: 1px solid var(--border);
    }

    .exp-step {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .exp-step-index {
      font-family: 'Cinzel', serif;
      font-size: 0.6rem;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: rgba(201,168,76,0.7);
    }

    .exp-step-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.05rem;
      color: var(--cream);
    }

    .exp-step-copy {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .experience-note {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
    }

    .experience-right {
      position: relative;
      padding: 2.25rem 2rem;
      border-radius: 20px;
      background: radial-gradient(circle at 0% 0%, rgba(201,168,76,0.18), transparent 55%),
                  radial-gradient(circle at 100% 100%, rgba(var(--text-rgb),0.18), transparent 55%),
                  var(--dark2);
      border: 1px solid var(--border);
      overflow: hidden;
    }

    .experience-right::before {
      content: '7EVEN';
      position: absolute;
      right: -70px;
      top: 50%;
      transform: translateY(-50%) rotate(-90deg);
      font-family: 'Cinzel', serif;
      font-size: 0.6rem;
      letter-spacing: 0.55em;
      color: rgba(var(--text-rgb),0.12);
      text-transform: uppercase;
    }

    .experience-quote-mark {
      font-family: 'Cinzel', serif;
      font-size: 2.4rem;
      line-height: 1;
      color: rgba(201,168,76,0.6);
      margin-bottom: 0.75rem;
    }

    .experience-quote {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 1.15rem;
      line-height: 1.8;
      color: var(--text-strong);
      max-width: 320px;
    }

    .experience-guest {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .experience-guest-name {
      font-family: 'Cinzel', serif;
      font-size: 0.8rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--gold, #c9a84c);
    }

    .experience-guest-meta {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .experience-badge {
      position: absolute;
      right: 1.8rem;
      bottom: 1.8rem;
      width: 88px;
      height: 88px;
      border-radius: 999px;
      border: 1px solid rgba(201,168,76,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Cinzel', serif;
      font-size: 0.55rem;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: rgba(201,168,76,0.95);
      text-align: center;
      padding: 0.75rem;
    }

    @media (max-width: 1024px) {
      .experience-section {
        padding: 4.5rem 3rem 4rem;
      }
      .experience-inner {
        grid-template-columns: 1.15fr 1fr;
        gap: 3rem;
      }
    }

    @media (max-width: 768px) {
      .experience-section {
        padding: 4rem 1.5rem 3.5rem;
      }
      .experience-inner {
        grid-template-columns: 1fr;
      }
      .experience-right {
        margin-top: 1.5rem;
      }
      .experience-steps {
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }
    }

    @media (max-width: 560px) {
      .experience-steps {
        grid-template-columns: 1fr;
      }
      .experience-section {
        padding-bottom: 3.25rem;
      }
      .experience-badge {
        right: 1.4rem;
        bottom: 1.4rem;
        width: 76px;
        height: 76px;
        font-size: 0.5rem;
      }
    }
  `}</style>
);

export default function Experience() {
  return (
    <>
      <Styles />
      <section className="experience-section" id="atelier">
        <div className="experience-bg-orbit" />

        <div className="experience-inner">
          <div className="experience-left">
            <div className="experience-eyebrow">The SEVENEVEN Experience</div>
            <h2 className="experience-heading">
              From <em>first impression</em><br />
              to lasting <em>signature</em>
            </h2>
            <p className="experience-body">
              Step into our private atelier and allow our perfumers to read the
              stories written in your memories. Through a guided ritual, we
              compose a fragrance that feels like it has always belonged to you —
              a <strong>bespoke signature</strong> captured in glass and gold.
            </p>

            <div className="experience-steps">
              {[
                {
                  index: "I",
                  title: "Scent Portrait",
                  copy: "We begin with your memories, rituals and favorite places.",
                },
                {
                  index: "II",
                  title: "Accord Selection",
                  copy: "Our perfumers blend rare accords tailored to your skin.",
                },
                {
                  index: "III",
                  title: "Bespoke Pour",
                  copy: "Your final essence is decanted and hand-signed in-house.",
                },
              ].map((step) => (
                <div key={step.index} className="exp-step">
                  <span className="exp-step-index">{step.index}</span>
                  <span className="exp-step-title">{step.title}</span>
                  <span className="exp-step-copy">{step.copy}</span>
                </div>
              ))}
            </div>

            <p className="experience-note">
              By appointment only — limited to four commissions each month.
            </p>
          </div>

          <aside className="experience-right">
            <div className="experience-quote-mark">“</div>
            <p className="experience-quote">
              The atelier felt like a sanctuary. I left wearing a scent that
              somehow smelled like childhood summers and velvet opera nights
              at once.
            </p>
            <div className="experience-guest">
              <span className="experience-guest-name">Ananya R.</span>
              <span className="experience-guest-meta">
                Private client ·SEVENEVEN Bespoke No. 07
              </span>
            </div>
            <div className="experience-badge">
              Private
              <br />
              Atelier
              <br />
              Sessions
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

