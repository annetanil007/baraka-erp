"use client";

import { Bell, Search, HelpCircle, X, Languages, ArrowRight, FilePlus2, BarChart3, Boxes, UsersRound, WalletCards, Plus, Download, Clock3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { mockApprovals } from "@/lib/mock-data";

const BREADCRUMB_MAP: Record<string, string[]> = {
  "/": ["Dashboard"],
  "/operations/sales": ["Operations", "Sales"],
  "/operations/customers": ["Operations", "Customers"],
  "/operations/inventory": ["Operations", "Inventory"],
  "/operations/inventory/intelligence": ["Operations", "Inventory Intelligence"],
  "/operations/transfers": ["Operations", "Transfers"],
  "/procurement/requests": ["Procurement", "Purchase Requests"],
  "/procurement/orders": ["Procurement", "Purchase Orders"],
  "/procurement/suppliers": ["Procurement", "Suppliers"],
  "/procurement/receiving": ["Procurement", "Receiving"],
  "/finance/accounts": ["Finance", "Accounts"],
  "/finance/invoices": ["Finance", "Invoices"],
  "/finance/payments": ["Finance", "Payments"],
  "/finance/expenses": ["Finance", "Expenses"],
  "/finance/cash-flow": ["Finance", "Cash Flow"],
  "/finance/cogs": ["Finance", "Cost of Goods Sold"],
  "/control/exceptions": ["Control", "Exceptions"],
  "/control/reviews": ["Control", "Reviews"],
  "/control/approvals": ["Control", "Approvals"],
  "/control/reconciliation": ["Control", "Reconciliation"],
  "/reports/operational": ["Reports", "Operational Reports"],
  "/reports/financial": ["Reports", "Financial Reports"],
  "/reports/inventory": ["Reports", "Inventory Reports"],
  "/reports/executive": ["Reports", "Executive Intelligence"],
  "/admin/users": ["Administration", "Users"],
  "/admin/roles": ["Administration", "Roles & Permissions"],
  "/admin/branches": ["Administration", "Branches"],
  "/admin/settings": ["Administration", "System Settings"],
};

const ARABIC_CRUMBS: Record<string, string> = { Dashboard: "لوحة التحكم", Operations: "العمليات", Sales: "المبيعات", Customers: "العملاء", Inventory: "المخزون", "Inventory Intelligence": "ذكاء المخزون", Transfers: "التحويلات", Procurement: "المشتريات", "Purchase Requests": "طلبات الشراء", "Purchase Orders": "أوامر الشراء", Suppliers: "الموردون", Receiving: "الاستلام", Finance: "المالية", Accounts: "الحسابات", Invoices: "الفواتير", Payments: "المدفوعات", Expenses: "المصروفات", "Cash Flow": "التدفق النقدي", Control: "الرقابة", Exceptions: "الاستثناءات", Reviews: "المراجعات", Approvals: "الموافقات", Reconciliation: "التسوية", Reports: "التقارير", "Operational Reports": "التقارير التشغيلية", "Financial Reports": "التقارير المالية", "Inventory Reports": "تقارير المخزون", "Executive Intelligence": "الذكاء التنفيذي", Administration: "الإدارة", Users: "المستخدمون", "Roles & Permissions": "الأدوار والصلاحيات", Branches: "الفروع", "System Settings": "إعدادات النظام" };

type CommandItem = { label: string; detail: string; href?: string; icon: React.ElementType; keywords?: string; action?: "create" | "export" };
type WorkflowNotification = { id: string; title: string; detail: string; href: string; tone: "danger" | "warning" | "info" };

const COMMAND_ITEMS: CommandItem[] = [
  { label: "Owner Command Center", detail: "Dashboard", href: "/", icon: BarChart3, keywords: "home overview pulse" },
  { label: "Sales Orders", detail: "Operations", href: "/operations/sales", icon: FilePlus2, keywords: "sale order revenue" },
  { label: "Inventory", detail: "Operations", href: "/operations/inventory", icon: Boxes, keywords: "stock products parts" },
  { label: "Inventory Intelligence", detail: "Operations", href: "/operations/inventory/intelligence", icon: Boxes, keywords: "reorder dead stock transfer forecast" },
  { label: "Cost of Goods Sold", detail: "Finance", href: "/finance/cogs", icon: BarChart3, keywords: "cogs margin profit costing" },
  { label: "Cash Flow Center", detail: "Finance", href: "/finance/cash-flow", icon: WalletCards, keywords: "cash liquidity forecast collections payments" },
  { label: "Customers", detail: "Operations", href: "/operations/customers", icon: UsersRound, keywords: "clients accounts" },
  { label: "Financial Reports", detail: "Reports", href: "/reports/financial", icon: BarChart3, keywords: "finance report profit" },
  { label: "Executive Intelligence", detail: "Reports", href: "/reports/executive", icon: BarChart3, keywords: "briefing changes branch margin cash owner" },
  { label: "Open Exceptions", detail: "Control", href: "/control/exceptions", icon: Bell, keywords: "risk issue alert" },
  { label: "Create new record", detail: "Action", icon: Plus, action: "create", keywords: "add new create record" },
  { label: "Export current view", detail: "Action", icon: Download, action: "export", keywords: "download csv spreadsheet" },
  { label: "Show overdue items", detail: "Action", href: "/control/exceptions", icon: Clock3, keywords: "late overdue urgent follow up" },
];

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const crumbs = BREADCRUMB_MAP[pathname] ?? ["Platform"];
  const [panel, setPanel] = useState<"notifications" | "help" | null>(null);
  const { language, toggleLanguage } = useLanguage();
  const displayCrumb = (crumb: string) => language === "ar" ? ARABIC_CRUMBS[crumb] || crumb : crumb;
  const searchRef = useRef<HTMLInputElement>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [approvals] = useLocalStorage("baraka:approvals", mockApprovals);
  const [dismissedNotifications, setDismissedNotifications] = useLocalStorage<string[]>("baraka:dismissed-notifications", []);
  const filteredCommands = COMMAND_ITEMS.filter((item) => `${item.label} ${item.detail} ${item.keywords ?? ""}`.toLowerCase().includes(query.toLowerCase())).slice(0, 7);
  const notificationCandidates: WorkflowNotification[] = [
    ...approvals.filter((approval) => approval.status === "Pending").slice(0, 3).map<WorkflowNotification>((approval) => ({
      id: `approval-${approval.id}`,
      title: `Approval waiting: ${approval.reference}`,
      detail: `${approval.riskLevel} risk · ${approval.requestedBy}`,
      href: "/control/approvals",
      tone: approval.riskLevel === "Critical" || approval.riskLevel === "High" ? "danger" as const : "warning" as const,
    })),
    { id: "inventory-shortfall", title: "Inventory shortfall projected", detail: "PROD-0441 · review reorder plan", href: "/operations/inventory/intelligence", tone: "info" },
  ];
  const workflowNotifications = notificationCandidates.filter((notification) => !dismissedNotifications.includes(notification.id));
  const dismissNotification = (id: string) => setDismissedNotifications((current) => [...current, id]);
  const openCommand = () => { setCommandOpen(true); setQuery(""); setActiveIndex(0); };
  const runCommand = (item: CommandItem) => {
    setCommandOpen(false);
    if (item.action) window.dispatchEvent(new CustomEvent("baraka:module-action", { detail: { action: item.action } }));
    else if (item.href) router.push(item.href);
  };
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openCommand();
      }
      if (event.key === "Escape") setCommandOpen(false);
    };
    const handleCommandEvent = () => openCommand();
    window.addEventListener("keydown", handleShortcut);
    window.addEventListener("baraka:open-command", handleCommandEvent);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
      window.removeEventListener("baraka:open-command", handleCommandEvent);
    };
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
      <button className="search-bar topbar-search-trigger" type="button" onClick={openCommand} aria-label="Open command search">
        <Search size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
        <span>Search records, orders, invoices…</span>
        <kbd>⌘K</kbd>
      </button>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
        <button className="language-toggle" type="button" onClick={toggleLanguage} title={language === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"} aria-label={language === "en" ? "Switch to Arabic" : "Switch to English"}><Languages size={15} /><span>{language === "en" ? "العربية" : "English"}</span></button>
        <button className="notif-btn" title="Notifications" onClick={() => setPanel(panel === "notifications" ? null : "notifications")}>
          <Bell size={16} style={{ color: "var(--color-text-secondary)" }} />
          {workflowNotifications.length > 0 && <span className="notif-dot" />}
        </button>

        <button className="notif-btn" title="Help" onClick={() => setPanel(panel === "help" ? null : "help")}>
          <HelpCircle size={16} style={{ color: "var(--color-text-secondary)" }} />
        </button>
      </div>
      {panel && <div className="topbar-popover">
        <div className="popover-header"><strong>{panel === "notifications" ? "Notifications" : "Help centre"}</strong><button type="button" onClick={() => setPanel(null)} aria-label="Close"><X size={14} /></button></div>
        {panel === "notifications" ? <>{workflowNotifications.length > 0 ? workflowNotifications.map((notification) => <div className="popover-item workflow-notification" key={notification.id}><button type="button" className="workflow-notification-link" onClick={() => { setPanel(null); router.push(notification.href); }}><span className={`notif-indicator ${notification.tone}`} /><span><strong>{notification.title}</strong><small>{notification.detail}</small></span></button><button type="button" className="notification-dismiss" aria-label={`Dismiss ${notification.title}`} onClick={() => dismissNotification(notification.id)}><X size={12} /></button></div>) : <div className="popover-copy">You’re all caught up. No workflow reminders need your attention.</div>}<div className="popover-footer">{workflowNotifications.length} active workflow reminder{workflowNotifications.length === 1 ? "" : "s"}</div></> : <><p className="popover-copy">Need help with a workflow?</p><button className="btn btn-secondary btn-sm" onClick={() => setPanel(null)}>Contact platform support</button></>}
      </div>}
      {commandOpen && <div className="command-backdrop" role="presentation" onClick={() => setCommandOpen(false)}>
        <div className="command-palette" role="dialog" aria-modal="true" aria-label="Command search" onClick={(event) => event.stopPropagation()}>
          <div className="command-input-row"><Search size={17} /><input ref={searchRef} autoFocus value={query} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setActiveIndex((index) => Math.min(index + 1, filteredCommands.length - 1)); } if (event.key === "ArrowUp") { event.preventDefault(); setActiveIndex((index) => Math.max(index - 1, 0)); } if (event.key === "Enter" && filteredCommands[activeIndex]) runCommand(filteredCommands[activeIndex]); }} placeholder="Search pages, records, or actions..." /></div>
          <div className="command-hint">Jump anywhere in Baraka <span><kbd>↑</kbd><kbd>↓</kbd> navigate <kbd>↵</kbd> open <kbd>esc</kbd> close</span></div>
          <div className="command-results">{filteredCommands.length > 0 ? filteredCommands.map((item, index) => <button type="button" className={`command-result ${index === activeIndex ? "active" : ""}`} key={`${item.label}-${item.href ?? item.action}`} onMouseEnter={() => setActiveIndex(index)} onClick={() => runCommand(item)}><span className="command-result-icon"><item.icon size={15} /></span><span><strong>{item.label}</strong><small>{item.detail}</small></span><ArrowRight size={14} className="command-result-arrow" /></button>) : <div className="command-empty">No destinations match “{query}”.</div>}</div>
        </div>
      </div>}
    </div>
  );
}
