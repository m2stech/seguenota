"use client";

import { useState } from "react";
import { Download, Monitor, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export function StepInstallAgent({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [downloaded, setDownloaded] = useState(false);

  function handleDownload() {
    setDownloaded(true);
    toast.success("Download iniciado: SegueNotaAgentSetup.msi");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instale o agente no computador com o certificado</CardTitle>
        <CardDescription>
          O agente roda no Windows do computador que tem o certificado A1 instalado. Ele é a única
          peça que acessa a API nacional da NFS-e — seus certificados nunca saem do seu computador.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-border flex items-center gap-4 rounded-lg border px-4 py-3">
          <Monitor className="text-muted-foreground size-8" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-foreground text-sm font-medium">Segue Nota Agent — Windows</p>
            <p className="text-muted-foreground text-xs">
              Instalador MSI assinado · requer Windows 10/11
            </p>
          </div>
          <Button type="button" variant="outline" onClick={handleDownload}>
            <Download />
            Baixar instalador
          </Button>
        </div>
        {downloaded && (
          <div className="text-success flex items-center gap-2 text-sm">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Download concluído. Execute o instalador no computador com o certificado.
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <Button type="button" onClick={onNext}>
          Já instalei, continuar
        </Button>
      </CardFooter>
    </Card>
  );
}
