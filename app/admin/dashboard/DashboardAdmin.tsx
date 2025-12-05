"use client"
import Header from '@/components/Header'
import { useSession } from 'next-auth/react'

const DashboardAdmin = () => {
    const {data: session} = useSession();
    console.log(session)
  return (
    <>
    <Header session={session!}/>
    </>
  )
}

export default DashboardAdmin