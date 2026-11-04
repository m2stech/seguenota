"use client";

import { useState } from "react";
import { Laptop, Smartphone, Monitor, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/empty-state";
import { toast } from "sonner";

type Session = {
  id: string;
  device: string;
  deviceIcon: LucideIcon;
  location: string;
  lastActiveAt: string;
  current: boolean;
};

const INITIAL_SESSIONS: Session[] = [
  {
    id: "session-1",
    device: "Chrome em Windows",
    deviceIcon: Monitor,
    location: "São Paulo, BR",
    lastActiveAt: "Agora",
    current: true,
  },
  {
    id: "session-2",
    device: "Safari em macOS",
    deviceIcon: Laptop,
    location: "São Paulo, BR",
    lastActiveAt: "há 2 dias",
    current: false,
  },
  {
    id: "session-3",
    device: "App Segue Nota em iPhone",
    deviceIcon: Smartphone,
    location: "Campinas, BR",
    lastActiveAt: "há 1 semana",
    current: false,
  },
];

export function ActiveSessions() {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [revokeAllOpen, setRevokeAllOpen] = useState(false);

  function handleRevoke(id: string) {
    setSessions((current) => current.filter((session) => session.id !== id));
    toast.success("Sessão encerrada.");
  }

  function handleRevokeAll() {
    setSessions((current) => current.filter((session) => session.current));
    setRevokeAllOpen(false);
    toast.success("Todas as outras sessões foram encerradas.");
  }

  const otherSessionsCount = sessions.filter((session) => !session.current).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Sessões ativas</CardTitle>
          <CardDescription>Dispositivos conectados à sua conta no momento.</CardDescription>
        </div>
        {otherSessionsCount > 0 && (
          <Dialog open={revokeAllOpen} onOpenChange={setRevokeAllOpen}>
            <Button variant="outline" size="sm" onClick={() => setRevokeAllOpen(true)}>
              Encerrar todas
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Encerrar todas as outras sessões?</DialogTitle>
                <DialogDescription>
                  Isso vai desconectar todos os outros dispositivos. Você precisará entrar novamente
                  neles.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
                <Button variant="destructive" onClick={handleRevokeAll}>
                  Encerrar todas
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {sessions.length === 0 ? (
          <EmptyState icon={Monitor} title="Nenhuma sessão ativa" />
        ) : (
          sessions.map((session) => {
            const Icon = session.deviceIcon;
            return (
              <div
                key={session.id}
                className="border-border flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-muted-foreground size-4" aria-hidden="true" />
                  <div>
                    <p className="text-foreground text-sm font-medium">
                      {session.device}
                      {session.current && (
                        <Badge variant="outline" className="border-success/30 text-success ml-2">
                          Sessão atual
                        </Badge>
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {session.location} · {session.lastActiveAt}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="ghost" size="sm" onClick={() => handleRevoke(session.id)}>
                    Encerrar
                  </Button>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
