"use client";

import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function AdminDashboard() {
  const t = useTranslations("AdminDashboard");

  const { user } = useAuth();

  const { data: users } = trpc.user.list.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const totalUsers = users?.length ?? 0;
  const adminUsers = users?.filter((u) => u.role === "admin").length ?? 0;
  const normalUsers = users?.filter((u) => u.role === "user").length ?? 0;

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("users")}</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{totalUsers}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("admins")}</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{adminUsers}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("normalUsers")}</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {normalUsers}
          </CardContent>
        </Card>
      </div>

      {/* QUICK ACTIONS */}
      <Card>
        <CardHeader>
          <CardTitle>{t("quickAccess")}</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-3">
          <Link href="/admin/users">
            <Button className="cursor-pointer transition-opacity hover:opacity-60">
              {t("manageUsers")}
            </Button>
          </Link>

          <Link href="/admin/settings">
            <Button
              variant="outline"
              className="cursor-pointer transition-opacity hover:opacity-60"
            >
              {t("settings")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
