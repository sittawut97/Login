export async function sendLineNotify(message: string) {
  const token = process.env.LINE_NOTIFY_TOKEN;
  if (!token) {
    console.error('LINE_NOTIFY_TOKEN not set');
    return;
  }

  try {
    await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      body: new URLSearchParams({ message }),
    });
  } catch (err) {
    console.error('LINE Notify error', err);
  }
}
