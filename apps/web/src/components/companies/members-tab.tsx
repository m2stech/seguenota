"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users, UserPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormField } from "@/components/form-field";
import { EmptyState } from "@/components/empty-state";
import {
  inviteMemberSchema,
  type InviteMemberInput,
} from "@/lib/validations/companies";
import {
  MEMBERS,
  ORGANIZATION_ROLE_LABELS,
  type Member,
  type OrganizationRole,
} from "@/lib/fixtures/companies";

export function MembersTab() {
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { name: "", email: "", role: "usuario_consulta" },
  });

  const roleValue = watch("role");

  async function onSubmit(data: InviteMemberInput) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    setMembers((current) => [
      {
        id: `member-${current.length + 1}`,
        name: data.name,
        email: data.email,
        role: data.role,
        companyIds: data.role === "admin_organizacao" ? "all" : [],
        invitedAt: new Date().toISOString().slice(0, 10),
        status: "convite_pendente",
      },
      ...current,
    ]);
    reset();
    setDialogOpen(false);
  }

  function removeMember(memberId: string) {
    setMembers((current) => current.filter((member) => member.id !== memberId));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Usuários da organização e seu perfil de permissão: Admin Organização, Operador Fiscal ou
          Usuário de Consulta.
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />}>
            <UserPlus />
            Convidar usuário
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar usuário</DialogTitle>
              <DialogDescription>
                O usuário recebe um convite por e-mail para definir a senha e, se exigido, o TOTP.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormField label="Nome" htmlFor="name" error={errors.name?.message}>
                <Input id="name" placeholder="Nome completo" {...register("name")} />
              </FormField>
              <FormField label="E-mail" htmlFor="email" error={errors.email?.message}>
                <Input id="email" type="email" placeholder="nome@empresa.com.br" {...register("email")} />
              </FormField>
              <FormField label="Perfil" htmlFor="role" error={errors.role?.message}>
                <Select
                  value={roleValue}
                  onValueChange={(value) => setValue("role", value as OrganizationRole)}
                >
                  <SelectTrigger id="role" className="w-full" aria-label="Perfil">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ORGANIZATION_ROLE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  Enviar convite
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {members.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum usuário nesta organização" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Empresas</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{ORGANIZATION_ROLE_LABELS[member.role]}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {member.companyIds === "all" ? "Todas" : `${member.companyIds.length} empresa(s)`}
                </TableCell>
                <TableCell>
                  {member.status === "ativo" ? (
                    <Badge variant="outline" className="border-success/30 text-success">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-warning/30 text-warning">
                      Convite pendente
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeMember(member.id)}
                  >
                    <Trash2 />
                    <span className="sr-only">Remover</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
