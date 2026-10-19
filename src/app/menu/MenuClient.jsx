// src/app/menu/MenuClient.jsx
'use client';
import { useState, useRef } from 'react';
import MenuItem from '@/components/MenuItem/MenuItem';
import Modal from '@/components/Modal/Modal';
import { allMenu, allCategories } from '@/data';
import { addToCart } from '@/lib/cart';
import './page.css';

export default function MenuClient() {
    const [selected, setSelected] = useState(null);
    const [activeCat, setActiveCat] = useState('Все');
    const menuSectionRef = useRef(null);

    const filtered =
        activeCat === 'Все'
            ? allMenu
            : allMenu.filter((i) => i.category === activeCat);

    const handleAdd = (product) => {
        addToCart(product);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleCategoryClick = (cat) => {
        setActiveCat(cat);
        requestAnimationFrame(() => {
            if (!menuSectionRef.current) return;
            const top =
                menuSectionRef.current.getBoundingClientRect().top +
                window.scrollY;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    };

    return (
        <>
            <div className="cat-bar">
                <div className="cat-scroll">
                    {allCategories.map((cat) => (
                        <button
                            key={cat}
                            className={`cat-chip ${activeCat === cat ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <section ref={menuSectionRef} className="menu-section container">
                <div className="menu-header">
                    <h2>{activeCat === 'Все' ? 'Всё меню' : activeCat}</h2>
                    <span className="menu-count">
                        {filtered.length} {filtered.length === 1 ? 'блюдо' : 'блюд'}
                    </span>
                </div>
                <div className="menu-grid">
                    {filtered.map((item) => (
                        <MenuItem
                            key={`${item.source}-${item.id}`}
                            item={item}
                            onClick={setSelected}
                        />
                    ))}
                </div>
            </section>

            <Modal item={selected} onClose={() => setSelected(null)} onAdd={handleAdd} />
        </>
    );
}