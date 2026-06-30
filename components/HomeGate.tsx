"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar, LogIn, UserPlus } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { useTranslations } from "next-intl";

type Feature = {
  title: string;
  desc: string;
};

const CalendarView = dynamic(
  () => import("@/components/CalendarView").then((m) => m.CalendarView),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner className="h-10 w-10" />
      </div>
    ),
  },
);

export function HomeGate() {
  const { user, isLoading } = useAuth();
  const t = useTranslations("Home");

  if (isLoading) {
    return <Spinner className="h-10 w-10" />;
  }

  if (!user) {
    const features = t.raw("features") as Feature[];

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-6">
            <Calendar className="h-14 w-14 text-primary" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>

          <p className="text-muted-foreground text-lg max-w-md">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" asChild>
            <Link href="/auth/signin">
              <LogIn className="h-5 w-5 mr-2" />
              {t("login")}
            </Link>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/signup">
              <UserPlus className="h-5 w-5 mr-2" />
              {t("register")}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 max-w-2xl w-full text-left">
          {features.map((f) => (
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
