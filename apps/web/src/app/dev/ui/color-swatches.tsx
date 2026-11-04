const NEUTRAL_TOKENS = [
  { name: "background", className: "bg-background text-foreground border" },
  { name: "foreground", className: "bg-foreground text-background" },
  { name: "card", className: "bg-card text-card-foreground border" },
  { name: "muted", className: "bg-muted text-muted-foreground" },
  { name: "secondary", className: "bg-secondary text-secondary-foreground" },
  { name: "border", className: "bg-border" },
];

const BRAND_TOKENS = [
  { name: "primary", className: "bg-primary text-primary-foreground" },
  { name: "accent", className: "bg-accent text-accent-foreground" },
  { name: "ring", className: "bg-ring" },
];

const SEMANTIC_TOKENS = [
  { name: "success", className: "bg-success text-success-foreground" },
  { name: "warning", className: "bg-warning text-warning-foreground" },
  { name: "danger", className: "bg-danger text-danger-foreground" },
  { name: "info", className: "bg-info text-info-foreground" },
];

const FISCAL_TOKENS = [
  { name: "status-cancelled", className: "bg-status-cancelled text-status-cancelled-foreground" },
  { name: "status-replaced", className: "bg-status-replaced text-status-replaced-foreground" },
  {
    name: "status-extemporaneous",
    className: "bg-status-extemporaneous text-status-extemporaneous-foreground",
  },
];

const SYNC_TOKENS = [
  { name: "sync-online", className: "bg-sync-online text-sync-online-foreground" },
  { name: "sync-offline", className: "bg-sync-offline text-sync-offline-foreground" },
  { name: "sync-error", className: "bg-sync-error text-sync-error-foreground" },
];

function SwatchGroup({
  title,
  tokens,
}: {
  title: string;
  tokens: { name: string; className: string }[];
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {tokens.map((token) => (
          <div
            key={token.name}
            className={`flex h-16 flex-col justify-end rounded-lg px-3 py-2 text-xs font-medium ${token.className}`}
          >
            {token.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ColorSwatches() {
  return (
    <div className="space-y-6">
      <SwatchGroup title="Neutros" tokens={NEUTRAL_TOKENS} />
      <SwatchGroup title="Marca (índigo/violeta)" tokens={BRAND_TOKENS} />
      <SwatchGroup title="Semânticas" tokens={SEMANTIC_TOKENS} />
      <SwatchGroup title="Situação fiscal" tokens={FISCAL_TOKENS} />
      <SwatchGroup title="Sincronização" tokens={SYNC_TOKENS} />
    </div>
  );
}
