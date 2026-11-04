"use client";

import { Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";

export function StatesShowcase() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Carregando</h3>
        <div className="space-y-2 rounded-lg border border-border p-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Vazio</h3>
        <EmptyState
          icon={Inbox}
          title="Nenhum documento encontrado"
          description="Ajuste os filtros ou aguarde a próxima sincronização."
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Erro</h3>
        <ErrorState description="Verifique sua conexão e tente novamente." onRetry={() => {}} />
      </div>
    </div>
  );
}
