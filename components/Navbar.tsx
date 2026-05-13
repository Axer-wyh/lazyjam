"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import CartDrawer from "./CartDrawer";
import CheckoutModal from "./CheckoutModal";
import { saveCart, clearCart, type CartItem } from "@/lib/cart";

function useLightBackground() {
  const [isLight, setIsLight] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const detectBackground = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const bodyBg = getComputedStyle(document.body).backgroundColor;
        const rgb = bodyBg.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const [r, g, b] = rgb.map(Number);
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          setIsLight(luminance > 0.5);
        }
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", detectBackground, { passive: true });
    detectBackground();
    return () => window.removeEventListener("scroll", detectBackground);
  }, []);

  return isLight;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const isLight = useLightBackground();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textColor = isLight && isScrolled ? "var(--charcoal-clay)" : "var(--raw-linen)";

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };
  const handleCheckoutSuccess = () => {
    clearCart();
  };

  useEffect(() => {
    try {
      const stored: CartItem[] = JSON.parse(localStorage.getItem("lazyjam_cart") ?? "[]");
      setCart(stored);
    } catch {}
  }, []);

  return (
    <header
      className={`site-header${isScrolled ? " is-scrolled" : ""}`}
      data-header
      style={{ color: textColor }}
    >
      <div className="nav-shell">
        <Link href="/" className="logo" aria-label="LazyJam home">
          <span className="logo-mark">LJ</span>
          <span>LazyJam</span>
        </Link>
        <nav className="primary-nav" aria-label="Primary navigation">
          <Link href="/shop">Shop</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/about">About</Link>
        </nav>
        <button className="cart-button" type="button" aria-label="Cart" onClick={openCart}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" strokeWidth="1.7">
            <path d="M6.5 8.5h11l-1 11h-9l-1-11Z" />
            <path d="M9 8.5a3 3 0 0 1 6 0" />
          </svg>
          <span className="cart-count" data-cart-count>0</span>
        </button>

      {/* Cart and Checkout are portal-rendered outside header stacking context */}
        {cartOpen && <CartDrawer isOpen={cartOpen} onClose={closeCart} onCheckout={handleCheckout} />}
        {checkoutOpen && <CheckoutModal isOpen={checkoutOpen} cart={cart} total={cart.reduce((s, i) => s + i.price * i.quantity, 0)} onClose={() => setCheckoutOpen(false)} onSuccess={handleCheckoutSuccess} />}
      </div>

      <style>{`
        .site-header {
          position: fixed;
          inset: 0 0 auto;
          z-index: 50;
          height: var(--header-height);
          border-bottom: 1px solid rgba(201,191,175,0.35);
          background: rgba(243,239,230,0.85);
          backdrop-filter: blur(14px);
          color: var(--charcoal-clay);
          transition: height 260ms ease, box-shadow 260ms ease, color 260ms ease;
        }
        .site-header:not(.is-scrolled) {
          background: transparent;
          border-bottom-color: rgba(243,239,230,0.2);
          color: var(--charcoal-clay);
        }
        .site-header.is-scrolled {
          height: var(--header-compact);
          box-shadow: 0 10px 30px rgba(46,42,37,0.08);
        }
        .nav-shell {
          width: min(100% - 32px, var(--content-width));
          height: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }
        .logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.45rem;
          font-weight: 700;
          letter-spacing: 0;
          white-space: nowrap;
        }
        .logo-mark {
          width: 30px;
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          border: 1px solid currentColor;
          border-radius: 50%;
          font-size: 0.82rem;
          line-height: 1;
        }
        .primary-nav {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 0.64rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .primary-nav a {
          position: relative;
          padding: 8px 0;
        }
        .primary-nav a::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: 2px;
          height: 1px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 220ms ease;
        }
        .primary-nav a:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        .cart-button {
          position: relative;
          width: 42px;
          height: 42px;
          display: inline-grid;
          place-items: center;
          border: 1px solid currentColor;
          border-radius: 999px;
          background: transparent;
          color: inherit;
          cursor: pointer;
          transition: background-color 220ms ease, transform 220ms ease;
        }
        .cart-button:hover {
          background: rgba(243,239,230,0.16);
          transform: translateY(-1px);
        }
        .site-header.is-scrolled .cart-button:hover {
          background: var(--warm-oat);
        }
        .cart-button svg {
          width: 19px;
          height: 19px;
        }
        .cart-count {
          position: absolute;
          top: -3px;
          right: -3px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: var(--burnt-persimmon);
          color: var(--raw-linen);
          font-size: 0.68rem;
          line-height: 1;
          transition: transform 180ms ease;
        }
        .cart-count.bump {
          transform: scale(1.22);
        }
        @media (min-width: 680px) {
          .primary-nav { gap: clamp(18px, 3vw, 34px); font-size: 0.72rem; }
        }
      `}</style>
    </header>
  );
}