/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import CardStatsBox from '@/components/admin/Dashboard/CardStatsBox';
import Header from '@/components/Header'
import PageHeader from '@/components/Header/PageHeader';
import Navigation from '@/components/Navigation';
import { IStatsDashboard } from '@/lib/getStatsDashboard';
import { ICardDashboard } from '@/types/admin';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';



const DashboardAdmin = ({ stats, user }: { stats: IStatsDashboard, user: any }) => {
 
  const {isError, totalAnggota, totalBukuDipinjam, totalBukuPerJudul, totalDenda, totalInvoice, totalKeterlambatan, totalKonfirmasiPeminjaman, totalKonfirmasiPengembalian, totalStockBuku } = stats;

  const dataCardDashboard: ICardDashboard[] = [
        {
            label: "Stock Buku Tersedia",
            value: totalStockBuku,
            description: `${totalBukuPerJudul} judul • ${totalStockBuku} eks tersedia`,
            icon: BookOpen,
            variant: "emerald",
            linkDownload: "/admin/export/buku"
        },
        {
            label: "Buku Dipinjam",
            value: totalBukuDipinjam,
            description: totalInvoice === 0 ? "Belum ada buku dipinjam" : `${totalAnggota} anggota • ${totalInvoice} invoice`,
            icon: TrendingUp,
            variant: "cyan",
            modal: () => { },
            linkDownload: "/admin/export/dipinjam"
        },
        {
            label: "Konfirmasi Peminjaman",
            value: totalKonfirmasiPeminjaman,
            description: totalKonfirmasiPeminjaman === 0 ? "Tidak ada pending" : `${totalKonfirmasiPeminjaman} invoice menunggu`,
            icon: Clock,
            variant: "orange",
            modal: () => { },
            linkDownload: "/admin/export/peminjaman/pending"
        },
        {
            label: "Konfirmasi Pengembalian",
            value: totalKonfirmasiPengembalian,
            description: totalKonfirmasiPengembalian === 0 ? "Tidak ada pending" : `${totalKonfirmasiPengembalian} invoice menunggu`,
            icon: Clock,
            variant: "blue",
            modal: () => { },
            linkDownload: "/admin/export/pengembalian/pending"
        },
        {
            label: "Keterlambatan",
            value: totalKeterlambatan,
            description: `Denda: Rp ${totalDenda}`,
            icon: Clock,
            variant: "rose",
            modal: () => {},
            linkDownload: "/admin/export/keterlambatan"
        },
    ];

  return (
    <>
      <Header user={user!} />
      <div className="container bg-slate-950">
        <div className="mt-8">
          <Navigation type="admin" />
          <PageHeader title="Dashboard Statistik" description="Pantau aktivitas perpustakaan dan statistik peminjaman" />
          {isError ? (
            <h2 className='text-center text-white text-2xl'>Internal Server Error!</h2>
          ): (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
              {dataCardDashboard.map((item, index) => (
                <CardStatsBox description={item.description} icon={item.icon} label={item.label} value={item.value} variant={item.variant} modal={item.modal} linkDownload={item.linkDownload} key={index} />
              ))}
          </div>
          )}
        </div>
      </div>
    </>
  )
}

export default DashboardAdmin