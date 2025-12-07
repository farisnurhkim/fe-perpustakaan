import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon; 
  onDownload?: () => void;
}