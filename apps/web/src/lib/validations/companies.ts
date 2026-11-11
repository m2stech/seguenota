import { z } from "zod";
import { isValidCnpj } from "@/lib/cnpj";

export const createCompanySchema = z.object({
  cnpj: z
    .string()
    .trim()
    .min(1, "Informe o CNPJ.")
    .refine(isValidCnpj, "CNPJ inválido. Verifique os dígitos informados."),
  name: z.string().trim().min(2, "Informe a razão social."),
});
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

export const linkCertificateSchema = z
  .object({
    certificateId: z.string().min(1, "Selecione um certificado."),
    companyId: z.string().min(1, "Selecione uma empresa."),
    certificateHolderCnpj: z.string(),
    companyCnpj: z.string(),
  })
  .refine((data) => data.certificateHolderCnpj.replace(/\D/g, "") === data.companyCnpj.replace(/\D/g, ""), {
    message: "O CNPJ do titular do certificado é diferente do CNPJ da empresa.",
    path: ["certificateId"],
  });
export type LinkCertificateInput = z.infer<typeof linkCertificateSchema>;

export const inviteMemberSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome."),
  email: z.string().trim().min(1, "Informe o e-mail.").email("E-mail inválido."),
  role: z.enum(["admin_organizacao", "operador_fiscal", "usuario_consulta"], {
    error: "Selecione um perfil.",
  }),
});
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
