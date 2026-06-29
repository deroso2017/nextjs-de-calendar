import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboard() {
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
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Übersicht über dein System</p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Benutzer</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{totalUsers}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admins</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{adminUsers}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Normale Nutzer</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {normalUsers}
          </CardContent>
        </Card>
      </div>

      {/* QUICK ACTIONS */}
      <Card>
        <CardHeader>
          <CardTitle>Schnellzugriff</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Link href="/admin/users">
            <Button className="cursor-pointer transition-opacity hover:opacity-60">
              Benutzer verwalten
            </Button>
          </Link>

          <Link href="/admin/settings">
            <Button
              variant="outline"
              className="cursor-pointer transition-opacity hover:opacity-60"
            >
              Einstellungen
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
