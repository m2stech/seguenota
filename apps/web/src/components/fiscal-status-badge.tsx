import {
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Clock,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "cn";

export type FiscalStatus =
  | "autorizada"
  | "cancelada"
  | "substituida"
  | "cancelamento_em_analise"
  | "bloqueada";

const STATUS_CONFIG: Record<
  FiscalStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  autorizada: {
    label: "Autorizada",
    icon: CheckCircle2,
    className: "bg-success/10 text-success dark:bg-success/15",
  },
  cancelada: {
    label: "Cancelada",
    icon: XCircle,
    className: "bg-status-cancelled/10 text-status-cancelled dark:bg-status-cancelled/15",
  },
  substituida: {
    label: "Substituída",
    icon: RefreshCcw,
    className: "bg-status-replaced/10 text-status-replaced dark:bg-status-replaced/15",
  },
  cancelamento_em_analise: {
    label: "Cancelamento em análise",
    icon: Clock,
    className: "bg-warning/10 text-warning dark:bg-warning/15",
  },
  bloqueada: {
    label: "Bloqueada",
    icon: ShieldAlert,
    className: "bg-danger/10 text-danger dark:bg-danger/15",
  },
};

export function FiscalStatusBadge({
  status,
  className,
}: {
  status: FiscalStatus;
  className?: string;
}) {
  const { label, icon, className: statusClassName } = STATUS_CONFIG[status];

  return <StatusBadge label={label} icon={icon} className={cn(statusClassName, className)} />;
}
