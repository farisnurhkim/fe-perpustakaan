/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartItems } from "@/hooks/useCart"
import { toast } from "sonner"

interface CartItemProps {
  item: CartItems;
  items: CartItems[];
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
  onRemove: (id: string) => void;
  cartItem: CartItems;
}

export const ItemsCartCard = ({ item, items, onDecrease, onIncrease, onRemove, cartItem }: CartItemProps) => {
  const { foto, genre_buku, judul_buku, penulis, stok, _id } = item.buku;
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 border border-slate-700 hover:border-emerald-600 transition-all duration-200 p-4 rounded-xl items-start sm:items-center">
      {/* Image Wrapper */}
      <div className="relative w-20 h-28 sm:w-24 sm:h-32 bg-slate-800 rounded-md overflow-hidden shrink-0">
        <Image
          src={foto}
          alt={judul_buku}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 w-full">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg text-white line-clamp-1">{judul_buku}</h3>
            <p className="text-slate-400 text-sm mb-2">{penulis}</p>
            <div className="flex items-center gap-3 text-xs mb-4">
              <div className="px-2 py-1 rounded-md bg-transparent border text-slate-300 hover:bg-slate-700 border-slate-700">
                {genre_buku}
              </div>
              <span className="text-slate-500">Stok: {stok}</span>
            </div>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex justify-between items-center mt-2">
          {/* Quantity Control */}
          <div className="flex items-center gap-3 bg-slate-950/50 p-1 rounded-lg border border-slate-800">
            <Button
              variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => onDecrease(_id as string)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium w-4 text-center text-white">{item.qty}</span>
            <Button
              variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => {
                if (stok <= cartItem.qty) return;
                const totalStokItem = items.reduce((total, item) => total + item.qty, 0);
                if (totalStokItem >= 3) {
                  toast.error("Maksimal peminjaman 3 buku");
                  return;
                }

                onIncrease(_id as string)
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-8 px-2 gap-2 text-xs"
            onClick={() => {
              onRemove(_id as string)
              toast.success(`"${judul_buku}" dihapus dari keranjang`)
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Hapus</span>
          </Button>
        </div>
      </div>
    </div>
  )
}