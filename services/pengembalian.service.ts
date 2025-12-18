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


const pengembalianService = {
    prosesPengembalian: (barcode: string) => instance.patch(`/pengembalian/proses/${barcode}`),
}

export default pengembalianService;