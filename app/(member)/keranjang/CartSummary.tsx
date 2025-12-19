/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { CalendarIcon, ShoppingCart, Info, Lightbulb, Loader } from "lucide-react"
import { format, addDays, differenceInCalendarDays, startOfDay } from "date-fns"
import { id } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCart } from "@/hooks/useCart"
import peminjamanService, { PeminjamanPayload } from "@/services/peminjaman.service"
import { useSession } from "next-auth/react"
import { UserExtended } from "@/types/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/useModal"

interface CartSummaryProps {
  totalBooks: number
  totalTitles: number
}

const MAX_DAYS = 21;

export const CartSummary = ({ totalBooks, totalTitles }: CartSummaryProps) => {
  const [date, setDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [duration, setDuration] = useState(0)
  const { items, clear } = useCart();
  const { data } = useSession();
  const user = data?.user as unknown as UserExtended;
  const router = useRouter();
  const { onOpen } = useModal();
  const queryClient = useQueryClient();

  useEffect(() => {
    const today = new Date()
    setDate(today)
    setReturnDate(addDays(today, MAX_DAYS)) // Default 21 hari ke depan
  }, [])

  useEffect(() => {
    if (date && returnDate) {
      const diff = differenceInCalendarDays(returnDate, date)
      setDuration(diff)
    }
  }, [date, returnDate])

  const handleStartDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return
    setDate(selectedDate)

    const newMaxReturn = addDays(selectedDate, MAX_DAYS)
    setReturnDate(newMaxReturn)
  }

  const handleReturnDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return
    setReturnDate(selectedDate)
  }

  const onServiceCheckout = async (payload: PeminjamanPayload) => {
    if (items.length === 0) return;
    if (!user) return;

    const result = await peminjamanService.buatPeminjaman(payload)
    return result;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: onServiceCheckout,
    onError(error: any) {
      const message = error?.response?.data?.message || error.message || "Terjadi Kesalahan";
      toast.error(message)
    },
    onSuccess(result: any) {
      toast.success(result.data.message);
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: ["listBuku"],
        exact: false
      });
      clear()
      onOpen("successPeminjaman", { peminjamanUser: result.data.data })
    },
  });

  const onSubmit = () => {
    if (!date || !returnDate || !user._id) {
      return
    }
    const payload: PeminjamanPayload = {
      id_user: user._id,
      batas_pinjam: returnDate?.toISOString(),
      tanggal_pinjam: date?.toISOString(),
      detail_peminjaman: items.map(item => {
        if (!item.buku._id) throw new Error("Buku ID tidak tersedia");
        return {
          id_buku: item.buku._id,
          jumlah: item.qty
        }
      })
    }
    mutate(payload)
  }

  console.log(`

    tanggal_pinjam:
    ${date?.toISOString()}

    batas_pinjam:
   ${returnDate?.toISOString()} 
    `)
  return (
    <Card className="bg-slate-900 border-slate-800 text-white sticky top-24">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Ringkasan Peminjaman</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">

        <div className="space-y-1.5">
          <Label className="text-xs text-slate-400">Tanggal Pinjam</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal bg-slate-800 border-slate-600 hover:bg-slate-900 hover:text-white text-slate-200",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-emerald-500" />
                {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-800 text-white" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleStartDateSelect}
                // Disabled: Tanggal sebelum hari ini
                disabled={(day) => day < startOfDay(new Date())}
                initialFocus
                className="bg-slate-950 text-white"
                classNames={{
                  day: "text-slate-200 hover:bg-slate-800",
                  head_cell: "text-slate-400",
                  caption_label: "text-white font-medium",
                }}
                modifiersClassNames={{
                  selected: "bg-emerald-600 text-white hover:bg-emerald-600",
                  today: "bg-slate-800 text-white",
                  outside: "text-slate-600 opacity-50",
                  disabled: "text-slate-700 opacity-30",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-slate-400">Tanggal Kembali</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal bg-slate-800 border-slate-600 hover:bg-slate-900 hover:text-white text-slate-200",
                  !returnDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-emerald-500" />
                {returnDate ? format(returnDate, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-800 text-white" align="start">
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={handleReturnDateSelect}
                // Disabled: Sebelum Tanggal Pinjam ATAU Lebih dari 14 hari setelah Tanggal Pinjam
                disabled={(day) => {
                  if (!date) return true;
                  const maxDate = addDays(date, MAX_DAYS);
                  return day < date || day > maxDate;
                }}
                className="bg-slate-950 text-white"
                classNames={{
                  day: "text-slate-200 hover:bg-slate-800",
                  head_cell: "text-slate-400",
                  caption_label: "text-white font-medium",
                }}
                modifiersClassNames={{
                  selected: "bg-emerald-600 text-white hover:bg-emerald-600",
                  today: "bg-slate-800 text-white",
                  outside: "text-slate-600 opacity-50",
                  disabled: "text-slate-700 opacity-30",
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Durasi & Validasi UI */}
          <div className="flex justify-between items-center pt-1">
            <p className={`text-xs ${duration > MAX_DAYS ? 'text-red-500' : 'text-slate-500'}`}>
              Durasi: {duration} hari {duration === MAX_DAYS && "(Maksimal)"}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 my-4"></div>

        {/* Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-400">
            <span>Total Judul:</span>
            <span className="text-white font-medium">{totalTitles} buku</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Total Buku:</span>
            <span className="text-white font-medium">{totalBooks} eksemplar</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-lg p-3 flex gap-3 items-start">
          <Info className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-400/90 leading-relaxed">
            <span className="font-bold text-emerald-400">Perhatian:</span> Tunjukkan barcode yang dihasilkan ke petugas perpustakaan untuk konfirmasi peminjaman.
          </p>
        </div>

        <Button onClick={onSubmit} disabled={isPending} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-6 shadow-lg shadow-orange-900/20">
          {isPending && (
            <>
              <Loader className="mr-2 h-5 w-5 animate-spin" />
              Checkout
            </>
          )}
          {!isPending && (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Checkout
            </>
          )}
        </Button>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 mx-auto">
          <Lightbulb className="h-3 w-3 text-yellow-600" />
          Denda keterlambatan: Rp 2.000/buku/hari
        </div>
      </CardFooter>
    </Card>
  )
}