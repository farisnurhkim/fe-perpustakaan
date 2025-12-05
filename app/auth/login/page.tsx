import { ReactQueryProvider } from '@/components/ReactQueryProvider'
import React from 'react'
import Login from './Login'

const Page = () => {
  return (
    <ReactQueryProvider>
        <Login/>
    </ReactQueryProvider>
  )
}

export default Page