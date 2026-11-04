import { FileText } from "lucide-react";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/30 flex min-h-full flex-1 flex-col">
      <header className="border-border bg-background flex items-center gap-2 border-b px-6 py-4">
        <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg">
          <FileText className="size-4" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold tracking-tight">Segue Nota</span>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
