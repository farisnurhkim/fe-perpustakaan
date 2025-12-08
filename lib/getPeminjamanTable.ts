/* eslint-disable @typescript-eslint/no-explicit-any */
import peminjamanService from "@/services/peminjaman.service";
import { getCurrentUser } from "./currentUser";
import { IPeminjaman } from "@/types/model";

export const getPeminjamanTable = async (status: "dipinjam" | "pending_pengembalian" | "pending_peminjaman" | "terlambat") => {
  const user = await getCurrentUser();
  const resultPeminjaman = await peminjamanService.daftarSemuaPeminjaman((user as any).accessToken);
  const dataPeminjaman = resultPeminjaman?.data?.data || null;
  const dataPeminjamanByStatus = dataPeminjaman.filter((item: IPeminjaman) => item.status === status).map((item: IPeminjaman) => ({
    invoice: item.barcode,
    anggota: item.user.nama,
    idAnggota: item.user._id,
    buku: item.detail_peminjaman.map(b => `${b.buku.judul_buku} (${b.jumlah}x)`).join(", "),
    tglPinjam: new Date(item.tgl_pinjam).toLocaleDateString("id-ID"),
    tglKembali: new Date(item.batas_pinjam).toLocaleDateString("id-ID"),
    tenggatWaktu: new Date(item.batas_pinjam).toLocaleDateString("id-ID"),
    nominalDenda: item.pengembalian?.denda || null,
    status: item.status
  }));

  return dataPeminjamanByStatus;
}

