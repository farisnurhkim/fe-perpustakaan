import { Clock, CheckCircle2, Package, Box } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { IPeminjaman } from "@/types/model";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";


export interface LoanRequestProps {
  item: IPeminjaman;
  type: "peminjaman" | "pengembalian";
  onConfirm: () => void;
}

export function RequestPeminjamanCard({ item, type, onConfirm }: LoanRequestProps) {
  const { batas_pinjam, detail_peminjaman, status, tgl_pinjam, user } = item;
  const totalBuku = detail_peminjaman.reduce((total, item) => {
    return total + item.jumlah;
  }, 0)
  return (
    <div className="w-full space-y-2">
      {/* Header Section di luar Card */}

      {/* Main Card */}
      <Card className="bg-[#0f172a] border-slate-600 text-slate-100 shadow-xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-white">{user.nama}</h3>
              <p className="text-slate-400 text-sm mt-1">{user.email}</p>
            </div>

            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium",
              status === "pending_peminjaman"
                ? "border-amber-500/50 text-amber-500 bg-amber-500/10"
                : "border-purple-700 text-purple-400"
            )}>
              {status === "pending_peminjaman" && (
                <Clock className="w-3 h-3" />
              )}
              {status === "pending_pengembalian" && (
                <Box className="w-3 h-3" />
              )}
              {status === "pending_peminjaman" ? "Menunggu Konfirmasi" : "Pengembalian"}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Package className="w-4 h-4" />
            <span>
              {totalBuku} buku • {detail_peminjaman.length} judul
            </span>
          </div>

          <div className="space-y-3">
            {detail_peminjaman.map((book, index) => (
              <div
                key={index}
                className="flex gap-4 p-3 rounded-lg bg-[#1e293b] border border-slate-700/50 items-start"
              >
                {/* Book Cover */}
                <div className="w-12 h-16 shrink-0 bg-slate-800 rounded overflow-hidden">
                  <Image
                    src={book.buku.foto}
                    alt={book.buku.judul_buku}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm truncate">
                    {book.buku.judul_buku}
                  </h4>
                  <p className="text-slate-400 text-sm truncate">{book.buku.penulis}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Qty: <span className="text-slate-500">{book.jumlah}</span>{" "}
                    <span className="mx-1"></span> Stok: {book.buku.stok}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="bg-slate-400" />

          <div className="mx-4 py-3 bg-slate-900 grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 mb-1">Tanggal Pinjam:</p>
              <p className="text-slate-200 font-medium">{format(new Date(tgl_pinjam), 'dd MMM yyyy', { locale: id })}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Jatuh Tempo:</p>
              <p className="text-slate-200 font-medium">{format(new Date(batas_pinjam), 'dd MMM yyyy', { locale: id })}</p>
            </div>
          </div>

          {type === "peminjaman" && (
            <Button
              onClick={onConfirm}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Konfirmasi Peminjaman
            </Button>
          )}
          {type === "pengembalian" && status === "pending_pengembalian" && (
            <Button
              onClick={onConfirm}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Konfirmasi Pengembalian
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}