import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
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
          <div className="app-shell">
            <Sidebar />
            <div className="main-content">
              <Topbar />
              <div className="page-body">{children}</div>
            </div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
