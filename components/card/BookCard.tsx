/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit, Trash2, Plus, Minus, Package, ShoppingCart, Check } from 'lucide-react';
import Image from 'next/image'; // Pastikan domain gambar sudah di config next.config.js jika pakai URL luar
import { IBuku } from '@/types/model';
import { useModal } from '@/hooks/useModal';
import { useState } from 'react';
import bukuService from '@/services/buku.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useCart } from '@/hooks/useCart';


const BookCard = ({ book, type }: { book: IBuku; type: "admin" | "member" }) => {
  const { _id, foto, genre_buku, judul_buku, penerbit, penulis, stok, tahun_terbit, } = book;
  const { onOpen } = useModal();
  const [jumlahStok, setJumlahStok] = useState(stok);
  const router = useRouter();

  const { addToCart, items } = useCart()


  const serviceUpdateStok = async (action: "tambah" | "kurangi") => {
    if (type !== "admin") {
      throw new Error("Anda bukan admin");
    }

    if (action === "kurangi" && jumlahStok <= 0) {
      throw new Error("Stok tidak boleh kurang dari 0");
    }

    if (action === "tambah") {
      setJumlahStok(prev => prev + 1)
      return await bukuService.tambahStok((_id as string), 1)
    }

    setJumlahStok(prev => prev - 1)
    return await bukuService.kurangiStok((_id as string), 1)
  }

  const { mutate } = useMutation({
    mutationFn: serviceUpdateStok,
    onError(error: any) {
      const message = error?.response?.data?.message || error.message || "Terjadi Kesalahan";
      toast.error(message)
    },
    onSuccess(result) {
      toast.success(result.data.message);
      router.refresh();
    },
  });

  const handleUpdateStok = (action: "tambah" | "kurangi") => mutate(action);

  const [isAddToCart, setIsAddToCart] = useState(false);
  const handleAddToCart = (buku: IBuku) => {
    addToCart(buku)
    setIsAddToCart(!isAddToCart);
    toast.success(`"${judul_buku}" ditambahkan ke keranjang`)
  }

  return (
    <div className="flex flex-col bg-[#0f172a] border border-slate-700 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 group h-full">
      <div className="relative w-full aspect-3/4 overflow-hidden bg-slate-800">
        <Image
          src={foto ?? "avatar.svg"}
          alt={judul_buku}
          width={100}
          height={100}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">

        <div className="mb-3">
          <span className="bg-linear-to-tl from-emerald-300 to-emerald-600 inline-block px-2.5 py-0.5 text-base font-medium  text-white rounded-md text-shadow-sm">
            {genre_buku}
          </span>
        </div>

        <div className="mb-1">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2" title={judul_buku}>
            {judul_buku}
          </h3>
        </div>

        <p className="text-slate-400 text-sm font-medium mb-1">
          {penulis}
        </p>

        <p className="text-slate-500 text-xs mb-4">
          {penerbit} • {tahun_terbit}
        </p>

        <div className="mt-auto flex justify-between items-center mb-4 pt-3 border-t border-slate-700/50">
          <span className="text-slate-400 text-sm">Stok</span>
          <span className="text-emerald-400 font-bold font-mono">{jumlahStok}</span>
        </div>

        {type === "member" && (
          <>
            {isAddToCart && (
              <Button disabled className='bg-slate-400 text-black'>
                <Check />
                Di keranjang
              </Button>
            )}
            {!isAddToCart && (
              <Button onClick={() => {
                if (book.stok === 0) {
                  toast.success("Stock buku habis")
                  return;
                }
                const booksItem = items.find((data) => data.buku._id === book._id);
                
                if (booksItem && booksItem?.qty >= book.stok) {
                  toast.success("Stock buku habis")
                  return;
                }

                if (items.length === 3) {
                  toast.error("Maksimal peminjaman 3 buku");
                  return;
                }
                
                handleAddToCart(book)
              }} className='bg-orange-600 hover:bg-orange-600/80'>
                <ShoppingCart />
                Tambah
              </Button>
            )}
          </>
        )}

        {type === "admin" && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpen("editBuku", { buku: book })}
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 transition-colors text-xs font-medium bg-white"
            >
              <Edit className="w-3.5 h-3.5" /> Edit
            </button>

            <button onClick={() => handleUpdateStok("tambah")} className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 transition-colors text-xs font-medium bg-white">
              <Package className="w-3.5 h-3.5" /> <Plus className="w-3 h-3" />
            </button>

            <button onClick={() => handleUpdateStok("kurangi")} className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 transition-colors text-xs font-medium bg-white">
              <Package className="w-3.5 h-3.5" /> <Minus className="w-3 h-3" />
            </button>

            <button
              onClick={() => onOpen("deleteBuku", { buku: book })}
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors text-xs font-medium bg-white"
            >
              <Trash2 className="w-3.5 h-3.5" /> Del
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookCard;