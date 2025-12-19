import { ReactQueryProvider } from '@/components/provider/ReactQueryProvider'
import KembaliView from './KembaliView'

const Page = () => {
  return (
    <ReactQueryProvider>
      <KembaliView/>
    </ReactQueryProvider>
  )
}

export default Page