// src/app/api/telegram/webhook/route.js
import { NextResponse } from 'next/server';

const TOKEN = process.env.TG_TOKEN;

// Отправка сообщения в Telegram
async function sendMessage(chatId, text, extra = {}) {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
            ...extra,
        }),
    });
    return res.json();
}

// Ответ на callback (убирает «часики» у inline-кнопок)
async function answerCallback(callbackQueryId) {
    await fetch(`https://api.telegram.org/bot${TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: callbackQueryId }),
    });
}

export async function POST(req) {
    try {
        // ===== Проверка секрета (опционально, но рекомендуется) =====
        const secret = req.headers.get('x-telegram-bot-api-secret-token');
        if (process.env.TG_WEBHOOK_SECRET && secret !== process.env.TG_WEBHOOK_SECRET) {
            return NextResponse.json({ ok: false }, { status: 401 });
        }

        const update = await req.json();

        // ===== 1. Обработка текстовых сообщений =====
        const message = update.message;
        if (message?.text) {
            const chatId = message.chat.id;
            const text = message.text.trim();
            const firstName = message.from?.first_name || 'друг';

            // /start
            if (text === '/start') {
                await sendMessage(
                    chatId,
                    `Привет, <b>${firstName}</b>! 👋\n\n` +
                    `Это бот <b>Pizza Time Bukhara</b> 🍕🍣\n\n` +
                    `Здесь вы можете:\n` +
                    `• посмотреть меню — /menu\n` +
                    `• связаться с нами — /contact\n` +
                    `• узнать о доставке — /delivery\n\n` +
                    `Или просто напишите нам — мы ответим!`
                );
                return NextResponse.json({ ok: true });
            }

            // /menu
            if (text === '/menu') {
                await sendMessage(
                    chatId,
                    `🍕 <b>Наше меню</b>\n\n` +
                    `Пицца, суши, роллы и фаст-фуд — всё свежее, готовим каждый день.\n\n` +
                    `👉 <a href="https://www.pizzatime.uz/menu">Открыть меню на сайте</a>`,
                    { disable_web_page_preview: true }
                );
                return NextResponse.json({ ok: true });
            }

            // /contact
            if (text === '/contact') {
                await sendMessage(
                    chatId,
                    `📞 <b>Связаться с нами</b>\n\n` +
                    `Телефоны:\n` +
                    `+998 93 478 88 85\n` +
                    `+998 97 292 22 99\n\n` +
                    `📍 Бухара, ул. Амир Темура, 1/1\n` +
                    `🕐 Ежедневно 10:00 – 00:00`
                );
                return NextResponse.json({ ok: true });
            }

            // /delivery
            if (text === '/delivery') {
                await sendMessage(
                    chatId,
                    `🚗 <b>Доставка</b>\n\n` +
                    `Доставляем по Бухаре ежедневно с 10:00 до 00:00.\n` +
                    `Среднее время доставки — 30–60 минут.\n\n` +
                    `Заказать можно на сайте: https://www.pizzatime.uz/menu`
                );
                return NextResponse.json({ ok: true });
            }

            // Любое другое сообщение
            await sendMessage(
                chatId,
                `Спасибо за сообщение! 🙌\n\n` +
                `Мы скоро ответим. А пока можете посмотреть /menu или позвонить нам:\n` +
                `+998 93 478 88 85`
            );
            return NextResponse.json({ ok: true });
        }

        // ===== 2. Обработка inline-кнопок =====
        const callback = update.callback_query;
        if (callback) {
            await answerCallback(callback.id);

            if (callback.data === 'show_menu') {
                await sendMessage(
                    callback.message.chat.id,
                    `🍕 <b>Меню</b>\n👉 https://www.pizzatime.uz/menu`
                );
            }
            return NextResponse.json({ ok: true });
        }

        // Всё остальное игнорируем, но отвечаем 200, чтобы Telegram не ретраил
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[telegram webhook] error:', err);
        // Всегда возвращаем 200, чтобы Telegram не зациклил ретраи
        return NextResponse.json({ ok: true });
    }
}

// GET — для проверки, что роут жив
export async function GET() {
    return NextResponse.json({ ok: true, service: 'telegram-webhook' });
}