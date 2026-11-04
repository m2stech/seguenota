"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Wifi } from "lucide-react";
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
import { activateAgentSchema, type ActivateAgentInput } from "@/lib/validations/onboarding";

const MOCK_ACTIVATION_CODE = "ABC-123-XYZ";

export function StepActivateAgent({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ActivateAgentInput>({
    resolver: zodResolver(activateAgentSchema),
    defaultValues: { code: "" },
  });

  async function onSubmit(data: ActivateAgentInput) {
    setServerError(null);
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (data.code.toUpperCase() !== MOCK_ACTIVATION_CODE) {
      setServerError(
        "Código de ativação inválido ou expirado. Gere um novo código e tente novamente.",
      );
      return;
    }

    setConnected(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ative o agente com o código</CardTitle>
        <CardDescription>
          Abra o Segue Nota Agent no computador onde instalou e digite o código de ativação exibido
          lá.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {serverError && (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        {connected ? (
          <Alert>
            <Wifi className="text-success" />
            <AlertDescription className="text-foreground">
              Agente conectado com sucesso. Pronto para continuar.
            </AlertDescription>
          </Alert>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField
              label="Código de ativação"
              htmlFor="code"
              error={errors.code?.message}
              hint={`Código de demonstração: ${MOCK_ACTIVATION_CODE}`}
            >
              <Input
                id="code"
                placeholder="XXX-XXX-XXX"
                className="font-mono uppercase"
                aria-invalid={!!errors.code}
                {...register("code")}
              />
            </FormField>
            <Button type="submit" disabled={isSubmitting}>
              <KeyRound />
              {isSubmitting ? "Validando..." : "Ativar agente"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <Button type="button" onClick={onNext} disabled={!connected}>
          Continuar
        </Button>
      </CardFooter>
    </Card>
  );
}
