import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

export function StatusBadge({
  label,
  icon: Icon,
  className,
}: {
  label: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 border-transparent font-medium", className)}>
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </Badge>
  );
}
