// src/app/page.jsx
'use client';
import { useState, useRef } from 'react';
import Header from '@/components/Header/Header';
import Carousel from '@/components/Carousel/Carousel';
import Footer from '@/components/Footer/Footer';
import MenuItem from '@/components/MenuItem/MenuItem';
import Modal from '@/components/Modal/Modal';
import Contacts from '@/components/Contacts/Contacts';
import { allMenu, allCategories } from '@/data';
import { addToCart } from '@/lib/cart';
import './page.css';

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [activeCat, setActiveCat] = useState('Все');
  const menuSectionRef = useRef(null);

  const handleAdd = (product) => {
    addToCart(product);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const filtered =
    activeCat === 'Все'
      ? allMenu
      : allMenu.filter((i) => i.category === activeCat);

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
      <Header />
      <Carousel />

      <div className="cat-bar">
        <div className="cat-scroll">
          {allCategories.map((cat) => (
            <button
              key={cat}
              className={`cat-chip${cat === 'Акции' ? ' cat-chip--promotion' : ''} ${activeCat === cat ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section ref={menuSectionRef} className="menu-section container" id="menu">
        <div className="menu-header">
          <h2>Меню</h2>
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

      <Contacts />
      <Footer />
      <Modal item={selected} onClose={() => setSelected(null)} onAdd={handleAdd} />
    </>
  );
}