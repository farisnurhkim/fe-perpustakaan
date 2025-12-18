/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useModal } from '@/hooks/useModal'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import bukuService from '@/services/buku.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import uploadService from '@/services/upload.service';


const ModalDeleteBuku = () => {
    const { data, isOpen, onClose, modalType } = useModal();
    const isOpenModal = isOpen && modalType === "deleteBuku";

    const queryClient = useQueryClient();
    const router = useRouter();

    const buku = data?.buku;

    const deleteBukuService = async () => {
        if (!buku?._id) throw new Error("Id buku tidak ada!");

        let dbResponse;
        try {
            dbResponse = await bukuService.deleteBuku(buku._id as string);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Gagal delete buku dari database");
        }

        if (buku?.foto) {
            try {
                await uploadService.delete(buku.foto);
            } catch (err) {
                console.warn("Gagal menghapus file sampah, tapi data DB sudah bersih:", err);
            }
        }

        return dbResponse; 
    }

    const { isPending, mutate } = useMutation({
        mutationFn: deleteBukuService,
        onError(error: any) {
            const message = error?.response?.data?.message || error.message || "Terjadi Kesalahan";
            toast.error(message)
        },
        onSuccess(result) {
            toast.success(result.data.message);
            queryClient.invalidateQueries({
                queryKey: ["listBuku"],
                exact: false
            });

            router.refresh();
            onClose();
        },
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate();
    };

    if (!data || !isOpenModal) {
        return null;
    }

    return (
        <Dialog open={isOpenModal} onOpenChange={() => onClose()}>
            <DialogContent className='bg-slate-900 text-white border border-slate-700 max-h-[90vh] scroll-dark overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Hapus Buku?</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus buku ini dari perpustakaan? Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <DialogFooter>
                        <Button className='hover:bg-slate-700' type='button' onClick={() => onClose()} disabled={isPending}>Batal</Button>
                        <Button variant={"destructive"} type='submit' disabled={isPending} >
                            {isPending ? <Loader className="w-4 h-4 animate-spin" /> : "Delete"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ModalDeleteBuku