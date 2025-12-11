"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const categories = [
  "Semua Kategori",
  "Fiksi",
  "Non-Fiksi",
  "Sains",
  "Pengembangan Diri",
  "Keuangan",
  "Teknologi",
  "Sejarah",
  "Fantasi",
];

interface SearchFilterProps {
  onSearch?: (query: string) => void;
  onCategoryChange?: (category: string) => void;
}

export default function SearchFilter({ onSearch, onCategoryChange }: SearchFilterProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
      <div className="relative flex-1 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
        <Input
          placeholder="Cari judul, penulis, penerbit, atau kata kunci..."
          className={cn(
            "pl-10 h-11 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500",
            "focus-visible:ring-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-1 focus-visible:ring-offset-0"
          )}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
      <Filter className="w-4 h-4 opacity-50" />
      <Select onValueChange={(val) => onCategoryChange?.(val)} defaultValue="Semua Kategori">
        <SelectTrigger 
          className={cn(
            "w-full md:w-[220px] h-11 bg-slate-800 border-slate-700 text-slate-200",
            // Custom Focus biar warna Hijau
            "focus:ring-emerald-500 focus:ring-1 focus:ring-offset-0 data-[state=open]:border-emerald-500"
          )}
        >
          <div className="flex items-center gap-2">
            <SelectValue placeholder="Pilih Kategori" />
          </div>
        </SelectTrigger>
        
        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
          {categories.map((category) => (
            <SelectItem 
              key={category} 
              value={category}
              className="focus:bg-slate-800 focus:text-emerald-400 cursor-pointer"
            >
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      </div>

    </div>
  );
}