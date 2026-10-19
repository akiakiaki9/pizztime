// src/components/Header/Header.jsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FaPhone, FaInstagram, FaTelegram, FaBars, FaTimes } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import './Header.css';

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const closeMobile = () => setMobileOpen(false);

    return (
        <>
            <header className="header">
                <div className="container header-inner">
                    <Link href="/" className="logo" onClick={closeMobile}>
                        <Image
                            src="/images/logo.png"
                            alt="Pizza Time"
                            width={44}
                            height={44}
                            className="logo-img"
                            priority
                        />
                        <span className="logo-text">Pizza<span>Time</span></span>
                    </Link>

                    <nav className="nav">
                        <Link href="/">Главная</Link>
                        <Link href="/menu">Меню</Link>
                    </nav>

                    <div className="header-contacts">
                        <a href="tel:+998934788885" className="phone-link">
                            <FaPhone /> <span>+998 93 478 88 85</span>
                        </a>
                        <a href="https://www.instagram.com/pizza_time_bukhara/" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://t.me/pizza_time_bukhara" target="_blank" rel="noreferrer" aria-label="Telegram">
                            <FaTelegram />
                        </a>
                    </div>

                    <button
                        className="burger"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Открыть меню"
                    >
                        <FaBars />
                    </button>
                </div>
            </header>

            <div
                className={`mobile-overlay ${mobileOpen ? 'visible' : ''}`}
                onClick={closeMobile}
            />
            <aside className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <Link href="/" className="logo" onClick={closeMobile}>
                        <Image src="/images/logo.png" alt="Pizza Time" width={36} height={36} className="logo-img" />
                        <span className="logo-text">Pizza<span>Time</span></span>
                    </Link>
                    <button className="mobile-close" onClick={closeMobile} aria-label="Закрыть">
                        <FaTimes />
                    </button>
                </div>

                <nav className="mobile-nav">
                    <Link href="/" onClick={closeMobile}>Главная</Link>
                    <Link href="/menu" onClick={closeMobile}>Меню</Link>
                    <Link href="/#contacts" onClick={closeMobile}>Контакты</Link>
                </nav>

                <div className="mobile-contacts">
                    <a href="tel:+998934788885"><FaPhone /> +998 93 478 88 85</a>
                    <a href="tel:+998972922299"><FaPhone /> +998 97 292 22 99</a>
                    <div className="mobile-socials">
                        <a href="https://www.instagram.com/pizza_time_bukhara/" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://t.me/pizza_time_bukhara" target="_blank" rel="noreferrer" aria-label="Telegram">
                            <FaTelegram />
                        </a>
                    </div>
                </div>
            </aside>
        </>
    );
}