"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Truck,
  CreditCard, FileText, DollarSign, Receipt,
  AlertTriangle, CheckSquare, GitMerge, ClipboardCheck,
  BarChart2, PieChart, BookOpen, Settings, UserCog,
  Building2, Shield, ChevronDown, ChevronRight,
  TrendingUp, Warehouse,
} from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    label: "Operations",
    icon: TrendingUp,
    children: [
      { label: "Sales", href: "/operations/sales" },
      { label: "Customers", href: "/operations/customers" },
      { label: "Inventory", href: "/operations/inventory" },
      { label: "Transfers", href: "/operations/transfers" },
    ],
  },
  {
    label: "Procurement",
    icon: ShoppingCart,
    children: [
      { label: "Purchase Requests", href: "/procurement/requests" },
      { label: "Purchase Orders", href: "/procurement/orders" },
      { label: "Suppliers", href: "/procurement/suppliers" },
      { label: "Receiving", href: "/procurement/receiving" },
    ],
  },
  {
    label: "Finance",
    icon: DollarSign,
    children: [
      { label: "Accounts", href: "/finance/accounts" },
      { label: "Invoices", href: "/finance/invoices" },
      { label: "Payments", href: "/finance/payments" },
      { label: "Expenses", href: "/finance/expenses" },
    ],
  },
  {
    label: "Control",
    icon: Shield,
    children: [
      { label: "Exceptions", href: "/control/exceptions" },
      { label: "Reviews", href: "/control/reviews" },
      { label: "Approvals", href: "/control/approvals" },
      { label: "Reconciliation", href: "/control/reconciliation" },
    ],
  },
  {
    label: "Reports",
    icon: BarChart2,
    children: [
      { label: "Operational Reports", href: "/reports/operational" },
      { label: "Financial Reports", href: "/reports/financial" },
      { label: "Inventory Reports", href: "/reports/inventory" },
    ],
  },
  {
    label: "Administration",
    icon: Settings,
    children: [
      { label: "Users", href: "/admin/users" },
      { label: "Roles & Permissions", href: "/admin/roles" },
      { label: "Branches", href: "/admin/branches" },
      { label: "System Settings", href: "/admin/settings" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>(["Operations", "Control"]);

  const toggle = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (item: NavItem) =>
    item.children?.some((c) => pathname.startsWith(c.href));

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <h1>EnterpriseMC</h1>
        <p>Management &amp; Control Platform</p>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "8px 12px" }}>
        {NAV.map((item) => {
          if (item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`sidebar-item ${isActive(item.href) ? "active" : ""}`}
              >
                <item.icon size={16} className="icon" />
                {item.label}
              </Link>
            );
          }

          const open = expanded.includes(item.label);
          const groupActive = isGroupActive(item);

          return (
            <div key={item.label}>
              <button
                className={`sidebar-item ${groupActive ? "active" : ""}`}
                onClick={() => toggle(item.label)}
                style={{ justifyContent: "space-between" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <item.icon size={16} className="icon" />
                  {item.label}
                </span>
                {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>

              {open && (
                <div>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`sidebar-sub-item ${isActive(child.href) ? "active" : ""}`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{
        padding: "16px 20px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 13, fontWeight: 600, flexShrink: 0,
        }}>
          FM
        </div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: "#fff" }}>Finance Manager</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Head Office</div>
        </div>
      </div>
    </aside>
  );
}
