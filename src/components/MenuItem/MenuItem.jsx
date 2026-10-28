// src/components/MenuItem/MenuItem.jsx
'use client';
import { useState } from 'react';
import Image from 'next/image';
import './MenuItem.css';

const PLACEHOLDER = '/images/placeholder.png';

export default function MenuItem({ item, onClick }) {
    const [imgError, setImgError] = useState(false);

    const meta = (() => {
        if (!item.variants) return null;
        const v = item.variants[0];
        if (v.pieces && v.grams) return `${v.pieces} шт · ${v.grams} г`;
        if (v.pieces) return `${v.pieces} шт`;
        if (v.grams) return `${v.grams} г`;
        return null;
    })();

    const src = imgError ? PLACEHOLDER : item.image || PLACEHOLDER;

    return (
        <article
            className={`menu-item${item.category === 'Акции' ? ' menu-item--promotion' : ''}`}
            onClick={() => onClick(item)}
        >
            <div className="menu-item-img">
                <Image
                    src={src}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 300px"
                    className="menu-item-photo"
                    onError={() => setImgError(true)}
                />
                {item.category && (
                    <span className="menu-item-badge">{item.category}</span>
                )}
                {item.category === 'Акции' && (
                    <span className="menu-item-promo-label">Спецпредложение</span>
                )}
            </div>

            <div className="menu-item-info">
                <h3>{item.name}</h3>
                {item.composition && (
                    <p className="menu-item-composition">{item.composition}</p>
                )}
                <div className="menu-item-bottom">
                    {meta && <span className="menu-item-weight">{meta}</span>}
                    {item.minPrice != null ? (
                        <span className="menu-item-price">
                            от {item.minPrice.toLocaleString()} сум
                        </span>
                    ) : (
                        <a
                            href="tel:+998934788885"
                            className="menu-item-price-phone"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Цену уточняйте: +998 93 478 88 85
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}