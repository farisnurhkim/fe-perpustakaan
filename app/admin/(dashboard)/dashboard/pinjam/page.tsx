import { ReactQueryProvider } from '@/components/provider/ReactQueryProvider'
import React from 'react'
import PinjamView from './PinjamView'

const Page = () => {
  return (
    <ReactQueryProvider>
      <PinjamView/>
    </ReactQueryProvider>
  )
}

export default Page