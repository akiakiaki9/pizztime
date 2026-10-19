// src/components/Cart/CheckoutModal.jsx
'use client';
import { useState } from 'react';
import { FaTimes, FaTelegram, FaCheckCircle } from 'react-icons/fa';
import { clearCart } from '@/lib/cart';
import './CheckoutModal.css';

export default function CheckoutModal({ open, items, total, onClose, onSuccess }) {
    const [form, setForm] = useState({ name: '', phone: '', address: '', comment: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    if (!open) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const validate = () => {
        if (!form.name.trim()) return 'Введите имя';
        if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 9) return 'Введите корректный телефон';
        if (!form.address.trim()) return 'Введите адрес доставки';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }

        setSending(true);
        try {
            const res = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, total, customer: form }),
            });
            if (res.ok) {
                clearCart();
                window.dispatchEvent(new Event('cartUpdated'));
                setSent(true);
                setTimeout(() => {
                    setSent(false);
                    setForm({ name: '', phone: '', address: '', comment: '' });
                    onSuccess();
                }, 2500);
            } else {
                setError('Не удалось отправить заказ. Попробуйте позвонить нам.');
            }
        } catch {
            setError('Ошибка сети. Попробуйте позвонить нам.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="checkout-overlay" onClick={onClose}>
            <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
                <button className="checkout-close" onClick={onClose}><FaTimes /></button>
                {sent ? (
                    <div className="checkout-success">
                        <FaCheckCircle className="success-icon" />
                        <h3>Заказ отправлен!</h3>
                        <p>Мы свяжемся с вами для подтверждения.</p>
                    </div>
                ) : (
                    <>
                        <h2>Оформление заказа</h2>
                        <p className="checkout-subtitle">
                            {items.reduce((s, i) => s + i.qty, 0)} поз. на сумму {total.toLocaleString()} сум
                        </p>
                        <form onSubmit={handleSubmit} className="checkout-form">
                            <label>Имя*
                                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Как к вам обращаться" />
                            </label>
                            <label>Телефон*
                                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+998 __ ___ __ __" />
                            </label>
                            <label>Адрес доставки*
                                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Улица, дом, квартира" />
                            </label>
                            <label>Комментарий
                                <textarea name="comment" value={form.comment} onChange={handleChange} placeholder="Например: без лука" rows={3} />
                            </label>
                            {error && <div className="checkout-error">{error}</div>}
                            <button type="submit" className="checkout-submit" disabled={sending}>
                                <FaTelegram /> {sending ? 'Отправка...' : 'Отправить заказ в Telegram'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}