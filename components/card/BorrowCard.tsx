/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import { IPeminjaman } from '@/types/model';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Check, Clock, CornerDownLeft } from 'lucide-react';
import Image from 'next/image';

const BorrowCard = ({ item }: { item: IPeminjaman }) => {
    const totalStock = (data: any) => {
        return data.reduce((total: number, item: any) => {
            return total + item.jumlah
        }, 0)
    }

    return (
        <div className={cn('p-3 rounded-lg border border-slate-700 hover:border-emerald-600 transition-all duration-200')}>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar className='w-10 h-10'>
                        <AvatarImage src={"/avatar.svg"} />
                        <AvatarFallback>{item.user.nama}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2>{item.user.nama}</h2>
                        <p className='text-slate-500 text-sm'>{item.user.email}</p>
                    </div>
                </div>
                <div className='flex flex-col items-end gap-1'>
                    <div className={cn('flex items-center px-2 py-0.5 gap-1 border-2 rounded-md',
                        item.status === "dipinjam" && "border-emerald-500",
                        item.status === "pending_pengembalian" && "border-blue-600",
                        item.status === "pending_peminjaman" && "border-orange-600",
                        item.status === "terlambat" && "border-rose-600",
                    )}>
                        {item.status === "dipinjam" && <Check size={14} strokeWidth={2} className='text-emerald-300' />}
                        {item.status === "pending_pengembalian" && <CornerDownLeft size={14} strokeWidth={2} className='text-blue-400' />}
                        {item.status === "terlambat" && <Clock size={14} strokeWidth={2} className='text-rose-400' />}
                        {item.status === "pending_peminjaman" && <p className='text-xs'>⏳</p>}
                        <p className={cn("text-xs", item.status === "dipinjam" && "text-emerald-300",
                            item.status === "pending_pengembalian" && "text-blue-400", item.status === "pending_peminjaman" && "text-orange-400", item.status === "terlambat" && "text-rose-400")}>
                            {item.status === "dipinjam" && "Active"}
                            {item.status === "pending_pengembalian" && "Returning"}
                            {item.status === "pending_peminjaman" && "Pending"}
                            {item.status === "terlambat" && "Terlambat"}
                        </p>
                    </div>
                    <p className='text-slate-500 text-xs md:text-sm'>{item.barcode}</p>
                    <p className='text-slate-400 text-xs line-clamp-1'>
                        {totalStock(item.detail_peminjaman)} eks • {item.detail_peminjaman.length} judul
                    </p>
                </div>
            </div>
            <div className='w-full rounded-lg py-3 mt-4 px-4 gap-24 bg-slate-800 flex items-center'>
                <div className='flex flex-col gap-2'>
                    <p className='text-xs text-slate-400'>Tanggal Pinjam</p>
                    <h2 className='text-sm'>{new Date(item.tgl_pinjam).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}</h2>
                </div>
                <div className='flex flex-col gap-2 items-start'>
                    <p className='text-xs text-slate-400'>Tanggal Kembali</p>
                    <h2 className='text-sm'>{new Date(item.batas_pinjam).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}</h2>
                </div>
            </div>
            <div className='my-3 flex items-center justify-between'>
                <h2 className='text-sm text-slate-300'>Buku yang Dipinjam:</h2>
                {item.status === "terlambat" && (
                    <h2 className='text-sm text-slate-300'>
                    Denda: <span className='text-rose-500 font-semibold'>Rp {(item.pengembalian?.denda ?? 0).toLocaleString("id-ID")}</span>
                    </h2>
                )}
            </div>
            {item.detail_peminjaman.map((item, index) => (
                <div key={index} className='w-ful px-4 py-2 mb-3 border border-slate-500 bg-slate-800 rounded-md flex justify-between items-center'>
                    <div className='flex items-center gap-2'>
                        <div className='w-10 h-14 rounded-md overflow-hidden'>
                            <Image
                                src={item.buku.foto || "/user.jpg"}
                                width={100}
                                height={100}
                                alt={item.buku.judul_buku}
                                className='w-full h-full object-cover object-center'
                            />
                        </div>
                        <div>
                            <h2 className='text-sm'>{item.buku.judul_buku}</h2>
                            <p className='text-xs text-slate-400'>{item.buku.penulis}</p>
                        </div>
                    </div>
                    <div className='bg-slate-200 text-black text-xs font-semibold py-1 px-2 rounded-md'>
                        x{item.jumlah}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default BorrowCard