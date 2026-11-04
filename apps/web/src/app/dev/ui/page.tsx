"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FiscalStatusBadge, type FiscalStatus } from "@/components/fiscal-status-badge";
import { SyncStatusBadge, type SyncStatus } from "@/components/sync-status-badge";
import { ColorSwatches } from "./color-swatches";
import { StatesShowcase } from "./states-showcase";

const DOCUMENT_ROWS: { numero: string; empresa: string; valor: string; status: FiscalStatus }[] = [
  { numero: "000123", empresa: "Comércio Silva Ltda", valor: "R$ 1.250,00", status: "autorizada" },
  { numero: "000124", empresa: "Serviços Nova Era ME", valor: "R$ 890,50", status: "cancelada" },
  { numero: "000125", empresa: "Comércio Silva Ltda", valor: "R$ 3.420,00", status: "substituida" },
  {
    numero: "000126",
    empresa: "Serviços Nova Era ME",
    valor: "R$ 540,00",
    status: "cancelamento_em_analise",
  },
  { numero: "000127", empresa: "Comércio Silva Ltda", valor: "R$ 12.800,00", status: "bloqueada" },
];

const SYNC_ROWS: { agente: string; status: SyncStatus }[] = [
  { agente: "Agente — Escritório Alfa", status: "online" },
  { agente: "Agente — Escritório Beta", status: "offline" },
  { agente: "Agente — Filial Centro", status: "erro" },
];

export default function UiShowcasePage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Showcase de UI</h1>
        <p className="text-sm text-muted-foreground">
          Referência interna de tokens, componentes e estados do design system. Não é parte do
          produto final.
        </p>
      </div>

      <Tabs defaultValue="cores">
        <TabsList>
          <TabsTrigger value="cores">Cores</TabsTrigger>
          <TabsTrigger value="tipografia">Tipografia</TabsTrigger>
          <TabsTrigger value="componentes">Componentes</TabsTrigger>
          <TabsTrigger value="tabela">Tabela e badges</TabsTrigger>
          <TabsTrigger value="estados">Estados</TabsTrigger>
        </TabsList>

        <TabsContent value="cores" className="mt-6">
          <ColorSwatches />
        </TabsContent>

        <TabsContent value="tipografia" className="mt-6 space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight">Título nível 1 — Aa</h1>
          <h2 className="text-2xl font-semibold tracking-tight">Título nível 2 — Aa</h2>
          <h3 className="text-lg font-medium">Título nível 3 — Aa</h3>
          <p className="max-w-prose text-sm text-foreground">
            Texto de corpo padrão, usado para parágrafos e descrições. Fonte Geist Sans, pensada
            para leitura densa de dados fiscais.
          </p>
          <p className="text-sm text-muted-foreground">
            Texto secundário (muted-foreground), usado para legendas e metadados.
          </p>
          <p className="font-mono text-sm">
            35261023000190 — chave de acesso em Geist Mono, para IDs, NSU e valores tabulares.
          </p>
        </TabsContent>

        <TabsContent value="componentes" className="mt-6 space-y-8">
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Botões</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Button>Padrão</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destrutivo</Button>
              <Button variant="link">Link</Button>
              <Button disabled>Desabilitado</Button>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Formulário</h3>
            <div className="grid max-w-md gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="uf">Município</Label>
                <Select defaultValue="sp">
                  <SelectTrigger id="uf" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sp">São Paulo</SelectItem>
                    <SelectItem value="rj">Rio de Janeiro</SelectItem>
                    <SelectItem value="mg">Belo Horizonte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Dialog e toast</h3>
            <div className="flex flex-wrap gap-2">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger render={<Button variant="outline" />}>Abrir dialog</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Fechar competência</DialogTitle>
                    <DialogDescription>
                      Esta ação impede novos lançamentos na competência Nov/2026. Pode ser
                      reaberta depois.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => setDialogOpen(false)}>Confirmar fechamento</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                onClick={() => toast.success("Exportação concluída")}
              >
                Disparar toast
              </Button>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="tabela" className="mt-6 space-y-8">
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Situação fiscal (sempre com texto + ícone)
            </h3>
            <div className="flex flex-wrap gap-2">
              <FiscalStatusBadge status="autorizada" />
              <FiscalStatusBadge status="cancelada" />
              <FiscalStatusBadge status="substituida" />
              <FiscalStatusBadge status="cancelamento_em_analise" />
              <FiscalStatusBadge status="bloqueada" />
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Estado dos agentes</h3>
            <div className="flex flex-wrap gap-2">
              <SyncStatusBadge status="online" />
              <SyncStatusBadge status="offline" />
              <SyncStatusBadge status="erro" />
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Tabela densa</h3>
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DOCUMENT_ROWS.map((row) => (
                    <TableRow key={row.numero}>
                      <TableCell className="font-mono text-xs">{row.numero}</TableCell>
                      <TableCell>{row.empresa}</TableCell>
                      <TableCell className="text-right font-mono">{row.valor}</TableCell>
                      <TableCell>
                        <FiscalStatusBadge status={row.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Agentes</h3>
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agente</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SYNC_ROWS.map((row) => (
                    <TableRow key={row.agente}>
                      <TableCell>{row.agente}</TableCell>
                      <TableCell>
                        <SyncStatusBadge status={row.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="estados" className="mt-6">
          <StatesShowcase />
        </TabsContent>
      </Tabs>
    </div>
  );
}
