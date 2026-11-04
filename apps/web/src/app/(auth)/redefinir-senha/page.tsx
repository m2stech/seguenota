"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField } from "@/components/form-field";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setDone(true);
  }

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Link inválido</CardTitle>
          <CardDescription>
            Este link de redefinição de senha é inválido ou já expirou. Solicite um novo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => router.push("/recuperar-senha")}>
            Solicitar novo link
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (done) {
    return (
      <Card>
        <CardHeader className="items-center text-center">
          <span className="bg-success/10 text-success flex size-12 items-center justify-center rounded-full">
            <CheckCircle2 className="size-6" aria-hidden="true" />
          </span>
          <CardTitle>Senha redefinida</CardTitle>
          <CardDescription>
            Sua senha foi alterada com sucesso. Entre com a nova senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => router.push("/login")}>
            Ir para o login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Definir nova senha</CardTitle>
        <CardDescription>Escolha uma nova senha para sua conta.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errors.root && (
          <Alert variant="destructive">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField
            label="Nova senha"
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
            label="Confirmar nova senha"
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
            {isSubmitting ? "Salvando..." : "Redefinir senha"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
