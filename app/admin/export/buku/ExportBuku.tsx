/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Printer } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { useEffect, useState } from 'react';
import { IBuku } from '@/types/model';
dayjs.locale('id');

const ExportBuku = ({ data }: { data: any }) => {
    const books = data;
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const date = dayjs().format('D MMMM YYYY [pukul] HH.mm');
        setCurrentDate(date);
    }, []);
    return (
        <div className="p-8 bg-white min-h-screen font-sans text-slate-800">

            {/* --- HEADER SECTION --- */}
            <div className="mb-6">
                <h1 className="text-emerald-600 text-2xl font-bold">SmartLib Ubhara</h1>
                <h2 className="text-slate-600 text-sm">Sistem Peminjaman Buku - Data Buku</h2>

                <div className="mt-4 text-xs text-slate-900 font-medium">
                    Tanggal Export: {currentDate}
                </div>
            </div>

            {/* --- TABLE SECTION --- */}
            <div className="border border-emerald-600/30 overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    {/* Table Head */}
                    <thead className="bg-emerald-600 text-white">
                        <tr>
                            <th className="border border-slate-200 p-2 w-12 font-medium">ID</th>
                            <th className="border border-slate-200 p-2 font-medium">Judul</th>
                            <th className="border border-slate-200 p-2 font-medium">Penulis</th>
                            <th className="border border-slate-200 p-2 font-medium">Penerbit</th>
                            <th className="border border-slate-200 p-2 font-medium">Kategori</th>
                            <th className="border border-slate-200 p-2 w-24 font-medium">Tahun Terbit</th>
                            <th className="border border-slate-200 p-2 w-16 font-medium">Stok</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {books.map((book: IBuku, index: number) => (
                            <tr key={book._id} className="hover:bg-slate-50">
                                <td className="border border-slate-200 p-2 text-slate-700">{index + 1}</td>
                                <td className="border border-slate-200 p-2 text-slate-700">{book.judul_buku}</td>
                                <td className="border border-slate-200 p-2 text-slate-700">{book.penulis}</td>
                                <td className="border border-slate-200 p-2 text-slate-700">{book.penerbit}</td>
                                <td className="border border-slate-200 p-2 text-slate-700 text-center">{book.genre_buku}</td>
                                <td className="border border-slate-200 p-2 text-slate-700">{book.tahun_terbit}</td>
                                <td className="border border-slate-200 p-2 text-slate-700">{book.stok}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- FOOTER SECTION --- */}
            <div className="mt-6 flex flex-col gap-4">
                <div className="text-xs text-slate-600">
                    <p className="font-semibold">SmartLib Ubhara - <span className="font-normal text-slate-500">Perpustakaan Universitas Bhayangkara Jakarta Raya</span></p>
                    <p className="mt-1">Total Data: {books.length}</p>
                </div>

                {/* Button Print */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => window.print()}
                        className="print:hidden flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium py-2 px-4 rounded transition-colors"
                    >
                        <Printer size={16} />
                        Print / Save as PDF
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ExportBuku