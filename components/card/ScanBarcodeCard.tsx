import React, { useState } from "react";
import { ScanLine, Search } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModalData, ModalType } from "@/hooks/useModal";

interface ScanBarcodeCardProps {
    onSearch: (value: string) => void;
    onOpen: (value: ModalType, data?: ModalData) => void;
    isLoading?: boolean;
    title?: string;
    description?: string;
    className?: string;
}

export function ScanBarcodeCard({
    onSearch,
    onOpen,
    isLoading = false,
    title = "Scan Barcode Peminjaman",
    description = "Scan atau masukkan kode barcode untuk mengkonfirmasi peminjaman",
    className,
}: ScanBarcodeCardProps) {
    const [inputValue, setInputValue] = useState("");

    const handleSearch = () => {
        if (inputValue.trim()) {
            onSearch(inputValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <Card
            className={cn(
                "w-full bg-[#0f172a] border-slate-800 text-slate-100 shadow-lg",
                className
            )}
        >
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium text-white">
                    {title}
                </CardTitle>
                <CardDescription className="text-slate-400">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex w-full items-center gap-3">
                    {/* Input Wrapper dengan Icon di dalamnya */}
                    <div className="relative flex-1 group">
                        <ScanLine onClick={() => onOpen("scanPeminjaman")} className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                        <Input
                            type="text"
                            placeholder="Masukkan atau scan barcode..."
                            className="pl-10 h-10 bg-[#1e293b] border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-offset-0 focus-visible:border-emerald-500"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Tombol Cari */}
                    <Button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="h-10 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all"
                    >
                        {isLoading ? (
                            "Memproses..."
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" />
                                Cari
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}