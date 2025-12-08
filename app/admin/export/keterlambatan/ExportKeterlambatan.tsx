/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { IDataPeminjamanByStatusTable } from '@/types/export';
dayjs.locale('id');


const ExportKeterlambatan = ({data}: {data: any}) => {
  const [currentDate, setCurrentDate] = useState("");
  const dendaData = data;

  useEffect(() => {
    const date = dayjs().format('D MMMM YYYY [pukul] HH.mm');
    setCurrentDate(date);
  }, []);

  // 1. Helper Format Rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // 3. Hitung Total Denda Keseluruhan
  const totalDendaKeseluruhan = dendaData.reduce((acc: number, curr: IDataPeminjamanByStatusTable) => {
    return acc + (curr.nominalDenda || 0);
  }, 0);

  return (
    <div className="p-8 bg-white min-h-screen font-sans text-slate-800">
      
      {/* Header Laporan */}
      <div className="mb-6">
        <h1 className="text-emerald-600 text-2xl font-bold">SmartLib Ubhara</h1>
        <h2 className="text-slate-600 text-sm">Laporan Keuangan - Denda & Keterlambatan</h2>
        <div className="mt-4 text-xs text-slate-900 font-medium">
          Tanggal Export: {currentDate}
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto border border-slate-200 rounded-t-lg">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-emerald-800 text-white">
            <tr>
              <th className="p-3 font-medium">Invoice</th>
              <th className="p-3 font-medium">Peminjam</th>
              <th className="p-3 font-medium w-1/4">Buku Yang Dipinjam</th>
              <th className="p-3 font-medium">Tenggat Waktu</th>
              <th className="p-3 font-medium">Tgl Dikembalikan</th>
              <th className="p-3 font-medium text-right bg-emerald-900/50">Nominal Denda</th>
            </tr>
          </thead>
          <tbody>
            {dendaData.map((item: IDataPeminjamanByStatusTable, index: number) => (
              <tr key={index} className={`border-b border-slate-200 hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                <td className="p-3 font-medium text-emerald-700">{item.invoice}</td>
                <td className="p-3">
                    <div className="font-medium">{item.anggota}</div>
                    <div className="text-xs text-slate-500">{item.idAnggota}</div>
                </td>
                <td className="p-3 text-slate-600">
                    {item.buku}
                </td>
                <td className="p-3 text-slate-600">{item.tenggatWaktu}</td>
                <td className="p-3 text-slate-600">
                    {item.tglKembali}
                </td>
                <td className="p-3 text-right font-semibold text-rose-600 bg-rose-50/30">
                    {formatRupiah(item.nominalDenda)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- TOTAL DENDA SECTION (PALING BAWAH) --- */}
      <div className="mt-0 border-x border-b border-slate-200 bg-slate-50 p-4 flex justify-end items-center rounded-b-lg">
          <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-medium text-slate-500">Total Denda Keseluruhan</span>
              <span className="text-2xl font-bold text-emerald-700">
                  {formatRupiah(totalDendaKeseluruhan)}
              </span>
          </div>
      </div>

      {/* Footer Info & Print */}
      <div className="mt-8 flex flex-col gap-6">
        <div className="text-xs text-slate-600">
            <p className="font-semibold">SmartLib Ubhara - <span className="font-normal text-slate-500">Perpustakaan Universitas Bhayangkara Jakarta Raya</span></p>
            <p>Total Transaksi Denda: {dendaData.length}</p>
        </div>

        <div className="flex justify-center">
            <button 
                onClick={() => window.print()} 
                className="print:hidden flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium py-2.5 px-6 rounded transition-colors shadow-sm"
            >
                <Printer size={18} />
                Print Laporan Denda
            </button>
        </div>
      </div>

    </div>
  );
}

export default ExportKeterlambatan