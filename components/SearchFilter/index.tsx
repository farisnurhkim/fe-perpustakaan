"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useDebounce from "@/hooks/useDebounce"
import { cn } from "@/lib/utils"
import { Filter, Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface SearchFilterProps {
  categories: string[];
  placeholder?: string;
  className?: string;
}

const SearchFilter = ({ 
  categories, 
  placeholder = "Cari data...", 
  className 
}: SearchFilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategory = searchParams.get("category");
  const currentSearch = searchParams.get("search");

  const [searchInput, setSearchInput] = useState(currentSearch ?? "");
  const debouncedSearchValue = useDebounce(searchInput, 800);

  useEffect(() => {
    if (debouncedSearchValue === (currentSearch ?? "")) return;

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearchValue) {
      params.set("search", debouncedSearchValue)
    } else {
      params.delete("search")
    }

    router.replace(`${pathname}?${params.toString()}`)
  }, [debouncedSearchValue, currentSearch, pathname, router, searchParams]);

  const onCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category && category !== "semua kategori") {
      params.set("category", category)
    } else {
      params.delete("category")
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className={cn("flex flex-col md:flex-row md:items-center gap-4 w-full", className)}>
      <div className="relative flex-1 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
        <Input
          placeholder={placeholder}
          className={cn(
            "pl-10 h-11 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500",
            "focus-visible:ring-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-1 focus-visible:ring-offset-0"
          )}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 opacity-50" />
        <Select 
            onValueChange={onCategoryChange} 
            value={(currentCategory || "Semua Kategori").toLowerCase()}
        >
          <SelectTrigger className="w-full md:w-[220px] h-11 bg-slate-800 border-slate-700 text-slate-200 focus:ring-emerald-500 focus:ring-1 focus:ring-offset-0">
            <SelectValue placeholder="Pilih Kategori" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
            {categories.map((category) => (
              <SelectItem 
                key={category} 
                value={category.toLocaleLowerCase()} 
                className="focus:bg-slate-800 focus:text-emerald-400 cursor-pointer"
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default SearchFilter;