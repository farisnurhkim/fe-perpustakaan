/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useModal } from '@/hooks/useModal'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Book,
    User,
    Building2,
    Loader,
    MapPin,
    Phone,
    Lock,
    Pencil,
    Mail,
    UserCircle
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import authServices from '@/services/auth.service';
import { useSession } from 'next-auth/react';
import { UserExtended } from '@/types/auth';

const formSchema = z.object({
    nama: z.string().min(1, "Nama wajib diisi"),
    email: z.string().min(1, "Email wajib diisi"),
    no_telp: z.string().min(1, "No. Telepon wajib diisi"),
    password: z.string().min(6, "Password baru harus minimal 6 karakter").optional().or(z.literal("")),
})

type FormSchema = z.infer<typeof formSchema>;

const ModalEditProfile = () => {
    const { isOpen, onClose, modalType, onOpen } = useModal();
    const isOpenModal = isOpen && modalType === "ubahProfile";
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
            nama: '',
            email: '',
            no_telp: '',
        },
    })

    useEffect(() => {
        if (dataUser) {
            form.reset({
                nama: dataUser.nama || "",
                email: dataUser.email || "",
                no_telp: dataUser.no_telp || "",
                password: ""
            });
        }
    }, [dataUser, form]);

    // Hit API --
    const processUbahProfile = async (formData: FormSchema) => {
        const result = await authServices.ubahProfile(formData, dataUser._id);
        return result;
    }

    const { mutate, isPending } = useMutation({
        mutationFn: processUbahProfile,
        onError(error: any) {
            const message = error?.response?.data?.message || error.message || "Terjadi Kesalahan";
            form.setError("root", {
                message
            });
            toast.error(message)
        },
        onSuccess(result) {
            toast.success(result.data.message);
            queryClient.invalidateQueries({
                queryKey: ["userProfile"],
                exact: false
            });

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
                        <UserCircle className="w-7 h-7 text-emerald-500" />
                        Edit Profil
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Perbarui informasi profil Anda. Klik simpan untuk menyimpan perubahan.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">

                        <FormField
                            control={form.control}
                            name="nama"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Nama Lengkap</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input
                                                disabled={isPending}
                                                placeholder="Nama Lengkap"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input
                                                disabled={isPending}
                                                placeholder="user@example.com"
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input
                                                type="password"
                                                disabled={isPending}
                                                placeholder="••••••••"
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
                            name="no_telp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Nomor Telepon</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input
                                                disabled={isPending}
                                                placeholder="0812..."
                                                className="pl-9 bg-slate-800 border-slate-700 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-500 h-10 text-white placeholder:text-slate-500"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Alamat Lengkap</span>
                                <button
                                    type="button"
                                    onClick={() => { onOpen("ubahAlamat") }}
                                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                                >
                                    <Pencil className="w-3 h-3" /> Edit Alamat
                                </button>
                            </div>

                            <div className="relative group">
                                <div className="absolute left-3 top-3">
                                    <MapPin className="h-4 w-4 text-slate-500" />
                                </div>
                                <div className="min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-800/50 p-3 pl-9 text-sm text-slate-300">
                                    {dataUser?.alamat?.nama_jalan ? (
                                        <>
                                            {dataUser.alamat.nama_jalan} No. {dataUser.alamat.no_rumah}, <br />
                                            {dataUser.alamat.kelurahan}, {dataUser.alamat.kecamatan}, <br />
                                            {dataUser.alamat.kota}
                                        </>
                                    ) : (
                                        <span className="italic text-slate-500">Alamat belum diatur lengkap.</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 mt-6">
                            <div className="grid grid-cols-1 gap-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">ID Keanggotaan:</span>
                                    <span className="font-mono text-slate-300">{dataUser._id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Role:</span>
                                    <span className="font-medium text-emerald-400 capitalize">{dataUser.status_user}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Bergabung:</span>
                                    <span className="text-slate-300">{dataUser.createdAt}</span>
                                </div>
                                <div className="mt-2 text-xs text-slate-600 border-t border-slate-800 pt-2">
                                    * ID Keanggotaan dan Role tidak dapat diubah
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleClose}
                                className="text-slate-400 hover:text-white hover:bg-slate-800"
                                disabled={isPending}
                            >
                                batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
                            >
                                {isPending && (
                                    <Loader className="w-4 h-4 animate-spin mr-2" />
                                )}
                                {!isPending && "Simpan Perubahan"}
                            </Button>
                        </div>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ModalEditProfile