/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from '@/components/Header'
import PageHeader from '@/components/Header/PageHeader';
import Navigation from '@/components/Navigation';
import bukuService from '@/services/buku.service';
import peminjamanService from '@/services/peminjaman.service';
import { IBuku, IPeminjaman } from '@/types/model';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';

export const dynamic = "force-dynamic";

const DashboardAdmin = async ({ user }: { user: any }) => {
  let dataPeminjaman;
  let dataBuku;
  let isError = false;

  try {
    const resultPeminjaman = await peminjamanService.daftarSemuaPeminjaman(user.accessToken);
    dataPeminjaman = resultPeminjaman?.data?.data || [];

    const resultBuku = await bukuService.listBuku();
    dataBuku = resultBuku?.data?.data || [];

  } catch (error) {
    isError = true
    console.log(error)
  }

  const bukuDipinjam = dataPeminjaman.filter((data: IPeminjaman) => data.status === "dipinjam");

  const totalBukuDipinjam = bukuDipinjam.reduce((total: any, peminjaman: any) => {
    const jumlahPerPeminjaman = peminjaman.detail_peminjaman.reduce(
      (sum: any, item: any) => sum + item.jumlah,
      0
    );
    return total + jumlahPerPeminjaman;
  }, 0)


  const totalKonfirmasiPeminjaman = dataPeminjaman.filter((data: IPeminjaman) => data.status === "pending_peminjaman").length;
  const totalKonfirmasiPengembalian = dataPeminjaman.filter((data: IPeminjaman) => data.status === "pending_pengembalian").length;
  const totalKeterlambatan = dataPeminjaman.filter((data: IPeminjaman) => data.status === "terlambat").length;

  const totalInvoice = bukuDipinjam.length;
  const userIds = new Set(bukuDipinjam.map((item: IPeminjaman) => item.id_user._id));
  const totalAnggota = userIds.size;

  const totalStockBuku = dataBuku.reduce((total: any, buku: IBuku) => {
    return total + buku.stok;
  }, 0);
  const totalBukuPerJudul = dataBuku.length;

  const dataCardDashboard = [
    {
      label: "Stock Buku Tersedia",
      value: totalStockBuku,
      description: `${totalBukuPerJudul} judul • ${totalStockBuku} eks tersedia`,
      icon: BookOpen,
      variant: "emerald"
    },
    {
      label: "Buku Dipinjam",
      value: totalBukuDipinjam,
      description: totalInvoice === 0 ? "Belum ada buku dipinjam" : `${totalAnggota} anggota • ${totalInvoice} invoice`,
      icon: TrendingUp,
      variant: "cyan",
      modal: () => {}
    },
    {
      label: "Konfirmasi Peminjaman",
      value: totalKonfirmasiPeminjaman,
      description: totalKonfirmasiPeminjaman === 0 ? "Tidak ada pending" : `${totalKonfirmasiPeminjaman} invoice menunggu`,
      icon: Clock,
      variant: "orange",
      modal: () => {}
    },
    {
      label: "Konfirmasi Pengembalian",
      value: totalKonfirmasiPengembalian,
      description: totalKonfirmasiPengembalian === 0 ? "Tidak ada pending" : `${totalKonfirmasiPengembalian} invoice menunggu`,
      icon: Clock,
      variant: "blue",
      modal: () => {}
    },
    {
      label: "Keterlambatan",
      value: totalKeterlambatan,
      description: "Denda: Rp 0",
      icon: Clock,
      variant: "blue",
      modal: () => {}
    },
  ];

  console.log(dataCardDashboard)
  

  return (
    <>
      <Header user={user!} />
      <div className="container bg-slate-950">
        <div className="mt-8">
          <Navigation type="admin" />
          <PageHeader title="Dashboard Statistik" description="Pantau aktivitas perpustakaan dan statistik peminjaman" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardAdmin