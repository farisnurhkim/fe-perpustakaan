/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPeminjamanTable } from "@/lib/getPeminjamanTable";
import ExportPengembalianPending from "./ExportPengembalianPending";

export const dynamic = "force-dynamic";

const Page = async () => {
  const dataPeminjamanPending = await getPeminjamanTable("pending_pengembalian")

  return (
    <ExportPengembalianPending  data={dataPeminjamanPending}/>
  )
}

export default Page