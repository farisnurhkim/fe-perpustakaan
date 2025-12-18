/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useModal } from '@/hooks/useModal'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { IPeminjaman } from '@/types/model';
import BorrowCard from '../card/BorrowCard';
import { BookOpen } from 'lucide-react';


const ModalStatsDipinjam = () => {
    const { data, isOpen, modalType, onClose } = useModal();

    const isOpenModal = isOpen && modalType === "bukuDipinjam";
    if (!isOpenModal || !data || !data.peminjaman) return null;

    const peminjaman = data.peminjaman;

    return (
        <Dialog open={isOpenModal} onOpenChange={onClose}>
            <DialogContent className='bg-slate-900 text-white border border-slate-700 max-h-[90vh] scroll-dark overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Detail Buku Sedang Dipinjam</DialogTitle>
                    <DialogDescription>
                        Total {peminjaman.totalBukuDipinjam ?? 0} eksemplar buku sedang dipinjam oleh {peminjaman.totalAnggota || 0} anggota ({peminjaman.totalInvoice ?? 0} invoice peminjaman)
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-4 '>
                    {(!data || !peminjaman?.data || peminjaman.data.length === 0) && (
                        <div className='w-full h-50 flex items-center justify-center flex-col'>
                            <BookOpen size={50} className='text-slate-400' />
                            <p className='text-slate-400'>Tidak ada data</p>
                        </div>
                    )}
                    {peminjaman && peminjaman.data && peminjaman.data.map((item: IPeminjaman, index: number) => (
                        <BorrowCard item={item} key={index} />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ModalStatsDipinjam