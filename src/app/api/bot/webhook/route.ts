import { NextResponse } from 'next/server';

// Telegram sends POST updates to this webhook
export async function POST(request: Request) {
  try {
    const botToken = process.env.BOT_TOKEN;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
    if (!botToken) {
      return NextResponse.json({ error: 'BOT_TOKEN not configured' }, { status: 500 });
    }

    const update = await request.json();

    // Handle /start (with optional deep-link start param)
    const msg = update?.message;
    const chatId = msg?.chat?.id;
    const text: string | undefined = msg?.text;

    if (chatId && typeof text === 'string' && text.startsWith('/start')) {
      // Optional deep link param: /start <param>
      const parts = text.split(' ');
      const startParam = parts.length > 1 ? parts[1] : undefined;
      const webAppUrl = startParam
        ? `${siteUrl}?start=${encodeURIComponent(startParam)}`
        : siteUrl;

      const payload = {
        chat_id: chatId,
        text: 'Welcome! Tap below to open the course app.',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Open App',
                web_app: { url: webAppUrl },
              },
            ],
          ],
        },
      };

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    // Optionally handle callback_query, etc. (ignored for now)

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Webhook error', err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

// Telegram requires 200 OK quickly; no GET handler needed

