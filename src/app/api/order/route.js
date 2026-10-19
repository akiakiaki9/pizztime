// src/app/api/order/route.js
import { NextResponse } from 'next/server';

// Экранируем HTML-спецсимволы, чтобы Telegram не ругался на <, >, &
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export async function POST(req) {
  try {
    const { items, total, customer, coords } = await req.json();

    // ===== Валидация =====
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: 'Корзина пуста' }, { status: 400 });
    }
    if (!customer?.name || !customer?.phone) {
      return NextResponse.json(
        { ok: false, error: 'Не хватает данных клиента' },
        { status: 400 }
      );
    }

    const token = process.env.TG_TOKEN;
    const chatId = process.env.TG_CHAT_ID;
    if (!token || !chatId) {
      console.error('[order] TG_TOKEN или TG_CHAT_ID не заданы');
      return NextResponse.json(
        { ok: false, error: 'Сервер не настроен' },
        { status: 500 }
      );
    }

    // ===== Состав заказа =====
    const lines = items
      .map(
        (i) =>
          `• ${esc(i.name)} × ${i.qty} — ${(i.price * i.qty).toLocaleString('ru-RU')} сум`
      )
      .join('\n');

    // ===== Маршрут =====
    let routeBlock = '';
    let inlineKeyboard = null;

    if (coords?.lat && coords?.lng) {
      const lat = Number(coords.lat).toFixed(6);
      const lng = Number(coords.lng).toFixed(6);
      const yandexRoute = `https://yandex.uz/maps/?rtext=~${lat},${lng}&rtt=auto`;
      const googleRoute = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

      routeBlock = [
        '',
        '📍 <b>Маршрут до клиента</b>',
        `Координаты: ${lat}, ${lng}`,
      ].join('\n');

      inlineKeyboard = {
        inline_keyboard: [
          [
            { text: '🚗 Яндекс.Карты', url: yandexRoute },
            { text: '🗺 Google Maps', url: googleRoute },
          ],
        ],
      };
    }

    // ===== Текст сообщения =====
    const text = [
      '🍕 <b>Новый заказ Pizza Time</b>',
      '',
      '👤 <b>Клиент</b>',
      `Имя: ${esc(customer.name)}`,
      `Телефон: ${esc(customer.phone)}`,
      customer.address ? `Адрес: ${esc(customer.address)}` : null,
      customer.comment ? `Комментарий: ${esc(customer.comment)}` : null,
      routeBlock || null,
      '',
      '🛒 <b>Состав заказа</b>',
      lines,
      '',
      `💰 <b>Итого: ${Number(total).toLocaleString('ru-RU')} сум</b>`,
      '',
      `🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}`,
    ]
      .filter(Boolean)
      .join('\n');

    // ===== Отправка в Telegram =====
    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          ...(inlineKeyboard && { reply_markup: inlineKeyboard }),
        }),
      }
    );

    const tgData = await tgRes.json();

    if (!tgRes.ok || !tgData.ok) {
      console.error('[order] Telegram error:', tgData);
      return NextResponse.json(
        { ok: false, error: 'Не удалось отправить в Telegram' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[order] fatal:', err);
    return NextResponse.json(
      { ok: false, error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}