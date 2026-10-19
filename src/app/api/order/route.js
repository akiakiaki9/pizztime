// src/app/api/order/route.js
export async function POST(req) {
  try {
    const { items, total, customer } = await req.json();

    if (!items || items.length === 0) {
      return Response.json({ ok: false, error: 'Cart is empty' }, { status: 400 });
    }

    const lines = items.map(
      (i) => `• ${i.name} × ${i.qty} — ${(i.price * i.qty).toLocaleString()} сум`
    );

    const text = [
      '🍕 Новый заказ Pizza Time',
      '',
      '👤 Клиент:',
      `Имя: ${customer.name}`,
      `Телефон: ${customer.phone}`,
      `Адрес: ${customer.address}`,
      customer.comment ? `Комментарий: ${customer.comment}` : null,
      '',
      '🛒 Состав заказа:',
      ...lines,
      '',
      `💰 Итого: ${total.toLocaleString()} сум`,
    ]
      .filter(Boolean)
      .join('\n');

    const res = await fetch(
      `https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TG_CHAT_ID,
          text,
        }),
      }
    );

    return Response.json({ ok: res.ok }, { status: res.ok ? 200 : 502 });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}