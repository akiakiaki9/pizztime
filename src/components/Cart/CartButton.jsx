// src/components/Cart/CartButton.jsx
'use client';
import { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { getCart } from '@/lib/cart';
import CartSidebar from './CartSidebar';
import './CartButton.css';

const readCartSummary = () => {
  const cart = getCart();
  return {
    cartCount: cart.reduce((s, i) => s + i.qty, 0),
    total: cart.reduce((s, i) => s + i.qty * i.price, 0),
  };
};

export default function CartButton() {
  const [{ cartCount, total }, setCartSummary] = useState(() => readCartSummary());
  const [open, setOpen] = useState(false);

  const refresh = () => {
    setCartSummary(readCartSummary());
  };

  useEffect(() => {
    const onCartUpdate = () => refresh();
    window.addEventListener('cartUpdated', onCartUpdate);
    window.addEventListener('storage', onCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', onCartUpdate);
      window.removeEventListener('storage', onCartUpdate);
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
      {open && <CartSidebar key={open ? 'cart-open' : 'cart-closed'} open={open} onClose={() => setOpen(false)} />}
    </>
  );
}