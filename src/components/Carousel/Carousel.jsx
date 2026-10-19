// src/components/Carousel/Carousel.jsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Carousel.css';

const slides = [
    {
        id: 1,
        title: 'Свежие суши и роллы',
        subtitle: 'Готовим из отборной рыбы каждый день',
        image: '/images/hero-1.png',
    },
    {
        id: 2,
        title: 'Сочная пицца',
        subtitle: 'Из дровяной печи — настоящий итальянский вкус',
        image: '/images/hero-2.png',
    },
    {
        id: 3,
        title: 'Вкусный фаст-фуд',
        subtitle: 'Бургеры, картофель фри и крылышки',
        image: '/images/hero-3.png',
    },
];

export default function Carousel() {
    const [current, setCurrent] = useState(0);

    const next = useCallback(
        () => setCurrent((prev) => (prev + 1) % slides.length),
        []
    );
    const prev = () =>
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const timer = setInterval(next, 6000);
        return () => clearInterval(timer);
    }, [next]);

    return (
        <section className="carousel">
            {slides.map((slide, i) => (
                <div
                    key={slide.id}
                    className={`carousel-slide ${i === current ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${slide.image})` }}
                >
                    <div className="carousel-overlay" />
                    <div className="carousel-content">
                        <h1>{slide.title}</h1>
                        <p>{slide.subtitle}</p>
                    </div>
                </div>
            ))}

            <button className="carousel-btn left" onClick={prev} aria-label="Назад">
                <FaChevronLeft />
            </button>
            <button className="carousel-btn right" onClick={next} aria-label="Вперёд">
                <FaChevronRight />
            </button>

            <div className="carousel-dots">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        className={`dot ${i === current ? 'active' : ''}`}
                        onClick={() => setCurrent(i)}
                        aria-label={`Слайд ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}