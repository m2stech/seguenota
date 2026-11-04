"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/form-field";
import { acceptInviteSchema, type AcceptInviteInput } from "@/lib/validations/auth";
import { toast } from "sonner";

const MOCK_INVITE = {
  organizationName: "Contabilidade Horizonte",
  inviterName: "Ana Ferreira",
  email: "novo.usuario@horizonte.com.br",
  role: "Operador Fiscal",
};

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInviteInput>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success("Convite aceito. Bem-vindo(a) ao Segue Nota!");
    router.push("/dashboard");
  }

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Convite inválido</CardTitle>
          <CardDescription>Este link de convite é inválido ou já expirou.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
          <Building2 className="size-5" aria-hidden="true" />
        </span>
        <CardTitle>Você foi convidado(a)</CardTitle>
        <CardDescription>
          <span className="text-foreground font-medium">{MOCK_INVITE.inviterName}</span> convidou
          você para a organização{" "}
          <span className="text-foreground font-medium">{MOCK_INVITE.organizationName}</span> como{" "}
          <span className="text-foreground font-medium">{MOCK_INVITE.role}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="E-mail" htmlFor="email" hint="Vinculado automaticamente ao convite.">
          <Input id="email" value={MOCK_INVITE.email} disabled readOnly />
        </FormField>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField
            label="Defina sua senha"
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Aceitar convite e entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={null}>
      <AcceptInviteContent />
    </Suspense>
  );
}
