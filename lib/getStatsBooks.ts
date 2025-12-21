import bukuService from "@/services/buku.service";
import { IBuku } from "@/types/model";

export type StatsBuku = {
    totalBuku: number;
    totalStock: number;
    stockHabis: number;
    isError: boolean;
}

const getStatsBooks = async (): Promise<StatsBuku> => { 
    let dataBuku: IBuku[] = []; 
    let isError = false;

    try {
        const resultAllBook = await bukuService.listBuku();
        dataBuku = resultAllBook?.data?.data || [];

    } catch (error) {
        isError = true;
        console.error("Gagal mengambil data buku:", error); 
    }

    const totalBuku = dataBuku.length;
    
    const totalStock = dataBuku.reduce((total: number, item: IBuku) => {
        return total + (item.stok || 0);
    }, 0);

    const stockHabis = dataBuku.filter((item: IBuku) => item.stok === 0).length;

    return {
        totalBuku,
        totalStock,
        stockHabis,
        isError
    }
}

export default getStatsBooks;