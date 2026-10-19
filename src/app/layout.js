// src/app/layout.jsx
import './globals.css';
import CartButton from '@/components/Cart/CartButton';

const SITE_URL = 'https://pizzatime.uz'; // при желании замените на реальный домен
const LOGO = '/images/logo.PNG';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Pizza Time Bukhara — Пицца, Суши и Роллы в Бухаре',
    template: '%s | Pizza Time Bukhara',
  },
  description:
    'Pizza Time Bukhara — доставка пиццы, свежих суши, роллов и фаст-фуда в Бухаре. Пицца из дровяной печи, роллы Филадельфия, Калифорния, запечённые и горячие роллы. Работаем ежедневно 10:00–00:00. Заказ: +998 93 478 88 85.',
  keywords: [
    'пицца Бухара',
    'суши Бухара',
    'роллы Бухара',
    'доставка пиццы Бухара',
    'доставка суши Бухара',
    'доставка роллов Бухара',
    'заказать пиццу Бухара',
    'заказать суши Бухара',
    'Филадельфия Бухара',
    'Калифорния Бухара',
    'запечённые роллы Бухара',
    'горячие роллы Бухара',
    'фаст-фуд Бухара',
    'Pizza Time Bukhara',
    'пиццерия Бухара',
    'суши-бар Бухара',
  ],
  authors: [{ name: 'Akbar Soft', url: 'https://www.akbarsoft.uz' }],
  creator: 'Akbar Soft',
  publisher: 'Pizza Time Bukhara',
  applicationName: 'Pizza Time Bukhara',
  category: 'food',
  alternates: {
    canonical: '/',
    languages: {
      ru: '/',
      uz: '/',
    },
  },
  icons: {
    icon: LOGO,
    shortcut: LOGO,
    apple: LOGO,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: 'Pizza Time Bukhara',
    title: 'Pizza Time Bukhara — Пицца, Суши и Роллы в Бухаре',
    description:
      'Доставка пиццы из дровяной печи, свежих суши, роллов и фаст-фуда по Бухаре. Ежедневно 10:00–00:00.',
    images: [
      {
        url: LOGO,
        width: 1200,
        height: 630,
        alt: 'Pizza Time Bukhara',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pizza Time Bukhara — Пицца, Суши и Роллы',
    description:
      'Доставка пиццы, суши и роллов в Бухаре. Ежедневно 10:00–00:00.',
    images: [LOGO],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#c8102e',
};

export default function RootLayout({ children }) {
  // JSON-LD организации + хлебных крошек
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Pizza Time Bukhara',
    image: `${SITE_URL}${LOGO}`,
    url: SITE_URL,
    telephone: ['+998934788885', '+998972922299'],
    priceRange: '$$',
    servesCuisine: ['Pizza', 'Sushi', 'Japanese', 'Fast Food'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Амир Темура, 1/1',
      addressLocality: 'Бухара',
      addressCountry: 'UZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.743122,
      longitude: 64.401846,
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
    sameAs: [
      'https://www.instagram.com/pizza_time_bukhara/',
      'https://t.me/pizza_time_bukhara',
    ],
    hasMenu: `${SITE_URL}/menu`,
  };

  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        {children}
        <CartButton />
      </body>
    </html>
  );
}