import bukuService from "@/services/buku.service";
import peminjamanService from "@/services/peminjaman.service";
import { IBuku, IPeminjaman, StatusPeminjaman } from "@/types/model";

export interface IStatsDashboard {
  totalStockBuku: number;
  totalBukuPerJudul: number;
  totalBukuDipinjam: number;
  totalInvoice: number;
  totalAnggota: number;
  totalKonfirmasiPeminjaman: number;
  totalKonfirmasiPengembalian: number;
  totalKeterlambatan: number;
  totalDenda: number;
  isError: boolean;
  dataPeminjaman: IPeminjaman[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export const filteredDataPeminjaman = (data: IPeminjaman[], status: StatusPeminjaman) => {
    if (!data) return [];
    return data.filter((item: IPeminjaman) => item.status === status);
}


export const getStatsDashboard = async (user: any) => {
    let dataPeminjaman;
    let dataBuku;
    let isError = false;

    try {
        const resultPeminjaman = await peminjamanService.daftarSemuaPeminjaman((user as any).accessToken);
        dataPeminjaman = resultPeminjaman?.data?.data || [];

        const resultBuku = await bukuService.listBuku();
        dataBuku = resultBuku?.data?.data || [];

    } catch (error) {
        isError = true
        console.log(error)
    }

    const bukuDipinjam = dataPeminjaman.filter((item: IPeminjaman) => item.status === "dipinjam" || item.status === "pending_pengembalian") ;

    const totalBukuDipinjam = bukuDipinjam.reduce((total: any, peminjaman: any) => {
        const jumlahPerPeminjaman = peminjaman.detail_peminjaman.reduce(
            (sum: any, item: any) => sum + item.jumlah,
            0
        );
        return total + jumlahPerPeminjaman;
    }, 0)

    const totalKonfirmasiPeminjaman = filteredDataPeminjaman(dataPeminjaman, "pending_peminjaman").length;
    const totalKonfirmasiPengembalian = filteredDataPeminjaman(dataPeminjaman, "pending_pengembalian").length;
    const totalKeterlambatan = filteredDataPeminjaman(dataPeminjaman, "terlambat").length;

    const totalInvoice = bukuDipinjam.length;
    const userIds = new Set(bukuDipinjam.map((item: IPeminjaman) => item.user._id));
    const totalAnggota = userIds.size;

    const totalStockBuku = dataBuku.reduce((total: any, buku: IBuku) => {
        return total + buku.stok;
    }, 0);

    const totalBukuPerJudul = dataBuku.length;

    const pengembalianTerlambat = filteredDataPeminjaman(dataPeminjaman, "terlambat");

    const totalDenda = pengembalianTerlambat.reduce((total: any, item: IPeminjaman) => {
        return total + (item.pengembalian?.denda || 0)
    }, 0);

    return {
        totalStockBuku,
        totalBukuPerJudul,
        totalBukuDipinjam,
        totalInvoice,
        totalAnggota,
        totalKonfirmasiPeminjaman,
        totalKonfirmasiPengembalian,
        totalKeterlambatan,
        totalDenda,
        isError,
        dataPeminjaman
    }

}