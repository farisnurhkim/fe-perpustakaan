"use client"

import PageHeader from "@/components/Header/PageHeader"
import SearchFilter from "@/components/SearchFilter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const KatalogAdmin = () => {
    return (
        <>
        <div className="flex flex-wrap justify-between items-end">
            <PageHeader title="Manajemen Koleksi Buku" description="Kelola data buku dan stok perpustakaan" />
            <Button className="text-white mt-5 bg-emerald-600 hover:bg-emerald-700 transition-all duration-300">
                <Plus/>
                Tambah buku baru
            </Button>
        </div>

        <div className="mt-8">
            <SearchFilter/>
        </div>

        </>
    )
}

export default KatalogAdmin