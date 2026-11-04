import { z } from "zod";
import { isValidCnpj } from "@/lib/cnpj";

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome da organização."),
  segment: z.string().min(1, "Selecione o segmento."),
});
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export const activateAgentSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Informe o código de ativação.")
    .regex(/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/i, "Código inválido. Use o formato XXX-XXX-XXX."),
});
export type ActivateAgentInput = z.infer<typeof activateAgentSchema>;

export const addCompanySchema = z.object({
  cnpj: z
    .string()
    .trim()
    .min(1, "Informe o CNPJ.")
    .refine(isValidCnpj, "CNPJ inválido. Verifique os dígitos informados."),
  name: z.string().trim().min(2, "Informe a razão social."),
});
export type AddCompanyInput = z.infer<typeof addCompanySchema>;
