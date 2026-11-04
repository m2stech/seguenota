"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  CalendarRange,
  Building2,
  Bell,
  Palette,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTheme } from "next-themes";

const NAVIGATION = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Documentos fiscais", href: "/documentos", icon: FileText },
  { label: "Competências", href: "/competencias", icon: CalendarRange },
  { label: "Empresas e agentes", href: "/empresas", icon: Building2 },
  { label: "Notificações", href: "/notificacoes", icon: Bell },
  { label: "Showcase de UI", href: "/dev/ui", icon: Palette },
];

const CommandPaletteContext = createContext<{ open: () => void } | null>(null);

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  }
  return context;
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const contextValue = useMemo(() => ({ open: () => setOpen(true) }), []);

  function runNavigation(href: string) {
    setOpen(false);
    router.push(href);
  }

  function runTheme(theme: string) {
    setOpen(false);
    setTheme(theme);
  }

  return (
    <CommandPaletteContext.Provider value={contextValue}>
      {children}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Paleta de comandos"
        description="Navegue rapidamente pelo Segue Nota"
      >
        <Command>
          <CommandInput placeholder="Digite um comando ou busque uma página..." />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup heading="Navegação">
              {NAVIGATION.map(({ label, href, icon: Icon }) => (
                <CommandItem key={href} onSelect={() => runNavigation(href)}>
                  <Icon />
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Tema">
              <CommandItem onSelect={() => runTheme("light")}>Tema claro</CommandItem>
              <CommandItem onSelect={() => runTheme("dark")}>Tema escuro</CommandItem>
              <CommandItem onSelect={() => runTheme("system")}>Seguir sistema</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </CommandPaletteContext.Provider>
  );
}
