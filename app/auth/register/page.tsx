import React from 'react'
import Register from './Register'
import { ReactQueryProvider } from '@/components/ReactQueryProvider'

const Page = () => {
  return (
    <ReactQueryProvider>
      <Register />
    </ReactQueryProvider>
  )
}

export default Page