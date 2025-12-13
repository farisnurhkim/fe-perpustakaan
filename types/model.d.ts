/* eslint-disable @typescript-eslint/no-explicit-any */
interface Alamat {
    no_rumah: string;
    nama_jalan: string;
    kelurahan: string;
    kecamatan: string;
    kota: string;
}

export interface IUser {
    _id: string;
    nama: string;
    email: string;
    password: string;
    tgl_lahir: Date;
    alamat: Alamat;
    no_telp: string;
    status_user: "admin" | "member";
    di_blokir: boolean;
}

export type StatusPeminjaman = 'dipinjam' | 'dikembalikan' | 'terlambat' | 'pending_pengembalian' | 'pending_peminjaman'

export interface IPeminjaman{
    _id:string;
    barcode: string;
    user: IUser;
    tgl_pinjam: Date;
    batas_pinjam: Date;
    batas_ambil: Date;
    status: StatusPeminjaman;
    detail_peminjaman: Array<{
        buku: IBuku;
        jumlah: number;
    }>;
    pengembalian: IPengembalian | null
}

export interface IPengembalian {
    _id: string;
    id_peminjaman: IPeminjaman;
    tgl_kembali: Date;
    denda: number;
    keterangan: string;
}

export interface IBuku {
    _id?: string;
    judul_buku: string;
    genre_buku: string;
    tahun_terbit: number;
    penulis: string;
    penerbit: string;
    stok: number;
    foto: any;
}