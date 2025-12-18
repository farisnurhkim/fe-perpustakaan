"use client"
import BookCard from "@/components/card/BookCard";
import BookCardSkeleton from "@/components/card/BookCardSkeleton";
import PageHeader from "@/components/Header/PageHeader";
import SearchFilter from "@/components/SearchFilter";
import { categories } from "@/config/constants";
import bukuService from "@/services/buku.service";
import { IBuku } from "@/types/model";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function Home() {
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

  const { data, isLoading } = useQuery({
    queryKey: ["listBuku", currentCategory, currentSearch],
    queryFn: listBukuServices,
    refetchInterval: 0,
  });
  return (
    <>
      <PageHeader title="Katalog Buku" description="Jelajahi koleksi dan tambahkan buku ke keranjang peminjaman" />

      <div className="mt-8">
        <SearchFilter
          categories={categories}
          placeholder="Cari judul, penulis, penerbit..."
        />
      </div>
      <div className="my-5 text-sm text-slate-400">
        Menampilkan {data && data.length} dari {data && data.length} buku
      </div>
      <div className="text-white">
        {data && data.length === 0 && (
          <div className="w-full h-screen flex flex-col items-center justify-center">
            <BookOpen size={80} className='text-slate-700' />
            <p className="text-slate-500">Tidak ada data</p>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-20">
          {isLoading && [...Array(8)].map((_, index) => (
            <BookCardSkeleton type="member" key={index} />
          ))}
          {data && !isLoading && data.map((book: IBuku) => (
            <BookCard
              key={book._id}
              book={book}
              type="member"
            />
          ))}
        </div>
      </div>
    </>
  );
}
