"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { totpVerifySchema, type TotpVerifyInput } from "@/lib/validations/auth";

export default function VerifyTotpPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TotpVerifyInput>({
    resolver: zodResolver(totpVerifySchema),
    defaultValues: { code: "" },
  });

  async function onSubmit(data: TotpVerifyInput) {
    setServerError(null);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (data.code !== "123456") {
      setServerError("Código incorreto. Verifique seu aplicativo autenticador e tente novamente.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
          <ShieldCheck className="size-6" aria-hidden="true" />
        </span>
        <CardTitle>Verificação em duas etapas</CardTitle>
        <CardDescription>
          Digite o código de 6 dígitos do seu aplicativo autenticador.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {serverError && (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <form
          className="flex flex-col items-center gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} aria-invalid={!!errors.code} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.code && (
            <p className="text-destructive text-xs" role="alert">
              {errors.code.message}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Verificando..." : "Verificar código"}
          </Button>
        </form>
        <p className="text-muted-foreground text-center text-xs">
          Código de demonstração: <span className="font-mono">123456</span>
        </p>
      </CardContent>
    </Card>
  );
}
