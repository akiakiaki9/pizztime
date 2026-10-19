// src/lib/cart.js
const CART_KEY = 'pizza_time_cart';

export function getCart() {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

export function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item) {
    const cart = getCart();
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    saveCart(cart);
    return cart;
}

export function removeFromCart(id) {
    const cart = getCart().filter((i) => i.id !== id);
    saveCart(cart);
    return cart;
}

export function updateQty(id, qty) {
    const cart = getCart();
    const item = cart.find((i) => i.id === id);
    if (item) {
        if (qty <= 0) return removeFromCart(id);
        item.qty = qty;
    }
    saveCart(cart);
    return cart;
}

export function clearCart() {
    saveCart([]);
}