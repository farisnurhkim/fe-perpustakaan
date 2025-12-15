/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import BookCard from "@/components/card/BookCard"
import BookCardSkeleton from "@/components/card/BookCardSkeleton"
import BookStatCard from "@/components/card/BookStatCard"
import PageHeader from "@/components/Header/PageHeader"
import SearchFilter from "@/components/SearchFilter"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/useModal"
import { StatsBuku } from "@/lib/getStatsBooks"
import bukuService from "@/services/buku.service"
import { IBuku } from "@/types/model"
import { useQuery } from "@tanstack/react-query"
import { BookOpen, Box, PackageX, Plus } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

const categories = [
    "Semua Kategori", "Fiksi", "Non-Fiksi", "Sains", "Pengembangan Diri",
    "Keuangan", "Teknologi", "Sejarah", "Fantasi",
];

const KatalogAdmin = ({ stats }: { stats: StatsBuku }) => {
    const { stockHabis, totalBuku, totalStock } = stats;
    const { onOpen } = useModal();
    const searchParams = useSearchParams();

    const currentCategory = searchParams.get("category");
    const currentSearch = searchParams.get("search");

    const listBukuServices = async () => {
        const result = await bukuService.listBuku({
            category: currentCategory ?? undefined,
            search: currentSearch ?? undefined
        });
        return result.data.data;
    }

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["listBuku", currentCategory, currentSearch],
        queryFn: listBukuServices,
        refetchInterval: 0,
    });

    useEffect(() => {
        if (data) {
            console.log("Data API Baru Masuk:", data);
        }
    }, [data]);

    const statsBuku = [
        {
            label: "Total Buku",
            value: totalBuku,
            icon: BookOpen,
            iconColor: "text-emerald-400"
        },
        {
            label: "Stok Tersedia",
            value: totalStock,
            icon: Box,
            iconColor: "text-emerald-400"
        },
        {
            label: "Stok Habis",
            value: stockHabis,
            icon: PackageX,
            iconColor: "text-orange-500"
        }
    ];

    return (
        <>
            <div className="flex flex-wrap justify-between items-end">
                <PageHeader title="Manajemen Koleksi Buku" description="Kelola data buku dan stok perpustakaan" />
                <Button onClick={() => onOpen("createBuku")} className="text-white mt-5 bg-emerald-600 hover:bg-emerald-700 transition-all duration-300">
                    <Plus /> Tambah buku baru
                </Button>
            </div>

            <div className="mt-8">
                <SearchFilter
                    categories={categories}
                    placeholder="Cari judul, penulis, penerbit..."
                />
            </div>

            <BookStatCard stats={statsBuku} />


            <div className="text-white mt-4">
                {data && data.length === 0 && (
                    <div className="w-full h-screen flex flex-col items-center justify-center">
                        <BookOpen size={80} className='text-slate-700' />
                        <p className="text-slate-500">Tidak ada data</p>
                    </div>
                )}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-20">
                    {isLoading && [...Array(8)].map((_, index) => (
                        <BookCardSkeleton key={index} />
                    ))}
                    {data && !isLoading && data.map((book: IBuku) => (
                        <BookCard
                            key={book._id}
                            {...book}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default KatalogAdmin