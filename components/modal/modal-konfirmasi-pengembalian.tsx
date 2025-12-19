/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useModal } from '@/hooks/useModal'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { CheckCircle2, Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import peminjamanService from '@/services/peminjaman.service';
import { IPeminjaman } from '@/types/model';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import pengembalianService, { PayloadPengembalian } from '@/services/pengembalian.service';
import { Skeleton } from '../ui/skeleton';


const ModalKonfirmasiPengembalian = () => {
    const { data, isOpen, onClose, modalType, onOpen } = useModal();
    const isOpenModal = isOpen && modalType === "konfirmasiPengembalian";

    const queryClient = useQueryClient();
    const router = useRouter();


    const peminjaman = data?.peminjaman as unknown as IPeminjaman || [];
    const peminjamanId = data?.peminjaman?._id;

    const onServiceKonfirmasi = async ({ barcode, payload }: { barcode: string; payload: PayloadPengembalian }) => {
        const result = await pengembalianService.konfirmasiPengembalian(barcode, payload)
        return result;
    }

    const { mutate, isPending } = useMutation({
        mutationFn: onServiceKonfirmasi,
        onError(error: any) {
            const message = error?.response?.data?.message || error.message || "Terjadi Kesalahan";
            toast.error(message)
        },
        onSuccess(result: any) {
            toast.success(result.data.message);
            router.refresh();
            queryClient.invalidateQueries({
                queryKey: ["requestPengembalian"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["peminjaman"],
                exact: false
            });
            onClose()
            onOpen("strukPengembalian", { peminjaman: result.data.data })
        },
    });

    const hitungDendaService = async () => {
        const result = await peminjamanService.hitungDenda(peminjaman.barcode);
        return result.data.data;
    }

    const { data: dataDenda, isLoading } = useQuery({
        queryKey: ["hitungDenda", peminjamanId],
        queryFn: hitungDendaService,
        enabled: !!peminjamanId && isOpenModal,
        retry: false,
    });

    const onSubmit = (barcode: string) => {
        if (isLoading) return;

        const today = new Date().toISOString();
        const payload: PayloadPengembalian = {
            denda: dataDenda.totalDenda,
            tgl_kembali: today,
            keterangan: dataDenda.totalDenda > 0 ? "Buku dikembalikan terlambat" : "Dikembalikan tepat waktu"
        }
        mutate({ barcode, payload })
    };


    if (!data || !isOpenModal || !data.peminjaman) {
        return null;
    }

    const totalBuku = peminjaman.detail_peminjaman.reduce((total, item) => {
        return total + item.jumlah
    }, 0)

    return (
        <Dialog open={isOpenModal} onOpenChange={() => onClose()}>
            <DialogContent className='bg-slate-900 text-white border border-slate-700 max-h-[90vh] scroll-dark overflow-y-auto'>
                {/* Header */}
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-xl font-semibold text-white">
                        Konfirmasi Pengembalian
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 mt-1">
                        Scan barcode anggota untuk mengkonfirmasi pengembalian buku
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Informasi Peminjam Box */}
                    <div className="bg-emerald-900/10 border border-emerald-800/30 rounded-lg p-4">
                        <h4 className="text-emerald-500 font-medium mb-3">Informasi Peminjam</h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex">
                                <span className="w-24 font-semibold text-white">Nama:</span>
                                <span className="text-slate-300">{peminjaman.user.nama}</span>
                            </div>
                            <div className="flex">
                                <span className="w-24 font-semibold text-white">ID Anggota:</span>
                                <span className="text-slate-300">{peminjaman.user._id}</span>
                            </div>
                            <div className="flex">
                                <span className="w-24 font-semibold text-white">Email:</span>
                                <span className="text-slate-300">{peminjaman.user.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* List Buku */}
                    <div className="space-y-3">
                        <h4 className="text-slate-200 font-medium text-sm">Buku yang dikembalikan</h4>
                        {peminjaman.detail_peminjaman.map((book, index) => (
                            <div
                                key={index}
                                className="flex gap-4 p-3 rounded-lg bg-[#1e293b] border border-slate-700/50 items-center"
                            >
                                <div className="w-12 h-16 shrink-0 bg-slate-800 rounded overflow-hidden">
                                    <Image
                                        src={book.buku.foto}
                                        alt={book.buku.judul_buku}
                                        width={100}
                                        height={100}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-slate-100 font-medium truncate text-sm">
                                        {book.buku.judul_buku}
                                    </h4>
                                    <p className="text-slate-400 text-xs truncate">{book.buku.penulis}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs">
                                        <span className="text-slate-300">Qty: {book.jumlah}</span>
                                        <span className="text-emerald-500 font-medium">Stok: {book.buku.stok}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tanggal */}
                    <div className='flex gap-4 p-4 rounded-lg bg-[#1e293b] border border-slate-700/50 flex-col'>
                        <h2 className='text-sm'>Ringkasan pengembalian</h2>
                        <div className='flex flex-col gap-1'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-sm text-slate-400'>Total Buku:</h2>
                                <p className='text-sm text-slate-300'>{totalBuku}</p>
                            </div>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-sm text-slate-400'>Tanggal Pinjam</h2>
                                <p className='text-sm text-slate-300'>{format(new Date(peminjaman.tgl_pinjam), "dd MMM yyyy", { locale: id })}</p>
                            </div>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-sm text-slate-400'>Jatuh Tempo:</h2>
                                <p className='text-sm text-slate-300'>{format(new Date(peminjaman.batas_pinjam), "dd MMM yyyy", { locale: id })}</p>
                            </div>
                            {!isLoading && (
                                <div className='flex items-center justify-between'>
                                    <h2 className='text-sm text-slate-400'>Total Denda:</h2>
                                    <p className='text-sm text-slate-300'>{dataDenda.totalDenda}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <DialogFooter className=" pt-2 bg-[#0f172a] sm:justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isPending}
                        className="bg-white hover:bg-slate-200 text-slate-900 font-medium border border-transparent h-10 px-6"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={() => onSubmit(peminjaman.barcode)}
                        disabled={isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-10 px-6 gap-2"
                    >
                        {isPending ? <Loader className="w-3.5 h-3.5 animate-spin" /> : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Konfirmasi Pengembalian
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ModalKonfirmasiPengembalian