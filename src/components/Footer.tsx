import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <span className="logo-icon">◇</span>
              <span className="logo-text">Illusionhost</span>
            </Link>
            <p className="footer-desc">
              Premium domain names and web hosting services. Build your online presence with confidence.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Twitter">𝕏</a>
              <a href="#" className="social-link" aria-label="Facebook">f</a>
              <a href="#" className="social-link" aria-label="Instagram">📷</a>
              <a href="#" className="social-link" aria-label="LinkedIn">in</a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Domains</h4>
            <ul className="footer-links">
              <li><Link href="/domains">Domain Search</Link></li>
              <li><Link href="/domains">Bulk Domain Search</Link></li>
              <li><Link href="/transfer">Transfer Domains</Link></li>
              <li><Link href="/domains">Domain Pricing</Link></li>
              <li><Link href="/domains">Premium Domains</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Hosting</h4>
            <ul className="footer-links">
              <li><Link href="/hosting">Web Hosting</Link></li>
              <li><Link href="/hosting">WordPress Hosting</Link></li>
              <li><Link href="/hosting">VPS Hosting</Link></li>
              <li><Link href="/hosting">Dedicated Servers</Link></li>
              <li><Link href="/hosting">Cloud Hosting</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/contact">Knowledge Base</Link></li>
              <li><Link href="/contact">Documentation</Link></li>
              <li><Link href="/contact">Status Page</Link></li>
              <li><Link href="/contact">System Status</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Company</h4>
            <ul className="footer-links">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/press">Press</Link></li>
              <li><Link href="/partners">Partners</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© 2026 Illusionhost. All rights reserved.</p>
          <div className="footer-legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/acceptable-use">Acceptable Use Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
