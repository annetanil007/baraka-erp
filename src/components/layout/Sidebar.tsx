"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, ShoppingCart, DollarSign, BarChart2, Settings,
  Shield, ChevronDown, TrendingUp, ClipboardList,
} from "lucide-react";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { createClient } from "@/lib/supabase/client";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
};

const ARABIC_LABELS: Record<string, string> = {
  Dashboard: "لوحة التحكم", "Employee Workspace": "مساحة عمل الموظف", Operations: "العمليات", Sales: "المبيعات", Customers: "العملاء", Inventory: "المخزون", Transfers: "التحويلات",
  Procurement: "المشتريات", "Purchase Requests": "طلبات الشراء", "Purchase Orders": "أوامر الشراء", Suppliers: "الموردون", Receiving: "الاستلام",
  Finance: "المالية", Accounts: "الحسابات", Invoices: "الفواتير", Payments: "المدفوعات", Expenses: "المصروفات", "Cash Flow": "التدفق النقدي", "Cost of Goods Sold": "تكلفة البضائع المباعة", Control: "الرقابة",
  Exceptions: "الاستثناءات", Reviews: "المراجعات", Approvals: "الموافقات", Reconciliation: "التسوية", Reports: "التقارير", "Operational Reports": "التقارير التشغيلية",
  "Financial Reports": "التقارير المالية", "Inventory Reports": "تقارير المخزون", "Executive Intelligence": "الذكاء التنفيذي", Administration: "الإدارة", Users: "المستخدمون", "Roles & Permissions": "الأدوار والصلاحيات", Branches: "الفروع", "System Settings": "إعدادات النظام",
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Employee Workspace", href: "/employee", icon: ClipboardList },
  {
    label: "Operations",
    icon: TrendingUp,
    children: [
      { label: "Sales", href: "/operations/sales" },
      { label: "Customers", href: "/operations/customers" },
      { label: "Inventory", href: "/operations/inventory" },
      { label: "Inventory Intelligence", href: "/operations/inventory/intelligence" },
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
      { label: "Cash Flow", href: "/finance/cash-flow" },
      { label: "Cost of Goods Sold", href: "/finance/cogs" },
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
      { label: "Executive Intelligence", href: "/reports/executive" },
    ],
  },
  {
    label: "Administration",
    icon: Settings,
    children: [
      { label: "Users", href: "/admin/users" },
      { label: "Roles & Permissions", href: "/admin/roles" },
      { label: "Branches", href: "/admin/branches" },
      { label: "WhatsApp Directory", href: "/admin/whatsapp" },
      { label: "System Settings", href: "/admin/settings" },
    ],
  },
];

const EMPLOYEE_NAV: NavItem[] = [
  { label: "Employee Workspace", href: "/employee", icon: ClipboardList },
  {
    label: "Operations",
    icon: TrendingUp,
    children: [
      { label: "Sales", href: "/operations/sales" },
      { label: "Inventory", href: "/operations/inventory" },
      { label: "Transfers", href: "/operations/transfers" },
    ],
  },
  {
    label: "Procurement",
    icon: ShoppingCart,
    children: [
      { label: "Purchase Requests", href: "/procurement/requests" },
      { label: "Receiving", href: "/procurement/receiving" },
    ],
  },
  {
    label: "Control",
    icon: Shield,
    children: [{ label: "Exceptions", href: "/control/exceptions" }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Safe fallback if Supabase is unconfigured
    }
    document.cookie = "baraka_demo_workspace=; Max-Age=0; Path=/";
    router.push("/login");
  };
  const label = (value: string) => language === "ar" ? ARABIC_LABELS[value] || value : value;
  const navigation = pathname === "/employee" ? EMPLOYEE_NAV : NAV;
  const [expanded, setExpanded] = useState<string[]>([]);

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
        <Link href={pathname === "/employee" ? "/employee" : "/"} className="sidebar-brand" aria-label="Baraka home">
          <Image src="/baraka-logo.svg" alt="Baraka" width={138} height={46} priority />
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "8px 12px" }}>
        {navigation.map((item) => {
          if (item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`sidebar-item ${isActive(item.href) ? "active" : ""}`}
              >
                <item.icon size={16} className="icon" />
                {label(item.label)}
              </Link>
            );
          }

          const open = expanded.includes(item.label);
          const groupActive = isGroupActive(item);

          return (
            <div key={item.label} className={`sidebar-group ${open ? "is-open" : ""}`}>
              <button
                type="button"
                className={`sidebar-item ${groupActive ? "active" : ""}`}
                onClick={() => toggle(item.label)}
                style={{ justifyContent: "space-between" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <item.icon size={16} className="icon" />
                  {label(item.label)}
                </span>
                <ChevronDown size={13} className={`sidebar-chevron ${open ? "is-open" : ""}`} />
              </button>

              <div className="sidebar-children">
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`sidebar-sub-item ${isActive(child.href) ? "active" : ""}`}
                  >
                      {label(child.label)}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <button type="button" onClick={signOut} title="Sign out" style={{
        padding: "16px 20px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", gap: 10,
        width: "100%", borderLeft: 0, borderRight: 0, borderBottom: 0,
        background: "transparent", textAlign: "left", cursor: "pointer",
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 13, fontWeight: 600, flexShrink: 0,
        }}>
          {pathname === "/employee" ? "AO" : "FM"}
        </div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: "#fff" }}>{pathname === "/employee" ? "Ahmed Al Mansouri" : "Sara Al Rashidi"}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{pathname === "/employee" ? "Operations Employee" : "Finance Manager"} · Head Office</div>
        </div>
      </button>
    </aside>
  );
}
