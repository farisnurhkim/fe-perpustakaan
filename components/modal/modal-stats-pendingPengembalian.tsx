/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useModal } from '@/hooks/useModal'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { IPeminjaman } from '@/types/model';
import BorrowCard from '../card/BorrowCard';
import { BookOpen } from 'lucide-react';


const ModalStatsPendingPengembalian = () => {
    const { data, isOpen, onClose, modalType } = useModal();
    const isOpenModal = isOpen && modalType === "pengembalianPending";

    if (!data || !isOpenModal) {
        return null;
    }
    const peminjaman = data?.peminjaman ?? [];


    return (
        <Dialog open={isOpenModal} onOpenChange={() => onClose()}>
            <DialogContent className='bg-slate-900 text-white border border-slate-700 max-h-[90vh] scroll-dark overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Konfirmasi Pengembalian</DialogTitle>
                    <DialogDescription>
                        {peminjaman.length} peminjaman menunggu konfirmasi admin
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-4 '>
                    {(!data || !peminjaman || peminjaman.length === 0) && (
                        <div className='w-full h-50 flex items-center justify-center flex-col'>
                            <BookOpen size={50} className='text-slate-400' />
                            <p className='text-slate-400'>Tidak ada data</p>
                        </div>
                    )}
                    {peminjaman && peminjaman.length !== 0 && peminjaman.map((item: IPeminjaman, index: number) => (
                        <BorrowCard item={item} key={index} />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ModalStatsPendingPengembalian