import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) {
    redirect('/login');
  }
  const payload = verifyToken(token!);
  if (!payload) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between bg-white px-6 shadow">
        <h1 className="text-xl font-bold text-gray-700">ระบบจัดการเวร</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">สวัสดีคุณ {payload.thaiName || payload.email}</span>
          <a
            href="/api/logout"
            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Logout
          </a>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="w-48 bg-white shadow-md">
          <nav className="flex flex-col p-4 text-sm">
            <a
              href="/dashboard/add"
              className="rounded px-3 py-2 hover:bg-gray-100"
            >
              บันทึกเวร
            </a>
            <a
              href="/dashboard/my"
              className="rounded px-3 py-2 hover:bg-gray-100"
            >
              เวรของฉัน
            </a>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 flex items-start justify-center">{children}</main>
      </div>
    </div>
  );
}
