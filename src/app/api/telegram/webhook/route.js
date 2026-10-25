// src/app/api/telegram/webhook/route.js

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const TOKEN = process.env.TG_TOKEN;
const MENU_URL = 'https://www.pizzatime.uz/menu';

// Два ID администраторов через запятую в Vercel Environment Variables
const ADMIN_CHAT_IDS = (process.env.TG_CHAT_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

const LOCATION = {
    latitude: 39.743122,
    longitude: 64.401846,
};

// Защита от повторной обработки update в одном экземпляре
const processedUpdates = new Map();
const processingUpdates = new Map();

const UPDATE_TTL = 10 * 60 * 1000;
const MAX_CACHED_UPDATES = 2000;

// ============================================================
// TELEGRAM API
// ============================================================

async function tg(method, body) {
    if (!TOKEN) {
        throw new Error('Переменная TG_TOKEN не настроена в Vercel');
    }

    const response = await fetch(
        `https://api.telegram.org/bot${TOKEN}/${method}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(
            `Telegram API ${method}: ${result.description || response.status}`
        );
    }

    return result;
}

async function sendMessage(chatId, text, extra = {}) {
    return tg('sendMessage', {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        ...extra,
    });
}

async function sendLocation(chatId, latitude, longitude) {
    return tg('sendLocation', {
        chat_id: chatId,
        latitude,
        longitude,
    });
}

async function answerCallback(callbackQueryId) {
    return tg('answerCallbackQuery', {
        callback_query_id: callbackQueryId,
    });
}

// Экранирование текста для HTML-разметки Telegram
function esc(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ============================================================
// УВЕДОМЛЕНИЯ ДВУМ АДМИНИСТРАТОРАМ
// ============================================================

async function sendToAdmins(text, extra = {}) {
    if (ADMIN_CHAT_IDS.length === 0) {
        console.error('Не настроена переменная TG_CHAT_IDS');
        return;
    }

    const results = await Promise.allSettled(
        ADMIN_CHAT_IDS.map((chatId) =>
            sendMessage(chatId, text, extra)
        )
    );

    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            console.error(
                `Не удалось отправить сообщение администратору ${ADMIN_CHAT_IDS[index]}:`,
                result.reason
            );
        }
    });
}

// ============================================================
// КЛАВИАТУРЫ
// ============================================================

const mainKeyboard = {
    keyboard: [
        [
            { text: '🍕 Меню' },
            { text: '🛒 Сделать заказ' },
        ],
        [
            { text: '📞 Позвонить' },
            { text: '📍 Адрес' },
        ],
    ],
    resize_keyboard: true,
    is_persistent: true,
};

const menuInlineKeyboard = {
    inline_keyboard: [
        [
            {
                text: '🍕 Открыть меню',
                url: MENU_URL,
            },
        ],
    ],
};

const orderInlineKeyboard = {
    inline_keyboard: [
        [
            {
                text: '🛒 Выбрать блюда и заказать',
                url: MENU_URL,
            },
        ],
    ],
};

const contactInlineKeyboard = {
    inline_keyboard: [
        [
            {
                text: '🍕 Открыть меню',
                url: MENU_URL,
            },
        ],
    ],
};

const addressInlineKeyboard = {
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
};

// ============================================================
// ТЕКСТЫ
// ============================================================

function welcomeText(name) {
    return (
        `Привет, <b>${esc(name)}</b>! 👋\n\n` +
        `Добро пожаловать в <b>Pizza Time Bukhara</b> 🍕🍣\n\n` +
        `У нас вы найдёте пиццу, суши, роллы и фаст-фуд.\n\n` +
        `Выберите нужный раздел с помощью кнопок ниже 👇`
    );
}

function menuText() {
    return (
        `🍕 <b>Меню Pizza Time Bukhara</b>\n\n` +
        `Пицца, суши, роллы и фаст-фуд — выбирайте любимые блюда на нашем сайте.\n\n` +
        `Нажмите кнопку ниже, чтобы открыть меню 👇`
    );
}

function orderText() {
    return (
        `🛒 <b>Как оформить заказ?</b>\n\n` +
        `1️⃣ Нажмите кнопку «Выбрать блюда и заказать».\n\n` +
        `2️⃣ Выберите блюда и добавьте их в корзину.\n\n` +
        `3️⃣ Откройте корзину и проверьте свой заказ.\n\n` +
        `4️⃣ Заполните необходимые данные для доставки.\n\n` +
        `5️⃣ Проверьте информацию и подтвердите заказ на сайте.\n\n` +
        `Готово! Приятного аппетита! 🍕`
    );
}

function contactText() {
    return (
        `📞 <b>Связаться с Pizza Time Bukhara</b>\n\n` +
        `Телефоны:\n` +
        `+998 93 478 88 85\n` +
        `+998 97 292 22 99\n\n` +
        `🕐 Ежедневно: 10:00–00:00\n\n` +
        `Вы также можете открыть меню на сайте 👇`
    );
}

function addressText() {
    return (
        `📍 <b>Pizza Time Bukhara</b>\n\n` +
        `Бухара, ул. Амир Темура, 1/1\n\n` +
        `Выберите карту ниже, чтобы построить маршрут 👇`
    );
}

// ============================================================
// ОБРАБОТЧИКИ КОМАНД
// ============================================================

async function handleStart(chatId, firstName) {
    await sendMessage(
        chatId,
        welcomeText(firstName),
        {
            reply_markup: mainKeyboard,
        }
    );
}

async function handleMenu(chatId) {
    await sendMessage(
        chatId,
        menuText(),
        {
            reply_markup: menuInlineKeyboard,
            disable_web_page_preview: true,
        }
    );
}

async function handleOrder(chatId) {
    await sendMessage(
        chatId,
        orderText(),
        {
            reply_markup: orderInlineKeyboard,
            disable_web_page_preview: true,
        }
    );
}

async function handleCall(chatId) {
    await sendMessage(
        chatId,
        contactText(),
        {
            reply_markup: contactInlineKeyboard,
        }
    );
}

async function handleAddress(chatId) {
    await sendLocation(
        chatId,
        LOCATION.latitude,
        LOCATION.longitude
    );

    await sendMessage(
        chatId,
        addressText(),
        {
            reply_markup: addressInlineKeyboard,
        }
    );
}

// ============================================================
// ОСНОВНАЯ ОБРАБОТКА UPDATE
// ============================================================

async function processUpdate(update) {
    // --------------------------------------------------------
    // Inline-кнопки
    // --------------------------------------------------------

    if (update.callback_query) {
        const callback = update.callback_query;

        await answerCallback(callback.id);

        // Заказы оформляются на сайте.
        // Старые кнопки оформления заказа перенаправляем в меню.
        if (
            callback.data === 'start_order' ||
            callback.data === 'show_menu'
        ) {
            const chatId = callback.message?.chat?.id;

            if (chatId) {
                await handleOrder(chatId);
            }
        }

        return;
    }

    // --------------------------------------------------------
    // Текстовые сообщения
    // --------------------------------------------------------

    const message = update.message;

    if (!message?.text || !message.chat?.id) {
        return;
    }

    const chatId = String(message.chat.id);
    const text = message.text.trim();
    const firstName = message.from?.first_name || 'друг';

    if (text === '/start' || text.startsWith('/start ')) {
        await handleStart(chatId, firstName);
        return;
    }

    if (text === '/menu' || text === '🍕 Меню') {
        await handleMenu(chatId);
        return;
    }

    if (
        text === '/order' ||
        text === '🛒 Сделать заказ'
    ) {
        await handleOrder(chatId);
        return;
    }

    if (
        text === '/contact' ||
        text === '📞 Позвонить'
    ) {
        await handleCall(chatId);
        return;
    }

    if (
        text === '/address' ||
        text === '📍 Адрес'
    ) {
        await handleAddress(chatId);
        return;
    }

    // Проверка отправки тестового сообщения администраторам
    if (text === '/testadmin') {
        if (!ADMIN_CHAT_IDS.includes(chatId)) {
            await sendMessage(
                chatId,
                '⛔ Эта команда доступна только администраторам.',
                { reply_markup: mainKeyboard }
            );
            return;
        }

        await sendToAdmins(
            `✅ <b>Тестовое сообщение</b>\n\n` +
            `Бот Pizza Time Bukhara работает.\n` +
            `Chat ID: <code>${esc(chatId)}</code>\n` +
            `Время: ${new Date().toLocaleString('ru-RU', {
                timeZone: 'Asia/Tashkent',
            })}`
        );

        await sendMessage(
            chatId,
            '✅ Проверка выполнена. Бот отправил тестовые сообщения администраторам.',
            { reply_markup: mainKeyboard }
        );
        return;
    }

    // Неизвестное сообщение
    await sendMessage(
        chatId,
        `Не понял 🤔\n\n` +
        `Воспользуйтесь кнопками внизу, чтобы открыть меню, ` +
        `оформить заказ, узнать контакты или адрес.`,
        {
            reply_markup: mainKeyboard,
        }
    );
}

// ============================================================
// ОЧИСТКА КЭША UPDATE
// ============================================================

function cleanupProcessedUpdates() {
    const now = Date.now();

    for (const [id, timestamp] of processedUpdates.entries()) {
        if (now - timestamp > UPDATE_TTL) {
            processedUpdates.delete(id);
        }
    }

    while (processedUpdates.size > MAX_CACHED_UPDATES) {
        const oldestId = processedUpdates.keys().next().value;
        processedUpdates.delete(oldestId);
    }
}

// ============================================================
// WEBHOOK POST
// ============================================================

export async function POST(req) {
    try {
        // Проверка секрета, если он настроен
        const configuredSecret = process.env.TG_WEBHOOK_SECRET;

        if (configuredSecret) {
            const receivedSecret = req.headers.get(
                'x-telegram-bot-api-secret-token'
            );

            if (receivedSecret !== configuredSecret) {
                return NextResponse.json(
                    { ok: false },
                    { status: 401 }
                );
            }
        }

        const update = await req.json();
        const updateId = update?.update_id;

        if (updateId === undefined || updateId === null) {
            return NextResponse.json({ ok: true });
        }

        cleanupProcessedUpdates();

        // Update уже обработан
        if (processedUpdates.has(updateId)) {
            return NextResponse.json({ ok: true });
        }

        // Этот update уже обрабатывается в данном экземпляре
        const existingTask = processingUpdates.get(updateId);

        if (existingTask) {
            await existingTask;
            return NextResponse.json({ ok: true });
        }

        const task = processUpdate(update);

        processingUpdates.set(updateId, task);

        try {
            await task;
        } catch (error) {
            console.error(
                `[Telegram update ${updateId}]`,
                error
            );
        } finally {
            processingUpdates.delete(updateId);

            // Не допускаем повторного ответа на этот update
            // при повторной доставке Telegram в тот же экземпляр.
            processedUpdates.set(updateId, Date.now());
            cleanupProcessedUpdates();
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[Telegram webhook error]', error);

        // Возвращаем 200, чтобы Telegram не зацикливал повторы
        // из-за ошибки обработки.
        return NextResponse.json({ ok: true });
    }
}

// ============================================================
// WEBHOOK GET — ПРОВЕРКА ДОСТУПНОСТИ
// ============================================================

export async function GET() {
    return NextResponse.json({
        ok: true,
        service: 'telegram-webhook',
        adminsConfigured: ADMIN_CHAT_IDS.length,
    });
}