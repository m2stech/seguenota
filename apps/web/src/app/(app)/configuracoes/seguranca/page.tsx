import { PlaceholderPage } from "@/components/placeholder-page";
import { TwoFactorSetup } from "@/components/two-factor-setup";
import { ActiveSessions } from "@/components/active-sessions";

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <PlaceholderPage
        title="Segurança"
        description="Gerencie a verificação em duas etapas e as sessões ativas da sua conta."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <TwoFactorSetup />
        <ActiveSessions />
      </div>
    </div>
  );
}
