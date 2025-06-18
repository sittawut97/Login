import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function authOr401() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// PUT /api/duties/[id]
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const payload = await authOr401();
  if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const { date, detail } = await request.json();
  if (!date || !detail) return NextResponse.json({ message: 'Both date and detail are required' }, { status: 400 });

  const duty = await prisma.duty.findUnique({ where: { id } });
  if (!duty || duty.userId !== payload.id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const updated = await prisma.duty.update({ where: { id }, data: { date: new Date(date), detail } });
  return NextResponse.json(updated);
}

// DELETE /api/duties/[id]
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const payload = await authOr401();
  if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const duty = await prisma.duty.findUnique({ where: { id } });
  if (!duty || duty.userId !== payload.id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  await prisma.duty.delete({ where: { id } });
  return NextResponse.json({ message: 'Deleted' });
}