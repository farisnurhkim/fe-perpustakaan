/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useModal } from '@/hooks/useModal'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { IPeminjaman } from '@/types/model';
import { CheckCircle, ScanBarcode } from 'lucide-react';
import { Button } from '../ui/button';
import Barcode from "react-barcode";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';


const ModalSuccessPeminjaman = () => {
    const { data, isOpen, onClose, modalType } = useModal();
    const isOpenModal = isOpen && modalType === "successPeminjaman";
    if (!isOpenModal || !data.peminjamanUser || !data) {
        return null;
    }

    const peminjaman = data.peminjamanUser as unknown as IPeminjaman;
    const totalBuku = peminjaman.detail_peminjaman.reduce((total, item) => {
        return total + item.jumlah
    }, 0)


    return (
        <Dialog open={isOpenModal} onOpenChange={onClose}>
            <DialogContent className='bg-slate-900 text-white border border-slate-700 max-h-[90vh] scroll-dark overflow-y-auto0'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'><CheckCircle className="w-6 h-6 text-green-500" /> <p>Peminjaman Berhasil</p></DialogTitle>
                    <DialogDescription className='text-start'>
                        Silakan tunjukkan barcode ini ke petugas perpustakaan untuk mengambil buku
                    </DialogDescription>
                </DialogHeader>
                <div className="pt-2 space-y-4 max-w-full">

                    {/* Card Info Hijau */}
                    <div className="bg-[#064e3b]/40 border border-[#065f46] hover:border-emerald-700 transition-all duration-200 rounded-xl p-4 flex flex-col gap-3">
                        <div>
                            <p className="text-slate-400 text-xs mb-1">Total Buku</p>
                            <p className="font-semibold text-white">{totalBuku} Buku</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs mb-1">Tanggal Kembali</p>
                            <p className="font-semibold text-white">
                                {format(new Date(peminjaman.batas_pinjam), "EEEE, d MMMM yyyy", {
                                    locale: id,
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Card Barcode Putih */}
                    <div className="bg-white rounded-xl p-3 text-center text-black shadow-lg">
                        <div className="flex items-center justify-center gap-2 mb-4 text-slate-600">
                            <ScanBarcode className="w-5 h-5" />
                            <span className="text-sm font-medium">Kode Peminjaman</span>
                        </div>

                        <div className="flex justify-center mb-1">
                            <Barcode
                                value={peminjaman.barcode}
                                width={1.3}
                                height={60}
                                displayValue={false} // Kita custom text di bawahnya agar sesuai desain
                                background="#ffffff"
                                lineColor="#000000"
                                margin={0}
                            />
                        </div>
                        <p className="font-mono text-sm mt-2 tracking-widest font-bold">
                            {peminjaman.barcode}
                        </p>
                    </div>

                    {/* Warning Box */}
                    <div className="bg-[#431407]/40 border border-orange-900/50 rounded-lg p-4">
                        <p className="text-orange-200/90 text-sm leading-relaxed">
                            <span className="font-bold text-orange-200">Penting:</span> Simpan
                            atau screenshot barcode ini. Tunjukkan ke petugas perpustakaan
                            untuk konfirmasi dan pengambilan buku.
                        </p>
                    </div>

                    {/* Button Action */}
                    <Button
                        onClick={onClose}
                        className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold py-6 rounded-xl mt-2 transition-all"
                    >
                        Mengerti
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default ModalSuccessPeminjaman