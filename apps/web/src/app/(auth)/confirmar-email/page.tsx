"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "seu e-mail";
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  async function handleResend() {
    setIsResending(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsResending(false);
    setResendCount((count) => count + 1);
    toast.success("E-mail de confirmação reenviado.");
  }

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
          <MailCheck className="size-6" aria-hidden="true" />
        </span>
        <CardTitle>Confirme seu e-mail</CardTitle>
        <CardDescription>
          Enviamos um link de confirmação para{" "}
          <span className="text-foreground font-medium">{email}</span>. Clique no link para ativar
          sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={isResending || resendCount >= 3}
        >
          {isResending
            ? "Reenviando..."
            : resendCount >= 3
              ? "Limite de reenvios atingido"
              : "Reenviar e-mail de confirmação"}
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          Errou o e-mail?{" "}
          <Link href="/cadastro" className="text-primary font-medium hover:underline">
            Cadastre-se novamente
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
