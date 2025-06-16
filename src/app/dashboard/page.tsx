import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = verifyToken(token);

  if (!payload) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
      <p className="text-lg">Welcome, {payload.email}</p>
      <a
        href="/api/logout"
        className="mt-4 rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
      >
        Logout
      </a>
    </div>
  );
}
