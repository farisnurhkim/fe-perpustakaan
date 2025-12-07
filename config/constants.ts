import { BookOpen, LayoutGrid, Library, LucideIcon, ShoppingCart, SquareCheckBig } from "lucide-react";

export type NavigationLink = {
    name: string;
    url: string;
    icon: LucideIcon;
}

export const navigationLinkMember: NavigationLink[] = [
    {
        name: "Katalog",
        url: "/katalog",
        icon: BookOpen
    },
    {
        name: "Keranjang",
        url: "/keranjang",
        icon: ShoppingCart
    },
    {
        name: "Peminjaman",
        url: "/peminjaman",
        icon: Library
    }
]

export const navigationLinkAdmin: NavigationLink[] = [
    {
        name: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutGrid
    },
    {
        name: "Pinjam",
        url: "/admin/dashboard/pinjam",
        icon: SquareCheckBig

    },
    {
        name: "Kembali",
        url: "/admin/dashboard/kembali",
        icon: Library
    },
    {
        name: "Katalog",
        url: "/admin/dashboard/katalog",
        icon: BookOpen
    }
]