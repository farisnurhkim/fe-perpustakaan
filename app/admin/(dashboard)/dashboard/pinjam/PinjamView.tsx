/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react";
import { ScanBarcodeCard } from "@/components/card/ScanBarcodeCard"
import PageHeader from "@/components/Header/PageHeader"
import { filteredDataPeminjaman } from "@/lib/getStatsDashboard";
import peminjamanService from "@/services/peminjaman.service";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button"; // Pastikan import Button
import { BookOpen, RefreshCcw } from "lucide-react"; // Icon refresh/reset
import { RequestPeminjamanCard } from "@/components/card/RequestPeminjamanCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useModal } from "@/hooks/useModal";


const PinjamView = () => {
    const [searchCode, setSearchCode] = useState<string>("");
    const {onOpen} = useModal()
    const handleBarcodeSearch = async (code: string) => {
        setSearchCode(code);
    };

    const handleReset = () => {
        setSearchCode("");
    };

    const fetchPeminjamanData = async () => {
        if (searchCode) {
            try {
                const result = await peminjamanService.cariPeminjaman(searchCode);
                const item = result.data.data;

                if (!item || item.status !== "pending_peminjaman") return [];

                return [item];
            } catch (error) {
                console.log(error)
                return [];
            }
        } else {
            const result = await peminjamanService.daftarSemuaPeminjaman();
            return filteredDataPeminjaman(result.data.data, "pending_peminjaman");
        }
    }

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["requestPeminjaman", searchCode],
        queryFn: fetchPeminjamanData,
        refetchInterval: 0,
    });

    

    return (
        <div>
            <PageHeader
                description="Scan barcode anggota untuk mengkonfirmasi peminjaman buku"
                title="Konfirmasi Peminjaman"
            />

            <div className="mt-5 space-y-4">
                <ScanBarcodeCard
                    key={searchCode}
                    onSearch={handleBarcodeSearch}
                    isLoading={isLoading || isFetching}
                    onOpen={onOpen}
                />

                {searchCode && (
                    <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-md border border-emerald-200">
                        <p className="text-sm text-emerald-700">
                            Menampilkan peminjaman: <span className="font-bold">{searchCode}</span>
                        </p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100"
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Tampilkan Semua Data
                        </Button>
                    </div>
                )}
            </div>

            <div className="mt-5">
                <div className="flex items-center justify-between text-slate-100">
                    <h2 className="text-base">Daftar Peminjaman Menunggu Konfirmasi</h2>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-900 hover:bg-slate-200 px-3 py-1">
                        {data?.length ?? 0} peminjaman
                    </Badge>
                </div>
            </div>

            <div className="mt-5">
                {isLoading ? (
                    <>
                        <Skeleton className="h-[400px] w-full bg-slate-800" />
                    </>
                ) : (
                    <div>
                        {data?.map((item, index) => (
                            <RequestPeminjamanCard item={item} onConfirm={() => onOpen("konfirmasiPeminjaman", { peminjaman: item })} type="peminjaman" key={index} />
                        ))}
                    </div>
                )}

                {(!data || data.length === 0) && !isLoading && (
                    <div className="flex items-center justify-center h-screen flex-col gap-2">
                        <BookOpen className="w-24 h-24 text-slate-700" />
                        <h2 className="text-slate-400">Tidak ada data</h2>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PinjamView