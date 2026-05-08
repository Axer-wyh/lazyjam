"use client";

import { useEffect, useState } from "react";
import { getCart, saveCart, addToCart, removeFromCart, updateCartQty, clearCart, type CartItem } from "@/lib/cart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCart(getCart());
  }, []);

  const refresh = (next: CartItem[]) => {
    setCart(next);
    saveCart(next);
  };

  if (!mounted) return null;

  const total = cart.reduce((s, item) => s + item.price * item.quantity, 0);
  const count = cart.reduce((s, item) => s + item.quantity, 0);

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(4px)",
          }}
          onClick={onClose}
        />
      )}
      <aside
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 101,
          width: "min(420px, 100vw)",
          background: "var(--parchment)",
          boxShadow: "-12px 0 40px rgba(46,42,37,0.14)",
          display: "flex", flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 320ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 22px 16px",
          borderBottom: "1px solid rgba(201,191,175,0.55)",
        }}>
          <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 26, fontWeight: 700, color: "var(--charcoal-clay)" }}>
            购物车 {count > 0 && <span style={{ fontSize: 14, fontWeight: 500, color: "var(--weathered-taupe)" }}>({count}件)</span>}
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 28, cursor: "pointer", color: "var(--charcoal-clay)", lineHeight: 1, padding: "0 4px" }}
            aria-label="关闭购物车"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "var(--weathered-taupe)" }}>
              <p style={{ fontSize: 15 }}>购物车是空的</p>
              <button
                onClick={onClose}
                style={{ marginTop: 16, background: "var(--charcoal-clay)", color: "var(--raw-linen)", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                去逛逛
              </button>
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 14 }}>
              {cart.map((item) => (
                <li key={item.id} style={{
                  display: "flex", gap: 12,
                  padding: 12, borderRadius: 8,
                  background: "rgba(255,252,245,0.9)",
                  border: "1px solid rgba(201,191,175,0.4)",
                }}>
                  <div style={{ width: 70, height: 70, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                    <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14, color: "var(--charcoal-clay)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name}
                    </p>
                    <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "var(--persimmon)" }}>¥{item.price}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={() => refresh(updateCartQty(item.id, -1))}
                        style={{ width: 26, height: 26, borderRadius: 4, border: "1px solid rgba(201,191,175,0.6)", background: "transparent", cursor: "pointer", fontSize: 16, lineHeight: 1, color: "var(--charcoal-clay)" }}
                      >−</button>
                      <span style={{ minWidth: 20, textAlign: "center", fontSize: 14, fontWeight: 600 }}>{item.quantity}</span>
                      <button
                        onClick={() => refresh(updateCartQty(item.id, 1))}
                        style={{ width: 26, height: 26, borderRadius: 4, border: "1px solid rgba(201,191,175,0.6)", background: "transparent", cursor: "pointer", fontSize: 16, lineHeight: 1, color: "var(--charcoal-clay)" }}
                      >+</button>
                      <button
                        onClick={() => refresh(removeFromCart(item.id))}
                        style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--weathered-taupe)", textDecoration: "underline" }}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: "16px 22px 24px", borderTop: "1px solid rgba(201,191,175,0.55)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 15, color: "var(--charcoal-clay)" }}>合计</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: "var(--persimmon)" }}>¥{total}</span>
            </div>
            <button
              onClick={onCheckout}
              style={{
                width: "100%", minHeight: 48, border: "none", borderRadius: 8,
                background: "var(--charcoal-clay)", color: "var(--raw-linen)",
                fontSize: 15, fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer",
                transition: "opacity 200ms ease",
              }}
            >
              去结算
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

// Export cart helpers for use elsewhere
export { getCart, saveCart, addToCart, removeFromCart, updateCartQty, clearCart };
export type { CartItem };