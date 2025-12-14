import { ReactQueryProvider } from "@/components/provider/ReactQueryProvider"
import KatalogAdmin from "./KatalogAdmin"

const Page = () => {
  return (
    <ReactQueryProvider>
      <KatalogAdmin />
    </ReactQueryProvider>
  )
}

export default Page