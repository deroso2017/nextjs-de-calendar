"use client";

import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Users() {
  const t = useTranslations("Users");

  const { user } = useAuth();
  const router = useRouter();

  const { data: users, refetch } = trpc.user.list.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const updateRole = trpc.user.updateRole.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteUser = trpc.user.delete.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-4">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin")}
          className="cursor-pointer transition-opacity hover:opacity-60"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <h1 className="text-xl font-bold">{t("title")}</h1>
      </div>

      {/* CARD */}
      <Card>
        <CardHeader>
          <CardTitle>{t("users")}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {users?.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={u.role}
                    onValueChange={(role) =>
                      updateRole.mutate({
                        userId: u.id,
                        role: role as "user" | "admin",
                      })
                    }
                    disabled={u.id === user?.id}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={u.id === user?.id}
                    onClick={() => {
                      if (confirm(t("confirmDelete", { name: u.name }))) {
                        deleteUser.mutate({ userId: u.id });
                      }
                    }}
                  >
                    {t("delete")}
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
