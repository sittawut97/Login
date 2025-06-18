// ------------------------------
// API Route: /api/register (POST)
// รับ username, email, password สร้างผู้ใช้ใหม่ใน MongoDB (ผ่าน Prisma)
// ส่ง JWT กลับใน cookie เพื่อให้ผู้ใช้ล็อกอินทันทีหลังสมัคร
// ------------------------------
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

// ฟังก์ชันหลัก จัดการคำขอ POST
export async function POST(request: NextRequest) {
  // ดึงข้อมูลจาก body
  const { username, email, password, thaiName } = await request.json();

  // ตรวจสอบช่องว่าง
  if (!username || !email || !password || !thaiName) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  try {
    // ------------------------------
    // 1. ตรวจสอบ Username หรือ Email ซ้ำ
    // ------------------------------
    // Check duplicate email
    const duplicateUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (duplicateUser) {
      return NextResponse.json({ message: 'Username or email already in use' }, { status: 400 });
    }

    // ------------------------------
    // 2. แฮชรหัสผ่านด้วย bcrypt ก่อนบันทึก
    // ------------------------------
    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // ------------------------------
    // 3. สร้างผู้ใช้ใหม่ในฐานข้อมูล
    // ------------------------------
    const user = await prisma.user.create({
      data: {
        username,
        thaiName,
        email,
        password: hashed,
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 4. สร้าง JWT หลังสมัครเสร็จ
    const token = signToken({ id: user.id, email: user.email, role: user.role, thaiName: user.thaiName ?? thaiName });

    const response = NextResponse.json({ message: 'Registration successful' }); // เตรียม Response
    // เซ็ต cookie "token" ให้ผู้ใช้ล็อกอินอัตโนมัติ
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response; // ส่งกลับ
  } catch (err) {
    // Handle error
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
