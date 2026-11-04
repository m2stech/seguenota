"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/form-field";
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";

export default function SignUpPage() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", acceptTerms: false },
  });

  async function onSubmit(data: SignUpInput) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    router.push(`/confirmar-email?email=${encodeURIComponent(data.email)}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>
          Crie sua conta para começar a monitorar as NFS-e da sua organização.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Nome completo" htmlFor="name" error={errors.name?.message}>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Seu nome"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </FormField>
          <FormField label="E-mail" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="voce@empresa.com.br"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </FormField>
          <FormField
            label="Senha"
            htmlFor="password"
            error={errors.password?.message}
            hint="Mínimo 8 caracteres, com letra maiúscula e número."
          >
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
          </FormField>
          <FormField
            label="Confirmar senha"
            htmlFor="confirmPassword"
            error={errors.confirmPassword?.message}
          >
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
          </FormField>
          <div className="space-y-1">
            <Label htmlFor="acceptTerms" className="font-normal">
              <Controller
                control={control}
                name="acceptTerms"
                render={({ field }) => (
                  <Checkbox
                    id="acceptTerms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={!!errors.acceptTerms}
                  />
                )}
              />
              Li e aceito os{" "}
              <Link href="/termos" className="text-primary hover:underline">
                termos de uso
              </Link>
            </Label>
            {errors.acceptTerms && (
              <p className="text-destructive text-xs" role="alert">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>
        <p className="text-muted-foreground text-center text-sm">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
