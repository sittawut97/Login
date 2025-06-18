import { prisma } from '@/lib/prisma';
import Duties from './DutiesFixed';

interface WrapperProps {
  userId: string;
  showForm?: boolean;
  showList?: boolean;
}

export default async function DutiesWrapper({ userId, showForm = true, showList = true }: WrapperProps) {
  // ดึงข้อมูลเวรของ user ปัจจุบันจากฐานข้อมูล
  const duties = await prisma.duty.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  // แปลง date เป็น string เพื่อให้ serializable ฝั่ง client
  const clean = duties.map((d) => ({
    id: d.id,
    date: d.date.toISOString(),
    detail: d.detail,
  }));

  // ส่งค่า initial ไปให้ component ฝั่ง client
  return <Duties initial={clean} showForm={showForm} showList={showList} />;
}
