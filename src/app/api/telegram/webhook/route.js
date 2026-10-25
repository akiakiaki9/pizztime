
import { NextResponse } from 'next/server';

const TOKEN = process.env.TG_TOKEN;

const MENU_URL = 'https://www.pizzatime.uz/menu';

const LOCATION = {
    latitude: 39.743122,
    longitude: 64.401846,
};

// ===== Telegram API =====

async function tg(method, body) {
    if (!TOKEN) {
        throw new Error('TG_TOKEN не задан в переменных окружения');
    }

    const res = await fetch(
        `https://api.telegram.org/bot${TOKEN}/${method}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            cache: 'no-store',
        }
    );

    const result = await res.json();

    if (!res.ok || !result.ok) {
        throw new Error(
            `Telegram API ${method}: ${
                result.description || res.statusText
            }`
        );
    }

    return result;
}

const sendMessage = (chat_id, text, extra = {}) =>
    tg('sendMessage', {
        chat_id,
        text,
        parse_mode: 'HTML',
        ...extra,
    });

const sendLocation = (chat_id) =>
    tg('sendLocation', {
        chat_id,
        latitude: LOCATION.latitude,
        longitude: LOCATION.longitude,
    });

const answerCallback = (callback_query_id, text) =>
    tg('answerCallbackQuery', {
        callback_query_id,
        text,
    });

const esc = (value) =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

// ===== Клавиатуры =====

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

// ===== Тексты =====

const welcomeText = (name) =>
    `Привет, <b>${esc(name)}</b>! 👋\n\n` +
    `Добро пожаловать в <b>Pizza Time Bukhara</b> 🍕🍣\n\n` +
    `Здесь вы можете посмотреть наше меню и перейти к оформлению заказа.\n\n` +
    `Выберите нужное действие в меню ниже 👇`;

const menuText = () =>
    `🍕 <b>Меню Pizza Time Bukhara</b>\n\n` +
    `На нашем сайте вы можете посмотреть все блюда, выбрать любимые позиции и оформить заказ.\n\n` +
    `👇 Нажмите кнопку ниже, чтобы открыть меню.`;

const orderText = () =>
    `🛒 <b>Как оформить заказ?</b>\n\n` +
    `Всё просто — оформите заказ на нашем сайте! 🍕\n\n` +
    `1️⃣ Нажмите кнопку «Открыть меню» ниже.\n\n` +
    `2️⃣ Выберите понравившиеся блюда и добавьте их в корзину.\n\n` +
    `3️⃣ Откройте корзину и проверьте выбранные блюда и количество.\n\n` +
    `4️⃣ Заполните необходимые данные для доставки и оформите заказ.\n\n` +
    `✅ Готово! Ожидайте подтверждения заказа.\n\n` +
    `Приятного аппетита! ❤️`;

const contactText = () =>
    `📞 <b>Связаться с нами</b>\n\n` +
    `+998 93 478 88 85\n` +
    `+998 97 292 22 99\n\n` +
    `🕐 Ежедневно 10:00 – 00:00`;

const addressText = () =>
    `📍 <b>Pizza Time Bukhara</b>\n\n` +
    `Бухара, ул. Амир Темура, 1/1\n\n` +
    `Нажмите на кнопку ниже, чтобы построить маршрут 👇`;

// ===== Кнопки меню сайта =====

const websiteKeyboard = {
    inline_keyboard: [
        [
            {
                text: '🍕 Открыть меню',
                url: MENU_URL,
            },
        ],
    ],
};

const orderKeyboard = {
    inline_keyboard: [
        [
            {
                text: '🛒 Выбрать блюда и заказать',
                url: MENU_URL,
            },
        ],
        [
            {
                text: '🍕 Посмотреть меню',
                callback_data: 'show_menu',
            },
        ],
    ],
};

const contactKeyboard = {
    inline_keyboard: [
        [
            {
                text: '📞 Позвонить +998 93 478 88 85',
                url: 'tel:+998934788885',
            },
        ],
        [
            {
                text: '📞 Позвонить +998 97 292 22 99',
                url: 'tel:+998972922299',
            },
        ],
    ],
};

const addressKeyboard = {
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

// ===== Обработчики =====

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
            reply_markup: websiteKeyboard,
        }
    );
}

async function handleOrder(chatId) {
    await sendMessage(
        chatId,
        orderText(),
        {
            reply_markup: orderKeyboard,
        }
    );
}

async function handleCall(chatId) {
    await sendMessage(
        chatId,
        contactText(),
        {
            reply_markup: contactKeyboard,
        }
    );
}

async function handleAddress(chatId) {
    await sendLocation(chatId);

    await sendMessage(
        chatId,
        addressText(),
        {
            reply_markup: addressKeyboard,
        }
    );
}

// ===== Обработка обновлений Telegram =====

async function processUpdate(update) {
    // Обработка нажатий inline-кнопок.
    if (update.callback_query) {
        const cb = update.callback_query;
        const chatId = cb.message?.chat?.id;

        if (cb.data === 'show_menu') {
            await answerCallback(cb.id);
            if (chatId) {
                await handleMenu(chatId);
            }
            return;
        }

        await answerCallback(cb.id);
        return;
    }

    const msg = update.message;

    // Игнорируем сообщения без текста.
    if (!msg?.text) {
        return;
    }

    const chatId = msg.chat.id;
    const text = msg.text.trim();
    const firstName = msg.from?.first_name || 'друг';

    // Команды Telegram.
    if (text === '/start' || text.startsWith('/start ')) {
        await handleStart(chatId, firstName);
        return;
    }

    if (text === '/menu' || text === '🍕 Меню') {
        await handleMenu(chatId);
        return;
    }

    if (text === '/order' || text === '🛒 Сделать заказ') {
        await handleOrder(chatId);
        return;
    }

    if (text === '/contact' || text === '📞 Позвонить') {
        await handleCall(chatId);
        return;
    }

    if (text === '/address' || text === '📍 Адрес') {
        await handleAddress(chatId);
        return;
    }

    // Неизвестная команда или текст.
    await sendMessage(
        chatId,
        `Не понял 🤔\n\n` +
        `Вы можете открыть меню, оформить заказ, посмотреть адрес или связаться с нами.\n\n` +
        `Выберите действие с помощью кнопок ниже 👇`,
        {
            reply_markup: mainKeyboard,
        }
    );
}

// ===== Защита от повторных обновлений =====

// Эти коллекции помогают только внутри одного экземпляра Vercel.
// Для общей дедупликации между экземплярами потребуется Redis или БД.

const processedUpdates = new Map();
const processingUpdates = new Map();

const UPDATE_TTL = 10 * 60 * 1000;
const MAX_CACHED_UPDATES = 2000;

function cleanupProcessedUpdates() {
    const now = Date.now();

    for (const [id, timestamp] of processedUpdates) {
        if (now - timestamp > UPDATE_TTL) {
            processedUpdates.delete(id);
        }
    }

    while (processedUpdates.size > MAX_CACHED_UPDATES) {
        const oldestId = processedUpdates.keys().next().value;
        processedUpdates.delete(oldestId);
    }
}

// ===== Webhook =====

export async function POST(req) {
    try {
        const secret = req.headers.get(
            'x-telegram-bot-api-secret-token'
        );

        if (
            process.env.TG_WEBHOOK_SECRET &&
            secret !== process.env.TG_WEBHOOK_SECRET
        ) {
            return NextResponse.json(
                { ok: false },
                { status: 401 }
            );
        }

        const update = await req.json();
        const updateId = update.update_id;

        if (updateId === undefined || updateId === null) {
            console.error(
                '[telegram webhook] Missing update_id'
            );

            return NextResponse.json({ ok: true });
        }

        cleanupProcessedUpdates();

        // Повторное обновление, которое уже обработано.
        if (processedUpdates.has(updateId)) {
            console.log(
                '[telegram webhook] Duplicate ignored:',
                updateId
            );

            return NextResponse.json({ ok: true });
        }

        // То же обновление уже выполняется.
        const existingTask = processingUpdates.get(updateId);

        if (existingTask) {
            await existingTask;

            return NextResponse.json({ ok: true });
        }

        const task = processUpdate(update);
        processingUpdates.set(updateId, task);

        try {
            await task;

            processedUpdates.set(updateId, Date.now());

            console.log(
                '[telegram webhook] Processed:',
                updateId
            );

            return NextResponse.json({ ok: true });
        } catch (error) {
            console.error(
                '[telegram webhook] Processing failed:',
                updateId,
                error
            );

            return NextResponse.json(
                { ok: false },
                { status: 500 }
            );
        } finally {
            processingUpdates.delete(updateId);
        }
    } catch (error) {
        console.error(
            '[telegram webhook] Request failed:',
            error
        );

        return NextResponse.json(
            { ok: false },
            { status: 500 }
        );
    }
}

// ===== Проверка доступности =====

export async function GET() {
    return NextResponse.json({
        ok: true,
        service: 'telegram-webhook',
    });
}
