/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import PageHeader from "@/components/Header/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useDebounce from "@/hooks/useDebounce"
import { useModal } from "@/hooks/useModal"
import { cn } from "@/lib/utils"
import bukuService from "@/services/buku.service"
import { useQuery } from "@tanstack/react-query"
import { BookOpen, Filter, Plus, Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const categories = [
    "semua", "Fiksi", "Non-Fiksi", "Sains", "Pengembangan Diri",
    "Keuangan", "Teknologi", "Sejarah", "Fantasi",
];

const KatalogAdmin = () => {
    const { onOpen } = useModal();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategory = searchParams.get("category");
    const currentSearch = searchParams.get("search");

    const [searchInput, setSearchInput] = useState(currentSearch ?? "");

    const debouncedSearchValue = useDebounce(searchInput, 800);

    useEffect(() => {
        if (debouncedSearchValue === (currentSearch ?? "")) return;

        const params = new URLSearchParams(searchParams.toString());

        if (debouncedSearchValue) {
            params.set("search", debouncedSearchValue)
        } else {
            params.delete("search")
        }

        router.replace(`${pathname}?${params.toString()}`)

    }, [debouncedSearchValue, currentSearch])


    const onCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (category && category.toLowerCase() !== "semua") {
            params.set("category", category)
        } else {
            params.delete("category")
        }
        router.replace(`${pathname}?${params.toString()}`);
    }

    const listBukuServices = async () => {
        const result = await bukuService.listBuku({
            category: currentCategory ?? undefined,
            search: currentSearch ?? undefined
        });
        return result.data.data;
    }

    const { data, isLoading } = useQuery({
        queryKey: ["listBuku", currentCategory, currentSearch],
        queryFn: listBukuServices
    });

    useEffect(() => {
        if (data) {
            console.log("Data API Baru Masuk:", data);
        }
    }, [data]);

    return (
        <>
            <div className="flex flex-wrap justify-between items-end">
                <PageHeader title="Manajemen Koleksi Buku" description="Kelola data buku dan stok perpustakaan" />
                <Button onClick={() => onOpen("createBuku")} className="text-white mt-5 bg-emerald-600 hover:bg-emerald-700 transition-all duration-300">
                    <Plus /> Tambah buku baru
                </Button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full mt-8">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />

                    <Input
                        placeholder="Cari judul, penulis, penerbit..."
                        className={cn(
                            "pl-10 h-11 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500",
                            "focus-visible:ring-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-1 focus-visible:ring-offset-0"
                        )}
                        // Sinkronisasi State
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <Filter className="w-4 h-4 opacity-50" />
                    <Select onValueChange={onCategoryChange} defaultValue={currentCategory || "semua"}>
                        <SelectTrigger className="w-full md:w-[220px] h-11 bg-slate-800 border-slate-700 text-slate-200 focus:ring-emerald-500 focus:ring-1 focus:ring-offset-0">
                            <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            {categories.map((category) => (
                                <SelectItem key={category} value={category.toLocaleLowerCase()} className="focus:bg-slate-800 focus:text-emerald-400 cursor-pointer">
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Debugging Visual: Tampilkan jumlah data di layar biar yakin */}
            <div className="text-white mt-4">
                {data && data.length === 0 && (
                    <div className="w-full h-screen flex flex-col items-center justify-center">
                        <BookOpen size={80} className='text-slate-700' />
                        <p className="text-slate-500">Tidak ada data</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default KatalogAdmin