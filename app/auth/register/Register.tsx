"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Eye, EyeOff, Loader, UserPlus } from 'lucide-react'
import useRegister from './useRegister'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Register = () => {
    const { handleVisiblePassword, visiblePassword, form, onSubmit, isPending } = useRegister();
    const router = useRouter();
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-900 border-slate-700">
                <CardHeader className="space-y-4">
                    <div className="flex justify-center">
                        <Image
                            src="/logo_ubhara.png"
                            alt="SmartLib Ubhara"
                            width={80}
                            height={80}
                        />
                    </div>
                    <div className="text-center space-y-2">
                        <CardTitle className="text-gray-100">Daftar Anggota Baru</CardTitle>
                        <CardDescription className="text-gray-400">
                            Bergabung dengan SmartLib Ubhara untuk meminjam buku
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name='nama'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-300'>Nama Lengkap</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Masukkan nama lengkap"
                                                    required
                                                    className="bg-slate-800 border-slate-600 text-gray-100 placeholder:text-gray-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-300'>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Masukkan Email"
                                                    required
                                                    className="bg-slate-800 border-slate-600 text-gray-100 placeholder:text-gray-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-2 ">
                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-300'>Password</FormLabel>
                                            <FormControl>
                                                <div className='relative'>
                                                    <Input
                                                        type={visiblePassword["password"] ? 'text' : 'password'}
                                                        placeholder="Minimal 6 karakter"
                                                        required
                                                        className=" bg-slate-800 border-slate-600 text-gray-100 placeholder:text-gray-500"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleVisiblePassword("password")}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                                    >
                                                        {!visiblePassword["password"] ? (
                                                            <EyeOff className="w-4 h-4" />
                                                        ) : (
                                                            <Eye className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name='confirmPassword'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-300'>Konfirmasi Password</FormLabel>
                                            <FormControl>
                                                <div className='relative'>
                                                    <Input
                                                        type={visiblePassword["confirmPassword"] ? 'text' : 'password'}
                                                        required
                                                        className=" bg-slate-800 border-slate-600 text-gray-100 placeholder:text-gray-500"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleVisiblePassword("confirmPassword")}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                                    >
                                                        {!visiblePassword["confirmPassword"] ? (
                                                            <EyeOff className="w-4 h-4" />
                                                        ) : (
                                                            <Eye className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>


                            <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-lg p-4">
                                <p className="text-sm text-emerald-300">
                                    <strong className="text-emerald-400">Catatan:</strong> Setelah mendaftar, Anda akan mendapatkan ID keanggotaan yang dapat digunakan untuk login dan meminjam buku.
                                </p>
                            </div>

                            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                                {isPending && (
                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                )}

                                {!isPending && (
                                    <>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Daftar Sekarang
                                    </>
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full text-gray-300 hover:text-gray-100 hover:bg-slate-800"
                                onClick={() => router.push("/auth/login")}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali ke Login
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 pt-6 border-t border-slate-700 text-center">
                        <p className="text-sm text-gray-400">
                            Untuk akun admin, silakan hubungi pengelola perpustakaan
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Register