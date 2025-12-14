import instance from "@/lib/axios/instance";
import { IBuku } from "@/types/model";

interface ListBukuParams {
  search?: string | undefined;
  category?: string | undefined;
}

const bukuService = {
    listBuku: async(params?: ListBukuParams) => instance.get("/buku/list", {params}),
    buatBuku: async(payload: IBuku) => instance.post("/buku/buat", payload)
}

export default bukuService;