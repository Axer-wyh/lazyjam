import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">LazyJam</p>
            <p className="footer-copy">
              Polymer clay, bead jewelry, quiet packaging, and the pleasure of objects that look gently lived-in.
            </p>
          </div>
          <div>
            <p className="footer-heading">Navigation</p>
            <ul className="footer-links">
              <li><Link href="/shop">Shop</Link></li>
              <li><Link href="/collections">Collections</Link></li>
              <li><Link href="/journal">Journal</Link></li>
              <li><Link href="/about">About</Link></li>
            </ul>
          </div>
          <div>
            <p className="footer-heading">Social</p>
            <ul className="social-links">
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Pinterest</a></li>
              <li><a href="#">Etsy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 LazyJam Studio</span>
          <span>Raw Linen / Warm Oat / Burnt Persimmon</span>
        </div>
      </div>

      <style>{`
        .site-footer {
          padding: 54px 0 34px;
          background: var(--smoked-umber);
          color: var(--raw-linen);
        }
        .footer-grid {
          display: grid;
          gap: 34px;
          padding-bottom: 36px;
          border-bottom: 1px solid rgba(201,191,175,0.42);
          grid-template-columns: 1fr;
        }
        .footer-brand {
          margin: 0 0 12px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.7rem, 12vw, 5.5rem);
          font-weight: 600;
          letter-spacing: 0;
          line-height: 0.98;
        }
        .footer-copy {
          max-width: 440px;
          margin: 0;
          color: var(--warm-oat);
        }
        .footer-links, .social-links {
          display: grid;
          gap: 8px;
          margin: 0;
          padding: 0;
          list-style: none;
          color: var(--warm-oat);
          font-size: 0.94rem;
        }
        .footer-links a, .social-links a {
          transition: color 180ms ease;
        }
        .footer-links a:hover, .social-links a:hover {
          color: var(--raw-linen);
        }
        .footer-heading {
          margin: 0 0 14px;
          color: var(--raw-linen);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .footer-bottom {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 24px;
          color: var(--warm-oat);
          font-size: 0.82rem;
        }
        @media (min-width: 680px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
          }
        }
        @media (min-width: 920px) {
          .footer-grid {
            grid-template-columns: 1.3fr 0.7fr 0.7fr;
          }
        }
      `}</style>
    </footer>
  );
}
