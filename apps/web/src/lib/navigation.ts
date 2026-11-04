import {
  LayoutDashboard,
  FileText,
  CalendarRange,
  Building2,
  Bell,
  Settings,
  Palette,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon };

export const MAIN_NAVIGATION: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Documentos fiscais", href: "/documentos", icon: FileText },
  { label: "Competências", href: "/competencias", icon: CalendarRange },
  { label: "Empresas e agentes", href: "/empresas", icon: Building2 },
  { label: "Notificações", href: "/notificacoes", icon: Bell },
];

export const SECONDARY_NAVIGATION: NavItem[] = [
  { label: "Configurações", href: "/configuracoes", icon: Settings },
  { label: "Showcase de UI", href: "/dev/ui", icon: Palette },
];
