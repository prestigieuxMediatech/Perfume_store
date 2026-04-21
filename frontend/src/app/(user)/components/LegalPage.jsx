import Link from "next/link";
import "./styles/legal-page.css";

export default function LegalPage({ title, eyebrow, intro, lastUpdated, sections, contact }) {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div className="legal-hero-inner">
          <span className="legal-eyebrow">
            <span className="legal-eyebrow-line" />
            {eyebrow}
          </span>
          <h1 className="legal-title">{title}</h1>
          <p className="legal-intro">{intro}</p>

          <div className="legal-hero-meta">
            <div className="legal-meta-card">
              <span className="legal-meta-label">Last updated</span>
              <span className="legal-meta-value">{lastUpdated}</span>
            </div>
            <div className="legal-meta-card">
              <span className="legal-meta-label">Need help?</span>
              <a className="legal-meta-link" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="legal-body">
        <aside className="legal-sidebar">
          <div className="legal-sidebar-card">
            <span className="legal-sidebar-label">Quick access</span>
            <nav className="legal-sidebar-nav" aria-label="Legal pages">
              <Link href="/terms-and-conditions">Terms & Conditions</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/return-refund-policy">Return & Refund Policy</Link>
            </nav>
          </div>

          <div className="legal-sidebar-card">
            <span className="legal-sidebar-label">Contact</span>
            <div className="legal-sidebar-copy">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <span>{contact.whatsapp}</span>
              <span>{contact.address}</span>
            </div>
          </div>
        </aside>

        <div className="legal-content">
          {sections.map((section) => (
            <article key={section.title} className="legal-section">
              <div className="legal-section-header">
                {section.number ? <span className="legal-section-number">{section.number}</span> : null}
                <h2>{section.title}</h2>
              </div>

              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="legal-paragraph">
                  {paragraph}
                </p>
              ))}

              {section.items?.length ? (
                <ul className="legal-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
