"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminSettings() {
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const handleSaveProfile = () => {
    // TODO: replace with tRPC mutation
    console.log("Saving profile:", { name, email });
  };

  const handleResetSystem = () => {
    const confirmed = confirm(
      "Are you sure you want to reset system settings?",
    );
    if (!confirmed) return;

    // TODO: system reset logic
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
          {" "}
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Einstellungen</h1>
        <p className="text-muted-foreground">
          Verwalte dein System und dein Profil
        </p>
      </div>

      {/* PROFILE SETTINGS */}
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">E-Mail</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.com"
            />
          </div>

          <Button onClick={handleSaveProfile}>Speichern</Button>
        </CardContent>
      </Card>

      {/* SYSTEM SETTINGS */}
      <Card>
        <CardHeader>
          <CardTitle>System</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Systemweite Einstellungen (später erweiterbar)
          </p>

          <div className="flex gap-3">
            <Button variant="outline">Cache leeren</Button>

            <Button variant="outline">Logs anzeigen</Button>
          </div>
        </CardContent>
      </Card>

      {/* DANGER ZONE */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Diese Aktionen sind nicht rückgängig zu machen.
          </p>

          <Button variant="destructive" onClick={handleResetSystem}>
            System zurücksetzen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
