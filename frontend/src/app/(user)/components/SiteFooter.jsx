import Link from "next/link";
import Image from "next/image";
import "./styles/layout.css";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <Link href="/" className="footer-logo" aria-label="Seveneven home">
            <Image
              src="/brand/seveneven-logo-full.png"
              alt="Seveneven logo"
              width={220}
              height={158}
              className="footer-logo-image"
            />
          </Link>

          <p className="footer-copy">
            Discover signature fragrances, curated gift boxes, and the complete
            SEVENEVEN experience in one place.
          </p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h3 className="footer-heading">Explore</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/shop">Shop</Link></li>
              <li><Link href="/build-your-box">Build Your Box</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">My Account</h3>
            <ul>
              <li><Link href="/wishlist">Wishlist</Link></li>
              <li><Link href="/cart">Cart</Link></li>
              <li><Link href="/account/orders">Orders</Link></li>
              <li><Link href="/checkout">Checkout</Link></li>
            </ul>
          </div>

          <div className="footer-col footer-col--compact">
            <h3 className="footer-heading">Support</h3>
            <ul>
              <li><Link href="/contact">Contact Support</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link href="/return-refund-policy">Returns & Refunds</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span className="footer-small">
          &copy; {new Date().getFullYear()} SEVENEVEN Parfum. All rights reserved.
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
