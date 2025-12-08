import { LucideIcon } from "lucide-react";

export interface ICardDashboard {
    label: string;
    value: number;
    description: string;
    icon: LucideIcon;              
    variant: "emerald" | "cyan" | "orange" | "blue" | "rose";               
    modal?: () => void;
    linkDownload?: string;        
}
