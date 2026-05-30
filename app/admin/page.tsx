"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) router.push("/");
  }, [user, isLoading, router]);

  const { data: users, refetch } = trpc.user.list.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
  const updateRole = trpc.user.updateRole.useMutation({ onSuccess: () => refetch() });
  const deleteUser = trpc.user.delete.useMutation({ onSuccess: () => refetch() });

  if (isLoading || !user || user.role !== "admin") return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Benutzerverwaltung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users?.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={u.role}
                    onValueChange={(role) =>
                      updateRole.mutate({ userId: u.id, role: role as "user" | "admin" })
                    }
                    disabled={u.id === user.id}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Benutzer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={u.id === user.id}
                    onClick={() => {
                      if (confirm(`${u.name} löschen?`)) deleteUser.mutate({ userId: u.id });
                    }}
                  >
                    Löschen
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
