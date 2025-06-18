// ------------------------------
// หน้า Register ทำงานฝั่ง Client (ต้องมี 'use client')
// ใช้ React Hook จัดการ state และเรียก API /api/register
// ------------------------------
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// useState : เก็บข้อมูลจากช่อง input
// useRouter: พาไปหน้า /dashboard หลังสมัครสำเร็จ

export default function RegisterPage() {
  // สำหรับเปลี่ยนเส้นทางไปหน้าอื่น
  const router = useRouter();

  // ------------------------------
  // State ของฟอร์มสมัครสมาชิก
  // ------------------------------
  const [username, setUsername] = useState('');
  const [thaiName, setThaiName] = useState('');
  const [email, setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]    = useState('');
  const [loading, setLoading]= useState(false);

  // ฟังก์ชันที่ถูกเรียกเมื่อผู้ใช้กดปุ่ม Sign Up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกัน reload
    setLoading(true); // disable ปุ่มระหว่างส่งข้อมูล
    setError('');   // ล้าง error เก่า

    // เรียก API สมัครสมาชิก ส่งข้อมูลใน body
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, thaiName }),
    });

    // ------------------------------
    // ตรวจผลลัพธ์จาก API
    // ------------------------------
    if (res.ok) {
      router.push('/dashboard'); // ไป Dashboard (เพราะ cookie ถูกตั้งแล้ว)
    } else {
      const data = await res.json();
      setError(data.message || 'Registration failed'); // แสดงข้อความผิดพลาด
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded bg-white p-8 shadow-md"
      >
        <h1 className="mb-6 text-2xl font-bold text-center">Sign Up</h1>
        {error && (
          <p className="mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        {/* Thai name */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold" htmlFor="thaiName">
            ชื่อ-นามสกุล (ภาษาไทย)
          </label>
          <input
            id="thaiName"
            type="text"
            value={thaiName}
            onChange={(e) => setThaiName(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-green-600 py-2 font-semibold text-white hover:bg-green-700"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
