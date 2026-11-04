"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { OnboardingCompany } from "@/components/onboarding/step-add-companies";

export function StepStartSync({
  companies,
  onBack,
}: {
  companies: OnboardingCompany[];
  onBack: () => void;
}) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      setProgress((value) => Math.min(value + 12, 100));
    }, 400);

    return () => clearInterval(interval);
  }, [started]);

  const done = progress >= 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar sincronização</CardTitle>
        <CardDescription>
          Tudo pronto. O agente vai buscar os documentos fiscais d
          {companies.length === 1 ? "a" : "as"} {companies.length}{" "}
          {companies.length === 1 ? "empresa cadastrada" : "empresas cadastradas"} a partir da
          competência escolhida.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!started ? (
          <ul className="text-muted-foreground space-y-1.5 text-sm">
            {companies.map((company) => (
              <li key={company.cnpj} className="flex items-center gap-2">
                <span className="font-mono text-xs">{company.cnpj}</span>
                {company.name}
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-3">
            <Progress value={progress}>
              <div className="flex w-full items-center justify-between text-sm">
                <span className="text-foreground font-medium">
                  {done ? "Sincronização inicial concluída" : "Sincronizando documentos..."}
                </span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
            </Progress>
            {done && (
              <div className="text-success flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Pronto! Os primeiros documentos já estão disponíveis no dashboard.
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <Button type="button" variant="ghost" onClick={onBack} disabled={started}>
          Voltar
        </Button>
        {!started ? (
          <Button type="button" onClick={() => setStarted(true)}>
            Iniciar sincronização
          </Button>
        ) : (
          <Button type="button" onClick={() => router.push("/dashboard")} disabled={!done}>
            {done ? (
              "Ir para o dashboard"
            ) : (
              <>
                <Loader2 className="animate-spin" />
                Sincronizando...
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
