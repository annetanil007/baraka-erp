"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Plus, Search, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import CustomerCreditRiskDrawer, { CustomerCreditProfile } from "@/components/CustomerCreditRiskDrawer";

const initialCustomers: CustomerCreditProfile[] = [
  {
    id: "CUS-00184",
    name: "Falcon Industrial LLC",
    segment: "Enterprise",
    creditLimit: 500000,
    currentBalance: 206500,
    overdueBalance: 82000,
    avgPaymentDays: 52,
    agingTier: { current: 124500, tier30to60: 54000, tier60to90: 28000, tierOver90: 0 },
    creditHoldActive: false,
  },
  {
    id: "CUS-00183",
    name: "Al Jadeed Trading",
    segment: "Commercial",
    creditLimit: 250000,
    currentBalance: 34000,
    overdueBalance: 0,
    avgPaymentDays: 28,
    agingTier: { current: 34000, tier30to60: 0, tier60to90: 0, tierOver90: 0 },
    creditHoldActive: false,
  },
  {
    id: "CUS-00182",
    name: "Emirates Contractors",
    segment: "Enterprise",
    creditLimit: 750000,
    currentBalance: 120000,
    overdueBalance: 15000,
    avgPaymentDays: 34,
    agingTier: { current: 105000, tier30to60: 15000, tier60to90: 0, tierOver90: 0 },
    creditHoldActive: false,
  },
  {
    id: "CUS-00181",
    name: "Nexus Maintenance",
    segment: "SMB",
    creditLimit: 50000,
    currentBalance: 58400,
    overdueBalance: 38400,
    avgPaymentDays: 68,
    agingTier: { current: 20000, tier30to60: 14000, tier60to90: 16000, tierOver90: 8400 },
    creditHoldActive: true,
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useLocalStorage("baraka:customers", initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerCreditProfile | null>(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) || c.id.toLowerCase().includes(query.toLowerCase())
  );

  const toggleHold = (customerId: string, nextStatus: boolean) => {
    setCustomers((current) =>
      current.map((c) => (c.id === customerId ? { ...c, creditHoldActive: nextStatus } : c))
    );
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer((c) => (c ? { ...c, creditHoldActive: nextStatus } : null));
    }
    setToast(
      nextStatus
        ? `Credit Hold enforced on ${customerId}. All new orders blocked.`
        : `Credit Hold lifted for ${customerId}. Account restored to active status.`
    );
  };

  return (
    <div>
      <div className="page-header module-header">
        <div>
          <h2 className="page-title">Customer Accounts & Dynamic Credit Control</h2>
          <p className="page-description">
            Live receivables aging, automated credit limits, and credit hold enforcement against bad debt.
          </p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={13} /> Add Customer</button>
      </div>

      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={15} /> {toast}
          <button type="button" onClick={() => setToast("")}>Dismiss</button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <div className="kpi-card">
          <div className="kpi-label">Active Customer Ledgers</div>
          <div className="kpi-value">{customers.length} Accounts</div>
          <div className="kpi-sub kpi-trend-up">100% verified TRNs</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Outstanding AR</div>
          <div className="kpi-value">
            {formatCurrency(customers.reduce((acc, c) => acc + c.currentBalance, 0))}
          </div>
          <div className="kpi-sub">Across all branches</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Overdue Aging Debt</div>
          <div className="kpi-value" style={{ color: "var(--color-danger)" }}>
            {formatCurrency(customers.reduce((acc, c) => acc + c.overdueBalance, 0))}
          </div>
          <div className="kpi-sub kpi-trend-down">Breaching 30-day terms</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Credit Holds Active</div>
          <div className="kpi-value" style={{ color: "var(--color-warning)" }}>
            {customers.filter((c) => c.creditHoldActive).length} Accounts
          </div>
          <div className="kpi-sub">Shipments locked</div>
        </div>
      </div>

      <div className="toolbar module-toolbar">
        <div className="search-bar module-search">
          <Search size={14} style={{ color: "var(--color-text-muted)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customer name or ID..."
          />
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Client Name</th>
                <th>Segment</th>
                <th style={{ textAlign: "right" }}>Credit Limit</th>
                <th style={{ textAlign: "right" }}>Total Balance</th>
                <th style={{ textAlign: "right" }}>Overdue (30d+)</th>
                <th>Avg DSO</th>
                <th>Credit Standing</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{c.id}</td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td><span className="tag">{c.segment}</span></td>
                  <td style={{ textAlign: "right", fontFamily: "monospace" }}>{formatCurrency(c.creditLimit)}</td>
                  <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                    {formatCurrency(c.currentBalance)}
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "monospace", color: c.overdueBalance > 0 ? "var(--color-danger)" : "inherit", fontWeight: 600 }}>
                    {c.overdueBalance > 0 ? formatCurrency(c.overdueBalance) : "—"}
                  </td>
                  <td>{c.avgPaymentDays} Days</td>
                  <td>
                    {c.creditHoldActive ? (
                      <span className="badge badge-danger">Credit Hold Active</span>
                    ) : c.overdueBalance > 0 ? (
                      <span className="badge badge-warning">Review Due</span>
                    ) : (
                      <span className="badge badge-success">Good Standing</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedCustomer(c)}
                    >
                      <ShieldAlert size={12} /> Credit Risk & SOA
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && (
        <CustomerCreditRiskDrawer
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onToggleHold={toggleHold}
        />
      )}
    </div>
  );
}
