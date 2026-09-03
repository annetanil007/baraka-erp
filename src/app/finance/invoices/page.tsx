"use client";

import { useState } from "react";
import { mockInvoices } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Plus, AlertCircle } from "lucide-react";
import BillScanner from "@/components/BillScanner";
import { useLocalStorage } from "@/lib/useLocalStorage";
import ActionButton from "@/components/ActionButton";

const RISK_CLASS: Record<string, string> = {
  Critical: "priority-critical", High: "priority-high",
  Elevated: "priority-medium", Medium: "priority-medium", Low: "priority-low",
};
const STATUS_CLASS: Record<string, string> = {
  Approved: "badge-success", Pending: "badge-info",
  "Under Review": "badge-warning", Draft: "badge-muted",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useLocalStorage("baraka:invoices", mockInvoices);
  const [scannerOpen, setScannerOpen] = useState(false);
  const flagged = invoices.filter((inv) => inv.riskLevel === "Elevated" || inv.riskLevel === "High");
  const saveBill = (bill: { supplier: string; invoiceNumber: string; amount: string }) => {
    setInvoices((current) => [{ id: bill.invoiceNumber, supplier: bill.supplier, amount: Number(bill.amount) || 0, poRef: "Pending match", status: "Pending", riskLevel: "Medium", createdAt: new Date().toISOString() }, ...current]);
    setScannerOpen(false);
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="page-title">Invoices</h2>
          <p className="page-description">
            Supplier invoices with validation status. Invoices are compared against purchase orders automatically.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setScannerOpen((current) => !current)}><Plus size={13} /> Scan Bill</button>
      </div>

      {scannerOpen && <BillScanner onSaved={saveBill} />}

      {flagged.length > 0 && (
        <div className="alert-banner danger" style={{ marginBottom: 20 }}>
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <strong>{flagged.length} invoice{flagged.length > 1 ? "s" : ""} require review</strong> before payment approval.
          Value deviations from approved purchase orders have been identified.
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Supplier</th>
                <th>Amount</th>
                <th>Purchase Order</th>
                <th>Status</th>
                <th>Risk Level</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{inv.id}</td>
                  <td style={{ fontWeight: 500 }}>{inv.supplier}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(inv.amount)}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--color-accent)" }}>
                    {inv.poRef}
                  </td>
                  <td>
                    <span className={`badge ${STATUS_CLASS[inv.status] ?? "badge-muted"}`}>{inv.status}</span>
                  </td>
                  <td>
                    <span className={`badge ${RISK_CLASS[inv.riskLevel] ?? "badge-muted"}`}>{inv.riskLevel}</span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                    {formatDateTime(inv.createdAt)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <ActionButton label={`View ${inv.id}`} />
                      {inv.status === "Pending" && (
                        <ActionButton label={`Approve ${inv.id}`} className="btn btn-accent btn-sm" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
