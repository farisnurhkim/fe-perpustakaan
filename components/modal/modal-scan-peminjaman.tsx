/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useModal } from '@/hooks/useModal'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Loader, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import peminjamanService from '@/services/peminjaman.service';
import { useState } from 'react';
import dynamic from 'next/dynamic'
import type { DetectedBarcode } from "react-barcode-scanner";

const BarcodeScanner = dynamic(() => {
    import('react-barcode-scanner/polyfill')
    return import('react-barcode-scanner').then(mod => mod.BarcodeScanner)
}, { ssr: false })


const ModalScanPeminjaman = () => {
    const { isOpen, onClose, modalType, onOpen } = useModal();
    const isOpenModal = isOpen && modalType === "scanPeminjaman";
    const [locked, setLocked] = useState(false);

    const queryClient = useQueryClient();
    const router = useRouter();

    const deleteBukuService = async (barcode: string) => {
        const result = await peminjamanService.konfirmasiPeminjaman(barcode)
        return result;
    }

    const { isPending, mutate } = useMutation({
        mutationFn: deleteBukuService,
        onError(error: any) {
            const message = error?.response?.data?.message || error.message || "Terjadi Kesalahan";
            toast.error(message);
            setLocked(false)
        },
        onSuccess(result) {
            toast.success(result.data.message);
            queryClient.invalidateQueries({
                queryKey: ["requestPeminjaman"],
                exact: false
            });
            const data = result.data.data;
            onClose();
            onOpen("strukPeminjaman", {peminjaman: data})
            setLocked(false)
            router.refresh();
        },
    });


    if (!isOpenModal) {
        return null;
    }

    return (
        <Dialog open={isOpenModal} onOpenChange={() => onClose()}>
            <DialogContent className='bg-slate-900 text-white border border-slate-700 max-h-[90vh] w-xl scroll-dark overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle className='text-start'>Konfirmasi Peminjaman</DialogTitle>
                    <DialogDescription className='text-start'>
                        Arahkan kamera ke barcode buku untuk mengonfirmasi peminjaman.
                        Pastikan barcode terlihat jelas agar proses berjalan lancar.
                    </DialogDescription>
                </DialogHeader>
                <div className='relative w-full h-[450px] sm:h-[500px] rounded-lg overflow-hidden'>
                    {/* {isPending && (
                        <div className='absolute w-full h-full flex items-center justify-center z-50'>
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    )} */}
                    <BarcodeScanner
                        options={{
                            formats: ["qr_code", "code_128", "code_39", "code_93", "codabar", "ean_13", "ean_8", "itf", "upc_a", "upc_e"]
                        }}
                        onCapture={(barcodes: DetectedBarcode[]) => {
                            if (locked || !barcodes.length) return;

                            const barcode = barcodes[0].rawValue;
                            setLocked(true);

                            console.log("AUTO SUBMIT:", barcode);
                            mutate(barcode)
                        }}
                    />
                </div>
                <DialogFooter>
                    <Button variant={"destructive"} className='hover:bg-slate-700' type='button' onClick={() => onClose()} disabled={isPending}>Batal</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ModalScanPeminjaman