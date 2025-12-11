"use client"
import { IPeminjaman } from "@/types/model";
import { Download, TrendingUp } from "lucide-react";
import { useMemo } from "react";

interface BukuPopulerProps {
  data: IPeminjaman[]; 
}

export default function BukuPopuler({ data }: BukuPopulerProps) {
  
  const popularBooks = useMemo(() => {
    const bookMap = new Map<string, { title: string; author: string; count: number }>();

    data.forEach((transaksi) => {
      transaksi.detail_peminjaman.forEach((item) => {
        const idBuku = item.buku._id;
        const currentData = bookMap.get(idBuku);

        if (currentData) {
          bookMap.set(idBuku, {
            ...currentData,
            count: currentData.count + item.jumlah,
          });
        } else {
          bookMap.set(idBuku, {
            title: item.buku.judul_buku,
            author: item.buku.penulis,
            count: item.jumlah,
          });
        }
      });
    });

    return Array.from(bookMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
      
  }, [data]); 

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-slate-100">
          <TrendingUp className="w-5 h-5" />
          <h3 className="font-semibold text-lg">Buku Paling Populer</h3>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 rounded-lg hover:bg-emerald-400/20 transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      <div className="space-y-3">
        {popularBooks.length === 0 ? (
           <p className="text-slate-500 text-sm text-center py-4">Belum ada data peminjaman.</p>
        ) : (
          popularBooks.map((book, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg group hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center min-w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
                  {index + 1}
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {book.title}
                  </span>
                  <span className="text-xs text-slate-500 line-clamp-1">
                    {book.author}
                  </span>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">
                {book.count}x
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}