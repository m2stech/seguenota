"use client";

import { CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "cn";

function buildLastCompetences(count: number): { id: string; label: string }[] {
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const id = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    return { id, label: label.charAt(0).toUpperCase() + label.slice(1) };
  });
}

const COMPETENCES = buildLastCompetences(6);

export function StepInitialCompetence({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Escolha a competência inicial</CardTitle>
        <CardDescription>
          A sincronização retroativa vai buscar documentos a partir da competência selecionada. Você
          pode trazer competências anteriores depois, sob demanda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {COMPETENCES.map((competence) => (
            <button
              key={competence.id}
              type="button"
              onClick={() => onChange(competence.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                value === competence.id
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border hover:bg-muted",
              )}
            >
              <CalendarRange
                className={cn(
                  "size-4",
                  value === competence.id ? "text-primary" : "text-muted-foreground",
                )}
                aria-hidden="true"
              />
              {competence.label}
            </button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <Button type="button" onClick={onNext} disabled={!value}>
          Continuar
        </Button>
      </CardFooter>
    </Card>
  );
}
