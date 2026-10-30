// src/components/Footer/Footer.jsx
'use client';
import Link from 'next/link';
import {
  FaInstagram,
  FaTelegram,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
} from 'react-icons/fa';
import './Footer.css';

export default function Footer() {

  return (
    <footer className="footer">
      <div className="container footer-inner">
        {/* ====== Колонка 1: Бренд + адрес ====== */}
        <div className="footer-col footer-brand">
          <div className="footer-logo">
            Pizza<span>Time</span>
          </div>
          <p className="footer-tagline">Вкус, который объединяет</p>
          <ul className="footer-info">
            <li>
              <FaMapMarkerAlt />
              <span>Бухара, ул. Амир Темура, 1/1</span>
            </li>
            <li>
              <FaClock />
              <span>Ежедневно 10:00 – 00:00</span>
            </li>
          </ul>
        </div>

        {/* ====== Колонка 2: Навигация ====== */}
        <div className="footer-col">
          <h4>Навигация</h4>
          <ul className="footer-links">
            <li><Link href="/">Главная</Link></li>
            <li><Link href="/menu">Меню</Link></li>
            <li><Link href="/#contacts">Контакты</Link></li>
          </ul>
        </div>

        {/* ====== Колонка 3: Контакты + соцсети ====== */}
        <div className="footer-col">
          <h4>Связаться с нами</h4>
          <ul className="footer-links footer-phones">
            <li>
              <a href="tel:+998934788885">
                <FaPhone /> +998 93 478 88 85
              </a>
            </li>
            <li>
              <a href="tel:+998972922299">
                <FaPhone /> +998 97 292 22 99
              </a>
            </li>
          </ul>
          <div className="footer-social">
            <a
              href="https://www.instagram.com/pizza_time_bukhara/"
              target="_blank"
              rel="noreferrer"
              className="social-icon instagram"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://t.me/pizza_time_bukhara"
              target="_blank"
              rel="noreferrer"
              className="social-icon telegram"
              aria-label="Telegram"
            >
              <FaTelegram />
            </a>
          </div>
        </div>
      </div>

      {/* ====== Нижняя панель ====== */}
      <div className="container footer-bottom">
        <span>© Pizza Time Bukhara. Все права защищены.</span>
        <span className="footer-dev">
          Разработал{' '}
          <a href="https://www.akbarsoft.uz" target="_blank" rel="noreferrer">
            Akbar Soft
          </a>
        </span>
      </div>
    </footer>
  );
}