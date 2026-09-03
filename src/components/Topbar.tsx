"use client";

import { Bell, Search, HelpCircle, X, Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

const BREADCRUMB_MAP: Record<string, string[]> = {
  "/": ["Dashboard"],
  "/operations/sales": ["Operations", "Sales"],
  "/operations/customers": ["Operations", "Customers"],
  "/operations/inventory": ["Operations", "Inventory"],
  "/operations/transfers": ["Operations", "Transfers"],
  "/procurement/requests": ["Procurement", "Purchase Requests"],
  "/procurement/orders": ["Procurement", "Purchase Orders"],
  "/procurement/suppliers": ["Procurement", "Suppliers"],
  "/procurement/receiving": ["Procurement", "Receiving"],
  "/finance/accounts": ["Finance", "Accounts"],
  "/finance/invoices": ["Finance", "Invoices"],
  "/finance/payments": ["Finance", "Payments"],
  "/finance/expenses": ["Finance", "Expenses"],
  "/control/exceptions": ["Control", "Exceptions"],
  "/control/reviews": ["Control", "Reviews"],
  "/control/approvals": ["Control", "Approvals"],
  "/control/reconciliation": ["Control", "Reconciliation"],
  "/reports/operational": ["Reports", "Operational Reports"],
  "/reports/financial": ["Reports", "Financial Reports"],
  "/reports/inventory": ["Reports", "Inventory Reports"],
  "/admin/users": ["Administration", "Users"],
  "/admin/roles": ["Administration", "Roles & Permissions"],
  "/admin/branches": ["Administration", "Branches"],
  "/admin/settings": ["Administration", "System Settings"],
};

const ARABIC_CRUMBS: Record<string, string> = { Dashboard: "لوحة التحكم", Operations: "العمليات", Sales: "المبيعات", Customers: "العملاء", Inventory: "المخزون", Transfers: "التحويلات", Procurement: "المشتريات", "Purchase Requests": "طلبات الشراء", "Purchase Orders": "أوامر الشراء", Suppliers: "الموردون", Receiving: "الاستلام", Finance: "المالية", Accounts: "الحسابات", Invoices: "الفواتير", Payments: "المدفوعات", Expenses: "المصروفات", Control: "الرقابة", Exceptions: "الاستثناءات", Reviews: "المراجعات", Approvals: "الموافقات", Reconciliation: "التسوية", Reports: "التقارير", "Operational Reports": "التقارير التشغيلية", "Financial Reports": "التقارير المالية", "Inventory Reports": "تقارير المخزون", Administration: "الإدارة", Users: "المستخدمون", "Roles & Permissions": "الأدوار والصلاحيات", Branches: "الفروع", "System Settings": "إعدادات النظام" };

export default function Topbar() {
  const pathname = usePathname();
  const crumbs = BREADCRUMB_MAP[pathname] ?? ["Platform"];
  const [panel, setPanel] = useState<"notifications" | "help" | null>(null);
  const { language, toggleLanguage } = useLanguage();
  const displayCrumb = (crumb: string) => language === "ar" ? ARABIC_CRUMBS[crumb] || crumb : crumb;
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <div className="topbar">
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ margin: 0, flex: 1 }}>
        <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
          {crumbs.slice(0, -1).map((c, i) => (
            <span key={i}>
              {displayCrumb(c)}
              <span className="breadcrumb-sep" style={{ margin: "0 6px" }}>/</span>
            </span>
          ))}
        </span>
        <span className="breadcrumb-current">{displayCrumb(crumbs[crumbs.length - 1])}</span>
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
        <input ref={searchRef} placeholder="Search records, orders, invoices…" aria-label="Search records" />
        <kbd>⌘K</kbd>
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
        <button className="language-toggle" type="button" onClick={toggleLanguage} title={language === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"} aria-label={language === "en" ? "Switch to Arabic" : "Switch to English"}><Languages size={15} /><span>{language === "en" ? "العربية" : "English"}</span></button>
        <button className="notif-btn" title="Notifications" onClick={() => setPanel(panel === "notifications" ? null : "notifications")}>
          <Bell size={16} style={{ color: "var(--color-text-secondary)" }} />
          <span className="notif-dot" />
        </button>

        <button className="notif-btn" title="Help" onClick={() => setPanel(panel === "help" ? null : "help")}>
          <HelpCircle size={16} style={{ color: "var(--color-text-secondary)" }} />
        </button>
      </div>
      {panel && <div className="topbar-popover">
        <div className="popover-header"><strong>{panel === "notifications" ? "Notifications" : "Help centre"}</strong><button type="button" onClick={() => setPanel(null)} aria-label="Close"><X size={14} /></button></div>
        {panel === "notifications" ? <><div className="popover-item"><span className="notif-indicator danger" /><div><strong>Invoice mismatch requires review</strong><small>INV-S-2026-00882 · 2 min ago</small></div></div><div className="popover-item"><span className="notif-indicator warning" /><div><strong>Inventory shortfall projected</strong><small>PROD-0441 · 18 min ago</small></div></div><div className="popover-footer">12 open exceptions across the platform</div></> : <><p className="popover-copy">Need help with a workflow?</p><button className="btn btn-secondary btn-sm" onClick={() => setPanel(null)}>Contact platform support</button></>}
      </div>}
    </div>
  );
}
