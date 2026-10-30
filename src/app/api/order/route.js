
import { NextResponse } from 'next/server';

// Экранирование HTML-спецсимволов
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export async function POST(req) {
  try {
    const { items, total, customer, coords } = await req.json();

    // ===== ВАЛИДАЦИЯ =====
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Корзина пуста' },
        { status: 400 }
      );
    }

    if (!customer?.name || !customer?.phone) {
      return NextResponse.json(
        { ok: false, error: 'Не хватает данных клиента' },
        { status: 400 }
      );
    }

    // ===== TELEGRAM НАСТРОЙКИ =====
    const token = process.env.TG_TOKEN;

    // Получаем все ID администраторов из TG_CHAT_IDS
    const chatIds = (process.env.TG_CHAT_IDS || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    if (!token || chatIds.length === 0) {
      console.error('[order] TG_TOKEN или TG_CHAT_IDS не заданы');

      return NextResponse.json(
        { ok: false, error: 'Сервер не настроен' },
        { status: 500 }
      );
    }

    // ===== СОСТАВ ЗАКАЗА =====
    const lines = items
      .map((i) => {
        const qty = Number(i.qty);
        const price = Number(i.price);

        return `• ${esc(i.name)} × ${qty} — ${(price * qty).toLocaleString('ru-RU')} сум`;
      })
      .join('\n');

    // ===== МАРШРУТ =====
    let routeBlock = '';
    let inlineKeyboard = null;

    if (
      coords?.lat != null &&
      coords?.lng != null &&
      Number.isFinite(Number(coords.lat)) &&
      Number.isFinite(Number(coords.lng))
    ) {
      const lat = Number(coords.lat).toFixed(6);
      const lng = Number(coords.lng).toFixed(6);

      const yandexRoute =
        `https://yandex.uz/maps/?rtext=~${lat},${lng}&rtt=auto`;

      const googleRoute =
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

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

    // ===== ТЕКСТ ЗАКАЗА =====
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
      `🕐 ${new Date().toLocaleString('ru-RU', {
        timeZone: 'Asia/Tashkent',
      })}`,
    ]
      .filter(Boolean)
      .join('\n');

    // ===== ОТПРАВКА ВСЕМ АДМИНИСТРАТОРАМ =====
    const results = await Promise.all(
      chatIds.map(async (chatId) => {
        try {
          const tgRes = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                ...(inlineKeyboard && {
                  reply_markup: inlineKeyboard,
                }),
              }),
            }
          );

          const tgData = await tgRes.json();

          return {
            chatId,
            ok: tgRes.ok && tgData.ok,
            error: tgData.description || null,
          };
        } catch (error) {
          return {
            chatId,
            ok: false,
            error: error.message,
          };
        }
      })
    );

    // ===== ПРОВЕРКА РЕЗУЛЬТАТОВ =====
    const sent = results.filter((result) => result.ok);
    const failed = results.filter((result) => !result.ok);

    if (sent.length === 0) {
      console.error('[order] Не удалось отправить заказ ни одному администратору:', failed);

      return NextResponse.json(
        {
          ok: false,
          error: 'Не удалось отправить заказ администраторам',
        },
        { status: 502 }
      );
    }

    if (failed.length > 0) {
      console.error('[order] Заказ отправлен не всем администраторам:', failed);
    }

    console.log(`[order] Заказ успешно отправлен ${sent.length} администраторам`);

    return NextResponse.json({ ok: true, partial: failed.length > 0 });

  } catch (err) {
    console.error('[order] fatal:', err);

    return NextResponse.json(
      { ok: false, error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
