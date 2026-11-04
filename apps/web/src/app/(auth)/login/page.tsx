"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField } from "@/components/form-field";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (data.email === "bloqueado@segue.nota") {
      setServerError("E-mail ou senha incorretos.");
      return;
    }

    if (data.email === "2fa@segue.nota") {
      router.push("/2fa/verificar");
      return;
    }

    toast.success("Login realizado com sucesso.");
    router.push("/dashboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>
          Acesse sua conta para gerenciar as NFS-e da sua organização.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {serverError && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
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
          <FormField label="Senha" htmlFor="password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
          </FormField>
          <div className="flex items-center justify-between">
            <Label htmlFor="remember" className="font-normal">
              <Controller
                control={control}
                name="remember"
                render={({ field }) => (
                  <Checkbox id="remember" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              Lembrar de mim
            </Label>
            <Link
              href="/recuperar-senha"
              className="text-primary text-sm font-medium hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <p className="text-muted-foreground text-center text-sm">
          Não tem uma conta?{" "}
          <Link href="/cadastro" className="text-primary font-medium hover:underline">
            Criar conta
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
