import { ReactQueryProvider } from '@/components/provider/ReactQueryProvider'
import Login from './Login'

const Page = () => {
  return (
    <ReactQueryProvider>
        <Login/>
    </ReactQueryProvider>
  )
}

export default Page