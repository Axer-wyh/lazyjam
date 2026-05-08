"use client";

import { useEffect, useState, useMemo } from "react";
import { apiRequest } from "@/lib/client-api";
import type { Product, Section } from "@/lib/types";

export default function HomePage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    Promise.all([
      apiRequest<Section[]>("/api/sections"),
      apiRequest<Product[]>("/api/products"),
    ])
      .then(([sectionData, productData]) => {
        setSections(sectionData.filter((s) => s.isActive));
        setProducts(productData.filter((p) => p.status === "active" && p.featured));
      })
      .finally(() => setLoading(false));
  }, []);

  const bumpCart = () => {
    setCartCount((c) => c + 1);
  };

  useEffect(() => {
    const countEl = document.querySelector("[data-cart-count]") as HTMLElement | null;
    if (countEl) countEl.textContent = String(cartCount);
  }, [cartCount]);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--weathered-taupe)" }}>
        LazyJam 正在整理工作台...
      </div>
    );
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────── */}
      <section className="hero">
        <div className="hero-inner reveal">
          <p className="eyebrow">Polymer Clay &amp; Bead Jewelry</p>
          <h1>LazyJam</h1>
          <p className="hero-copy">慢慢揉合陶土、串珠、亚麻质地与旧书票的边框感，做成日常里安静发光的小首饰。</p>
          <a className="button light" href="#shop">Shop Slow Pieces</a>
        </div>
      </section>

      {/* ── Statement ────────────────────────────── */}
      <section className="statement-section">
        <div className="container reveal">
          <p className="statement">
            不追逐完美，<span>只收藏手留下的温度。</span>
          </p>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────── */}
      <section className="products-section" id="shop">
        <div className="container">
          <div className="section-heading reveal">
            <div>
              <p className="section-kicker">Featured Products</p>
              <h2 className="section-title">Softly made, lightly worn.</h2>
            </div>
            <p className="section-copy">每一枚粘土形体都保留轻微不均匀的边缘，再与旧玻璃珠、淡水珠和金属小件慢慢配对。</p>
          </div>
          <div className="product-grid">
            {products.slice(0, 4).map((product) => (
              <article key={product.id} className="product-card reveal">
                <div className="image-frame product-image">
                  <img src={product.imageUrl} alt={product.name} loading="lazy" />
                </div>
                <div className="product-info">
                  <p className="product-meta">{product.category}</p>
                  <h3 className="card-title">{product.name}</h3>
                  <div className="product-bottom">
                    <span className="price">¥{product.price}</span>
                    <button className="add-button" type="button" aria-label={`Add ${product.name} to cart`} onClick={bumpCart}>+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Craft ────────────────────────────────── */}
      <section className="craft-section">
        <div className="container craft-grid">
          <div className="image-frame craft-image reveal">
            <img
              src="https://images.unsplash.com/photo-1771523350747-468d40181cd2?auto=format&fit=crop&w=1200&q=80"
              alt="Handmade ceramic craft process on a working table"
              loading="lazy"
            />
          </div>
          <div className="craft-copy reveal">
            <div>
              <p className="section-kicker">Materials &amp; Craft</p>
              <h2 className="section-title">Quiet textures, honest traces.</h2>
            </div>
            <p className="section-copy">
              LazyJam 选择带有自然颗粒感的 Polymer Clay、复古库存珠、柔雾金属件与亚麻包装。低饱和色块和轻微手作痕迹，是每件作品的签名。
            </p>
            <ul className="craft-list">
              <li>手工调色、切片、打磨与低温烘烤，保留自然边缘。</li>
              <li>串珠按重量、光泽和旧化程度配组，避免过度对称。</li>
              <li>每次上新以小批量完成，让系列保持稀少和松弛。</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Collections ───────────────────────────── */}
      <section className="collections-section" id="collections">
        <div className="container">
          <div className="section-heading reveal">
            <div>
              <p className="section-kicker">Collections</p>
              <h2 className="section-title">Three slow shelves.</h2>
            </div>
            <p className="section-copy">像翻开旧藏书票一样进入系列：粗糙、温润、安静，带一点午后灰尘的光。</p>
          </div>
          <div className="collection-grid">
            {[
              {
                meta: "Collection 01",
                title: "Raw Linen Pearls",
                desc: "淡水珠、奶油色粘土与旧书页色金属件。",
                img: "https://images.unsplash.com/photo-1643081268653-95e521230cb8?auto=format&fit=crop&w=1000&q=80",
                href: "/shop",
              },
              {
                meta: "Collection 02",
                title: "Clay Margins",
                desc: "不规则轮廓、陶土色块和手写边注感。",
                img: "https://images.unsplash.com/photo-1745828186668-505155a65a81?auto=format&fit=crop&w=1000&q=80",
                href: "/shop",
              },
              {
                meta: "Collection 03",
                title: "Dried Sage Charms",
                desc: "鼠尾草绿、温燕麦色和复古小吊坠。",
                img: "https://images.unsplash.com/photo-1653031933905-65c526afd699?auto=format&fit=crop&w=1000&q=80",
                href: "/shop",
              },
            ].map((col) => (
              <a key={col.title} className="collection-card reveal" href={col.href}>
                <div className="image-frame">
                  <img src={col.img} alt={col.title} loading="lazy" />
                </div>
                <div className="collection-content">
                  <p className="product-meta">{col.meta}</p>
                  <h3 className="card-title">{col.title}</h3>
                  <p>{col.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Journal ───────────────────────────────── */}
      <section className="journal-section" id="journal">
        <div className="container">
          <div className="section-heading reveal">
            <div>
              <p className="section-kicker">Journal</p>
              <h2 className="section-title">Latest notes.</h2>
            </div>
            <p className="section-copy">记录工作台上的失败、配色、旧珠来源和包装里那一小片亚麻布。</p>
          </div>
          <div className="journal-grid">
            {[
              {
                meta: "Studio Note",
                title: "A slow morning palette",
                desc: "从亚麻布的折痕里取色，让白、燕麦和陶土色自然靠近。",
                img: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=80",
              },
              {
                meta: "Ex Libris",
                title: "Borders from old books",
                desc: "藏书票的装饰边框，变成耳饰卡片和系列标签里的细线。",
                img: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?auto=format&fit=crop&w=1000&q=80",
              },
              {
                meta: "Craft Log",
                title: "Why the edge stays uneven",
                desc: "轻微歪斜不是缺陷，而是手和材料互相让步后的证据。",
                img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=80",
              },
            ].map((j) => (
              <article key={j.title} className="journal-card reveal">
                <div className="image-frame journal-image">
                  <img src={j.img} alt={j.title} loading="lazy" />
                </div>
                <div className="journal-body">
                  <p className="journal-meta">{j.meta}</p>
                  <h3 className="journal-title">{j.title}</h3>
                  <p>{j.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────── */}
      <section className="about-section" id="about">
        <div className="container about-grid">
          <div className="reveal">
            <p className="section-kicker">About LazyJam</p>
            <h2 className="section-title">Made for unhurried keepers.</h2>
          </div>
          <div className="reveal">
            <p className="about-note">LazyJam 起初只是一本旧速写本旁边的手作小盘。</p>
            <p className="section-copy">
              我们把下班后的慢时间揉进粘土，把旅行里收来的旧珠串成轻首饰。作品不追求绝对一致，而是希望戴上它的人，能带走一点安静、柔软和不费力的美。
            </p>
          </div>
        </div>
      </section>

      {/* ── Newsletter ─────────────────────────────── */}
      <section className="newsletter-section">
        <div className="container newsletter-box">
          <div className="reveal">
            <p className="section-kicker">Newsletter</p>
            <h2 className="section-title">Letters from the bench.</h2>
            <p className="section-copy">新系列、小批量补货和工作台日记，会慢慢寄到你的信箱。</p>
          </div>
          <form className="newsletter-form reveal" data-newsletter>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              aria-label="Email address"
              required
            />
            <button className="button" type="submit">Subscribe</button>
            <p className="newsletter-message" data-newsletter-message aria-live="polite" />
          </form>
        </div>
      </section>

      {/* ── Scroll reveal ─────────────────────────── */}
      <RevealObserver />

      {/* ── Newsletter handler ────────────────────── */}
      <NewsletterHandler />

      <style>{`
        /* ── Hero ─────────────────────────────────── */
        .hero {
          min-height: 100svh;
          position: relative;
          display: grid;
          align-items: end;
          isolation: isolate;
          overflow: hidden;
          background: var(--soft-stone);
        }
        .hero::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background: linear-gradient(180deg, rgba(46,42,37,0.34), rgba(46,42,37,0.58)),
            url("https://images.unsplash.com/photo-1755401324208-7ead4696b351?auto=format&fit=crop&w=2200&q=82") center / cover;
          transform: scale(1.03);
        }
        .hero-inner {
          width: min(100% - 32px, var(--content-width));
          margin: 0 auto;
          padding: calc(var(--header-height) + 80px) 0 clamp(54px, 10vw, 96px);
          color: var(--raw-linen);
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 20px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .eyebrow::before {
          content: "";
          width: 40px;
          height: 1px;
          background: currentColor;
        }
        .hero h1 {
          max-width: 760px;
          margin: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(5rem, 22vw, 12.5rem);
          font-weight: 600;
          letter-spacing: 0;
          line-height: 0.98;
        }
        .hero-copy {
          max-width: 560px;
          margin: 26px 0 34px;
          color: var(--warm-oat);
          font-size: clamp(1rem, 3.6vw, 1.2rem);
        }
        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 24px;
          border: 1px solid var(--charcoal-clay);
          border-radius: 999px;
          background: var(--charcoal-clay);
          color: var(--raw-linen);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 220ms ease, border-color 220ms ease, transform 220ms ease;
          text-decoration: none;
        }
        .button:hover {
          background: var(--burnt-persimmon);
          border-color: var(--burnt-persimmon);
          transform: translateY(-2px);
        }
        .button.light {
          border-color: var(--raw-linen);
          background: var(--raw-linen);
          color: var(--smoked-umber);
        }
        .button.light:hover {
          border-color: var(--burnt-persimmon);
          background: var(--burnt-persimmon);
          color: var(--raw-linen);
        }
        /* ── Statement ─────────────────────────────── */
        .statement-section {
          padding: clamp(82px, 18vw, 178px) 0;
          background: var(--raw-linen);
          text-align: center;
        }
        .statement {
          max-width: 930px;
          margin: 0 auto;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.55rem, 10vw, 6.6rem);
          font-weight: 600;
          letter-spacing: 0;
          line-height: 0.98;
        }
        .statement span { color: var(--weathered-taupe); }
        /* ── Sections shared ───────────────────────── */
        section { padding: clamp(72px, 14vw, 148px) 0; }
        .container {
          width: min(100% - 32px, var(--content-width));
          margin: 0 auto;
        }
        .section-kicker {
          margin: 0 0 10px;
          color: var(--burnt-persimmon);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .section-heading {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 34px;
        }
        .section-title {
          margin: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.5rem, 9vw, 5.2rem);
          font-weight: 600;
          letter-spacing: 0;
          line-height: 0.98;
        }
        .section-copy {
          max-width: 600px;
          margin: 0;
          color: var(--weathered-taupe);
        }
        /* ── Products ──────────────────────────────── */
        .product-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .product-card {
          border: 1px solid var(--soft-stone);
          background: var(--raw-linen);
          transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease;
        }
        .product-card:hover {
          transform: translateY(-6px);
          border-color: var(--burnt-persimmon);
          box-shadow: 0 18px 45px rgba(46,42,37,0.12);
        }
        .image-frame {
          position: relative;
          overflow: hidden;
          background: var(--soft-stone);
        }
        .image-frame::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, var(--soft-stone), var(--warm-oat));
          opacity: 1;
          transition: opacity 300ms ease;
          z-index: 1;
        }
        .image-frame.is-loaded::before { opacity: 0; }
        .image-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          min-height: 100%;
          filter: saturate(0.82) contrast(0.96);
          transition: transform 520ms ease, filter 520ms ease;
          position: relative;
        }
        .product-card:hover img { transform: scale(1.045); filter: saturate(0.95) contrast(1); }
        .product-image { aspect-ratio: 4/5; }
        .product-info { padding: 18px 18px 20px; }
        .product-meta, .journal-meta {
          margin: 0 0 8px;
          color: var(--weathered-taupe);
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .card-title {
          margin: 0 0 8px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.72rem;
          font-weight: 600;
          letter-spacing: 0;
          line-height: 0.98;
        }
        .product-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 16px;
        }
        .price { color: var(--smoked-umber); font-weight: 600; }
        .add-button {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid var(--soft-stone);
          border-radius: 50%;
          background: var(--warm-oat);
          color: var(--charcoal-clay);
          cursor: pointer;
          font-size: 18px;
          transition: background-color 220ms ease, color 220ms ease, transform 220ms ease;
        }
        .add-button:hover {
          background: var(--burnt-persimmon);
          color: var(--raw-linen);
          transform: rotate(90deg);
        }
        /* ── Craft ────────────────────────────────── */
        .craft-section { background: var(--warm-oat); }
        .craft-grid {
          display: grid;
          gap: 34px;
          align-items: center;
          grid-template-columns: 1fr;
        }
        .craft-image { aspect-ratio: 1/1.12; border: 1px solid var(--soft-stone); }
        .craft-copy { display: grid; gap: 22px; }
        .craft-list {
          display: grid;
          gap: 14px;
          margin: 10px 0 0;
          padding: 0;
          list-style: none;
          color: var(--weathered-taupe);
        }
        .craft-list li {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 12px;
          align-items: start;
        }
        .craft-list li::before {
          content: "";
          width: 12px;
          height: 12px;
          margin-top: 9px;
          border: 1px solid var(--burnt-persimmon);
          border-radius: 50%;
          background: var(--raw-linen);
        }
        /* ── Collections ──────────────────────────── */
        .collections-section { background: var(--raw-linen); }
        .collection-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr;
        }
        .collection-card {
          position: relative;
          min-height: 420px;
          display: grid;
          align-items: end;
          overflow: hidden;
          color: var(--raw-linen);
          background: var(--soft-stone);
          border: 1px solid var(--soft-stone);
          transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease;
        }
        .collection-card:hover {
          transform: translateY(-6px);
          border-color: var(--burnt-persimmon);
          box-shadow: 0 18px 45px rgba(46,42,37,0.12);
        }
        .collection-card .image-frame {
          position: absolute;
          inset: 0;
          z-index: 0;
          height: 100%;
        }
        .collection-card::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(180deg, rgba(46,42,37,0.06), rgba(46,42,37,0.68));
        }
        .collection-content {
          position: relative;
          z-index: 2;
          padding: 24px;
        }
        .collection-content p { margin: 10px 0 0; color: var(--warm-oat); }
        .collection-card:hover img { transform: scale(1.045); filter: saturate(0.95) contrast(1); }
        /* ── Journal ───────────────────────────────── */
        .journal-section { background: var(--warm-oat); }
        .journal-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .journal-card {
          background: var(--raw-linen);
          border: 1px solid var(--soft-stone);
          transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease;
        }
        .journal-card:hover {
          transform: translateY(-6px);
          border-color: var(--burnt-persimmon);
          box-shadow: 0 18px 45px rgba(46,42,37,0.12);
        }
        .journal-image { aspect-ratio: 1.35/1; }
        .journal-body { padding: 20px; }
        .journal-title {
          margin: 0 0 12px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.85rem;
          line-height: 1.05;
          font-weight: 600;
        }
        .journal-body p { margin: 0; color: var(--weathered-taupe); }
        .journal-card:hover img { transform: scale(1.045); filter: saturate(0.95) contrast(1); }
        /* ── About ────────────────────────────────── */
        .about-section {
          background: var(--smoked-umber);
          color: var(--raw-linen);
        }
        .about-grid {
          display: grid;
          gap: 32px;
          align-items: end;
          grid-template-columns: 1fr;
        }
        .about-section .section-copy { color: var(--warm-oat); }
        .about-note {
          max-width: 670px;
          margin: 0;
          color: var(--warm-oat);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 8vw, 4.7rem);
          line-height: 1.05;
        }
        /* ── Newsletter ───────────────────────────── */
        .newsletter-section {
          padding: clamp(72px, 12vw, 116px) 0;
          background: var(--dried-sage);
        }
        .newsletter-box {
          display: grid;
          gap: 26px;
          align-items: end;
          grid-template-columns: 1fr;
        }
        .newsletter-box .section-title { font-size: clamp(2.3rem, 8vw, 4.8rem); }
        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex-wrap: wrap;
        }
        .newsletter-form input {
          width: 100%;
          min-height: 54px;
          border: 1px solid var(--charcoal-clay);
          border-radius: 999px;
          background: rgba(243,239,230,0.78);
          color: var(--charcoal-clay);
          padding: 0 20px;
          outline: none;
          transition: background-color 220ms ease, box-shadow 220ms ease;
        }
        .newsletter-form input:focus {
          background: var(--raw-linen);
          box-shadow: 0 0 0 4px rgba(46,42,37,0.1);
        }
        .newsletter-message {
          flex-basis: 100%;
          min-height: 24px;
          margin: 0;
          color: var(--smoked-umber);
          font-size: 0.88rem;
        }
        /* ── Responsive ───────────────────────────── */
        @media (min-width: 680px) {
          .section-heading {
            flex-direction: row;
            align-items: end;
            justify-content: space-between;
          }
          .newsletter-form {
            flex-direction: row;
            align-items: center;
          }
          .newsletter-form input { flex: 1; }
          .newsletter-form .button { flex: 0 0 auto; }
        }
        @media (min-width: 920px) {
          :root { --header-height: 88px; }
          .hero-inner { padding-bottom: clamp(70px, 9vw, 116px); }
          .product-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .craft-grid, .about-grid, .newsletter-box {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          }
          .collection-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .journal-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            transition-duration: 1ms !important;
            animation-duration: 1ms !important;
          }
          .reveal { opacity: 1; transform: none; }
        }
      `}</style>
    </>
  );
}

function RevealObserver() {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return null;
}

function NewsletterHandler() {
  useEffect(() => {
    const form = document.querySelector("[data-newsletter]") as HTMLFormElement | null;
    const msg = document.querySelector("[data-newsletter-message]") as HTMLElement | null;
    if (!form || !msg) return;
    const handler = (e: Event) => {
      e.preventDefault();
      const data = new FormData(form);
      const email = data.get("email");
      msg.textContent = email ? "已加入 LazyJam 的慢通信。" : "";
      form.reset();
    };
    form.addEventListener("submit", handler);
    return () => form.removeEventListener("submit", handler);
  }, []);
  return null;
}
