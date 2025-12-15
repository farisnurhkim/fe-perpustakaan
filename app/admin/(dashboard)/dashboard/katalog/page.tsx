import { ReactQueryProvider } from "@/components/provider/ReactQueryProvider"
import KatalogAdmin from "./KatalogAdmin"
import getStatsBooks from "@/lib/getStatsBooks";

export const dynamic = "force-dynamic";

const Page = async() => {
  const statsBuku = await getStatsBooks();
  return (
    <ReactQueryProvider>
      <KatalogAdmin stats={statsBuku} />
    </ReactQueryProvider>
  )
}

export default Page