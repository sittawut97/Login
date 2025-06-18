import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pushLine } from '@/lib/lineBot';

// optional: run on edge runtime (smaller cold start)
// Use default (nodejs) runtime; Prisma not supported on edge
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('test') === '1' || searchParams.get('force') === '1') {
    await pushLine(`🔔 LINE test message (${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })})`);
    return NextResponse.json({ ok: true, test: true });
  }

  const now = new Date();
  // get today date in YYYY-MM-DD
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  // แปลงเป็นวันที่รูปแบบไทย เช่น 18 มิถุนายน 2568
  const todayStrTH = now.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // get all duties scheduled for today
  const duties = await prisma.duty.findMany({
    where: {
      date: {
        gte: new Date(`${todayStr}T00:00:00.000Z`),
        lt: new Date(`${todayStr}T23:59:59.999Z`),
      },
    },
    include: {
      user: {
        select: {
          thaiName: true,
          username: true,
        },
      },
    },
  });

  if (duties.length === 0) {
    return NextResponse.json({ ok: true, message: 'no duties today' });
  }

  // build single message or send per duty
  const lines = duties.map((d) => {
    const name = d.user?.thaiName || d.user?.username || 'ไม่ทราบชื่อ';
    return `• คุณ ${name} ถึงเวลาเข้าเวรแล้ว – ${d.detail}`;
  });
  const message = `แจ้งเตือนเวรประจำวันที่ ${todayStrTH} \n${lines.join('\n')}`;

  await pushLine(message);

  return NextResponse.json({ ok: true });
}
