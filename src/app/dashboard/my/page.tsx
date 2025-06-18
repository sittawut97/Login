import DutiesWrapper from '@/components/DutiesWrapper';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function MyDutiesPage() {
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
    <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
      <DutiesWrapper userId={payload.id} showForm={false} showList={true} />
    </div>
  );
}
