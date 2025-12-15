import React from 'react';
import { Edit, Trash2, Plus, Minus, Package } from 'lucide-react';
import Image from 'next/image'; // Pastikan domain gambar sudah di config next.config.js jika pakai URL luar
import { IBuku } from '@/types/model';



const BookCard: React.FC<IBuku> = ({
  _id,
  foto,
  genre_buku,
  judul_buku,
  penerbit,
  penulis,
  stok,
  tahun_terbit
}) => {
  return (
    <div className="flex flex-col bg-[#0f172a] border border-slate-700 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 group h-full">
      <div className="relative w-full aspect-3/4 overflow-hidden bg-slate-800">
        <Image 
          src={foto ?? "avatar.svg"} 
          alt={judul_buku}
          width={100}
          height={100} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        
        <div className="mb-3">
          <span className="bg-linear-to-tl from-emerald-300 to-emerald-600 inline-block px-2.5 py-0.5 text-base font-medium  text-white rounded-md text-shadow-sm">
            {genre_buku}
          </span>
        </div>

        <div className="mb-1">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2" title={judul_buku}>
            {judul_buku}
          </h3>
        </div>
        
        <p className="text-slate-400 text-sm font-medium mb-1">
          {penulis}
        </p>

        <p className="text-slate-500 text-xs mb-4">
          {penerbit} • {tahun_terbit}
        </p>

        <div className="mt-auto flex justify-between items-center mb-4 pt-3 border-t border-slate-700/50">
          <span className="text-slate-400 text-sm">Stok</span>
          <span className="text-emerald-400 font-bold font-mono">{stok}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => {}}
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 transition-colors text-xs font-medium"
          >
            <Edit className="w-3.5 h-3.5" /> Edit
          </button>

          <button className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 transition-colors text-xs font-medium">
            <Package className="w-3.5 h-3.5" /> <Plus className="w-3 h-3" />
          </button>

          <button className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 transition-colors text-xs font-medium">
            <Package className="w-3.5 h-3.5" /> <Minus className="w-3 h-3" />
          </button>

          <button 
             onClick={() => {}}
             className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors text-xs font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" /> Del
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookCard;