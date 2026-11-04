"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/form-field";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: ForgotPasswordInput) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSentTo(data.email);
  }

  if (sentTo) {
    return (
      <Card>
        <CardHeader className="items-center text-center">
          <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
            <MailCheck className="size-6" aria-hidden="true" />
          </span>
          <CardTitle>Verifique seu e-mail</CardTitle>
          <CardDescription>
            Se existir uma conta para <span className="text-foreground font-medium">{sentTo}</span>,
            enviamos um link para redefinir a senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login" className="text-primary text-sm font-medium hover:underline">
            Voltar para o login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar senha</CardTitle>
        <CardDescription>
          Informe o e-mail da sua conta e enviaremos um link para redefinir a senha.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
          </Button>
        </form>
        <p className="text-muted-foreground text-center text-sm">
          <Link href="/login" className="text-primary font-medium hover:underline">
            Voltar para o login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
