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

// กำหนด Type สำหรับ params แยกต่างหากเพื่อความชัดเจน
interface RouteParams {
  id: string;
}

export async function PUT(
  request: NextRequest,
  // แก้ไขตรงนี้: params ถูกส่งเป็น argument แยกต่างหาก
  // ไม่ได้อยู่ใน context object แล้ว (สำหรับ Next.js 15.3.3 ตาม Error Log)
  { params }: { params: RouteParams } // <--- แก้ไขบรรทัดนี้
) {
  const payload = authOr401(request);
  if (!payload) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params; // params ถูก Destructure มาจาก argument โดยตรงแล้ว
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
  // แก้ไขตรงนี้เช่นกัน
  { params }: { params: RouteParams } // <--- แก้ไขบรรทัดนี้
) {
  const payload = authOr401(request);
  if (!payload) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params; // params ถูก Destructure มาจาก argument โดยตรงแล้ว
  const duty = await prisma.duty.findUnique({ where: { id } });
  if (!duty || duty.userId !== payload.id) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  await prisma.duty.delete({ where: { id } });
  return NextResponse.json({ message: 'Deleted' });
}