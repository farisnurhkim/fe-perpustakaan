/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPeminjamanTable } from "@/lib/getPeminjamanTable";
import ExportDiPinjam from "./ExportDiPinjam";

export const dynamic = "force-dynamic";

const Page = async () => {
  const dataPeminjamanPending = await getPeminjamanTable("dipinjam")

  return (
    <ExportDiPinjam  data={dataPeminjamanPending}/>
  )
}

export default Page