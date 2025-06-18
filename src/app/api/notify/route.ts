import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // Fallback literals (use env vars in production)
    const token = process.env.LINE_CHANNEL_TOKEN;
    const userId = process.env.LINE_TARGET_ID;

    // const token = process.env.LINE_CHANNEL_TOKEN || '6guISgfqLeCc3SkyLYhmvjUJjh9xYRas3EyT+lF+a2LSKy6t+A/H2oiPiJbz89AiflZqW9X+ncSp/EzXxQNScPO7sLz1zWYVz0zU14OtsCETAuztcs8KvD8xJnyHpU7ey3IhWYDxeHYT1LSCYSufeQdB04t89/1O/w1cDnyilFU=';
    // const userId = process.env.LINE_TARGET_ID || 'U98e8d6e0ef042df8721222fccce29890';

    const payload = {
      to: userId,
      messages: [
        {
          type: 'text',
          text: message || 'Hello from Next.js!',
        },
      ],
    };

    const res = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return NextResponse.json({ status: 'success' });
    }

    const errorText = await res.text();
    return NextResponse.json({ status: 'error', error: errorText }, { status: 500 });
  } catch (err: unknown) {
    if (err instanceof Error) {
        return NextResponse.json({ status: 'error', error: err.message }, { status: 500 });
    }
    return NextResponse.json({ status: 'error', error: 'Unexpected error' }, { status: 500 });
  }
}
