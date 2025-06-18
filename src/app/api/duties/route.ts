import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET: คืนข้อมูลเวรของผู้ใช้ปัจจุบัน
export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json([], { status: 401 });
  }
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json([], { status: 401 });
  }

  const duties = await prisma.duty.findMany({
    where: { userId: payload.id },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(duties);
}

// POST: สร้างเวรใหม่ของผู้ใช้
export async function POST(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { date, detail } = await request.json();
  if (!date || !detail) {
    return NextResponse.json({ message: 'Both date and detail are required' }, { status: 400 });
  }

  try {
    const duty = await prisma.duty.create({
      data: {
        userId: payload.id,
        date: new Date(date),
        detail,
      },
    });
    return NextResponse.json(duty);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
