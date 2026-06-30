"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function AdminSettings() {
  const t = useTranslations("AdminSettings");
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const handleSaveProfile = () => {
    console.log("Saving profile:", { name, email });
  };

  const handleResetSystem = () => {
    const confirmed = confirm(t("resetConfirm"));
    if (!confirmed) return;

    console.log("System reset triggered");
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
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

        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      {/* PROFILE SETTINGS */}
      <Card>
        <CardHeader>
          <CardTitle>{t("profile")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("name")}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("name")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("email")}</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email")}
            />
          </div>

          <Button onClick={handleSaveProfile}>{t("save")}</Button>
        </CardContent>
      </Card>

      {/* SYSTEM SETTINGS */}
      <Card>
        <CardHeader>
          <CardTitle>{t("system")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{t("systemHint")}</p>

          <div className="flex gap-3">
            <Button variant="outline">{t("clearCache")}</Button>
            <Button variant="outline">{t("showLogs")}</Button>
          </div>
        </CardContent>
      </Card>

      {/* DANGER ZONE */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">{t("danger")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{t("dangerHint")}</p>

          <Button variant="destructive" onClick={handleResetSystem}>
            {t("resetSystem")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
