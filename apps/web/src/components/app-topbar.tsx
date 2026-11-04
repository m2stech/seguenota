"use client";

import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ContextSelectors } from "@/components/context-selectors";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCommandPalette } from "@/components/command-palette";

export function AppTopbar() {
  const { open } = useCommandPalette();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <ContextSelectors />
      <div className="flex-1" />
      <Button
        variant="outline"
        size="sm"
        className="text-muted-foreground"
        onClick={open}
      >
        <Search className="size-4" />
        Buscar
        <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 text-[0.7rem] font-medium">
          ⌘K
        </kbd>
      </Button>
      <ThemeToggle />
    </header>
  );
}
