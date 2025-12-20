import ExportBuku from './ExportBukuPopuler';
import bukuService from '@/services/buku.service';

export const dynamic = "force-dynamic";

const Page = async () => {
    const result = await bukuService.bukuPopuler();
    const dataBuku = result?.data?.data || null;
     
  return (
    <ExportBuku data={dataBuku} />
  )
}

export default Page