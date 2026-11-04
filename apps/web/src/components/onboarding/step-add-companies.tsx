"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Plus, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField } from "@/components/form-field";
import { EmptyState } from "@/components/empty-state";
import { addCompanySchema, type AddCompanyInput } from "@/lib/validations/onboarding";
import { formatCnpj, isValidCnpj } from "@/lib/cnpj";
import { DETECTED_CERTIFICATES } from "@/lib/fixtures/onboarding";

export type OnboardingCompany = { cnpj: string; name: string; hasMatchingCertificate: boolean };

export function StepAddCompanies({
  companies,
  onAdd,
  onRemove,
  onNext,
  onBack,
}: {
  companies: OnboardingCompany[];
  onAdd: (company: OnboardingCompany) => void;
  onRemove: (cnpj: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddCompanyInput>({
    resolver: zodResolver(addCompanySchema),
    defaultValues: { cnpj: "", name: "" },
  });

  const cnpjValue = watch("cnpj");
  const hasMatchingCertificate =
    isValidCnpj(cnpjValue ?? "") &&
    DETECTED_CERTIFICATES.some(
      (cert) => cert.holderCnpj.replace(/\D/g, "") === cnpjValue.replace(/\D/g, ""),
    );

  async function onSubmit(data: AddCompanyInput) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    onAdd({
      cnpj: data.cnpj,
      name: data.name,
      hasMatchingCertificate,
    });
    reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastre as empresas</CardTitle>
        <CardDescription>
          Informe o CNPJ de cada empresa que será monitorada. Empresas com certificado detectado na
          etapa anterior são vinculadas automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="flex flex-col gap-4 sm:flex-row sm:items-start"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FormField label="CNPJ" htmlFor="cnpj" error={errors.cnpj?.message} className="flex-1">
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
          <FormField
            label="Razão social"
            htmlFor="name"
            error={errors.name?.message}
            className="flex-1"
          >
            <Input
              id="name"
              placeholder="Ex.: Comércio Silva Ltda."
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </FormField>
          <Button type="submit" className="mt-6 shrink-0" disabled={isSubmitting}>
            <Plus />
            Adicionar
          </Button>
        </form>

        {isValidCnpj(cnpjValue ?? "") && (
          <Alert variant={hasMatchingCertificate ? "default" : "destructive"}>
            {hasMatchingCertificate ? <CheckCircle2 className="text-success" /> : <AlertTriangle />}
            <AlertDescription className={hasMatchingCertificate ? "text-foreground" : undefined}>
              {hasMatchingCertificate
                ? "Certificado correspondente encontrado para este CNPJ."
                : "Nenhum certificado detectado para este CNPJ ainda. Você poderá vincular depois, na tela de empresas."}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          {companies.length === 0 ? (
            <EmptyState icon={Building2} title="Nenhuma empresa cadastrada ainda" />
          ) : (
            companies.map((company) => (
              <div
                key={company.cnpj}
                className="border-border flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5"
              >
                <div>
                  <p className="text-foreground text-sm font-medium">{company.name}</p>
                  <p className="text-muted-foreground font-mono text-xs">{company.cnpj}</p>
                </div>
                <div className="flex items-center gap-2">
                  {company.hasMatchingCertificate ? (
                    <span className="text-success flex items-center gap-1 text-xs">
                      <CheckCircle2 className="size-3.5" aria-hidden="true" />
                      Certificado vinculado
                    </span>
                  ) : (
                    <span className="text-warning flex items-center gap-1 text-xs">
                      <AlertTriangle className="size-3.5" aria-hidden="true" />
                      Sem certificado
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onRemove(company.cnpj)}
                  >
                    <Trash2 />
                    <span className="sr-only">Remover</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <Button type="button" onClick={onNext} disabled={companies.length === 0}>
          Continuar
        </Button>
      </CardFooter>
    </Card>
  );
}
