import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { LanguageProvider } from "@/components/shared/LanguageProvider";

export const metadata: Metadata = {
  title: "Baraka | Enterprise Operations Platform",
  description: "Unified enterprise platform for operations, finance, procurement, inventory and control management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
