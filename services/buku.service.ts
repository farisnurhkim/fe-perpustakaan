import instance from "@/lib/axios/instance";
import { IBuku } from "@/types/model";

const bukuService = {
    listBuku: async() => instance.get("/buku/list"),
    buatBuku: async(payload: IBuku) => instance.post("/buku/buat", payload)
}

export default bukuService;