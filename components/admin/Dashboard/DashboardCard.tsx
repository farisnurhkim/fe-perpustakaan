import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DashboardCardProps } from '@/types/admin'
import { BookOpen, Download } from 'lucide-react'
import React from 'react'

const DashboardCard = ({ label, value, description, icon: Icon }: DashboardCardProps) => {
    return (
        <Card className='bg-slate-900 border-2 border-slate-600 py-5 hover:border-emerald-700 transition-colors duration-300'>
            <CardContent>
                <div className='flex flex-col justify-between w-full'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-white text-sm'>{label}</h2>
                        <div className='flex items-center gap-1'>
                            <Button className='group'>
                                <Download className='text-emerald-400 group-hover:text-emerald-300 transition-all' />
                            </Button>
                            <span className='w-fit p-2 bg-emerald-500/15 rounded-lg'>
                                <Icon className='text-emerald-400' size={15} />
                            </span>
                        </div>
                    </div>
                    <div className='mt-8 pb-2'>
                        <h2 className='text-emerald-500 text-3xl'>{value}</h2>
                        <span className='text-slate-400 text-xs'>{description}</span>
                        {label !== "Stok Buku Tersedia" && (
                            <p className='text-xs text-slate-400'>Lihat detail</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default DashboardCard