/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import BukuPopuler from '@/components/admin/Dashboard/BukuPopuler';
import CardStatsBox from '@/components/admin/Dashboard/CardStatsBox';
import StatusPeminjaman, { StatusItem } from '@/components/admin/Dashboard/StatusPeminjaman';
import PageHeader from '@/components/Header/PageHeader';
import { useModal } from '@/hooks/useModal';
import { filteredDataPeminjaman, IStatsDashboard } from '@/lib/getStatsDashboard';
import { ICardDashboard } from '@/types/admin';
import { IPeminjaman } from '@/types/model';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';



const DashboardAdmin = ({ stats }: { stats: IStatsDashboard }) => {
  const { onOpen } = useModal()
  const { isError, totalAnggota, totalBukuDipinjam, totalBukuPerJudul, totalDenda, totalInvoice, totalKeterlambatan, totalKonfirmasiPeminjaman, totalKonfirmasiPengembalian, totalStockBuku, dataPeminjaman } = stats;


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
      modal: () => onOpen("bukuDipinjam", { peminjaman: { data: dataPeminjaman.filter((item: IPeminjaman) => item.status === "dipinjam" || item.status === "pending_pengembalian"), totalInvoice, totalAnggota, totalBukuDipinjam } }),
      linkDownload: "/admin/export/dipinjam"
    },
    {
      label: "Konfirmasi Peminjaman",
      value: totalKonfirmasiPeminjaman,
      description: totalKonfirmasiPeminjaman === 0 ? "Tidak ada pending" : `${totalKonfirmasiPeminjaman} invoice menunggu`,
      icon: Clock,
      variant: "orange",
      modal: () => onOpen("peminjamanPending", { peminjaman: dataPeminjaman.filter((item: IPeminjaman) => item.status === "pending_peminjaman") }),
      linkDownload: "/admin/export/peminjaman/pending"
    },
    {
      label: "Konfirmasi Pengembalian",
      value: totalKonfirmasiPengembalian,
      description: totalKonfirmasiPengembalian === 0 ? "Tidak ada pending" : `${totalKonfirmasiPengembalian} invoice menunggu`,
      icon: Clock,
      variant: "blue",
      modal: () => onOpen("pengembalianPending", { peminjaman: dataPeminjaman.filter((item: IPeminjaman) => item.status === "pending_pengembalian") }),
      linkDownload: "/admin/export/pengembalian/pending"
    },
    {
      label: "Keterlambatan",
      value: totalKeterlambatan,
      description: `Denda: Rp ${totalDenda}`,
      icon: Clock,
      variant: "rose",
      modal: () => onOpen("keterlambatan", { peminjaman: dataPeminjaman.filter((item: IPeminjaman) => item.status === "terlambat") }),
      linkDownload: "/admin/export/keterlambatan"
    },
  ];

  const totalBukuKonfirmasiPeminjaman = filteredDataPeminjaman(dataPeminjaman, "pending_peminjaman").reduce((total: number, item) => {
    const jumlahPerPeminjaman = item.detail_peminjaman.reduce((total, item) => {
      return total + item.jumlah
    },0);
    return total + jumlahPerPeminjaman;
  }, 0);

  const totalBukuPeminjamanActive = filteredDataPeminjaman(dataPeminjaman, "dipinjam").reduce((total, item) => {
    const jumlahPerPeminjaman = item.detail_peminjaman.reduce((total, item) => {
        return total + item.jumlah;
    }, 0);

    return total + jumlahPerPeminjaman;
  }, 0);

  const totalBukuPendingPengembalian = filteredDataPeminjaman(dataPeminjaman, "pending_pengembalian").reduce((total, item) => {
    const jumlahPerPeminjaman = item.detail_peminjaman.reduce((total, item) => {
        return total + item.jumlah;
    }, 0);

    return total + jumlahPerPeminjaman;
  }, 0);

  const statusData: StatusItem[] = [
    { title: "Menunggu Konfirmasi", subtitle: `${totalBukuKonfirmasiPeminjaman} Buku`, count: totalKonfirmasiPeminjaman, variant: "warning", modal: () => onOpen("peminjamanPending", { peminjaman: dataPeminjaman.filter((item: IPeminjaman) => item.status === "pending_peminjaman") }) },
    { title: "Peminjaman Aktif", subtitle: `${totalBukuPeminjamanActive} Buku`, count: totalBukuDipinjam, variant: "info", modal: () => onOpen("bukuDipinjam", { peminjaman: { data: dataPeminjaman.filter((item: IPeminjaman) => item.status === "dipinjam" || item.status === "pending_pengembalian"), totalInvoice, totalAnggota, totalBukuDipinjam } }), },
    { title: "Menunggu Pengembalian", subtitle: `${totalBukuPendingPengembalian} Buku`, count: totalKonfirmasiPengembalian, variant: "purple",  modal: () => onOpen("pengembalianPending", { peminjaman: dataPeminjaman.filter((item: IPeminjaman) => item.status === "pending_pengembalian") }), },
    { title: "Terlambat", subtitle: `Denda: Rp ${totalDenda.toLocaleString("id-ID")}`, count: totalKeterlambatan, variant: "danger",  modal: () => onOpen("keterlambatan", { peminjaman: dataPeminjaman.filter((item: IPeminjaman) => item.status === "terlambat") }) },
  ];

  return (
    <>
      <PageHeader title="Dashboard Statistik" description="Pantau aktivitas perpustakaan dan statistik peminjaman" />
      {isError ? (
        <h2 className='text-center text-white text-2xl'>Internal Server Error!</h2>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {dataCardDashboard.map((item, index) => (
              <CardStatsBox description={item.description} icon={item.icon} label={item.label} value={item.value} variant={item.variant} modal={item.modal} linkDownload={item.linkDownload} key={index} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <StatusPeminjaman statusData={statusData}/>
            <BukuPopuler data={dataPeminjaman} />
          </div>
        </>
      )}
    </>
  )
}

export default DashboardAdmin