'use client';

import { useState } from 'react';
import Image from 'next/image';
import './contact.css';
import useReveal from '../hooks/useReveal';

const INFO = [
  { icon:'◈', label:'Email',   val:'sevenevenam@gmail.com',  href:'mailto:sevenevenam@gmail.com',  type:'link' },
  { icon:'◇', label:'Phone',   val:'+1 (234) 567-890',         href:'tel:+1234567890',                type:'link' },
  { icon:'✦', label:'Atelier', val:'12 Rue du Faubourg,\nGrasse, France',  href:null,                   type:'text' },
  { icon:'◉', label:'Hours',   val:'Mon–Sat  10:00 – 19:00\nSunday by appointment', href:null,         type:'text' },
];

export default function Page() {
  const [form, setForm]       = useState({ name:'', email:'', phone:'', message:'' });
  const [active, setActive]   = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  useReveal();

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false); setSent(true);
      setTimeout(() => { setForm({ name:'', email:'', phone:'', message:'' }); setSent(false); }, 3000);
    }, 900);
  };

  const isActive = f => active === f;
  const isFilled = f => form[f]?.length > 0;

  return (
    <div className="ct-page">

      <div className="ct-hero">
        <div className="ct-hero-eyebrow">
          <span/>SEVENEVEN · Est. 1987 <span/>
        </div>
        <h1 className="ct-hero-heading">
          GET IN
          <em>Touch</em>
        </h1>
        <p className="ct-hero-sub">
          Our fragrance experts are ready to guide you toward
          a scent that speaks the language only you understand.
        </p>
        <div className="ct-hero-orn"><span>◆</span></div>
      </div>

      {/* ── Main grid ── */}
      <div className="ct-main">

        {/* ════ LEFT — image + info ════ */}
        <div className="ct-left">

          {/* Image shell */}
          <div className="r ct-img-shell">
            <div className="ct-img-glow" />

            {/* Corner marks */}
            <div className="ct-corner ct-corner--tl"/>
            <div className="ct-corner ct-corner--tr"/>
            <div className="ct-corner ct-corner--bl"/>
            <div className="ct-corner ct-corner--br"/>

            {/* Decorative frame */}
            <div className="ct-img-frame" />

            {/* Orbit rings */}
            <div className="ct-orbit ct-orbit--1">
              <span className="ct-orbit-dot" />
            </div>
            <div className="ct-orbit ct-orbit--2">
              <span className="ct-orbit-dot ct-orbit-dot--2" />
            </div>

            {/* Particles */}
            <span className="ct-particle ct-p1" />
            <span className="ct-particle ct-p2" />
            <span className="ct-particle ct-p3" />
            <span className="ct-particle ct-p4" />

            {/* Bottle */}
            <Image
              src="/c2.png"
              alt="7EVEN Perfume"
              width={320} height={480}
              className="ct-bottle"
              priority
            />

            <span className="ct-img-label">Eau de Parfum · 50ml</span>
          </div>

          {/* Contact info */}
          <div className="ct-info-list">
            {INFO.map(({ icon, label, val, href, type }) => (
              <div key={label} className="r ct-info-item">
                <div className="ct-info-icon">{icon}</div>
                <div>
                  <span className="ct-info-label">{label}</span>
                  {type === 'link'
                    ? <a href={href} className="ct-info-val">{val}</a>
                    : <span className="ct-info-val" style={{whiteSpace:'pre-line'}}>{val}</span>
                  }
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ════ RIGHT — form ════ */}
        <div className="ct-form-wrap">

          <div className="r ct-form-header">
            <div className="ct-form-eyebrow">
              <span/> Send a Message
            </div>
            <h2 className="ct-form-heading">
              Begin the <em>Conversation</em>
            </h2>
            <div className="ct-form-divider" />
            <p className="ct-form-sub">
              Whether you seek a bespoke creation, a gift, or simply wish
              to visit our atelier — we would love to hear from you.
            </p>
          </div>

          <form className="r t1 ct-form" onSubmit={submit}>

            <div className="ct-row">
              <div className={`ct-field${isActive('name') ? ' active' : ''}${isFilled('name') ? ' filled' : ''}`}>
                <label className="ct-label">Full Name</label>
                <input
                  className="ct-input" name="name" type="text" required
                  value={form.name} onChange={handle}
                  onFocus={() => setActive('name')}
                  onBlur={() => setActive(null)}
                />
                <div className="ct-field-line" />
              </div>

              {/* Email */}
              <div className={`ct-field${isActive('email') ? ' active' : ''}${isFilled('email') ? ' filled' : ''}`}>
                <label className="ct-label">Email Address</label>
                <input
                  className="ct-input" name="email" type="email" required
                  value={form.email} onChange={handle}
                  onFocus={() => setActive('email')}
                  onBlur={() => setActive(null)}
                />
                <div className="ct-field-line" />
              </div>
            </div>

            {/* Phone */}
            <div className={`ct-field${isActive('phone') ? ' active' : ''}${isFilled('phone') ? ' filled' : ''}`}>
              <label className="ct-label">Phone Number <span style={{opacity:.5,fontSize:'.9em'}}>(optional)</span></label>
              <input
                className="ct-input" name="phone" type="tel"
                value={form.phone} onChange={handle}
                onFocus={() => setActive('phone')}
                onBlur={() => setActive(null)}
              />
              <div className="ct-field-line" />
            </div>

            {/* Message */}
            <div className={`ct-field${isActive('message') ? ' active' : ''}${isFilled('message') ? ' filled' : ''}`}>
              <label className="ct-label">Your Message</label>
              <textarea
                className="ct-textarea" name="message" required
                value={form.message} onChange={handle}
                onFocus={() => setActive('message')}
                onBlur={() => setActive(null)}
                rows={5}
              />
              <div className="ct-field-line" />
            </div>

            {/* Submit */}
            <div className="ct-submit-row">
              <button
                type="submit"
                disabled={sending || sent}
                className={`ct-submit${sent ? ' ct-submit--success' : ''}`}
              >
                {sent ? '✓ Message Sent' : sending ? 'Sending…' : 'Send Message →'}
              </button>
              <p className="ct-submit-note">
                We respond within 24 hours from our Paris atelier.
              </p>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}


