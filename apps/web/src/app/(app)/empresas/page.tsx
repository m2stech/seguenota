import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompaniesTab } from "@/components/companies/companies-tab";
import { AgentsCertificatesTab } from "@/components/companies/agents-certificates-tab";
import { MembersTab } from "@/components/companies/members-tab";

export default function EmpresasPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Empresas e agentes</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie empresas, agentes, certificados e usuários da organização.
        </p>
      </div>

      <Tabs defaultValue="empresas">
        <TabsList>
          <TabsTrigger value="empresas">Empresas</TabsTrigger>
          <TabsTrigger value="agentes">Agentes e certificados</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários e permissões</TabsTrigger>
        </TabsList>
        <TabsContent value="empresas">
          <CompaniesTab />
        </TabsContent>
        <TabsContent value="agentes">
          <AgentsCertificatesTab />
        </TabsContent>
        <TabsContent value="usuarios">
          <MembersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
