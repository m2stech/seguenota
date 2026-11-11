export type CompanyStatus = "pendente_vinculo" | "ativa" | "desativada";

export type Company = {
  id: string;
  cnpj: string;
  name: string;
  status: CompanyStatus;
  certificateId: string | null;
  createdAt: string;
};

export const COMPANIES: Company[] = [
  {
    id: "company-1",
    cnpj: "12.345.678/0001-95",
    name: "Contabilidade Horizonte Ltda.",
    status: "ativa",
    certificateId: "cert-1",
    createdAt: "2026-08-12",
  },
  {
    id: "company-2",
    cnpj: "98.765.432/0001-98",
    name: "Comércio Nortex S.A.",
    status: "ativa",
    certificateId: "cert-2",
    createdAt: "2026-08-12",
  },
  {
    id: "company-3",
    cnpj: "45.123.789/0001-33",
    name: "Serviços Nova Era ME",
    status: "pendente_vinculo",
    certificateId: null,
    createdAt: "2026-10-02",
  },
  {
    id: "company-4",
    cnpj: "11.222.333/0001-44",
    name: "Indústria Alvorada Ltda.",
    status: "desativada",
    certificateId: null,
    createdAt: "2026-05-20",
  },
];

export type AgentStatus = "online" | "offline" | "erro" | "nunca_conectado";

export type Agent = {
  id: string;
  name: string;
  status: AgentStatus;
  lastSeenAt: string | null;
  version: string;
  activationCode: string | null;
  companyIds: string[];
};

export const AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "Notebook Financeiro — Mauricio",
    status: "online",
    lastSeenAt: "2026-11-11T09:40:00-03:00",
    version: "1.4.2",
    activationCode: null,
    companyIds: ["company-1"],
  },
  {
    id: "agent-2",
    name: "Servidor Contábil — Matriz",
    status: "erro",
    lastSeenAt: "2026-11-10T22:15:00-03:00",
    version: "1.3.0",
    activationCode: null,
    companyIds: ["company-2"],
  },
  {
    id: "agent-3",
    name: "Estação Fiscal — Backup",
    status: "offline",
    lastSeenAt: "2026-11-05T18:02:00-03:00",
    version: "1.2.5",
    activationCode: null,
    companyIds: [],
  },
];

export type CertificateStatus = "valido" | "vencendo" | "vencido" | "indisponivel";

export type Certificate = {
  id: string;
  thumbprint: string;
  holderCnpj: string;
  holderName: string;
  issuer: string;
  validUntil: string;
  agentId: string;
  companyId: string | null;
};

export const CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    thumbprint: "A1B2C3D4E5F6",
    holderCnpj: "12.345.678/0001-95",
    holderName: "Contabilidade Horizonte Ltda.",
    issuer: "AC SAFEWEB RFB v5",
    validUntil: "2027-01-14",
    agentId: "agent-1",
    companyId: "company-1",
  },
  {
    id: "cert-2",
    thumbprint: "F6E5D4C3B2A1",
    holderCnpj: "98.765.432/0001-98",
    holderName: "Comércio Nortex S.A.",
    issuer: "AC CERTISIGN RFB G5",
    validUntil: "2026-11-25",
    agentId: "agent-2",
    companyId: "company-2",
  },
  {
    id: "cert-3",
    thumbprint: "9F8E7D6C5B4A",
    holderCnpj: "33.444.555/0001-21",
    holderName: "Transportes Rio Claro Ltda.",
    issuer: "AC SAFEWEB RFB v5",
    validUntil: "2026-02-01",
    agentId: "agent-3",
    companyId: null,
  },
];

export function getCertificateStatus(validUntil: string): CertificateStatus {
  const diffDays = Math.ceil(
    (new Date(validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays < 0) return "vencido";
  if (diffDays <= 30) return "vencendo";
  return "valido";
}

export type OrganizationRole = "admin_organizacao" | "operador_fiscal" | "usuario_consulta";

export const ORGANIZATION_ROLE_LABELS: Record<OrganizationRole, string> = {
  admin_organizacao: "Admin Organização",
  operador_fiscal: "Operador Fiscal",
  usuario_consulta: "Usuário de Consulta",
};

export type Member = {
  id: string;
  name: string;
  email: string;
  role: OrganizationRole;
  companyIds: string[] | "all";
  invitedAt: string;
  status: "ativo" | "convite_pendente";
};

export const MEMBERS: Member[] = [
  {
    id: "member-1",
    name: "Mauricio Santos",
    email: "mauricio@contabilidadehorizonte.com.br",
    role: "admin_organizacao",
    companyIds: "all",
    invitedAt: "2026-08-12",
    status: "ativo",
  },
  {
    id: "member-2",
    name: "Juliana Prado",
    email: "juliana@contabilidadehorizonte.com.br",
    role: "operador_fiscal",
    companyIds: ["company-1", "company-2"],
    invitedAt: "2026-08-20",
    status: "ativo",
  },
  {
    id: "member-3",
    name: "Carlos Mendes",
    email: "carlos@contabilidadehorizonte.com.br",
    role: "usuario_consulta",
    companyIds: ["company-1"],
    invitedAt: "2026-11-09",
    status: "convite_pendente",
  },
];
