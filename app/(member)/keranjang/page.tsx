/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartSummary } from "./CartSummary"
import { useEffect, useState } from "react"
import { useCart } from "@/hooks/useCart"
import { ItemsCartCard } from "@/components/card/ItemsCartCard"
import PageHeader from "@/components/Header/PageHeader"

const KeranjangPage = () => {
    const [isMounted, setIsMounted] = useState(false)
    const cart = useCart()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    const totalTitles = cart.items.length
    const totalBooks = cart.items.reduce((acc, item) => acc + item.qty, 0)

    return (
        <div className="bg-slate-950 text-white">
            <div className="mb-6">
                <PageHeader title="Keranjang Peminjaman" description="Kelola buku yang akan dipinjam" />
            </div>
            {cart.items.length === 0 && (
                <div className="w-full h-screen flex flex-col gap-3 items-center justify-center">
                    <div className="w-fit p-8 rounded-full bg-slate-700">
                        <ShoppingCart size={60} className="text-slate-400"/>
                    </div>
                    <div className="text-center">
                        <h2>Keranjang Kosong</h2>
                        <p className="text-slate-400">Belum ada buku yang ditambahkan ke keranjang</p>
                    </div>
                </div>
            )}
            {cart.items.length > 0 && (

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* --- KOLOM KIRI (List Items) --- */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header List */}
                        <div className="flex justify-between items-center pb-2">
                            <div className="text-sm text-white font-medium">
                                Keranjang Peminjaman <br />
                                <span className="text-slate-400">{totalTitles} judul • {totalBooks} buku</span>
                            </div>

                            {cart.items.length > 0 && (
                                <Button
                                    variant="ghost"
                                    onClick={cart.clear}
                                    className="text-slate-400 hover:text-red-400 hover:bg-slate-900"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Kosongkan
                                </Button>
                            )}
                        </div>

                        {/* Cart Items Loop */}
                        <div className="space-y-4">
                            {cart.items.length === 0 ? (
                                <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                                    <p className="text-slate-500">Keranjang Anda kosong</p>
                                </div>
                            ) : (
                                cart.items.map((item, index) => (
                                    <ItemsCartCard
                                        key={item.buku._id}
                                        item={item}
                                        onIncrease={cart.increment}
                                        onDecrease={cart.decrement}
                                        onRemove={cart.removeFromCart}
                                        cartItem={cart.items[index]}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* --- KOLOM KANAN (Summary) --- */}
                    <div className="lg:col-span-1">
                        <CartSummary totalBooks={totalBooks} totalTitles={totalTitles} />
                    </div>

                </div>
            )}
        </div>
    )
}

export default KeranjangPage