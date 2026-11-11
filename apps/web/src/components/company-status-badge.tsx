import { Clock, CheckCircle2, CircleOff, type LucideIcon } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import type { CompanyStatus } from "@/lib/fixtures/companies";
import { cn } from "cn";

const STATUS_CONFIG: Record<
  CompanyStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  pendente_vinculo: {
    label: "Pendente de vínculo",
    icon: Clock,
    className: "bg-warning/10 text-warning dark:bg-warning/15",
  },
  ativa: {
    label: "Ativa",
    icon: CheckCircle2,
    className: "bg-success/10 text-success dark:bg-success/15",
  },
  desativada: {
    label: "Desativada",
    icon: CircleOff,
    className: "bg-muted text-muted-foreground",
  },
};

export function CompanyStatusBadge({
  status,
  className,
}: {
  status: CompanyStatus;
  className?: string;
}) {
  const { label, icon, className: statusClassName } = STATUS_CONFIG[status];

  return <StatusBadge label={label} icon={icon} className={cn(statusClassName, className)} />;
}
