import { Wifi, WifiOff, AlertTriangle, HelpCircle, type LucideIcon } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "cn";

export type SyncStatus = "online" | "offline" | "erro" | "nunca_conectado";

const STATUS_CONFIG: Record<
  SyncStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  online: {
    label: "Agente online",
    icon: Wifi,
    className: "bg-sync-online/10 text-sync-online dark:bg-sync-online/15",
  },
  offline: {
    label: "Agente offline",
    icon: WifiOff,
    className: "bg-sync-offline/10 text-sync-offline dark:bg-sync-offline/15",
  },
  erro: {
    label: "Erro de sincronização",
    icon: AlertTriangle,
    className: "bg-sync-error/10 text-sync-error dark:bg-sync-error/15",
  },
  nunca_conectado: {
    label: "Nunca conectado",
    icon: HelpCircle,
    className: "bg-muted text-muted-foreground",
  },
};

export function SyncStatusBadge({
  status,
  className,
}: {
  status: SyncStatus;
  className?: string;
}) {
  const { label, icon, className: statusClassName } = STATUS_CONFIG[status];

  return <StatusBadge label={label} icon={icon} className={cn(statusClassName, className)} />;
}
