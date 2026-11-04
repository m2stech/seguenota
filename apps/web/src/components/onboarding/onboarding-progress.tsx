import { Check } from "lucide-react";
import { cn } from "cn";

export const ONBOARDING_STEPS = [
  "Organização",
  "Instalar agente",
  "Ativar agente",
  "Certificados",
  "Empresas",
  "Competência inicial",
  "Sincronização",
] as const;

export function OnboardingProgress({ currentStep }: { currentStep: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2" aria-label="Progresso da configuração inicial">
      {ONBOARDING_STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <li key={step} className="flex flex-1 items-center gap-2">
            <div
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                isDone && "bg-primary text-primary-foreground",
                isCurrent && "border-primary text-primary border-2",
                !isDone && !isCurrent && "border-border text-muted-foreground border",
              )}
            >
              {isDone ? <Check className="size-3.5" aria-hidden="true" /> : stepNumber}
            </div>
            <span
              className={cn(
                "hidden text-xs font-medium sm:inline",
                isCurrent ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step}
            </span>
            {stepNumber < ONBOARDING_STEPS.length && (
              <div className={cn("h-px flex-1", isDone ? "bg-primary" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
