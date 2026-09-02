"use client";

import { Bell, Search, HelpCircle } from "lucide-react";
import { usePathname } from "next/navigation";

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

export default function Topbar() {
  const pathname = usePathname();
  const crumbs = BREADCRUMB_MAP[pathname] ?? ["Platform"];

  return (
    <div className="topbar">
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ margin: 0, flex: 1 }}>
        <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
          {crumbs.slice(0, -1).map((c, i) => (
            <span key={i}>
              {c}
              <span className="breadcrumb-sep" style={{ margin: "0 6px" }}>/</span>
            </span>
          ))}
        </span>
        <span className="breadcrumb-current">{crumbs[crumbs.length - 1]}</span>
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
        <input placeholder="Search records, orders, invoices…" />
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
        <button className="notif-btn" title="Notifications">
          <Bell size={16} style={{ color: "var(--color-text-secondary)" }} />
          <span className="notif-dot" />
        </button>

        <button className="notif-btn" title="Help">
          <HelpCircle size={16} style={{ color: "var(--color-text-secondary)" }} />
        </button>
      </div>
    </div>
  );
}
