"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/form-field";
import {
  createOrganizationSchema,
  type CreateOrganizationInput,
} from "@/lib/validations/onboarding";

const SEGMENTS = [
  { value: "escritorio_contabil", label: "Escritório contábil" },
  { value: "empresa", label: "Empresa" },
  { value: "outro", label: "Outro" },
];

export function StepOrganization({
  defaultValues,
  onNext,
}: {
  defaultValues: CreateOrganizationInput;
  onNext: (data: CreateOrganizationInput) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues,
  });

  async function onSubmit(data: CreateOrganizationInput) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    onNext(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crie sua organização</CardTitle>
        <CardDescription>
          A organização agrupa suas empresas, usuários e agentes no Segue Nota.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-4">
          <FormField label="Nome da organização" htmlFor="name" error={errors.name?.message}>
            <Input
              id="name"
              placeholder="Ex.: Contabilidade Horizonte"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </FormField>
          <FormField label="Segmento" htmlFor="segment" error={errors.segment?.message}>
            <Controller
              control={control}
              name="segment"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="segment" className="w-full" aria-invalid={!!errors.segment}>
                    <SelectValue placeholder="Selecione um segmento">
                      {(value: string) =>
                        SEGMENTS.find((segment) => segment.value === value)?.label
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SEGMENTS.map((segment) => (
                      <SelectItem key={segment.value} value={segment.value}>
                        {segment.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar organização e continuar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
