/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useModal } from '@/hooks/useModal'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Loader2, RefreshCcw, ScanLine, XCircle } from 'lucide-react'; // Tambah icon XCircle
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import peminjamanService from '@/services/peminjaman.service';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'
import type { DetectedBarcode } from "react-barcode-scanner";
import pengembalianService, { PayloadPengembalian } from '@/services/pengembalian.service';

const BarcodeScanner = dynamic(() => {
    import('react-barcode-scanner/polyfill')
    return import('react-barcode-scanner').then(mod => mod.BarcodeScanner)
}, { ssr: false })

const ModalScanPengembalian = () => {
    const { isOpen, onClose, modalType, onOpen } = useModal();
    const isOpenModal = isOpen && modalType === "scanPeminjaman";

    const [scanStatus, setScanStatus] = useState<'idle' | 'processing' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const queryClient = useQueryClient();
    const router = useRouter();

    useEffect(() => {
        if (isOpenModal) {
            setScanStatus('idle');
            setErrorMessage("");
        }
    }, [isOpenModal]);

    const onServiceKonfirmasi = async (barcode: string) => {
        const today = new Date().toISOString();
        const resultHitungDenda = await peminjamanService.hitungDenda(barcode);
        const totalDenda = resultHitungDenda.data.data.totalDenda ?? 0;
        
        const payload: PayloadPengembalian = {
            denda: totalDenda,
            tgl_kembali: today,
            keterangan: totalDenda > 0 ? "Buku dikembalikan terlambat" : "Dikembalikan tepat waktu"
        }

        const result = await pengembalianService.konfirmasiPengembalian(barcode, payload)
        return result;
    }

    const { mutate } = useMutation({
        mutationFn: onServiceKonfirmasi,
        onError(error: any) {
            const message = error?.response?.data?.message || error.message || "Terjadi Kesalahan";
            setScanStatus('error');
            setErrorMessage(message);

            toast.error(message);
        },
        onSuccess(result) {
            toast.success(result.data.message);
            queryClient.invalidateQueries({
                queryKey: ["requestPengembalian"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["peminjaman"],
                exact: false
            });
            const data = result.data.data;
            onClose();
            onOpen("strukPengembalian", { peminjaman: data })
            router.refresh();
        },
    });


    const handleManualRefresh = () => {
        setErrorMessage("");
        setScanStatus('idle');
    }

    if (!isOpenModal) {
        return null;
    }

    return (
        <Dialog open={isOpenModal} onOpenChange={() => onClose()}>
            <DialogContent className='bg-slate-900 text-white border border-slate-700 max-h-[90vh] scroll-dark overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle className='text-start'>Konfirmasi Pengembalian</DialogTitle>
                    <DialogDescription className='text-start'>
                        Lakukan pemindaian barcode sebagai konfirmasi pengembalian.
                        Sistem akan memproses data secara otomatis.
                    </DialogDescription>
                </DialogHeader>

                <div className='relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-slate-800 flex items-center justify-center'>

                    {scanStatus === 'idle' && (
                        <BarcodeScanner
                            options={{
                                formats: ["qr_code", "code_128", "ean_13"],
                            }}
                            onCapture={(barcodes: DetectedBarcode[]) => {
                                if (barcodes.length > 0) {
                                    const code = barcodes[0].rawValue;
                                    setScanStatus('processing');

                                    mutate(code);
                                }
                            }}
                        />
                    )}

                    {scanStatus === 'processing' && (
                        <div className='flex flex-col items-center justify-center animate-in fade-in'>
                            <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-2" />
                            <p className="text-lg font-semibold">Memverifikasi...</p>
                        </div>
                    )}

                    {scanStatus === 'error' && (
                        <div className='flex flex-col items-center justify-center text-center sm:p-4 p-2 animate-in zoom-in duration-300'>
                            <XCircle className="w-14 h-14 md:w-14 md:h-14 text-red-500 mb-3" />
                            <h3 className="text-xl font-bold text-red-400 mb-1">Gagal Validasi</h3>
                            <p className="text-sm text-slate-300 mb-3 px-4">{errorMessage}</p>

                            <Button
                                onClick={handleManualRefresh}
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-950 hover:text-red-200"
                            >
                                <RefreshCcw className="w-4 h-4 mr-2" /> Coba Scan Lagi
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button className='hover:bg-slate-700' type='button' onClick={() => onClose()}>
                        Batal
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ModalScanPengembalian