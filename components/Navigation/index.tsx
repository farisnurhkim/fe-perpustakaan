"use client"
import { navigationLinkAdmin, navigationLinkMember } from '@/config/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navigation = ({ type }: { type: "admin" | "member" }) => {
    const pathname = usePathname();
    const data = type === "admin" ? navigationLinkAdmin : navigationLinkMember;
    return (
        <div className='w-fit bg-background rounded-2xl max-w-full'>
            <div className='flex items-center gap-2 py-2 px-4 max-w-full overflow-x-auto'>
                {data.map((item, index) => (
                    <Link href={item.url} key={index} className={cn(
                        'py-1.5 px-4 w-32 md:w-44 gap-2 flex items-center justify-center rounded-3xl text-slate-950 transition-all',
                        item.url == pathname && 'bg-emerald-600 text-white shadow-md',
                        item.url !== pathname && "hover:bg-emerald-500/5"
                    )}>
                        <item.icon className='' size={15}/>
                        <span className='text-sm'>
                            {item.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Navigation