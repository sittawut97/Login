// ------------------------------
// หน้า Login ทำงานฝั่ง Client (จำเป็นต้องใส่ 'use client')
// เพื่อเปิดให้ใช้ React Hook และจัดการ state ได้
// ------------------------------
'use client';

import { useState } from 'react';

import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
// useState  : เก็บและอัปเดตค่าภายในฟอร์ม (email, password ฯลฯ)
// useRouter : ใช้เปลี่ยนเส้นทางไปหน้าถัดไปหลังล็อกอินสำเร็จ

export default function LoginPage() {
  // สำหรับเปลี่ยนหน้าไป /dashboard เมื่อผู้ใช้ล็อกอินผ่าน
  const router = useRouter();

  // ------------------------------
  // State ของฟอร์ม
  // ------------------------------
  const [username, setUsername]   = useState('');   // ชื่อผู้ใช้ที่กรอก
  const [password, setPassword] = useState('');   // รหัสผ่านที่ผู้ใช้กรอก
  
  const [loading, setLoading]   = useState(false); // true ระหว่างส่งคำขอไป API

  // ฟังก์ชันที่ถูกเรียกเมื่อกดปุ่ม "Login"
  // ทำหน้าที่เรียก API /api/login และจัดการผลลัพธ์
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // แสดง SweetAlert Loading
    Swal.fire({
      title: 'กำลังเข้าสู่ระบบ...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        Swal.close();
        router.push('/dashboard');
      } else {
        const data = await res.json();
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: data.message || 'Login failed',
        });
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์',
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // JSX (UI) ส่วนแสดงผล
  // ------------------------------
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200">
      {/* Card Container */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm rounded-lg bg-white p-8 shadow-md"
      >
        {/* Avatar circle */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-white text-4xl">
            <svg xmlns="http://www.w3.org/2000/svg" height="32" width="28" viewBox="0 0 448 512"><path fill="#ffffff" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
          </div>
        </div>
        <h1 className="mt-16 mb-6 text-center text-xl font-semibold text-gray-700">Login</h1>

        <div className="mb-4 relative">
          <label className="mb-2 block text-sm font-bold" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 pr-10 text-gray-700 placeholder-gray-500 focus:outline-blue-500"
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
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 pr-10 text-gray-700 placeholder-gray-500 focus:outline-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 cursor-pointer"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="mt-4 text-center text-sm text-gray-500">
          You don&apos;t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">Sign up</a>
        </p>
      </form>
      {/* Decorative blobs */}
      
      
    </div>
  );
}
