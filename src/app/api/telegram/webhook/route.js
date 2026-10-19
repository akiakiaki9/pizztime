// src/app/api/telegram/webhook/route.js
import { NextResponse } from 'next/server';

const TOKEN = process.env.TG_TOKEN;
const ADMIN_CHAT_ID = process.env.TG_CHAT_ID;

// ===== Хранилище состояний (в памяти процесса) =====
// В проде лучше заменить на Redis/KV. Пока для пиццерии хватает.
const states = new Map();

// ===== Утилиты =====
async function tg(method, body) {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return res.json();
}

const sendMessage = (chat_id, text, extra = {}) =>
    tg('sendMessage', { chat_id, text, parse_mode: 'HTML', ...extra });

const sendLocation = (chat_id, lat, lng) =>
    tg('sendLocation', { chat_id, latitude: lat, longitude: lng });

const answerCallback = (callback_query_id) =>
    tg('answerCallbackQuery', { callback_query_id });

const esc = (s) =>
    String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ===== Основная клавиатура (снизу) =====
const mainKeyboard = {
    keyboard: [
        [{ text: '🍕 Меню' }, { text: '🛒 Сделать заказ' }],
        [{ text: '📞 Позвонить' }, { text: '📍 Адрес' }],
    ],
    resize_keyboard: true,
    is_persistent: true,
};

const cancelKeyboard = {
    keyboard: [[{ text: '❌ Отменить' }]],
    resize_keyboard: true,
};

// ===== Приветствие =====
const welcomeText = (name) =>
    `Привет, <b>${esc(name)}</b>! 👋\n\n` +
    `Это бот <b>Pizza Time Bukhara</b> 🍕🍣\n\n` +
    `Выберите, что вас интересует — кнопки внизу 👇`;

// ===== Текст меню =====
const menuText = () =>
    `🍕 <b>Наше меню</b>\n\n` +
    `Пицца, суши, роллы и фаст-фуд — всё свежее, готовим каждый день.\n\n` +
    `👉 Открыть меню: https://www.pizzatime.uz/menu`;

// ===== Контакты =====
const contactText = () =>
    `📞 <b>Связаться с нами</b>\n\n` +
    `+998 93 478 88 85\n` +
    `+998 97 292 22 99\n\n` +
    `🕐 Ежедневно 10:00 – 00:00`;

// ===== Адрес =====
const addressText = () =>
    `📍 <b>Мы находимся здесь</b>\n\n` +
    `Бухара, ул. Амир Темура, 1/1\n\n` +
    `Нажмите кнопку ниже, чтобы построить маршрут 👇`;

// ===== Обработка /start =====
async function handleStart(chatId, firstName) {
    states.delete(chatId);
    await sendMessage(chatId, welcomeText(firstName), {
        reply_markup: mainKeyboard,
    });
}

// ===== Обработка /menu, кнопка «Меню» =====
async function handleMenu(chatId) {
    await sendMessage(chatId, menuText(), {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🍕 Открыть меню', url: 'https://www.pizzatime.uz/menu' }],
                [{ text: '🛒 Сделать заказ', callback_data: 'start_order' }],
            ],
        },
    });
}

// ===== Обработка «Позвонить» =====
async function handleCall(chatId) {
    await sendMessage(chatId, contactText(), {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📞 Позвонить +998 93 478 88 85', url: 'tel:+998934788885' }],
                [{ text: '📞 Позвонить +998 97 292 22 99', url: 'tel:+998972922299' }],
            ],
        },
    });
}

// ===== Обработка «Адрес» =====
async function handleAddress(chatId) {
    // Отправляем точку на карте + маршрут
    await sendLocation(chatId, 39.743122, 64.401846);
    await sendMessage(chatId, addressText(), {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '🚗 Маршрут в Яндекс.Картах',
                        url: 'https://yandex.uz/maps/?rtext=~39.743122,64.401846&rtt=auto',
                    },
                ],
                [
                    {
                        text: '🗺 Google Maps',
                        url: 'https://www.google.com/maps/dir/?api=1&destination=39.743122,64.401846&travelmode=driving',
                    },
                ],
            ],
        },
    });
}

// ===== Пошаговый заказ =====
async function handleOrderStart(chatId) {
    states.set(chatId, { step: 'name', data: {} });
    await sendMessage(
        chatId,
        `🛒 <b>Оформление заказа</b>\n\n` +
        `Шаг 1 из 4: как к вам обращаться?\n\n` +
        `Напишите имя:`,
        { reply_markup: cancelKeyboard }
    );
}

async function handleOrderStep(chatId, text, state) {
    const { step, data } = state;

    // Отмена в любой момент
    if (text === '❌ Отменить') {
        states.delete(chatId);
        await sendMessage(chatId, 'Заказ отменён ❌', {
            reply_markup: mainKeyboard,
        });
        return;
    }

    if (step === 'name') {
        data.name = text;
        states.set(chatId, { step: 'phone', data });
        await sendMessage(chatId, `Шаг 2 из 4: ваш номер телефона?\n\nНапример: +998901234567`);
        return;
    }

    if (step === 'phone') {
        const digits = text.replace(/\D/g, '');
        if (digits.length < 9) {
            await sendMessage(chatId, '❌ Неверный формат. Введите номер ещё раз:');
            return;
        }
        data.phone = text;
        states.set(chatId, { step: 'address', data });
        await sendMessage(
            chatId,
            `Шаг 3 из 4: адрес доставки?\n\nНапишите улицу, дом, квартиру:`
        );
        return;
    }

    if (step === 'address') {
        data.address = text;
        states.set(chatId, { step: 'comment', data });
        await sendMessage(
            chatId,
            `Шаг 4 из 4: комментарий к заказу?\n\n` +
            `Например: без лука, позвонить за 5 минут.\n` +
            `Или напишите <b>«нет»</b>, если комментария нет.`
        );
        return;
    }

    if (step === 'comment') {
        data.comment = text === 'нет' ? '' : text;
        states.set(chatId, { step: 'confirm', data });

        const summary =
            `📋 <b>Проверьте данные заказа</b>\n\n` +
            `👤 Имя: ${esc(data.name)}\n` +
            `📞 Телефон: ${esc(data.phone)}\n` +
            `📍 Адрес: ${esc(data.address)}\n` +
            (data.comment ? `💬 Комментарий: ${esc(data.comment)}\n` : '') +
            `\nВсё верно?`;

        await sendMessage(chatId, summary, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '✅ Подтвердить', callback_data: 'confirm_order' }],
                    [{ text: '❌ Отменить', callback_data: 'cancel_order' }],
                ],
            },
        });
        return;
    }
}

// ===== Отправка заказа админу =====
async function sendOrderToAdmin(data, clientChatId) {
    const text =
        `🍕 <b>Новый заказ из Telegram</b>\n\n` +
        `👤 <b>Клиент</b>\n` +
        `Имя: ${esc(data.name)}\n` +
        `Телефон: ${esc(data.phone)}\n` +
        `Адрес: ${esc(data.address)}\n` +
        (data.comment ? `Комментарий: ${esc(data.comment)}\n` : '') +
        `\n💬 Chat ID клиента: <code>${clientChatId}</code>\n` +
        `🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}`;

    await sendMessage(ADMIN_CHAT_ID, text, { disable_web_page_preview: true });
}

// ===== Основной обработчик =====
export async function POST(req) {
    try {
        const secret = req.headers.get('x-telegram-bot-api-secret-token');
        if (process.env.TG_WEBHOOK_SECRET && secret !== process.env.TG_WEBHOOK_SECRET) {
            return NextResponse.json({ ok: false }, { status: 401 });
        }

        const update = await req.json();

        // ===== Callback (inline-кнопки) =====
        if (update.callback_query) {
            const cb = update.callback_query;
            const chatId = cb.message.chat.id;
            await answerCallback(cb.id);

            if (cb.data === 'start_order') {
                await handleOrderStart(chatId);
            } else if (cb.data === 'confirm_order') {
                const state = states.get(chatId);
                if (!state || state.step !== 'confirm') {
                    await sendMessage(chatId, 'Сессия истекла. Начните заново: /start');
                    return NextResponse.json({ ok: true });
                }
                await sendOrderToAdmin(state.data, chatId);
                states.delete(chatId);
                await sendMessage(
                    chatId,
                    `✅ <b>Заказ принят!</b>\n\n` +
                    `Мы свяжемся с вами для подтверждения.\n` +
                    `Если что-то срочно — звоните: +998 93 478 88 85`,
                    { reply_markup: mainKeyboard }
                );
            } else if (cb.data === 'cancel_order') {
                states.delete(chatId);
                await sendMessage(chatId, 'Заказ отменён ❌', {
                    reply_markup: mainKeyboard,
                });
            }
            return NextResponse.json({ ok: true });
        }

        // ===== Текстовые сообщения =====
        const msg = update.message;
        if (!msg?.text) return NextResponse.json({ ok: true });

        const chatId = msg.chat.id;
        const text = msg.text.trim();
        const firstName = msg.from?.first_name || 'друг';

        // Команды
        if (text === '/start') return handleStart(chatId, firstName);
        if (text === '/menu') return handleMenu(chatId);
        if (text === '/contact') return handleCall(chatId);
        if (text === '/address') return handleAddress(chatId);
        if (text === '/order') return handleOrderStart(chatId);

        // Кнопки клавиатуры
        if (text === '🍕 Меню') return handleMenu(chatId);
        if (text === '🛒 Сделать заказ') return handleOrderStart(chatId);
        if (text === '📞 Позвонить') return handleCall(chatId);
        if (text === '📍 Адрес') return handleAddress(chatId);

        // Если клиент в процессе заказа — продолжаем
        const state = states.get(chatId);
        if (state) {
            await handleOrderStep(chatId, text, state);
            return NextResponse.json({ ok: true });
        }

        // Иначе — стандартный ответ
        await sendMessage(
            chatId,
            `Не понял 🤔\n\n` +
            `Пожалуйста, воспользуйтесь кнопками внизу 👇`,
            { reply_markup: mainKeyboard }
        );

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[telegram webhook] error:', err);
        return NextResponse.json({ ok: true });
    }
}

export async function GET() {
    return NextResponse.json({ ok: true, service: 'telegram-webhook' });
}