import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ICardDashboard } from '@/types/admin'
import { Download } from 'lucide-react'
import Link from 'next/link'

const CardStatsBox = ({ label, value, description, icon: Icon, variant = "emerald", modal, linkDownload }: ICardDashboard) => {
    const styles = {
    emerald: {
        text: "text-emerald-500",
        bgIcon: "bg-emerald-500/15",
        borderHover: "hover:border-emerald-500",
        iconColor: "text-emerald-400"
    },
    cyan: {
        text: "text-cyan-500",
        bgIcon: "bg-cyan-500/15",
        borderHover: "hover:border-cyan-500",
        iconColor: "text-cyan-400"
    },
    orange: {
        text: "text-orange-500",
        bgIcon: "bg-orange-500/15",
        borderHover: "hover:border-orange-500",
        iconColor: "text-orange-400"
    },
    blue: {
        text: "text-blue-500",
        bgIcon: "bg-blue-500/15",
        borderHover: "hover:border-blue-500",
        iconColor: "text-blue-400"
    },
    rose: {
        text: "text-rose-500",
        bgIcon: "bg-rose-500/15",
        borderHover: "hover:border-rose-500",
        iconColor: "text-rose-400"
    }
  };

  const currentStyle = styles[variant];

    return (
        <Card className={cn(
            'bg-slate-900 border-2 border-slate-600 py-5 hover:border-emerald-700 transition-colors duration-300',
        )}
        
        >
            <CardContent>
                <div className='flex flex-col justify-between w-full'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-white text-sm'>{label}</h2>
                        <div className='flex items-center gap-3'>
                            <Link href={linkDownload || "#"} target='_blank' className='group w-fit'>
                                <Download size={16} className='text-emerald-400 group-hover:text-emerald-300 transition-all' />
                            </Link>
                            <span className={cn('w-fit p-2 rounded-lg', currentStyle.bgIcon)}>
                                <Icon className={cn(currentStyle.iconColor)} size={15} />
                            </span>
                        </div>
                    </div>
                    <div className='mt-8 pb-2'>
                        <h2 className={cn("text-3xl", currentStyle.text)}>{value}</h2>
                        <span className='text-slate-400 text-xs'>{description}</span>
                        {modal && (
                            <p className='text-xs text-slate-400 hover:text-emerald-500 mt-1 transition-all duration-100 hover:cursor-pointer' onClick={modal}>Lihat detail &gt;</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CardStatsBox