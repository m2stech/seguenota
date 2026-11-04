import { z } from "zod";

const emailField = z.string().trim().min(1, "Informe o e-mail.").email("Informe um e-mail válido.");

const passwordField = z
  .string()
  .min(8, "A senha precisa ter no mínimo 8 caracteres.")
  .regex(/[A-Z]/, "A senha precisa ter ao menos uma letra maiúscula.")
  .regex(/[0-9]/, "A senha precisa ter ao menos um número.");

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Informe a senha."),
  remember: z.boolean().optional(),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome completo."),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Confirme a senha."),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: "É necessário aceitar os termos de uso.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });
export type SignUpInput = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: emailField,
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, "Confirme a senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const acceptInviteSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, "Confirme a senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;

export const totpVerifySchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, "O código precisa ter 6 dígitos.")
    .regex(/^\d+$/, "O código deve conter apenas números."),
});
export type TotpVerifyInput = z.infer<typeof totpVerifySchema>;
