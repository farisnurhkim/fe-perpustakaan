import instance from "@/lib/axios/instance";

const peminjamanService = {
    daftarSemuaPeminjaman: (token: string) => instance.get("/peminjaman/list", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export default peminjamanService;