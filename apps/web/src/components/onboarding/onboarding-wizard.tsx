"use client";

import { useState } from "react";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { StepOrganization } from "@/components/onboarding/step-organization";
import { StepInstallAgent } from "@/components/onboarding/step-install-agent";
import { StepActivateAgent } from "@/components/onboarding/step-activate-agent";
import { StepReviewCertificates } from "@/components/onboarding/step-review-certificates";
import {
  StepAddCompanies,
  type OnboardingCompany,
} from "@/components/onboarding/step-add-companies";
import { StepInitialCompetence } from "@/components/onboarding/step-initial-competence";
import { StepStartSync } from "@/components/onboarding/step-start-sync";
import type { CreateOrganizationInput } from "@/lib/validations/onboarding";

type OnboardingState = {
  organization: CreateOrganizationInput;
  companies: OnboardingCompany[];
  competence: string;
};

const INITIAL_STATE: OnboardingState = {
  organization: { name: "", segment: "" },
  companies: [],
  competence: "",
};

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);

  function goTo(nextStep: number) {
    setStep(nextStep);
  }

  return (
    <div>
      <OnboardingProgress currentStep={step} />

      {step === 1 && (
        <StepOrganization
          defaultValues={state.organization}
          onNext={(organization) => {
            setState((current) => ({ ...current, organization }));
            goTo(2);
          }}
        />
      )}

      {step === 2 && <StepInstallAgent onNext={() => goTo(3)} onBack={() => goTo(1)} />}

      {step === 3 && <StepActivateAgent onNext={() => goTo(4)} onBack={() => goTo(2)} />}

      {step === 4 && <StepReviewCertificates onNext={() => goTo(5)} onBack={() => goTo(3)} />}

      {step === 5 && (
        <StepAddCompanies
          companies={state.companies}
          onAdd={(company) =>
            setState((current) => ({ ...current, companies: [...current.companies, company] }))
          }
          onRemove={(cnpj) =>
            setState((current) => ({
              ...current,
              companies: current.companies.filter((company) => company.cnpj !== cnpj),
            }))
          }
          onNext={() => goTo(6)}
          onBack={() => goTo(4)}
        />
      )}

      {step === 6 && (
        <StepInitialCompetence
          value={state.competence}
          onChange={(competence) => setState((current) => ({ ...current, competence }))}
          onNext={() => goTo(7)}
          onBack={() => goTo(5)}
        />
      )}

      {step === 7 && <StepStartSync companies={state.companies} onBack={() => goTo(6)} />}
    </div>
  );
}
