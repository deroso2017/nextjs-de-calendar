"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc/client";
import { Button } from "./ui/button";
import { Moon, Sun, Calendar, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const signoutMutation = trpc.auth.signout.useMutation({
    onSuccess: () => {
      signOut();
      router.push("/auth/signin");
    },
  });

  return (
    <nav className="border-b bg-background px-4 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
        <Calendar className="h-5 w-5 text-primary" />
        <span>DE Kalender</span>
      </Link>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {user ? (
          <>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.name} ({user.role})
            </span>
            {user.role === "admin" && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin"><Settings className="h-4 w-4 mr-1" />Admin</Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signoutMutation.mutate()}
              disabled={signoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Abmelden
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/signin">Anmelden</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/signup">Registrieren</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
