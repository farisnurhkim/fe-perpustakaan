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


const peminjamanService = {
    daftarSemuaPeminjaman: (token?: string) => instance.get("/peminjaman/list", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }),
    buatPeminjaman: (payload: PeminjamanPayload) => instance.post("/peminjaman/buat", payload),
    daftarPeminjamanUser: (userId: string) => instance.get(`/peminjaman/user/${userId}`),
    cariPeminjaman: (barcode: string) => instance.get(`/peminjaman/cari/${barcode}`),
    konfirmasiPeminjaman: (barcode: string) => instance.patch(`/peminjaman/konfirmasi/${barcode}`),
    hitungDenda: (barcode: string) => instance.get(`/peminjaman/hitung-denda/${barcode}`),
}

export default peminjamanService;