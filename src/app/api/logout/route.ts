// ------------------------------
// API Route: /api/logout (Method: GET)
// ทำหน้าที่ลบ cookie ชื่อ "token" เพื่อล็อกเอาต์ผู้ใช้
// แล้ว redirect ผู้ใช้กลับไปหน้า /login
// ------------------------------
import { NextResponse } from 'next/server';

// Vercel/Next.js จะเรียกฟังก์ชันนี้เมื่อมีคำขอ GET เข้ามา
export async function GET(request: Request) {
  // สร้าง Response พร้อม redirect กลับ /login
  const response = NextResponse.redirect(new URL('/login', request.url));
  // ลบ (หรือทำให้หมดอายุ) cookie JWT
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  // ส่ง Response กลับไป
  return response;
}
