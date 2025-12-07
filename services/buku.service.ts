import instance from "@/lib/axios/instance";

const bukuService = {
    listBuku: async() => instance.get("/buku/list")
}

export default bukuService;