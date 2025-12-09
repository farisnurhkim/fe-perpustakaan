"use client"
import { useModal } from '@/hooks/useModal'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { filteredDataPeminjaman, IStatsDashboard } from '@/lib/getStatsDashboard';
import { IPeminjaman } from '@/types/model';

const ModalStatsDipinjam = () => {
    const {data, isOpen, onOpen, onClose} = useModal();
    const { peminjaman } = data;
    const dataBukuDipinjam = filteredDataPeminjaman(peminjaman, "dipinjam");
     

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='bg-slate-900 text-white border border-slate-700'>
                <DialogHeader>
                    <DialogTitle>Detail Buku Sedang Dipinjam</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default ModalStatsDipinjam