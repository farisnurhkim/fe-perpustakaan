import instance from "@/lib/axios/instance";

export interface DetailPeminjaman {
  id_buku: string
  jumlah: number
}

export interface PeminjamanPayload {
  id_user: string
  tanggal_pinjam: string // format: yyyy-MM-dd
  batas_pinjam: string   // format: yyyy-MM-dd
  detail_peminjaman: DetailPeminjaman[]
}

export interface PayloadPengembalian {
  tgl_kembali: string;   // format: YYYY-MM-DD
  keterangan: string;
  denda: number;
}


const pengembalianService = {
    prosesPengembalian: (barcode: string) => instance.patch(`/pengembalian/proses/${barcode}`),
    konfirmasiPengembalian: (barcode: string, payload: PayloadPengembalian) => instance.post(`/pengembalian/konfirmasi/${barcode}`, payload),
}

export default pengembalianService;