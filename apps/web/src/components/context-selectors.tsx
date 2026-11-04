"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = { id: string; label: string };

const ORGANIZATIONS: Option[] = [
  { id: "org-1", label: "Contabilidade Alfa" },
  { id: "org-2", label: "Contabilidade Beta" },
];

const COMPANIES: Option[] = [
  { id: "company-1", label: "Comércio Silva Ltda — 12.345.678/0001-90" },
  { id: "company-2", label: "Serviços Nova Era ME — 98.765.432/0001-10" },
];

const COMPETENCES: Option[] = [
  { id: "2026-11", label: "Nov/2026" },
  { id: "2026-10", label: "Out/2026" },
  { id: "2026-09", label: "Set/2026" },
];

function LabeledSelect({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}) {
  const labelByid = Object.fromEntries(options.map((option) => [option.id, option.label]));

  return (
    <Select value={value} onValueChange={(next) => next && onChange(next)}>
      <SelectTrigger className={className} aria-label={ariaLabel}>
        <SelectValue>{(selected: string) => labelByid[selected]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ContextSelectors() {
  const [organization, setOrganization] = useState(ORGANIZATIONS[0].id);
  const [company, setCompany] = useState(COMPANIES[0].id);
  const [competence, setCompetence] = useState(COMPETENCES[0].id);

  return (
    <div className="flex items-center gap-2">
      <LabeledSelect
        options={ORGANIZATIONS}
        value={organization}
        onChange={setOrganization}
        ariaLabel="Organização"
        className="w-44"
      />
      <LabeledSelect
        options={COMPANIES}
        value={company}
        onChange={setCompany}
        ariaLabel="Empresa"
        className="w-56"
      />
      <LabeledSelect
        options={COMPETENCES}
        value={competence}
        onChange={setCompetence}
        ariaLabel="Competência"
        className="w-28"
      />
    </div>
  );
}
