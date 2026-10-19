// src/components/Contacts/Contacts.jsx
'use client';
import {
    FaMapMarkerAlt,
    FaClock,
    FaPhone,
    FaInstagram,
    FaTelegram,
    FaRoute,
} from 'react-icons/fa';
import './Contacts.css';

const MAPS_URL = 'https://yandex.uz/maps/?pt=64.401846,39.743122&z=17&l=map';
const ROUTE_URL =
    'https://yandex.uz/maps/?rtext=~39.743122,64.401846&rtt=auto';
const EMBED_URL =
    'https://yandex.uz/map-widget/v1/?ll=64.401846%2C39.743122&z=16&pt=64.401846,39.743122,pm2rdm';

export default function Contacts() {
    return (
        <section className="contacts container" id="contacts">
            <div className="contacts-header">
                <h2>Контакты</h2>
                <p>Заходите к нам или закажите доставку</p>
            </div>

            <div className="contacts-grid">
                {/* ====== Информация ====== */}
                <div className="contacts-info">
                    <div className="contact-row">
                        <span className="contact-icon"><FaMapMarkerAlt /></span>
                        <div>
                            <h4>Адрес</h4>
                            <p>Бухара, ул. Амир Темура, 1/1</p>
                        </div>
                    </div>

                    <div className="contact-row">
                        <span className="contact-icon"><FaClock /></span>
                        <div>
                            <h4>Время работы</h4>
                            <p>Ежедневно 10:00 – 00:00</p>
                        </div>
                    </div>

                    <div className="contact-row">
                        <span className="contact-icon"><FaPhone /></span>
                        <div>
                            <h4>Телефоны</h4>
                            <a href="tel:+998934788885">+998 93 478 88 85</a>
                            <a href="tel:+998972922299">+998 97 292 22 99</a>
                        </div>
                    </div>

                    <div className="contact-socials">
                        <a
                            href="https://www.instagram.com/pizza_time_bukhara/"
                            target="_blank"
                            rel="noreferrer"
                            className="social-btn instagram"
                            aria-label="Instagram"
                        >
                            <FaInstagram /> Instagram
                        </a>
                        <a
                            href="https://t.me/pizza_time_bukhara"
                            target="_blank"
                            rel="noreferrer"
                            className="social-btn telegram"
                            aria-label="Telegram"
                        >
                            <FaTelegram /> Telegram
                        </a>
                    </div>

                    <div className="contact-actions">
                        <a
                            href={ROUTE_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary"
                        >
                            <FaRoute /> Построить маршрут
                        </a>
                        <a
                            href={MAPS_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary"
                        >
                            <FaMapMarkerAlt /> Открыть в картах
                        </a>
                    </div>
                </div>

                {/* ====== Карта ====== */}
                <div className="contacts-map">
                    <iframe
                        src={EMBED_URL}
                        title="Pizza Time на карте"
                        loading="lazy"
                        allowFullScreen
                    />
                </div>
            </div>
        </section>
    );
}