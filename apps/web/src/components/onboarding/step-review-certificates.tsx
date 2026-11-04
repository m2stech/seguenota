"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DETECTED_CERTIFICATES } from "@/lib/fixtures/onboarding";

export function StepReviewCertificates({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificados detectados</CardTitle>
        <CardDescription>
          O agente encontrou os certificados A1 abaixo neste computador. Na próxima etapa você vai
          vinculá-los às empresas correspondentes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CNPJ titular</TableHead>
              <TableHead>Titular</TableHead>
              <TableHead>Emissor</TableHead>
              <TableHead>Validade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DETECTED_CERTIFICATES.map((certificate) => (
              <TableRow key={certificate.thumbprint}>
                <TableCell className="font-mono text-xs">{certificate.holderCnpj}</TableCell>
                <TableCell>{certificate.holderName}</TableCell>
                <TableCell className="text-muted-foreground">{certificate.issuer}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-success/30 text-success gap-1.5">
                    <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
                    {new Date(certificate.validUntil).toLocaleDateString("pt-BR")}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <Button type="button" onClick={onNext}>
          Continuar
        </Button>
      </CardFooter>
    </Card>
  );
}
