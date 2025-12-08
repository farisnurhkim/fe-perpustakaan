import { Printer } from 'lucide-react';
import React from 'react'
import ExportBuku from './ExportBuku';
import bukuService from '@/services/buku.service';

export const dynamic = "force-dynamic";

const Page = async () => {
    const result = await bukuService.listBuku();
    const dataBuku = result?.data?.data || null;
    
     
  return (
    <ExportBuku data={dataBuku} />
  )
}

export default Page