"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader, LogIn } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import useLogin from './useLogin'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const Login = () => {
    const router = useRouter();
    const { form, isPending, onSubmit, setVisiblePassword, visiblePassword } = useLogin();
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" style={{ backgroundColor: '#020617', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="w-full max-w-md" style={{ width: '100%', maxWidth: '28rem' }}>
                <div className="text-center mb-8" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="inline-flex items-center justify-center mb-4" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Image
                            src="/logo_ubhara.png"
                            alt="SmartLib Ubhara"
                            width={80}
                            height={80}
                        />
                    </div>
                    <h1 className="mb-2 text-emerald-400" style={{ fontSize: '2.25rem', fontWeight: '800', color: '#34d399', marginBottom: '0.5rem', lineHeight: '1.2' }}>SmartLib Ubhara</h1>
                    <p className="text-orange-400" style={{ fontSize: '1rem', color: '#fb923c', lineHeight: '1.5' }}>Perpustakaan Universitas Bhayangkara Jakarta Raya</p>
                </div>

                <Card className="shadow-lg bg-slate-900 border-slate-700" style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -4px rgba(0, 0, 0, 0.7)' }}>
                    <CardHeader className="text-center">
                        <CardTitle className="text-gray-100">Masuk ke Akun Anda</CardTitle>
                        <CardDescription className="text-gray-400">
                            Masukkan kredensial untuk mengakses sistem perpustakaan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-gray-300'>Nama Lengkap</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='email'
                                                        placeholder="Masukkan email / username"
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
                                        name='password'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-gray-300'>Password</FormLabel>
                                                <FormControl>
                                                    <div className='relative'>
                                                        <Input
                                                            type={visiblePassword ? 'text' : 'password'}
                                                            placeholder="******"
                                                            required
                                                            className=" bg-slate-800 border-slate-600 text-gray-100 placeholder:text-gray-500"
                                                            {...field}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setVisiblePassword(!visiblePassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                                        >
                                                            {!visiblePassword ? (
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

                                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white" style={{ width: '100%', backgroundColor: '#f97316', color: 'white', padding: '0.625rem 1rem', fontSize: '1rem', fontWeight: '600', borderRadius: '0.5rem' }}>
                                    {isPending && (
                                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                                    )}

                                    {!isPending && (
                                        <>
                                        <LogIn className="w-4 h-4 mr-2" />
                                        Masuk
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center space-y-2">
                    <p className="text-sm text-gray-400">
                        Belum punya akun?{' '}
                        <button onClick={() => router.push("/auth/register")} className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium">
                            Daftar sebagai anggota
                        </button>
                    </p>
                    <p className="text-xs text-gray-500">
                        Untuk akun admin, silakan hubungi pengelola perpustakaan
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login