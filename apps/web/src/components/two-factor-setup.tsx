"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, ShieldCheck, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { totpVerifySchema, type TotpVerifyInput } from "@/lib/validations/auth";
import { toast } from "sonner";

const MOCK_SECRET = "JBSW Y3DP EHPK 3PXP";

type TwoFactorState = "disabled" | "setup" | "enabled";

export function TwoFactorSetup() {
  const [state, setState] = useState<TwoFactorState>("disabled");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
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

    setState("enabled");
    toast.success("Verificação em duas etapas ativada.");
  }

  async function handleDisable() {
    await new Promise((resolve) => setTimeout(resolve, 400));
    setState("disabled");
    toast.success("Verificação em duas etapas desativada.");
  }

  function handleCopySecret() {
    navigator.clipboard?.writeText(MOCK_SECRET.replace(/\s/g, ""));
    toast.success("Chave copiada para a área de transferência.");
  }

  if (state === "enabled") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="text-success size-4" aria-hidden="true" />
            Verificação em duas etapas ativada
          </CardTitle>
          <CardDescription>
            Sua conta está protegida com um aplicativo autenticador (TOTP).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleDisable}>
            <ShieldOff />
            Desativar verificação em duas etapas
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (state === "setup") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configurar aplicativo autenticador</CardTitle>
          <CardDescription>
            Escaneie o QR Code com seu aplicativo autenticador (Google Authenticator, Authy,
            1Password) ou digite a chave manualmente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-border bg-muted/40 flex items-center justify-center rounded-lg border border-dashed py-8">
            <div
              role="img"
              aria-label="QR Code de configuração do autenticador"
              className="bg-background ring-border grid size-36 grid-cols-6 grid-rows-6 gap-1 rounded p-2 ring-1"
            >
              {Array.from({ length: 36 }).map((_, index) => (
                <div
                  key={index}
                  className={(index * 7) % 3 === 0 ? "bg-foreground rounded-xs" : ""}
                />
              ))}
            </div>
          </div>
          <div className="border-border bg-muted/30 flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
            <code className="text-sm tracking-wide">{MOCK_SECRET}</code>
            <Button type="button" variant="ghost" size="icon-sm" onClick={handleCopySecret}>
              <Copy />
              <span className="sr-only">Copiar chave</span>
            </Button>
          </div>

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
            <p className="text-foreground text-sm font-medium">
              Digite o código gerado pelo aplicativo para confirmar
            </p>
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
            <div className="flex w-full gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  reset();
                  setServerError(null);
                  setState("disabled");
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Confirmando..." : "Confirmar e ativar"}
              </Button>
            </div>
          </form>
          <p className="text-muted-foreground text-center text-xs">
            Código de demonstração: <span className="font-mono">123456</span>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificação em duas etapas</CardTitle>
        <CardDescription>
          Adicione uma camada extra de segurança exigindo um código do seu aplicativo autenticador
          ao entrar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setState("setup")}>
          <ShieldCheck />
          Ativar verificação em duas etapas
        </Button>
      </CardContent>
    </Card>
  );
}
