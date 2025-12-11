import { ChevronRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusItem = {
  title: string;
  subtitle: string;
  count: number;
  variant: "warning" | "info" | "purple" | "danger";
  modal: () => void;
};



export default function StatusPeminjaman({statusData}: {statusData: StatusItem[]}) {
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      case "info":
        return "bg-cyan-50 border-cyan-200 text-cyan-900";
      case "purple":
        return "bg-purple-50 border-purple-200 text-purple-900";
      case "danger":
        return "bg-red-50 border-red-200 text-red-900";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  const getBadgeStyles = (variant: string) => {
    switch (variant) {
        case "warning": return "bg-white/60 text-yellow-700 border-yellow-300";
        case "info": return "bg-white/60 text-cyan-700 border-cyan-300";
        case "purple": return "bg-white/60 text-purple-700 border-purple-300";
        case "danger": return "bg-red-600 text-white border-red-600"; // Merah solid untuk denda
        default: return "";
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-6 text-slate-100">
        <TrendingUp className="w-5 h-5" />
        <h3 className="font-semibold text-lg">Status Peminjaman</h3>
      </div>

      <div className="space-y-3">
        {statusData.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl border transition-all hover:brightness-95 cursor-pointer",
              getVariantStyles(item.variant)
            )}
            onClick={item.modal}
          >
            <div className="flex flex-col">
              <span className="font-medium text-sm">{item.title}</span>
              <span className={cn("text-xs mt-0.5 opacity-80", item.variant === 'danger' && "text-red-700 font-medium")}>
                {item.subtitle}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className={cn("flex items-center justify-center min-w-8 h-8 px-2 rounded-full text-xs font-bold border", getBadgeStyles(item.variant))}>
                {item.count}
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}