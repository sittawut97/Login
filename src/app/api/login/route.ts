// ------------------------------
// API Route: /api/login (Method: POST)
// รับอีเมล + รหัสผ่านจาก body → ตรวจสอบกับฐานข้อมูล (MongoDB ผ่าน Prisma)
// ถ้าถูกต้องจะสร้าง JWT, เก็บใน cookie แล้วตอบกลับ "Login successful"
// ------------------------------
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

// บังคับให้ Route นี้ทำงานบน Node.js runtime (ไม่ใช่ Edge)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ฟังก์ชันหลักสำหรับจัดการคำขอแบบ POST
export async function POST(request: NextRequest) {
  // ดึงข้อมูลจาก body ของ request (JSON)
  const { username, password } = await request.json();

  // ตรวจสอบว่ารับครบทั้ง email และ password
  if (!username || !password) {
    return NextResponse.json({ message: 'Username and password required' }, { status: 400 });
  }

  try {
    // ------------------------------
    // 1. หา user ตามอีเมล
    // ------------------------------
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user || !user.password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // ------------------------------
    // 2. เปรียบเทียบรหัสผ่าน (plain vs hash)
    // ------------------------------
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // ------------------------------
    // 3. สร้าง JWT เก็บข้อมูล id, email, role
    // ------------------------------
    const token = signToken({ id: user.id, email: user.email, role: user.role, thaiName: user.thaiName ?? '' });

    // เตรียม Response JSON กลับไปหา client
    const response = NextResponse.json({ message: 'Login successful' });
    // เซ็ต cookie "token" เป็น HTTP-only เพื่อความปลอดภัย
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    // ส่ง Response กลับ
    return response;
  } catch (error) {
    // ถ้าเกิดข้อผิดพลาดใด ๆ จะมาที่บล็อกนี้
    console.error(error); // log บน server
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
