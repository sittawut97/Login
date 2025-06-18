import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ตรวจสอบ token และคืน payload หรือ response 401
function authOr401(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ไม่ต้องประกาศ Interface RouteParams แยกแล้ว
// เราจะใช้ Inline Type Definition ไปเลย เพื่อให้ตรงกับที่ Next.js คาดหวังที่สุด

export async function PUT(
  request: NextRequest,
  // แก้ไขตรงนี้: Type ของ parameter ที่สองคือ { params: { id: string } } โดยตรง
  // ไม่มีการ Destructure ซ้ำซ้อน และไม่ใช่ชื่อ context
  { params }: { params: { id: string } } // <--- แก้ไขบรรทัดนี้
) {
  const payload = authOr401(request);
  if (!payload) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params; // ดึง id ออกมาจาก params
  const { date, detail } = await request.json();

  if (!date || !detail) {
    return NextResponse.json({ message: 'Both date and detail are required' }, { status: 400 });
  }

  const duty = await prisma.duty.findUnique({ where: { id } });
  if (!duty || duty.userId !== payload.id) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const updated = await prisma.duty.update({
    where: { id },
    data: {
      date: new Date(date),
      detail,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  // แก้ไขตรงนี้: Type ของ parameter ที่สองคือ { params: { id: string } } โดยตรง
  { params }: { params: { id: string } } // <--- แก้ไขบรรทัดนี้
) {
  const payload = authOr401(request);
  if (!payload) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params; // ดึง id ออกมาจาก params
  const duty = await prisma.duty.findUnique({ where: { id } });
  if (!duty || duty.userId !== payload.id) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  await prisma.duty.delete({ where: { id } });
  return NextResponse.json({ message: 'Deleted' });
}