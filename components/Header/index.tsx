/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { LogOut, Shield, User, UserIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

const Header = ({ user }: { user: any }) => {
    return (
        <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-10 shadow-sm">
            <div className="container px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo_ubhara.png"
                            alt="SmartLib Ubhara"
                            width={50}
                            height={50}
                        />
                        <div>
                            <h1 className="text-xl text-emerald-400">SmartLib Ubhara</h1>
                            <p className="text-sm text-orange-400">Sistem Peminjaman Buku</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button id="trigger-desktop" variant="ghost" className="hidden sm:flex gap-3 h-auto p-3 hover:bg-slate-800">
                                    <Avatar className='w-11 h-11'>
                                        <AvatarImage src={"/user.jpg"} />
                                        <AvatarFallback>{"Nama"}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-left flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-gray-100">{user?.nama}</p>
                                        </div>
                                        {user?.status_user === 'admin' && (
                                            <div className='flex w-fit px-2.5 py-1 items-center gap-1 rounded-md justify-center bg-orange-600 text-white hover:bg-orange-700'>
                                                <Shield className="w-3 h-3 mr-1" />
                                                <span className='text-xs'>
                                                    Admin
                                                </span>
                                            </div>
                                        )}
                                        {user?.status_user === 'member' && (
                                            <div className='flex w-fit px-3 py-1 items-center gap-1 rounded-md justify-center bg-orange-600 text-white hover:bg-orange-700'>
                                                <User className="w-3 h-3 mr-1" />
                                                <span className='text-xs'>
                                                    User
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-700">
                                <DropdownMenuLabel className="text-gray-300">Akun Saya</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-700" />
                                <DropdownMenuItem
                                    onClick={() => { }}
                                    className="text-gray-300 hover:bg-slate-800 focus:bg-slate-800 focus:text-gray-100 cursor-pointer"
                                >
                                    <UserIcon className="w-4 h-4 mr-2" />
                                    Edit Profil
                                </DropdownMenuItem>
                                {user?.status_user === 'admin' && (
                                    <>
                                        <DropdownMenuSeparator className="bg-slate-700" />
                                    </>
                                )}
                                <DropdownMenuSeparator className="bg-slate-700" />
                                <DropdownMenuItem
                                    onClick={() => signOut()}
                                    className="text-orange-400 hover:bg-orange-950/30 focus:bg-orange-950/30 focus:text-orange-300 cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Keluar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>


                        {/* Mobile User Icon */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button id="trigger-mobile" variant="ghost" size="icon" className="sm:hidden hover:bg-emerald-950/50">
                                    <UserIcon className="w-5 h-5 text-gray-300" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-700">
                                <DropdownMenuLabel className="text-gray-300">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span>{user?.nama}</span>
                                    </div>
                                    {user?.status_user === 'admin' && (
                                        <div className='flex w-fit px-2.5 py-1 items-center gap-1 rounded-md justify-center bg-orange-600 text-white hover:bg-orange-700'>
                                            <Shield className="w-3 h-3 mr-1" />
                                            <span className='text-xs'>
                                                Admin
                                            </span>
                                        </div>
                                    )}
                                    {user?.status_user === 'member' && (
                                        <div className='flex w-fit px-3 py-1 items-center gap-1 rounded-md justify-center bg-orange-600 text-white hover:bg-orange-700'>
                                            <User className="w-3 h-3 mr-1" />
                                            <span className='text-xs'>
                                                User
                                            </span>
                                        </div>
                                    )}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-700" />
                                <DropdownMenuItem
                                    onClick={() => { }}
                                    className="text-gray-300 hover:bg-slate-800 focus:bg-slate-800 focus:text-gray-100 cursor-pointer"
                                >
                                    <UserIcon className="w-4 h-4 mr-2" />
                                    Edit Profil
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-slate-700" />
                                <DropdownMenuItem
                                    onClick={() => signOut()}
                                    className="text-orange-400 hover:bg-orange-950/30 focus:bg-orange-950/30 focus:text-orange-300 cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Keluar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header