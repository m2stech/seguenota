"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Plus, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { FormField } from "@/components/form-field";
import { EmptyState } from "@/components/empty-state";
import { CompanyStatusBadge } from "@/components/company-status-badge";
import { createCompanySchema, type CreateCompanyInput } from "@/lib/validations/companies";
import { formatCnpj } from "@/lib/cnpj";
import { COMPANIES, type Company } from "@/lib/fixtures/companies";

export function CompaniesTab() {
  const [companies, setCompanies] = useState<Company[]>(COMPANIES);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCompanyInput>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: { cnpj: "", name: "" },
  });

  async function onSubmit(data: CreateCompanyInput) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    setCompanies((current) => [
      {
        id: `company-${current.length + 1}`,
        cnpj: data.cnpj,
        name: data.name,
        status: "pendente_vinculo",
        certificateId: null,
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...current,
    ]);
    reset();
    setDialogOpen(false);
  }

  function toggleStatus(companyId: string) {
    setCompanies((current) =>
      current.map((company) =>
        company.id === companyId
          ? { ...company, status: company.status === "desativada" ? "ativa" : "desativada" }
          : company,
      ),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Empresas monitoradas pela organização. Cada CNPJ precisa de um certificado A1 próprio
          vinculado por um único agente.
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus />
            Cadastrar empresa
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar empresa</DialogTitle>
              <DialogDescription>
                Informe o CNPJ e a razão social. A empresa entra como &ldquo;Pendente de
                vínculo&rdquo; até que um certificado correspondente seja associado.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormField label="CNPJ" htmlFor="cnpj" error={errors.cnpj?.message}>
                <Controller
                  control={control}
                  name="cnpj"
                  render={({ field }) => (
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      aria-invalid={!!errors.cnpj}
                      value={field.value}
                      onChange={(event) => field.onChange(formatCnpj(event.target.value))}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </FormField>
              <FormField label="Razão social" htmlFor="name" error={errors.name?.message}>
                <Input
                  id="name"
                  placeholder="Ex.: Comércio Silva Ltda."
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              </FormField>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  Cadastrar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {companies.length === 0 ? (
        <EmptyState icon={Building2} title="Nenhuma empresa cadastrada" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Razão social</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Cadastrada em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell className="font-mono text-xs">{company.cnpj}</TableCell>
                <TableCell>
                  <CompanyStatusBadge status={company.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(company.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStatus(company.id)}
                    disabled={company.status === "pendente_vinculo"}
                  >
                    {company.status === "desativada" ? (
                      <>
                        <Power />
                        Reativar
                      </>
                    ) : (
                      <>
                        <PowerOff />
                        Desativar
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
