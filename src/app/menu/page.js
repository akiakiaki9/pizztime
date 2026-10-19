// src/app/menu/page.jsx
import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import MenuClient from './MenuClient';
import { allMenu } from '@/data';
import './page.css';

const SITE_URL = 'https://pizzatime.uz';
const LOGO = '/images/logo.PNG';

export const metadata = {
    title: 'Заказать пиццу, суши и роллы в Бухаре — Меню и цены | Pizza Time',
    description:
        'Закажите пиццу, суши, роллы или фаст-фуд в Бухаре с доставкой за 30–60 минут. Свежие роллы Филадельфия и Калифорния, пицца из дровяной печи, сеты и закуски. Онлайн-заказ: +998 93 478 88 85. Работаем ежедневно 10:00–00:00.',
    keywords: [
        'заказать пиццу Бухара',
        'заказать суши Бухара',
        'заказать роллы Бухара',
        'доставка пиццы Бухара',
        'доставка суши Бухара',
        'доставка роллов Бухара',
        'суши на дом Бухара',
        'роллы на дом Бухара',
        'пицца на дом Бухара',
        'заказ еды Бухара',
        'доставка еды Бухара',
        'купить суши Бухара',
        'купить роллы Бухара',
        'купить пиццу Бухара',
        'меню и цены Бухара',
        'Пицца Тайм Бухара',
        'Pizza Time Bukhara',
    ],
    alternates: { canonical: '/menu' },
    openGraph: {
        title: 'Заказать пиццу, суши и роллы в Бухаре — Pizza Time',
        description:
            'Доставка пиццы, суши и роллов по Бухаре за 30–60 минут. Онлайн-заказ: +998 93 478 88 85.',
        url: `${SITE_URL}/menu`,
        siteName: 'Pizza Time Bukhara',
        images: [
            {
                url: LOGO,
                width: 1200,
                height: 630,
                alt: 'Заказать пиццу и суши в Бухаре — Pizza Time',
            },
        ],
        locale: 'ru_RU',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Заказать пиццу, суши и роллы в Бухаре',
        description: 'Доставка за 30–60 минут. Онлайн-заказ: +998 93 478 88 85.',
        images: [LOGO],
    },
};

export default function MenuPage() {
    // Полное меню
    const jsonLdMenu = {
        '@context': 'https://schema.org',
        '@type': 'Menu',
        name: 'Меню Pizza Time Bukhara — заказать пиццу, суши и роллы',
        inLanguage: 'ru-RU',
        hasMenuSection: [...new Set(allMenu.map((i) => i.category))].map(
            (category) => ({
                '@type': 'MenuSection',
                name: category,
                hasMenuItem: allMenu
                    .filter((i) => i.category === category)
                    .map((item) => ({
                        '@type': 'MenuItem',
                        name: item.name,
                        description: item.composition || undefined,
                        image: item.image
                            ? `${SITE_URL}${item.image}`
                            : undefined,
                        offers:
                            item.minPrice != null
                                ? {
                                    '@type': 'Offer',
                                    price: item.minPrice,
                                    priceCurrency: 'UZS',
                                    availability: 'https://schema.org/InStock',
                                    url: `${SITE_URL}/menu`,
                                }
                                : undefined,
                    })),
            })
        ),
    };

    // Хлебные крошки
    const jsonLdBreadcrumbs = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Меню', item: `${SITE_URL}/menu` },
        ],
    };

    // Категория «доставка» — акцент на заказе
    const jsonLdService = {
        '@context': 'https://schema.org',
        '@type': 'FoodEstablishment',
        name: 'Pizza Time Bukhara — доставка пиццы, суши и роллов',
        url: `${SITE_URL}/menu`,
        image: `${SITE_URL}${LOGO}`,
        telephone: ['+998934788885', '+998972922299'],
        servesCuisine: ['Pizza', 'Sushi', 'Japanese', 'Fast Food'],
        priceRange: '$$',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'ул. Амир Темура, 1/1',
            addressLocality: 'Бухара',
            addressCountry: 'UZ',
        },
        areaServed: {
            '@type': 'City',
            name: 'Бухара',
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                ],
                opens: '10:00',
                closes: '00:00',
            },
        ],
        potentialAction: {
            '@type': 'OrderAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `tel:+998934788885`,
                actionPlatform: [
                    'http://schema.org/MobileWebPlatform',
                    'http://schema.org/DesktopWebPlatform',
                ],
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdMenu) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }}
            />

            <Header />

            <section className="menu-hero">
                <div
                    className="menu-hero-bg"
                    style={{ backgroundImage: 'url(/images/bg.png)' }}
                />
                <div className="menu-hero-overlay" />
                <div className="container menu-hero-content">
                    <nav className="breadcrumbs" aria-label="Хлебные крошки">
                        <Link href="/">Главная</Link>
                        <span>/</span>
                        <span className="current">Заказать</span>
                    </nav>
                    <h1>Заказать пиццу, суши и роллы в Бухаре</h1>
                    <p>
                        Свежие роллы, суши и пицца из дровяной печи — с доставкой за 30–60
                        минут. Выберите блюда и оформите заказ за пару кликов.
                    </p>
                </div>
            </section>

            <MenuClient />
            <Footer />
        </>
    );
}