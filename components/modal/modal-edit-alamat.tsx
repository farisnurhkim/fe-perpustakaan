/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useModal } from '@/hooks/useModal'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Loader,
    MapPin,
    Home,
    Building2, // Icon gedung untuk kota/kelurahan
    Map,       // Icon peta untuk jalan
    Signpost   // Icon penunjuk jalan untuk kecamatan
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import authServices from '@/services/auth.service';
import { useSession } from 'next-auth/react';
import { UserExtended } from '@/types/auth';

export const formSchema = z.object({
    no_rumah: z.string().min(1, "No rumah wajib diisi"),
    nama_jalan: z.string().min(3, "Nama jalan minimal 3 karakter"),
    kelurahan: z.string().min(3, "Kelurahan minimal 3 karakter"),
    kecamatan: z.string().min(3, "Kecamatan minimal 3 karakter"),
    kota: z.string().min(3, "Kota minimal 3 karakter"),
});

type FormSchema = z.infer<typeof formSchema>;

const ModalEditAlamat = () => {
    const { isOpen, onClose, modalType } = useModal();
    const isOpenModal = isOpen && modalType === "ubahAlamat";
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: session } = useSession();
    const user = session?.user as unknown as UserExtended;

    const userService = async () => {
        const result = await authServices.getProfileWithToken(user._id as string);
        return result.data.data;
    }

    const { data: dataUser } = useQuery({
        queryKey: ['userProfile', user?._id],
        queryFn: userService,
        enabled: isOpenModal && !!user._id,
    })

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            nama_jalan: '',
            kecamatan: '',
            kelurahan: '',
            kota: '',
            no_rumah: '',
        },
    })

    useEffect(() => {
        if (dataUser && dataUser.alamat) {
            form.reset({
                nama_jalan: dataUser.alamat.nama_jalan || '',
                kecamatan: dataUser.alamat.kecamatan || '',
                kelurahan: dataUser.alamat.kelurahan || '',
                kota: dataUser.alamat.kota || '',
                no_rumah: dataUser.alamat.no_rumah || '',
            });
        } else if (dataUser && !dataUser.alamat) {
             form.reset({
                nama_jalan: '',
                kecamatan: '',
                kelurahan: '',
                kota: '',
                no_rumah: '',
            });
        }
    }, [dataUser, form]);

    // Hit API --
    const processUbahAlamat = async (formData: FormSchema) => {
        const result = await authServices.ubahAlamat(formData, dataUser._id);
        return result;
    }

    const { mutate, isPending } = useMutation({
        mutationFn: processUbahAlamat,
        onError(error: any) {
            const message = error?.response?.data?.message || error.message || "Terjadi Kesalahan";
            form.setError("root", { message });
            toast.error(message)
        },
        onSuccess(result) {
            toast.success(result.data.message);
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            router.refresh();
            handleClose();
        },
    });

    const onSubmit = (values: FormSchema) => mutate(values);

    const handleClose = () => {
        form.reset();
        onClose();
    }

    if (!isOpenModal || !dataUser) return null; 

    return (
        <Dialog open={isOpenModal} onOpenChange={handleClose}>
            <DialogContent className='bg-slate-900 text-slate-100 border-slate-800 max-w-lg sm:max-w-xl shadow-2xl max-h-[90vh] scroll-dark overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-emerald-500" />
                        Ubah Alamat Lengkap
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Pastikan alamat yang Anda masukkan benar untuk keperluan pengiriman atau validasi.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">

                        {/* --- Baris 1: Nama Jalan (Full Width) --- */}
                        <FormField
                            control={form.control}
                            name="nama_jalan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Nama Jalan</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Map className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input
                                                disabled={isPending}
                                                placeholder="Jl. Merdeka Raya"
                                                className="pl-9 bg-slate-800 border-slate-700 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-500 h-10 text-white placeholder:text-slate-500"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* --- Baris 2: No Rumah & Kelurahan (Grid 2 Kolom) --- */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="no_rumah"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wider">No. Rumah</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Home className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                                <Input
                                                    disabled={isPending}
                                                    placeholder="No. 12A"
                                                    className="pl-9 bg-slate-800 border-slate-700 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-500 h-10 text-white placeholder:text-slate-500"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="kelurahan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Kelurahan</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                                <Input
                                                    disabled={isPending}
                                                    placeholder="Kel. Sukamaju"
                                                    className="pl-9 bg-slate-800 border-slate-700 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-500 h-10 text-white placeholder:text-slate-500"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* --- Baris 3: Kecamatan & Kota (Grid 2 Kolom) --- */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="kecamatan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Kecamatan</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Signpost className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                                <Input
                                                    disabled={isPending}
                                                    placeholder="Kec. Sukajaya"
                                                    className="pl-9 bg-slate-800 border-slate-700 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-500 h-10 text-white placeholder:text-slate-500"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="kota"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Kota / Kabupaten</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                                <Input
                                                    disabled={isPending}
                                                    placeholder="Kota Bekasi"
                                                    className="pl-9 bg-slate-800 border-slate-700 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-500 h-10 text-white placeholder:text-slate-500"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-800 mt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleClose}
                                className="text-slate-400 hover:text-white hover:bg-slate-800"
                                disabled={isPending}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
                            >
                                {isPending && (
                                    <Loader className="w-4 h-4 animate-spin mr-2" />
                                )}
                                {!isPending && "Simpan Alamat"}
                            </Button>
                        </div>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ModalEditAlamat