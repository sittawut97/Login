'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

interface Duty {
  id: string;
  date: string; // ISO string
  detail: string;
}

// Helper: แปลงวันที่ ISO → รูปแบบไทย
const formatThaiDate = (iso: string) =>
  new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

interface Props {
  initial: Duty[];
  showForm?: boolean;
  showList?: boolean;
}

export default function Duties({ initial, showForm = true, showList = true }: Props) {
  const [duties, setDuties] = useState<Duty[]>(initial);
  const [date, setDate] = useState('');
  const [detail, setDetail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editDetail, setEditDetail] = useState('');

  // -------- CRUD --------
  const createDuty = async () => {
    if (!date || !detail) {
      setError('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    setLoading(true);
    setError('');
    const res = await fetch('/api/duties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, detail }),
    });
    if (res.ok) {
      const duty: Duty = await res.json();
      setDuties([duty, ...duties]);
      setDate('');
      setDetail('');
      // SweetAlert2 popup
      Swal.fire({ 
        icon: 'success', 
        title: 'บันทึกเวรสำเร็จ', 
        timer: 1500, 
        showConfirmButton: false });
    } else {
      const data = await res.json();
      setError(data.message || 'บันทึกไม่สำเร็จ');
    }
    setLoading(false);
  };

  const startEdit = (d: Duty) => {
    setEditingId(d.id);
    setEditDate(d.date.split('T')[0]);
    setEditDetail(d.detail);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editDate || !editDetail) {
      setError('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    const res = await fetch(`/api/duties/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: editDate, detail: editDetail }),
    });
    if (res.ok) {
      const updated: Duty = await res.json();
      setDuties(duties.map((d) => (d.id === updated.id ? updated : d)));
      setEditingId(null);
      // SweetAlert2 popup
      Swal.fire({ 
        icon: 'success', 
        title: 'อัปเดตเวรสำเร็จ', 
        timer: 1500, 
        showConfirmButton: false });
    } else {
      const data = await res.json();
      setError(data.message || 'อัปเดตไม่สำเร็จ');
    }
  };

  const deleteDuty = async (id: string) => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'ยืนยันการลบเวร?',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
    });
    if (!result.isConfirmed) return;
    const res = await fetch(`/api/duties/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setDuties(duties.filter((d) => d.id !== id));
      // SweetAlert2 popup
      Swal.fire({ 
        icon: 'success', 
        title: 'ลบเวรสำเร็จ', 
        timer: 1500, 
        showConfirmButton: false });
    } else {
      const data = await res.json();
      setError(data.message || 'ลบไม่สำเร็จ');
    }
  };

  // -------- UI --------
  return (
    <div className="mt-6 w-full max-w-md">
      {showForm && (
        <>
          <h2 className="mb-4 text-xl font-semibold">บันทึกเวร</h2>
          {error && (
            <p className="mb-2 rounded bg-red-100 px-3 py-1 text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="mb-4 space-y-2">
            <div>
              <label className="block text-sm font-medium">วันที่</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">รายละเอียด</label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <button
              onClick={createDuty}
              disabled={loading}
              className="rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 cursor-pointer"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึกเวร'}
            </button>
          </div>
        </>
      )}

      {showList && (
        <>
          <h3 className="mb-2 text-lg font-semibold">เวรของฉัน</h3>
          <ul className="space-y-2">
            {duties.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between rounded border px-3 py-2 text-sm"
              >
                {editingId === d.id ? (
                  <>
                    <div className="mr-2 flex flex-1 flex-col">
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="mb-1 rounded border px-2 py-1 text-xs"
                      />
                      <textarea
                        value={editDetail}
                        onChange={(e) => setEditDetail(e.target.value)}
                        className="rounded border px-2 py-1 text-xs"
                      />
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={saveEdit}
                        className="rounded bg-blue-600 p-2 text-white hover:bg-blue-700 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="17.5" viewBox="0 0 448 512"><path fill="#ffffff" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="rounded bg-gray-400 p-2 text-white hover:bg-gray-500 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="15" viewBox="0 0 384 512"><path fill="#ffffff" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mr-2 flex-1 truncate">
                      <span className="block font-medium">
                        {formatThaiDate(d.date)}
                      </span>
                      <span>{d.detail}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(d)}
                        className="rounded bg-yellow-500 p-2 text-white hover:bg-yellow-600 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><path fill="#ffffff" d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>
                      </button>
                      <button
                        onClick={() => deleteDuty(d.id)}
                        className="rounded bg-red-600 p-2 text-white hover:bg-red-700 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="17.5" viewBox="0 0 448 512"><path fill="#ffffff" d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
            {duties.length === 0 && (
              <li className="text-sm text-gray-500">ยังไม่มีข้อมูลเวร</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
