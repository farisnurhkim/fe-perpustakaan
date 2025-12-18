/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useModal } from '@/hooks/useModal'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Upload,
    Book,
    User,
    Building2,
    Calendar,
    Bookmark,
    X,
    Loader
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import bukuService from '@/services/buku.service';
import uploadService from '@/services/upload.service';
import { categories } from '@/config/constants';

const formSchema = z.object({
    judul_buku: z.string().min(1, "Judul buku wajib diisi"),
    penulis: z.string().min(1, "Nama penulis wajib diisi"),
    penerbit: z.string().min(1, "Nama penerbit wajib diisi"),
    genre_buku: z.string().min(1, "Genre wajib dipilih"),
    tahun_terbit: z.coerce.number().min(1000, "Tahun tidak valid").max(new Date().getFullYear(), "Tahun tidak boleh lebih dari sekarang"),
    foto: z.any(),
})

type FormSchema = z.infer<typeof formSchema>;

const ModalEditBuku = () => {
    const { isOpen, onClose, modalType, data } = useModal();
    const isOpenModal = isOpen && modalType === "editBuku";
    const router = useRouter();
    const queryClient = useQueryClient();

    const buku = data?.buku;
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (buku) {
            form.setValue("judul_buku", buku.judul_buku);
            form.setValue("genre_buku", buku.genre_buku);
            form.setValue("penerbit", buku.penerbit);
            form.setValue("tahun_terbit", buku.tahun_terbit);
            form.setValue("penulis", buku.penulis);
            setPreview(buku.foto);
        }
    }, [buku]);

    // Ref untuk input file hidden
    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            judul_buku: "",
            penulis: "",
            penerbit: "",
            genre_buku: "",
            tahun_terbit: 2025,
        },
    })

    // --- FUNGSI HANDLE FILE (DRAG & DROP / CLICK) ---

    // 1. Process File: Validasi & Set Preview
    const processFile = (file: File) => {
        if (!file) return;

        // Validasi tipe file 
        if (!file.type.startsWith("image/")) {
            alert("Harap upload file gambar");
            return;
        }

        // Buat preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Masukkan File object ke React Hook Form
        form.setValue("foto", file, { shouldValidate: true });
    }

    // 2. Handle Drag Over (Mencegah browser membuka file)
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // 3. Handle Drop
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    // 4. Handle Click Input Manual
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    // 5. Handle Remove Image
    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation(); // Agar tidak memicu klik input file
        setPreview(null);
        form.setValue("foto", undefined);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    // 6. Trigger Input Click saat Div diklik
    const handleClickArea = () => {
        inputRef.current?.click();
    };

    // Hit API --
    const processUbahBuku = async (formData: FormSchema) => {
        let uploadedUrl = formData.foto; // Default pakai URL lama

        if (formData.foto instanceof File) {
            try {
                const uploadRes = await uploadService.upload(formData.foto);
                uploadedUrl = uploadRes.data.data || uploadRes.data?.data?.fileUrl;

                if (!uploadedUrl) throw new Error("Gagal mendapatkan URL gambar");
            } catch (error: any) {
                console.error("Upload Error:", error);
                throw new Error(error.response?.data?.message || "Gagal upload gambar ke server");
            }
        }

        const payloadBuku = {
            ...formData,
            foto: uploadedUrl
        };

        const result = await bukuService.ubahBuku(payloadBuku, buku._id);
        if (formData.foto instanceof File && buku.foto) {

            try {
                await uploadService.delete(buku.foto);
            } catch (err) {
                console.warn("Gagal menghapus file lama (tidak kritikal):", err);
            }
        }

        return result;
    }

    const { mutate, isPending } = useMutation({
        mutationFn: processUbahBuku,
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
                queryKey: ["listBuku"],
                exact: false
            });

            router.refresh();
            handleClose();
        },
    });

    const onSubmit = (values: FormSchema) => mutate(values);

    const handleClose = () => {
        form.reset();
        setPreview(null)
        onClose();
    }

    if (!isOpenModal) return null;

    return (
        <Dialog open={isOpenModal} onOpenChange={handleClose}>
            <DialogContent className='bg-slate-900 text-slate-100 border-slate-800 max-w-lg sm:max-w-2xl shadow-2xl max-h-[90vh] scroll-dark overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        Edit Buku
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Perbarui informasi buku di koleksi perpustakaan
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-2">

                        {/* --- DRAG & DROP UPLOAD SECTION --- */}
                        <div className="space-y-2">
                            <FormLabel className="text-xs uppercase font-bold text-slate-500 tracking-wider">Cover Buku *</FormLabel>

                            <div
                                onClick={!preview ? handleClickArea : undefined} // Hanya bisa klik jika belum ada gambar
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                className={`
                                    relative w-full h-48 rounded-xl border-2 border-dashed transition-all group overflow-hidden
                                    ${preview
                                        ? 'border-orange-500/50 bg-slate-800'
                                        : 'border-slate-700 bg-slate-800/50 hover:bg-slate-950/50 hover:border-orange-500/50 cursor-pointer'
                                    }
                                `}
                            >
                                {/* KONDISI 1: JIKA BELUM ADA GAMBAR */}
                                {!preview && (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                        <div className="p-3 rounded-full bg-slate-800 group-hover:bg-slate-700 transition mb-3">
                                            <Upload className="h-6 w-6 text-slate-400 group-hover:text-orange-500 transition" />
                                        </div>
                                        <div className="text-sm font-medium">
                                            <span className=' text-emerald-500'>Klik untuk upload</span> atau drag & drop
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            PNG, JPG, JPEG (Max. 5MB)
                                        </p>
                                    </div>
                                )}

                                {preview && (
                                    <>
                                        {/* Menggunakan h-full dan object-contain agar buku pas di tengah dan tidak terpotong */}
                                        <div className="relative w-full h-full flex items-center justify-center bg-slate-950 rounded-xl overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={preview}
                                                alt="Preview Upload"
                                                className="h-full w-auto object-contain shadow-md rounded-sm"
                                            />

                                            {/* Overlay Hover Effect & Delete Button */}
                                            {/* Kita buat overlay memenuhi seluruh kotak agar mudah di-hover dimanapun */}
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                <Button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Hapus Gambar
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Input File Hidden */}
                                <Input
                                    ref={inputRef}
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileInput}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="judul_buku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase font-bold text-slate-500 tracking-wider">Informasi Utama</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Book className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input
                                                disabled={isPending}
                                                placeholder="Judul Buku Lengkap"
                                                className="pl-9 bg-slate-800 border-slate-700 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-500 h-10"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="penulis"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                                <Input
                                                    disabled={isPending}
                                                    placeholder="Nama Penulis"
                                                    className="pl-9 bg-slate-800 border-slate-800 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-500 h-10"
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
                                name="penerbit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                                <Input
                                                    disabled={isPending}
                                                    placeholder="Nama Penerbit"
                                                    className="pl-9 bg-slate-800 border-slate-800 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-500 h-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="genre_buku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase font-bold text-slate-500 tracking-wider">Detail</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <div className="relative">
                                                    <Bookmark className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-500 z-10 pointer-events-none" />
                                                    <SelectTrigger disabled={isPending} className=" w-full pl-9 bg-slate-800 border-slate-800 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-5000">
                                                        <SelectValue placeholder="Genre" />
                                                    </SelectTrigger>
                                                </div>
                                            </FormControl>
                                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-100 w-full">
                                                {categories.slice(1, categories.length).map((category) => (
                                                    <SelectItem
                                                        key={category}
                                                        value={category.toLocaleLowerCase()}
                                                        className="focus:bg-slate-800 focus:text-emerald-400 cursor-pointer"
                                                    >
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tahun_terbit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="md:invisible text-xs uppercase font-bold text-slate-500 tracking-wider">Tahun</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                                <Input
                                                    disabled={isPending}
                                                    type="number"
                                                    placeholder="Tahun"
                                                    className="pl-9 bg-slate-800 border-slate-800 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-500 h-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                        </div>

                        {/* FOOTER ACTIONS */}
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
                                className="bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20"
                            >
                                {isPending && (
                                    <Loader className="w-4 h-4 animate-spin" />
                                )}

                                {!isPending && "Simpan buku"}
                            </Button>
                        </div>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ModalEditBuku