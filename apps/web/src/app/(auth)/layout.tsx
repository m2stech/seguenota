import Link from "next/link";
import { FileText } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
      <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
        <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg">
          <FileText className="size-4" aria-hidden="true" />
        </span>
        Segue Nota
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
