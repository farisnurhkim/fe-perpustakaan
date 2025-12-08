/* eslint-disable @typescript-eslint/no-explicit-any */
import ExportPeminjamanPending from "./ExportPeminjamanPending";
import { getPeminjamanTable } from "@/lib/getPeminjamanTable";

export const dynamic = "force-dynamic";

const Page = async () => {
  const dataPeminjamanPending = await getPeminjamanTable("pending_peminjaman")

  return (
    <ExportPeminjamanPending  data={dataPeminjamanPending}/>
  )
}

export default Page