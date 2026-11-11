"use client";

import { useMemo, useState } from "react";
import { Bot, KeyRound, Link2, Unlink, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormField } from "@/components/form-field";
import { SyncStatusBadge } from "@/components/sync-status-badge";
import { CertificateStatusBadge } from "@/components/certificate-status-badge";
import {
  AGENTS,
  CERTIFICATES,
  COMPANIES,
  getCertificateStatus,
  type Agent,
  type Certificate,
} from "@/lib/fixtures/companies";

function generateActivationCode() {
  const segment = () =>
    Math.random().toString(36).slice(2, 5).toUpperCase().padEnd(3, "X");
  return `${segment()}-${segment()}-${segment()}`;
}

export function AgentsCertificatesTab() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [certificates, setCertificates] = useState<Certificate[]>(CERTIFICATES);
  const [activationDialogAgentId, setActivationDialogAgentId] = useState<string | null>(null);
  const [linkDialog, setLinkDialog] = useState<{ certificateId: string } | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [linkError, setLinkError] = useState<string | null>(null);

  const companiesWithoutCertificate = useMemo(
    () => COMPANIES.filter((company) => !company.certificateId && company.status !== "desativada"),
    [],
  );

  function openLinkDialog(certificateId: string) {
    setLinkDialog({ certificateId });
    setSelectedCompanyId("");
    setLinkError(null);
  }

  function confirmLink() {
    if (!linkDialog) return;
    const certificate = certificates.find((cert) => cert.id === linkDialog.certificateId);
    const company = COMPANIES.find((item) => item.id === selectedCompanyId);

    if (!certificate || !company) {
      setLinkError("Selecione uma empresa.");
      return;
    }

    if (certificate.holderCnpj.replace(/\D/g, "") !== company.cnpj.replace(/\D/g, "")) {
      setLinkError(
        "O CNPJ titular do certificado é diferente do CNPJ da empresa. O vínculo foi recusado.",
      );
      return;
    }

    const alreadyLinked = certificates.some(
      (cert) => cert.companyId === company.id && cert.id !== certificate.id,
    );
    if (alreadyLinked) {
      setLinkError("Esta empresa já possui um certificado vinculado. Remova o vínculo atual antes.");
      return;
    }

    setCertificates((current) =>
      current.map((cert) =>
        cert.id === certificate.id ? { ...cert, companyId: company.id } : cert,
      ),
    );
    setLinkDialog(null);
  }

  function unlinkCertificate(certificateId: string) {
    setCertificates((current) =>
      current.map((cert) => (cert.id === certificateId ? { ...cert, companyId: null } : cert)),
    );
  }

  function revokeAgent(agentId: string) {
    setAgents((current) =>
      current.map((agent) =>
        agent.id === agentId
          ? { ...agent, status: "offline" as const, activationCode: null }
          : agent,
      ),
    );
  }

  function generateCode(agentId: string) {
    setAgents((current) =>
      current.map((agent) =>
        agent.id === agentId ? { ...agent, activationCode: generateActivationCode() } : agent,
      ),
    );
    setActivationDialogAgentId(agentId);
  }

  const agentById = (id: string) => agents.find((agent) => agent.id === id);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Agentes</h2>
          <p className="text-sm text-muted-foreground">
            Cada agente instalado sincroniza um ou mais CNPJs. Um agente é único por CNPJ.
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agente</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Última conexão</TableHead>
              <TableHead>Versão</TableHead>
              <TableHead>Empresas vinculadas</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell className="flex items-center gap-2 font-medium">
                  <Bot className="size-4 text-muted-foreground" aria-hidden="true" />
                  {agent.name}
                </TableCell>
                <TableCell>
                  <SyncStatusBadge status={agent.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {agent.lastSeenAt
                    ? new Date(agent.lastSeenAt).toLocaleString("pt-BR")
                    : "Nunca conectado"}
                </TableCell>
                <TableCell className="text-muted-foreground">{agent.version}</TableCell>
                <TableCell className="text-muted-foreground">
                  {agent.companyIds.length}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => generateCode(agent.id)}>
                      <KeyRound />
                      Código de ativação
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => revokeAgent(agent.id)}
                    >
                      <XCircle />
                      Revogar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Certificados detectados</h2>
          <p className="text-sm text-muted-foreground">
            Metadados dos certificados A1 reportados pelos agentes. A chave privada nunca chega ao
            backend — apenas thumbprint, titular, emissor e validade.
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titular</TableHead>
              <TableHead>CNPJ titular</TableHead>
              <TableHead>Emissor</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Agente</TableHead>
              <TableHead>Empresa vinculada</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.map((certificate) => {
              const company = COMPANIES.find((item) => item.id === certificate.companyId);
              const agent = agentById(certificate.agentId);
              const status = getCertificateStatus(certificate.validUntil);

              return (
                <TableRow key={certificate.id}>
                  <TableCell className="font-medium">{certificate.holderName}</TableCell>
                  <TableCell className="font-mono text-xs">{certificate.holderCnpj}</TableCell>
                  <TableCell className="text-muted-foreground">{certificate.issuer}</TableCell>
                  <TableCell>
                    <CertificateStatusBadge status={status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {agent?.name ?? "—"}
                  </TableCell>
                  <TableCell>
                    {company ? (
                      <span className="text-sm">{company.name}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Sem vínculo</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {company ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => unlinkCertificate(certificate.id)}
                      >
                        <Unlink />
                        Desvincular
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openLinkDialog(certificate.id)}
                        disabled={companiesWithoutCertificate.length === 0}
                      >
                        <Link2 />
                        Vincular empresa
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>

      <Dialog open={!!linkDialog} onOpenChange={(open) => !open && setLinkDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular certificado à empresa</DialogTitle>
            <DialogDescription>
              O vínculo só é aceito quando o CNPJ titular do certificado é igual ao CNPJ da
              empresa selecionada.
            </DialogDescription>
          </DialogHeader>
          <FormField label="Empresa" htmlFor="company" error={linkError ?? undefined}>
            <Select
              value={selectedCompanyId}
              onValueChange={(next) => next && setSelectedCompanyId(next)}
            >
              <SelectTrigger id="company" className="w-full" aria-label="Empresa">
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                {companiesWithoutCertificate.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name} — {company.cnpj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <DialogFooter>
            <Button type="button" onClick={confirmLink} disabled={!selectedCompanyId}>
              Confirmar vínculo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!activationDialogAgentId}
        onOpenChange={(open) => !open && setActivationDialogAgentId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Código de ativação gerado</DialogTitle>
            <DialogDescription>
              Informe este código único no agente para concluir a ativação. Ele expira após o
              primeiro uso.
            </DialogDescription>
          </DialogHeader>
          <p className="rounded-lg border border-border bg-muted px-4 py-3 text-center font-mono text-lg tracking-widest">
            {agents.find((agent) => agent.id === activationDialogAgentId)?.activationCode}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
