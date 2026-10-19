// src/components/Cart/CartSidebar.jsx
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaTrash, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import { getCart, removeFromCart, updateQty } from '@/lib/cart';
import CheckoutModal from './CheckoutModal';
import './CartSidebar.css';

const PLACEHOLDER = '/images/placeholder.png';

export default function CartSidebar({ open, onClose }) {
    const [cart, setCart] = useState([]);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [brokenImages, setBrokenImages] = useState({});

    const refresh = () => setCart(getCart());

    useEffect(() => {
        if (open) refresh();
    }, [open]);

    useEffect(() => {
        const onUpdate = () => refresh();
        window.addEventListener('cartUpdated', onUpdate);
        return () => window.removeEventListener('cartUpdated', onUpdate);
    }, []);

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    const handleRemove = (id) => {
        removeFromCart(id);
        window.dispatchEvent(new Event('cartUpdated'));
    };
    const handleQty = (id, qty) => {
        updateQty(id, qty);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleCheckoutSuccess = () => {
        setCheckoutOpen(false);
        onClose();
    };

    return (
        <>
            <div className={`cart-overlay ${open ? 'visible' : ''}`} onClick={onClose} />
            <aside className={`cart-sidebar ${open ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2><FaShoppingBag /> Корзина</h2>
                    <button className="cart-close" onClick={onClose}><FaTimes /></button>
                </div>

                <div className="cart-body">
                    {cart.length === 0 ? (
                        <div className="cart-empty">
                            <span>🍕</span>
                            <p>Корзина пуста</p>
                            <small>Добавьте что-нибудь из меню</small>
                        </div>
                    ) : (
                        cart.map((item) => {
                            const src = brokenImages[item.id]
                                ? PLACEHOLDER
                                : item.image || PLACEHOLDER;

                            return (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-img">
                                        <Image
                                            src={src}
                                            alt={item.name}
                                            fill
                                            sizes="64px"
                                            className="cart-item-photo"
                                            onError={() =>
                                                setBrokenImages((prev) => ({ ...prev, [item.id]: true }))
                                            }
                                        />
                                    </div>
                                    <div className="cart-item-info">
                                        <h4>{item.name}</h4>
                                        <p>{item.price.toLocaleString()} сум</p>
                                        <div className="cart-item-controls">
                                            <button onClick={() => handleQty(item.id, item.qty - 1)}><FaMinus /></button>
                                            <span>{item.qty}</span>
                                            <button onClick={() => handleQty(item.id, item.qty + 1)}><FaPlus /></button>
                                        </div>
                                    </div>
                                    <button className="cart-item-remove" onClick={() => handleRemove(item.id)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Итого:</span>
                            <strong>{total.toLocaleString()} сум</strong>
                        </div>
                        <button className="cart-checkout-btn" onClick={() => setCheckoutOpen(true)}>
                            Оформить заказ
                        </button>
                    </div>
                )}
            </aside>

            <CheckoutModal
                open={checkoutOpen}
                items={cart}
                total={total}
                onClose={() => setCheckoutOpen(false)}
                onSuccess={handleCheckoutSuccess}
            />
        </>
    );
}