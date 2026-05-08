// Shared cart state manager - use in any component via useCart()
const CART_KEY = "lazyjam_cart";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // Update all cart-count elements in the DOM
  if (typeof document !== "undefined") {
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    const els = document.querySelectorAll("[data-cart-count]");
    els.forEach((el) => { el.textContent = String(count); });
  }
}

export function addToCart(item: Omit<CartItem, "quantity">, qty = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...item, quantity: qty });
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(id: string) {
  const cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
  return cart;
}

export function updateCartQty(id: string, delta: number) {
  const cart = getCart().map((i) =>
    i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
  );
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
  return [];
}