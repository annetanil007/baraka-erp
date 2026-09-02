import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export const metadata: Metadata = {
  title: "Enterprise Management & Control Platform",
  description: "Unified enterprise platform for operations, finance, procurement, inventory and control management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Sidebar />
          <div className="main-content">
            <Topbar />
            <div className="page-body">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
