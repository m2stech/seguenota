import { ShieldCheck, ShieldAlert, ShieldX, ShieldQuestion, type LucideIcon } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import type { CertificateStatus } from "@/lib/fixtures/companies";
import { cn } from "cn";

const STATUS_CONFIG: Record<
  CertificateStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  valido: {
    label: "Válido",
    icon: ShieldCheck,
    className: "bg-success/10 text-success dark:bg-success/15",
  },
  vencendo: {
    label: "Vencendo",
    icon: ShieldAlert,
    className: "bg-warning/10 text-warning dark:bg-warning/15",
  },
  vencido: {
    label: "Vencido",
    icon: ShieldX,
    className: "bg-danger/10 text-danger dark:bg-danger/15",
  },
  indisponivel: {
    label: "Indisponível",
    icon: ShieldQuestion,
    className: "bg-muted text-muted-foreground",
  },
};

export function CertificateStatusBadge({
  status,
  className,
}: {
  status: CertificateStatus;
  className?: string;
}) {
  const { label, icon, className: statusClassName } = STATUS_CONFIG[status];

  return <StatusBadge label={label} icon={icon} className={cn(statusClassName, className)} />;
}
