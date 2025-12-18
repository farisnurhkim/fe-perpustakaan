"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react';
import { UserExtended } from '@/types/auth';
import peminjamanService from '@/services/peminjaman.service';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { IPeminjaman, StatusPeminjaman } from '@/types/model';
import { BookOpen, Clock } from 'lucide-react';
import { RiwayatPeminjamanCard } from '@/components/card/RiwayaPeminjamanCard';
import PageHeader from '@/components/Header/PageHeader';


const STATUS_MAP: Record<"menunggu" | "aktif" | "riwayat", StatusPeminjaman[]> = {
    aktif: ["dipinjam", "pending_pengembalian"],
    menunggu: ["pending_peminjaman"],
    riwayat: ["dikembalikan", "terlambat"],
};



export default function Page() {
    const { data: session } = useSession();
    const user = session?.user as UserExtended;
    const [activeTab, setActiveTab] = useState("menunggu");

    const getPeminjaman = async (userId: string) => {
        if (!userId) return [];
        const result = await peminjamanService.daftarPeminjamanUser(userId);
        if (result.status !== 200) {
            throw new Error(result.data.message);
        }
        return result.data.data as IPeminjaman[];
    };

    const { data, isLoading } = useQuery({
        queryKey: ['peminjaman', user?._id],
        queryFn: async () => await getPeminjaman(user?._id as string),
        enabled: !!user?._id
    });

    const filterData = (statusKey: "menunggu" | "aktif" | "riwayat") => {
        const list = Array.isArray(data) ? data : [];
        return list.filter(item => STATUS_MAP[statusKey].includes(item.status));
    };

    const waitingList = filterData("menunggu");
    const activeList = filterData("aktif");
    const historyList = filterData("riwayat");

    return (
        <div className="w-full p-4 space-y-6">
            <PageHeader title='Riwayat Peminjaman' description='Pantau status peminjaman buku Anda'/>

            <Tabs defaultValue="menunggu" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full bg-white border border-slate-800 p-1 h-auto rounded-full grid grid-cols-3 mb-6">
                    <TabsTrigger
                        value="menunggu"
                        className="rounded-full py-2.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 transition-all"
                    >
                        Menunggu
                        {waitingList.length > 0 && (
                            <span className="ml-2 bg-white text-black text-[10px] px-1.5 py-0.5 rounded-md min-w-5">
                                {waitingList.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="aktif"
                        className="rounded-full py-2.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 transition-all"
                    >
                        Aktif
                        {activeList.length > 0 && (
                            <span className="ml-2 bg-white text-black text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px]">
                                {activeList.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="riwayat"
                        className="rounded-full py-2.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 transition-all"
                    >
                        Riwayat
                    </TabsTrigger>
                </TabsList>

                {/* Content Area */}
                <div className="min-h-[300px]">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2].map(i => <Skeleton key={i} className="h-48 w-full bg-slate-800/50 rounded-xl" />)}
                        </div>
                    ) : (
                        <>
                            <TabsContent value="menunggu" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {waitingList.length === 0 ? <EmptyState label="Tidak ada peminjaman menunggu konfirmasi" /> : waitingList.map(item => <RiwayatPeminjamanCard key={item._id} item={item} />)}
                            </TabsContent>

                            <TabsContent value="aktif" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {activeList.length === 0 ? <EmptyState label="Tidak ada peminjaman aktif" /> : activeList.map(item => <RiwayatPeminjamanCard key={item._id} item={item} />)}
                            </TabsContent>

                            <TabsContent value="riwayat" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {historyList.length === 0 ? <EmptyState label="Belum ada riwayat peminjaman" /> : historyList.map(item => <RiwayatPeminjamanCard key={item._id} item={item} />)}
                            </TabsContent>
                        </>
                    )}
                </div>
            </Tabs>
        </div>
    )
}

const EmptyState = ({ label }: { label: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center border border-slate-600 rounded-xl bg-slate-900">
        <Clock className="w-15 h-15 text-slate-600 mb-3 opacity-50" />
        <p className="text-slate-400 text-sm sm:text-base">{label}</p>
    </div>
);