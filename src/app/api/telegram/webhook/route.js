
import { NextResponse } from 'next/server';

const TOKEN = process.env.TG_TOKEN;
const ADMIN_CHAT_ID = process.env.TG_CHAT_ID;

// Состояния диалогов пользователей.
// Важно: в Vercel память не общая между экземплярами.
const states = new Map();

// Защита от повторных update_id внутри одного экземпляра.
const processedUpdates = new Map();
const processingUpdates = new Map();

const UPDATE_TTL = 10 * 60 * 1000;
const MAX_CACHED_UPDATES = 2000;

// ===== Утилиты =====

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

const sendLocation = (chat_id, lat, lng) =>
    tg('sendLocation', {
        chat_id,
        latitude: lat,
        longitude: lng,
    });

const answerCallback = (callback_query_id) =>
    tg('answerCallbackQuery', {
        callback_query_id,
    });

const esc = (s) =>
    String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

// ===== Дедупликация обновлений =====

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

const cancelKeyboard = {
    keyboard: [
        [{ text: '❌ Отменить' }],
    ],
    resize_keyboard: true,
};

// ===== Тексты =====

const welcomeText = (name) =>
    `Привет, <b>${esc(name)}</b>! 👋\n\n` +
    `Это бот <b>Pizza Time Bukhara</b> 🍕🍣\n\n` +
    `Выберите, что вас интересует — кнопки внизу 👇`;

const menuText = () =>
    `🍕 <b>Наше меню</b>\n\n` +
    `Пицца, суши, роллы и фаст-фуд — всё свежее, готовим каждый день.\n\n` +
    `👉 Открыть меню: https://www.pizzatime.uz/menu`;

const contactText = () =>
    `📞 <b>Связаться с нами</b>\n\n` +
    `+998 93 478 88 85\n` +
    `+998 97 292 22 99\n\n` +
    `🕐 Ежедневно 10:00 – 00:00`;

const addressText = () =>
    `📍 <b>Мы находимся здесь</b>\n\n` +
    `Бухара, ул. Амир Темура, 1/1\n\n` +
    `Нажмите кнопку ниже, чтобы построить маршрут 👇`;

// ===== Обработчики меню =====

async function handleStart(chatId, firstName) {
    states.delete(chatId);

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
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '🍕 Открыть меню',
                            url: 'https://www.pizzatime.uz/menu',
                        },
                    ],
                    [
                        {
                            text: '🛒 Сделать заказ',
                            callback_data: 'start_order',
                        },
                    ],
                ],
            },
        }
    );
}

async function handleCall(chatId) {
    await sendMessage(
        chatId,
        contactText(),
        {
            reply_markup: {
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
            },
        }
    );
}

async function handleAddress(chatId) {
    await sendLocation(
        chatId,
        39.743122,
        64.401846
    );

    await sendMessage(
        chatId,
        addressText(),
        {
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
        }
    );
}

// ===== Оформление заказа =====

async function handleOrderStart(chatId) {
    states.set(chatId, {
        step: 'name',
        data: {},
    });

    await sendMessage(
        chatId,
        `🛒 <b>Оформление заказа</b>\n\n` +
        `Шаг 1 из 4: как к вам обращаться?\n\n` +
        `Напишите имя:`,
        {
            reply_markup: cancelKeyboard,
        }
    );
}

async function handleOrderStep(chatId, text, state) {
    const { step, data } = state;

    // Отмена заказа доступна на любом шаге.
    if (text === '❌ Отменить') {
        states.delete(chatId);

        await sendMessage(
            chatId,
            'Заказ отменён ❌',
            {
                reply_markup: mainKeyboard,
            }
        );

        return;
    }

    // Команды не должны записываться в поля заказа.
    if (
        text === '/start' ||
        text === '/menu' ||
        text === '/contact' ||
        text === '/address' ||
        text === '/order' ||
        text === '🍕 Меню' ||
        text === '📞 Позвонить' ||
        text === '📍 Адрес' ||
        text === '🛒 Сделать заказ'
    ) {
        states.delete(chatId);

        await sendMessage(
            chatId,
            'Текущее оформление заказа остановлено. Выберите действие:',
            {
                reply_markup: mainKeyboard,
            }
        );

        return;
    }

    if (step === 'name') {
        if (!text.trim()) {
            await sendMessage(
                chatId,
                'Введите, пожалуйста, ваше имя:'
            );
            return;
        }

        data.name = text.trim();

        states.set(chatId, {
            step: 'phone',
            data,
        });

        await sendMessage(
            chatId,
            `Шаг 2 из 4: ваш номер телефона?\n\n` +
            `Например: +998901234567`
        );

        return;
    }

    if (step === 'phone') {
        const digits = text.replace(/\D/g, '');

        if (digits.length < 9 || digits.length > 15) {
            await sendMessage(
                chatId,
                '❌ Неверный формат. Введите номер ещё раз:\n\n' +
                'Например: +998901234567'
            );
            return;
        }

        data.phone = text.trim();

        states.set(chatId, {
            step: 'address',
            data,
        });

        await sendMessage(
            chatId,
            `Шаг 3 из 4: адрес доставки?\n\n` +
            `Напишите улицу, дом, квартиру:`
        );

        return;
    }

    if (step === 'address') {
        if (!text.trim()) {
            await sendMessage(
                chatId,
                'Введите адрес доставки:'
            );
            return;
        }

        data.address = text.trim();

        states.set(chatId, {
            step: 'comment',
            data,
        });

        await sendMessage(
            chatId,
            `Шаг 4 из 4: комментарий к заказу?\n\n` +
            `Например: без лука, позвонить за 5 минут.\n` +
            `Или напишите <b>«нет»</b>, если комментария нет.`
        );

        return;
    }

    if (step === 'comment') {
        data.comment =
            text.trim().toLowerCase() === 'нет'
                ? ''
                : text.trim();

        states.set(chatId, {
            step: 'confirm',
            data,
        });

        const summary =
            `📋 <b>Проверьте данные заказа</b>\n\n` +
            `👤 Имя: ${esc(data.name)}\n` +
            `📞 Телефон: ${esc(data.phone)}\n` +
            `📍 Адрес: ${esc(data.address)}\n` +
            (
                data.comment
                    ? `💬 Комментарий: ${esc(data.comment)}\n`
                    : ''
            ) +
            `\nВсё верно?`;

        await sendMessage(
            chatId,
            summary,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '✅ Подтвердить',
                                callback_data: 'confirm_order',
                            },
                        ],
                        [
                            {
                                text: '❌ Отменить',
                                callback_data: 'cancel_order',
                            },
                        ],
                    ],
                },
            }
        );

        return;
    }

    await sendMessage(
        chatId,
        'Не удалось определить текущий шаг заказа. Начните заново: /order'
    );
}

// ===== Отправка заказа администратору =====

async function sendOrderToAdmin(data, clientChatId) {
    if (!ADMIN_CHAT_ID) {
        throw new Error('TG_CHAT_ID не задан в переменных окружения');
    }

    const text =
        `🍕 <b>Новый заказ из Telegram</b>\n\n` +
        `👤 <b>Клиент</b>\n` +
        `Имя: ${esc(data.name)}\n` +
        `Телефон: ${esc(data.phone)}\n` +
        `Адрес: ${esc(data.address)}\n` +
        (
            data.comment
                ? `Комментарий: ${esc(data.comment)}\n`
                : ''
        ) +
        `\n💬 Chat ID клиента: <code>${clientChatId}</code>\n` +
        `🕐 ${new Date().toLocaleString('ru-RU', {
            timeZone: 'Asia/Tashkent',
        })}`;

    await sendMessage(
        ADMIN_CHAT_ID,
        text,
        {
            disable_web_page_preview: true,
        }
    );
}

// ===== Основная обработка обновлений =====

async function processUpdate(update) {
    // Callback от inline-кнопок.
    if (update.callback_query) {
        const cb = update.callback_query;
        const chatId = cb.message?.chat?.id;

        await answerCallback(cb.id);

        if (!chatId) {
            return;
        }

        if (cb.data === 'start_order') {
            await handleOrderStart(chatId);
        } else if (cb.data === 'confirm_order') {
            const state = states.get(chatId);

            if (!state || state.step !== 'confirm') {
                await sendMessage(
                    chatId,
                    'Сессия истекла. Начните заново: /start'
                );
                return;
            }

            // Удаляем состояние до отправки заказа,
            // чтобы повторное нажатие не использовало его повторно.
            states.delete(chatId);

            try {
                await sendOrderToAdmin(state.data, chatId);

                await sendMessage(
                    chatId,
                    `✅ <b>Заказ принят!</b>\n\n` +
                    `Мы свяжемся с вами для подтверждения.\n` +
                    `Если что-то срочно — звоните: +998 93 478 88 85`,
                    {
                        reply_markup: mainKeyboard,
                    }
                );
            } catch (error) {
                console.error(
                    '[telegram order] Failed to send order:',
                    error
                );

                await sendMessage(
                    chatId,
                    'Не удалось передать заказ. Пожалуйста, свяжитесь с нами по телефону: +998 93 478 88 85',
                    {
                        reply_markup: mainKeyboard,
                    }
                );
            }
        } else if (cb.data === 'cancel_order') {
            states.delete(chatId);

            await sendMessage(
                chatId,
                'Заказ отменён ❌',
                {
                    reply_markup: mainKeyboard,
                }
            );
        }

        return;
    }

    // Обычные текстовые сообщения.
    const msg = update.message;

    if (!msg?.text) {
        return;
    }

    const chatId = msg.chat.id;
    const text = msg.text.trim();
    const firstName = msg.from?.first_name || 'друг';

    // Сначала обрабатываем команды и кнопки меню.
    if (text === '/start') {
        return handleStart(chatId, firstName);
    }

    if (text === '/menu' || text === '🍕 Меню') {
        states.delete(chatId);
        return handleMenu(chatId);
    }

    if (text === '/contact' || text === '📞 Позвонить') {
        states.delete(chatId);
        return handleCall(chatId);
    }

    if (text === '/address' || text === '📍 Адрес') {
        states.delete(chatId);
        return handleAddress(chatId);
    }

    if (text === '/order' || text === '🛒 Сделать заказ') {
        return handleOrderStart(chatId);
    }

    // Если пользователь оформляет заказ, обрабатываем шаг.
    const state = states.get(chatId);

    if (state) {
        await handleOrderStep(chatId, text, state);
        return;
    }

    // Неизвестное сообщение.
    await sendMessage(
        chatId,
        `Не понял 🤔\n\n` +
        `Пожалуйста, воспользуйтесь кнопками внизу 👇`,
        {
            reply_markup: mainKeyboard,
        }
    );
}

// ===== Webhook =====

export async function POST(req) {
    try {
        // Проверка секрета webhook, если он настроен.
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

            return NextResponse.json(
                { ok: true }
            );
        }

        cleanupProcessedUpdates();

        // Уже успешно обработанное обновление.
        if (processedUpdates.has(updateId)) {
            console.log(
                '[telegram webhook] Duplicate ignored:',
                updateId
            );

            return NextResponse.json(
                { ok: true }
            );
        }

        // Это же обновление уже обрабатывается.
        const existingTask = processingUpdates.get(updateId);

        if (existingTask) {
            await existingTask;

            return NextResponse.json(
                { ok: true }
            );
        }

        // Обрабатываем обновление в рамках запроса,
        // а не запускаем работу в фоне.
        const task = processUpdate(update);
        processingUpdates.set(updateId, task);

        try {
            await task;

            processedUpdates.set(
                updateId,
                Date.now()
            );

            console.log(
                '[telegram webhook] Processed:',
                updateId
            );

            return NextResponse.json(
                { ok: true }
            );
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

// GET — проверка доступности webhook.
export async function GET() {
    return NextResponse.json({
        ok: true,
        service: 'telegram-webhook',
    });
}
