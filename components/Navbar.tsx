"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc/client";
import { Button } from "./ui/button";
import { Moon, Sun, Calendar, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Navbar");

  const signoutMutation = trpc.auth.signout.useMutation({
    onSuccess: () => {
      signOut();
      router.push("/auth/signin");
    },
  });

  const currentLocale = pathname.split("/")[1] || "en";

  const changeLocale = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  };

  const getFlag = (locale: string) => {
    switch (locale) {
      case "de":
        return "🇩🇪";
      case "en":
      default:
        return "🇬🇧";
    }
  };

  return (
    <nav className="border-b bg-background px-4 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
        <Calendar className="h-5 w-5 text-primary" />
        <span>{t("title")}</span>
      </Link>

      <div className="flex items-center gap-2">
        {/* LANGUAGE */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer text-lg"
              aria-label={t("language")}
            >
              <span>{getFlag(currentLocale)}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={() => changeLocale("en")}
              className={cn(
                currentLocale === "en" && "font-semibold",
                "cursor-pointer",
              )}
            >
              🇬🇧 <span className="ml-2">{t("english")}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => changeLocale("de")}
              className={cn(
                currentLocale === "de" && "font-semibold",
                "cursor-pointer",
              )}
            >
              🇩🇪 <span className="ml-2">{t("german")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* THEME */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={t("toggleTheme")}
          className="cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {user ? (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/weather">{t("weather")}</Link>
            </Button>

            {user.role === "admin" && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin">
                  <Settings className="h-4 w-4 mr-1" />
                  {t("admin")}
                </Link>
              </Button>
            )}

            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.name} ({user.role})
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => signoutMutation.mutate()}
              disabled={signoutMutation.isPending}
              className="cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-1" />
              {t("logout")}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="cursor-pointer"
            >
              <Link href="/auth/signin">{t("login")}</Link>
            </Button>

            <Button size="sm" asChild className="cursor-pointer">
              <Link href="/auth/signup">{t("register")}</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
