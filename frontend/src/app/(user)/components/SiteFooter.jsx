import Link from "next/link";
import "./styles/layout.css";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">7EVEN</span>

          <p className="footer-copy">
            A 7EVEN dedicated to rare ingredients, quiet luxury
            and fragrances that feel like they were written for you alone.
          </p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h3 className="footer-heading">Maison</h3>
            <ul>
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/shop">The Collection</Link></li>
              <li><Link href="/blog">Maison Journal</Link></li>
              <li><Link href="/contact">Private Atelier</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Visit</h3>
            <ul>
              <li>By appointment only</li>
              <li>Grasse | Paris | Mumbai</li>
              <li>
                <a href="mailto:concierge@7EVENparfum.com">
                  concierge@7EVENparfum.com
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col footer-col--compact">
            <h3 className="footer-heading">Support</h3>
            <ul>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link href="/return-refund-policy">Returns & Refunds</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span className="footer-small">
          &copy; {new Date().getFullYear()} 7EVEN Parfum. All rights reserved.
        </span>

        <div className="footer-small-links">
          <Link href="/privacy-policy">Privacy</Link>
          <span>&middot;</span>
          <Link href="/terms-and-conditions">Terms</Link>
          <span>&middot;</span>
          <Link href="/return-refund-policy">Returns</Link>
        </div>
      </div>
    </footer>
  );
}
