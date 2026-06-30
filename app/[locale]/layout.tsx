import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";

import "../globals.css";
import { TRPCProvider } from "@/components/TRPCProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CalendarProvider } from "@/contexts/CalendarContext";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DE Kalender",
  description: "Deutscher Kalender mit Feiertagen",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // ✅ Load correct messages per locale (fix for your issue)
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TRPCProvider>
            <AuthProvider>
              <ThemeProvider>
                <CalendarProvider>
                  <div className="min-h-screen bg-background text-foreground">
                    <Navbar />
                    {children}
                  </div>
                </CalendarProvider>
              </ThemeProvider>
            </AuthProvider>
          </TRPCProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
