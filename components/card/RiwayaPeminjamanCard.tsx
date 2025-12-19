/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPeminjaman, StatusPeminjaman } from "@/types/model";
import { format, differenceInCalendarDays, isAfter } from "date-fns";
import { BookOpen, Calendar, CheckCircle, Clock, Loader, PackageOpen, QrCode, Receipt } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import Image from "next/image";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { id } from "date-fns/locale/id";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import pengembalianService from "@/services/pengembalian.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const getStatusColor = (status: StatusPeminjaman) => {
    switch (status) {
        case 'pending_peminjaman': return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
        case 'dipinjam': return 'text-emerald-500 border-emerald-500/50 bg-emerald-500/10';
        case 'pending_pengembalian': return 'text-purple-400 border-purple-500/50 bg-purple-500/10';
        case 'dikembalikan': return 'text-green-500 border-green-500/50 bg-green-500/10';
        case 'terlambat': return 'text-red-500 border-red-500/50 bg-red-500/10';
        default: return 'text-slate-500';
    }
};

const getStatusLabel = (status: StatusPeminjaman) => {
    switch (status) {
        case 'pending_peminjaman': return 'Menunggu Konfirmasi';
        case 'dipinjam': return 'Sedang Dipinjam';
        case 'pending_pengembalian': return 'Menunggu Pengembalian';
        case 'dikembalikan': return 'Dikembalikan';
        case 'terlambat': return 'Terlambat';
        default: return status;
    }
};

export const RiwayatPeminjamanCard = ({ item }: { item: IPeminjaman }) => {
    const totalBuku = item.detail_peminjaman.reduce((acc: number, cur) => acc + cur.jumlah, 0);
    const { onOpen } = useModal();
    const queryClient = useQueryClient();
    const router = useRouter();

    const getSisaHari = (batas_pinjam: string | Date) => {
        const today = new Date();
        const batas = new Date(batas_pinjam);

        const diff = differenceInCalendarDays(batas, today);

        if (diff < 0) return "Sudah lewat";
        if (diff === 0) return "Hari ini";

        return `${diff} hari lagi`;
    };

    const prosesPengembalian = async (barcode: string) => {
        const result = await pengembalianService.prosesPengembalian(barcode);
        return result;
    }

    const { mutate, isPending } = useMutation({
        mutationFn: prosesPengembalian,
        onError(error: any) {
            const message = error?.response?.data?.message || error.message || "Terjadi Kesalahan";
            toast.error(message)
        },
        onSuccess(result) {
            toast.success(result.data.message);
            queryClient.invalidateQueries({
                queryKey: ["peminjaman"],
                exact: false
            });

            router.refresh();
        },
    });

    const onProsesPengembalian = (barcode: string) => mutate(barcode)

    return (
        <Card className="bg-slate-900 border-slate-700 p-0 overflow-hidden mb-4">
            <div className="p-4 flex justify-between items-start">
                <div>
                    <p className="text-white text-sm font-mono mb-1">Peminjaman #{item.barcode.slice(-6)}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <span className='text-slate-400'>{totalBuku} buku</span>
                        <span className='text-slate-600'>•</span>
                        <span className='text-slate-400'>{item.detail_peminjaman.length} judul</span>
                    </div>
                </div>
                <Badge className={`${getStatusColor(item.status)} capitalize rounded-md`}>
                    {item.status === "pending_pengembalian" && (
                        <QrCode className="w-3 h-3 mr-1" />
                    )}

                    {item.status === "dikembalikan" && (
                        <CheckCircle className="w-3 h-3 mr-1" />
                    )}

                    {item.status === 'pending_peminjaman' && <Clock className="w-3 h-3 mr-1" />}
                    {item.status !== "dipinjam" && getStatusLabel(item.status)}
                    {item.status === "dipinjam" && getSisaHari(item.batas_pinjam)}
                </Badge>
            </div>

            <div className="p-6">
                {item.detail_peminjaman.map((item, index) => (
                    <div key={index} className="p-4 rounded-md border border-slate-700 bg-slate-800 flex mb-3 gap-4">
                        {/* Image Placeholder / Actual Image */}
                        <div className="w-16 h-24 bg-slate-800 rounded-md shrink-0 overflow-hidden relative border border-slate-700">
                            {item.buku.foto ? (
                                <Image
                                    src={item.buku.foto}
                                    alt={item.buku.judul_buku}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="text-white font-medium line-clamp-2">{item.buku.judul_buku}</h3>
                            <p className="text-slate-400 text-sm mt-1">{item.buku.penulis}</p>
                            <Badge className="mt-2 bg-white flex items-center justify-center rounded-md text-slate-900 hover:bg-slate-700 text-sm">
                                {item.jumlah}x
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>


            <div className="mx-4 py-3 border border-b-0 border-t-slate-700 bg-slate-900 border-t grid grid-cols-2 gap-4">
                <div>
                    <p className="text-slate-500 text-xs flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3" /> Tanggal Pinjam
                    </p>
                    <p className="text-slate-300 text-sm">
                        {format(new Date(item.tgl_pinjam), 'dd MMM yyyy', { locale: id })}
                    </p>
                </div>
                <div>
                    <p className="text-slate-500 text-xs flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3" /> Jatuh Tempo
                    </p>
                    <p className="text-white font-medium text-sm">
                        {format(new Date(item.batas_pinjam), 'dd MMM yyyy', { locale: id })}
                    </p>
                </div>
            </div>
            <div className="px-4">
                <div className={cn(
                    (item.status !== "dikembalikan" && item.status !== "terlambat") && "p-4 bg-[#064e3b]/10 border-t border-emerald-900/30"
                )}>
                    {(item.status !== "dipinjam" && item.status !== "dikembalikan" && item.status !== "terlambat") && (
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <div className="text-emerald-400/80">
                                    <p className="font-semibold text-sm text-emerald-200">Barcode Peminjaman</p>
                                    <p className="text-xs mt-1">Tunjukkan barcode ini ke petugas</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onOpen("successPeminjaman", { peminjamanUser: item })}
                                className="text-emerald-400 hover:text-emerald-300 bg-white hover:bg-emerald-950/50 h-8 text-xs"
                            >
                                <QrCode className="w-4 h-4 mr-2" /> Tampilkan Barcode
                            </Button>
                        </div>
                    )}
                    {(item.status === "dikembalikan" || item.status === "terlambat") && (
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <div className="text-emerald-400/80">
                                    <p className="font-semibold text-sm text-emerald-200">Struk Peminjaman</p>
                                    <p className="text-xs mt-1">Lihat detail transaksi</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onOpen("strukPengembalian", { peminjaman: item })}
                                className="text-emerald-400 hover:text-emerald-300 bg-white hover:bg-emerald-950/50 h-8 text-xs"
                            >
                                <Receipt className="w-4 h-4 mr-2" /> Tampilkan Struk
                            </Button>
                        </div>
                    )}
                    {item.status === "dipinjam" && (
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPending}
                            onClick={() => onProsesPengembalian(item.barcode)}
                            className="text-white hover:text-white bg-emerald-600 hover:bg-emerald-600/85 h-8 w-full text-xs"
                        >
                            {isPending ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                </>

                            ) : (
                                <>
                                    <PackageOpen className="w-4 h-4 mr-2" />
                                    Ajukan Pengembalian
                                </>
                            )}
                        </Button>
                    )}

                </div>
            </div>

        </Card>
    );
};