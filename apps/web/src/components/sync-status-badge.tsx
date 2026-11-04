import { Wifi, WifiOff, AlertTriangle, type LucideIcon } from "lucide-react";
import { cn } from "cn";

export type SyncStatus = "online" | "offline" | "erro";

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
};

export function SyncStatusBadge({
  status,
  className,
}: {
  status: SyncStatus;
  className?: string;
}) {
  const { label, icon: Icon, className: statusClassName } = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        statusClassName,
        className
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
