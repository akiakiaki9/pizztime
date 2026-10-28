// src/components/Modal/Modal.jsx
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaPlus, FaPhone } from 'react-icons/fa';
import './Modal.css';

const PLACEHOLDER = '/images/placeholder.png';

export default function Modal({ item, onClose, onAdd }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!item) return;
    setVariantIndex(0);
    setImgError(false);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [item]);

  if (!item) return null;

  const hasVariants = Array.isArray(item.variants) && item.variants.length > 0;
  const variant = hasVariants ? item.variants[variantIndex] : null;
  const priceAvailable = hasVariants && variant?.price != null;
  const src = imgError ? PLACEHOLDER : item.image || PLACEHOLDER;

  // Функция для формирования подписи (0.5 л, 25 см, 8 шт, 118 г)
  const getVariantLabel = (v) => {
    if (v.label) return v.label;
    if (v.size) return `${v.size} см`;
    if (v.pieces) return `${v.pieces} шт`;
    if (v.grams) return `${v.grams} г`;
    return '';
  };

  const handleAdd = () => {
    if (!priceAvailable) return;
    
    const label = getVariantLabel(variant);
    
    onAdd({
      id: `${item.source}-${item.id}-${variant.size ?? 'x'}-${variant.pieces ?? 'x'}-${variant.grams ?? 'x'}-${variant.label ?? 'x'}`,
      productId: item.id,
      source: item.source,
      name: label ? `${item.name} (${label})` : item.name,
      price: variant.price,
      image: src,
    });
    if (item.containerPrice) {
      onAdd({
        id: `${item.source}-${item.id}-container`,
        productId: `${item.id}-container`,
        source: item.source,
        name: `Контейнер для ${item.name} (1 кг)`,
        price: item.containerPrice,
        image: src,
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">
          <FaTimes />
        </button>

        <div className="modal-img">
          <Image
            src={src}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="modal-photo"
            onError={() => setImgError(true)}
          />
        </div>

        <h2>{item.name}</h2>
        {item.composition && (
          <p className="modal-composition">{item.composition}</p>
        )}

        {hasVariants && (
          <div className="modal-variants">
            {item.variants.map((v, i) => (
              <button
                key={i}
                className={`variant-btn ${i === variantIndex ? 'active' : ''}`}
                onClick={() => setVariantIndex(i)}
              >
                <span className="variant-pieces">
                  {getVariantLabel(v) || '—'}
                </span>
                <span className="variant-price">
                  {v.price != null ? `${v.price.toLocaleString()} сум` : 'уточнить'}
                </span>
              </button>
            ))}
          </div>
        )}

        {priceAvailable ? (
          <button className="modal-add" onClick={handleAdd}>
            <FaPlus /> В корзину · {variant.price.toLocaleString()} сум
          </button>
        ) : (
          <a href="tel:+998934788885" className="modal-add modal-add--phone">
            <FaPhone /> Уточнить цену: +998 93 478 88 85
          </a>
        )}
      </div>
    </div>
  );
}