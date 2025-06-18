// ------------------------------
// หน้า Home (root path '/') — Server Component
// ทำหน้าที่ตรวจสอบ cookie JWT แล้ว redirect ตามสถานะล็อกอิน
// • มี token และ verify ผ่าน → /dashboard
// • อย่างอื่น → /login
// ------------------------------
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  // อ่าน cookie ฝั่ง Server

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (token && verifyToken(token)) {
    redirect('/dashboard');
  }

  redirect('/login');

  return null;
}
