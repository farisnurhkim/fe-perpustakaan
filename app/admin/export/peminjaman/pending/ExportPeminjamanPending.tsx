/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Printer } from 'lucide-react';
import { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { IDataPeminjamanByStatusTable } from '@/types/export';
dayjs.locale('id');

const ExportPeminjamanPending = ({ data }: { data: any }) => {
  const dataPeminjamanPending = data;
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = dayjs().format('D MMMM YYYY [pukul] HH.mm');
    setCurrentDate(date);
  }, []);
  return (
    <div className="p-8 bg-white min-h-screen font-sans text-slate-800">

      {/* --- HEADER PAGE SECTION --- */}
      <div className="mb-6">
        <h1 className="text-emerald-600 text-2xl font-bold">SmartLib Ubhara</h1>
        <h2 className="text-slate-600 text-sm">Sistem Peminjaman Buku - Konfirmasi Peminjaman</h2>

        <div className="mt-4 text-xs text-slate-900 font-medium">
          Tanggal Export: {currentDate}
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="border border-slate-200 p-3 font-medium">Invoice</th>
              <th className="border border-slate-200 p-3 font-medium">Anggota</th>
              <th className="border border-slate-200 p-3 font-medium">ID Anggota</th>
              <th className="border border-slate-200 p-3 font-medium w-1/4">Buku</th>
              <th className="border border-slate-200 p-3 font-medium">Tgl Pinjam</th>
              <th className="border border-slate-200 p-3 font-medium">Tgl Kembali</th>
              <th className="border border-slate-200 p-3 font-medium">Status</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {dataPeminjamanPending.map((item: IDataPeminjamanByStatusTable, index: number) => (
              <tr key={index} className={`border-b border-slate-200 hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                <td className="border border-slate-200 p-3">{item.invoice}</td>
                <td className="border border-slate-200 p-3">{item.anggota}</td>
                <td className="border border-slate-200 p-3">{item.idAnggota}</td>
                <td className="border border-slate-200 p-3">{item.buku}</td>
                <td className="border border-slate-200 p-3">{item.tglPinjam}</td>
                <td className="border border-slate-200 p-3">{item.tglKembali}</td>
                <td className="border border-slate-200 p-3">
                  {/* Styling khusus untuk status 'pending' */}
                  <span className={`text-xs font-medium ${item.status === 'pending' ? 'text-orange-600' : 'text-slate-600'}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <div className="text-xs text-slate-600 space-y-1">
          <p className="font-semibold">SmartLib Ubhara - <span className="font-normal text-slate-500">Perpustakaan Universitas Bhayangkara Jakarta Raya</span></p>
          <p>Total Data: {dataPeminjamanPending.length}</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => window.print()}
            className="print:hidden flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium py-2.5 px-6 rounded transition-colors shadow-sm"
          >
            <Printer size={18} />
            Print / Save as PDF
          </button>
        </div>
      </div>

    </div>
  )
}

export default ExportPeminjamanPending