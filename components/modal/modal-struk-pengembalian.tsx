/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useModal } from '@/hooks/useModal'
import { Dialog, DialogContent } from '../ui/dialog'
import { FileText, Loader2, Printer } from 'lucide-react';
import { Button } from '../ui/button';
import { IPeminjaman } from '@/types/model';
import { format } from 'date-fns';
import { useRef, useState } from 'react';
import { DialogTitle } from '@radix-ui/react-dialog';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

const ModalStrukPengembalian = () => {
    const { data, isOpen, onClose, modalType } = useModal();
    const isOpenModal = isOpen && modalType === "strukPengembalian";

    const contentRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!data || !isOpenModal || !data.peminjaman) {
        return null;
    }

    const peminjaman = data.peminjaman as unknown as IPeminjaman;

    const handlePrint = () => {
        window.print();
    };


    const totalBuku = peminjaman.detail_peminjaman.reduce((acc, curr) => acc + curr.jumlah, 0);

    const handleDownloadPDF = async () => {
        const element = contentRef.current;
        if (!element) return;

        setIsGenerating(true);

        try {

            const imgData = await toPng(element, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
                height: element.scrollHeight,
                style: {
                    maxHeight: 'none',
                    height: 'auto',
                    overflow: 'visible'
                }
            });

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10; // Margin 10mm

            const imgProps = pdf.getImageProperties(imgData);

            const maxContentWidth = pageWidth - (margin * 2);
            const maxContentHeight = pageHeight - (margin * 2);

            const imgRatio = imgProps.width / imgProps.height;

            let finalWidth = maxContentWidth;
            let finalHeight = finalWidth / imgRatio;

            if (finalHeight > maxContentHeight) {
                finalHeight = maxContentHeight;
                finalWidth = finalHeight * imgRatio;
            }

            const xPos = (pageWidth - finalWidth) / 2;

            pdf.addImage(imgData, 'PNG', xPos, margin, finalWidth, finalHeight);

            pdf.save(`Struk-${peminjaman.barcode}.pdf`);
        } catch (error) {
            console.error("Gagal membuat PDF", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Dialog open={isOpenModal} onOpenChange={() => onClose()}>
            <DialogContent className='bg-white text-black border border-slate-700 max-h-[90vh] scroll-dark overflow-y-auto'>
                <DialogTitle />
                <div className="flex justify-end gap-2 p-4 pb-2 bg-slate-50 border-b">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadPDF}
                        className="h-8 gap-2 text-xs border-slate-300 hover:bg-slate-100 text-slate-700"
                    >
                        {isGenerating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <FileText className="w-3.5 h-3.5" />
                        )}
                        {isGenerating ? "Generating..." : "PDF"}
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handlePrint}
                        className="h-8 gap-2 text-xs bg-slate-900 hover:bg-slate-800 text-white"
                    >
                        <Printer className="w-3.5 h-3.5" />
                        Print
                    </Button>
                </div>

                <div ref={contentRef} className="p-4 pt-4 font-mono text-xs leading-relaxed">

                    <div className="text-center mb-4 space-y-1">
                        <h3 className="font-bold text-sm text-black">SMARTLIB UBHARA</h3>
                        <p className="text-slate-600">Perpustakaan</p>
                        <p className="text-slate-600">Universitas Bhayangkara</p>
                        <p className="text-slate-600">Jakarta Raya</p>
                    </div>

                    <DashedSeparator />

                    <h4 className="text-center font-bold my-3 text-black">BUKTI PENGEMBALIAN</h4>

                    <div className='border border-black' />

                    <div className="my-3 space-y-1">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Tanggal</span>
                            <span className="font-medium">{format(new Date(), "dd/MM/yyyy")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Waktu</span>
                            <span className="font-medium">{format(new Date(), "HH.mm.ss")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">No. Invoice</span>
                            <span className="font-medium">{peminjaman.barcode}</span>
                        </div>
                    </div>

                    <DashedSeparator />

                    <div className="my-3 space-y-1">
                        <p className="font-bold text-slate-800 mb-2">DATA ANGGOTA:</p>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Nama</span>
                            <span className="font-medium text-right max-w-[150px] truncate">{peminjaman.user.nama}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">ID</span>
                            <span className="font-medium">{peminjaman.user._id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Telp</span>
                            <span className="font-medium">{peminjaman.user.no_telp}</span>
                        </div>
                    </div>

                    <DashedSeparator />

                    <div className="my-3 space-y-3">
                        <p className="font-bold text-slate-800">DAFTAR BUKU:</p>

                        {peminjaman.detail_peminjaman.map((item, index) => (
                            <div key={index} className="space-y-1">
                                <div className="flex justify-between items-start">
                                    <span className="font-bold text-black w-5">{index + 1}.</span>
                                    <div className="flex-1">
                                        <p className="font-bold text-black">{item.buku.judul_buku}</p>
                                        <p className="text-slate-500 italic">by {item.buku.penulis}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between pl-5">
                                    <span className="text-slate-600">Qty</span>
                                    <span className="font-medium">{item.jumlah} eks</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <DashedSeparator />

                    <div className="my-3 space-y-1">
                        <div className="flex justify-between font-bold text-black">
                            <span>TOTAL BUKU</span>
                            <span>{totalBuku} eksemplar</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="text-slate-600">Tanggal Pinjam</span>
                            <span className="font-medium">{format(new Date(peminjaman.tgl_pinjam), "dd/MM/yyyy")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Batas Kembali</span>
                            <span className="font-bold text-black">{format(new Date(peminjaman.batas_pinjam), "dd/MM/yyyy")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Status</span>
                            <span className="font-bold text-black">{peminjaman.status === "dikembalikan" ? "Tepat Waktu" : peminjaman.status}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Total Denda</span>
                            <span className="font-bold text-black">{formatRupiah(peminjaman.pengembalian?.denda ?? 0)}</span>
                        </div>
                    </div>

                    <DashedSeparator />

                    <div className="my-6 text-center space-y-1">
                        <p className="text-slate-500 text-[10px]">Barcode</p>
                        <p className="font-bold text-lg tracking-widest uppercase font-sans">
                            {peminjaman.barcode}
                        </p>
                    </div>

                    <DashedSeparator />

                    <div className="mt-4 text-center space-y-1">
                        <p className="font-bold text-black">Terima kasih</p>
                        <p className="text-slate-600">Harap simpan bukti ini</p>
                        <p className="text-[10px] text-slate-400 mt-2">
                            Dicetak: {new Date().toLocaleString("id-ID").replace(/\./g, ":")}
                        </p>
                    </div>

                    <DashedSeparator />

                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ModalStrukPengembalian;

function DashedSeparator() {
    return <div className="border-b-2 border-dashed border-slate-300 w-full my-2" />;
}