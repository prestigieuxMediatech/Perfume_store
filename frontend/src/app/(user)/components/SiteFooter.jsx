import './styles/layout.css'

export default function SiteFooter() {
  return (
    <footer className="site-footer">

      <div className="site-footer-inner">

        <div className="footer-brand">
          <span className="footer-logo">7EVEN</span>

          <p className="footer-copy">
            A maison de parfum dedicated to rare ingredients, quiet luxury
            and fragrances that feel like they were written for you alone.
          </p>
        </div>

        <div className="footer-cols">

          <div className="footer-col">
            <h3 className="footer-heading">Maison</h3>
            <ul>
              <li><a href="/about">Our Story</a></li>
              <li><a href="/shop">The Collection</a></li>
              <li><a href="#">Private Atelier</a></li>
              <li><a href="#">Reviews</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Visit</h3>
            <ul>
              <li>By appointment only</li>
              <li>Grasse · Paris · Mumbai</li>
              <li>
                <a href="mailto:concierge@7EVENparfum.com">
                  concierge@7EVENparfum.com
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col footer-col--compact">
            <h3 className="footer-heading">Follow</h3>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Journal Letters</a></li>
            </ul>
          </div>

        </div>

      </div>

      <div className="site-footer-bottom">

        <span className="footer-small">
          © {new Date().getFullYear()} 7EVEN Parfum. All rights reserved.
        </span>

        <div className="footer-small-links">
          <a href="#">Privacy</a>
          <span>·</span>
          <a href="#">Terms</a>
        </div>

      </div>

    </footer>
  );
}