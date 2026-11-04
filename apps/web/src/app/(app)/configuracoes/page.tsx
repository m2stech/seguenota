import Link from "next/link";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Card, CardContent } from "@/components/ui/card";

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <PlaceholderPage
        title="Configurações"
        description="Preferências de conta e organização chegam nos próximos milestones."
      />
      <Card>
        <CardContent>
          <Link
            href="/configuracoes/seguranca"
            className="hover:bg-muted flex items-center justify-between gap-4 rounded-lg px-1 py-1 text-sm"
          >
            <span className="text-foreground flex items-center gap-2 font-medium">
              <ShieldCheck className="text-muted-foreground size-4" aria-hidden="true" />
              Segurança (2FA e sessões ativas)
            </span>
            <ChevronRight className="text-muted-foreground size-4" aria-hidden="true" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
