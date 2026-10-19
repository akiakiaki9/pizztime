// src/components/Cart/CartButton.jsx
'use client';
import { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { getCart } from '@/lib/cart';
import CartSidebar from './CartSidebar';
import './CartButton.css';

export default function CartButton() {
  const [cartCount, setCartCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);

  const refresh = () => {
    const cart = getCart();
    setCartCount(cart.reduce((s, i) => s + i.qty, 0));
    setTotal(cart.reduce((s, i) => s + i.qty * i.price, 0));
  };

  useEffect(() => {
    refresh();
    window.addEventListener('cartUpdated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('cartUpdated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return (
    <>
      <button
        className={`floating-cart ${cartCount > 0 ? 'has-items' : ''}`}
        onClick={() => setOpen(true)}
        aria-label="Открыть корзину"
      >
        <FaShoppingCart className="floating-cart-icon" />
        {cartCount > 0 ? (
          <>
            <span className="floating-cart-qty">{cartCount}</span>
            <span className="floating-cart-total">{total.toLocaleString()} сум</span>
          </>
        ) : (
          <span className="floating-cart-label">Корзина</span>
        )}
      </button>
      <CartSidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
}