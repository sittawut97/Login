export async function pushLine(message: string) {
  const token = process.env.LINE_CHANNEL_TOKEN;
  const to = process.env.LINE_TARGET_ID;
  if (!token || !to) {
    console.error('LINE_CHANNEL_TOKEN or LINE_TARGET_ID not set');
    return;
  }
  console.log('pushLine() sending to LINE API...');
  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to,
      messages: [{ type: 'text', text: message }],
    }),
  });
  const text = await res.text();
  console.log('LINE status', res.status, 'body:', text);
  if (res.ok) {
    console.log('LINE push success', text);
  } else {
    console.error('LINE push failed', res.status, text);
  }
}
