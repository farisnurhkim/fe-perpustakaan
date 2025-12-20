/* eslint-disable @typescript-eslint/no-explicit-any */
  import instance from "@/lib/axios/instance";
  import { IBuku } from "@/types/model";

  interface ListBukuParams {
    search?: string | undefined;
    category?: string | undefined;
  }

  const bukuService = {
      listBuku: async(params?: ListBukuParams) => instance.get("/buku/list", {params}),
      buatBuku: async(payload: IBuku) => instance.post("/buku/buat", payload),
      deleteBuku: async(id: string) => instance.delete(`/buku/hapus/${id}`),
      tambahStok: async(id: string, jumlah: number) => instance.patch(`/buku/tambah-stok/${id}`, { jumlah }),
      kurangiStok: async(id: string, jumlah: number) => instance.patch(`/buku/kurangi-stok/${id}`, { jumlah }),
      ubahBuku: async(payload: any, id: string) => instance.patch(`/buku/ubah/${id}`, payload),
      lihatBuku: async(id: string) => instance.get(`/buku/${id}`),
      bukuPopuler: async() => instance.get("/buku/populer"),
  }

  export default bukuService;