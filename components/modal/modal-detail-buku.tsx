/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useModal } from '@/hooks/useModal'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { BookOpen, User, Building2, Calendar, ShoppingCart, Tag } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { IBuku } from '@/types/model';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

const ModalDetailBuku = () => {
    const { isOpen, onClose, modalType, data } = useModal();
    const isOpenModal = isOpen && modalType === "detailBuku";
    const { addToCart, items } = useCart();

    if (!isOpenModal || !data || !data.buku) return null;

    const buku = data?.buku as IBuku;

    const handleClose = () => {
        onClose();
    }

    const renderImage = () => {
        if (!buku.foto) {
            return (
                <div className="w-full h-full min-h-[300px] bg-slate-800 flex items-center justify-center rounded-lg text-slate-500">
                    <BookOpen className="w-16 h-16 opacity-20" />
                </div>
            )
        }
        return (
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg shadow-lg border border-slate-700">
                <Image
                    src={buku.foto}
                    alt={buku.judul_buku}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                />
            </div>
        )
    }

    const handleAddToCart = (buku: IBuku) => {
        addToCart(buku)
        handleClose();
        toast.success(`"${buku.judul_buku}" ditambahkan ke keranjang`);
    }

    return (
        <Dialog open={isOpenModal} onOpenChange={handleClose}>
            <DialogContent className='bg-slate-900 text-slate-100 border-slate-800 shadow-2xl max-w-lg sm:max-w-2xl max-h-[90vh] scroll-dark overflow-y-auto'>

                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center justify-center sm:justify-start gap-2">
                        <BookOpen className='w-5 h-5 text-emerald-400' />
                        Detail Buku
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Informasi lengkap tentang buku ini
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 pt-2 grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-8">

                    <div className="flex flex-col gap-4">
                        {renderImage()}
                    </div>

                    <div className="space-y-6">

                        <div className="space-y-2">
                            <span className="bg-linear-to-tl from-emerald-300 to-emerald-600 inline-block px-2.5 py-0.5 text-sm capitalize font-medium  text-white rounded-md text-shadow-sm">
                                {buku.genre_buku}
                            </span>
                            <h2 className="text-xl md:text-2xl font-medium text-white leading-tight">
                                {buku.judul_buku}
                            </h2>
                            <div className="h-px w-full bg-slate-400 mt-4" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 group">
                                <div className="p-2 rounded-md bg-slate-800/50 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                                    <User className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Penulis</p>
                                    <p className="text-slate-200">{buku.penulis}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 group">
                                <div className="p-2 rounded-md bg-slate-800/50 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Penerbit</p>
                                    <p className="text-slate-200 ">{buku.penerbit}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 group">
                                <div className="p-2 rounded-md bg-slate-800/50 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tahun Terbit</p>
                                    <p className="text-slate-200 ">{buku.tahun_terbit}</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-px w-full bg-slate-400 mt-4" />

                        <div className="p-4 rounded-xl bg-emerald-900/30 border border-slate-800 flex items-center justify-between">
                            <span className="text-emerald-400 font-medium text-sm">Stok Tersedia</span>
                            <span className="text-2xl text-emerald-500 font-semibold">
                                {buku.stok} <span className="text-sm font-normal text-slate-500">buku</span>
                            </span>
                        </div>
                    </div>
                </div>


                <div className="p-6 flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Tutup
                    </Button>
                    <Button
                        className="bg-linear-to-tl from-emerald-300 to-emerald-600 hover:bg-emerald-700 text-white gap-2 font-medium"
                        onClick={() => {
                            if (buku.stok === 0) {
                                toast.success("Stock buku habis")
                                return;
                            }
                            const bukusItem = items.find((data) => data.buku._id === buku._id);

                            if (bukusItem && bukusItem?.qty >= buku.stok) {
                                toast.success("Stock buku habis")
                                return;
                            }

                            const totalStokItem = items.reduce((total, item) => total + item.qty, 0);
                            if (totalStokItem >= 3) {
                                toast.error("Maksimal peminjaman 3 buku");
                                return;
                            }

                            if (items.length === 3) {
                                toast.error("Maksimal peminjaman 3 buku");
                                return;
                            }

                            handleAddToCart(buku)
                        }}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Tambah ke Keranjang
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default ModalDetailBuku