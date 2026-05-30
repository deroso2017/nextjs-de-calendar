"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar, LogIn, UserPlus } from "lucide-react";

const CalendarView = dynamic(
  () => import("@/components/CalendarView").then((m) => m.CalendarView),
  { loading: () => <div className="h-96 flex items-center justify-center text-muted-foreground">Kalender wird geladen...</div> }
);

export function HomeGate() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        Wird geladen...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-6">
            <Calendar className="h-14 w-14 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Willkommen beim DE Kalender</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Entdecke alle deutschen Feiertage für jedes Bundesland. Melde dich an oder erstelle ein Konto, um loszulegen.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" asChild>
            <Link href="/auth/signin">
              <LogIn className="h-5 w-5 mr-2" />
              Anmelden
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/signup">
              <UserPlus className="h-5 w-5 mr-2" />
              Registrieren
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 max-w-2xl w-full text-left">
          {[
            { title: "Alle Bundesländer", desc: "Feiertage für alle 16 Bundesländer auf einen Blick." },
            { title: "Immer aktuell", desc: "Bewegliche Feiertage wie Ostern werden automatisch berechnet." },
            { title: "Dark Mode", desc: "Angenehme Ansicht bei Tag und Nacht." },
          ].map((f) => (
            <div key={f.title} className="rounded-lg border p-4 space-y-1">
              <p className="font-semibold text-sm">{f.title}</p>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <CalendarView />
    </main>
  );
}
