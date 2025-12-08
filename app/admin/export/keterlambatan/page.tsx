import { getPeminjamanTable } from '@/lib/getPeminjamanTable';
import ExportKeterlambatan from './ExportKeterlambatan';

export const dynamic = "force-dynamic";

const Page = async () => {
    const data = await getPeminjamanTable("terlambat");

  return (
    <ExportKeterlambatan data={data}/>
  )
}

export default Page