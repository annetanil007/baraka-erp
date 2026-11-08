"use client";

import { useState } from "react";
import { mockInvoices } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Plus, AlertCircle, Split, BookOpen, CheckCircle, Eye } from "lucide-react";
import BillScanner from "@/components/BillScanner";
import { useLocalStorage } from "@/lib/useLocalStorage";
import ThreeWayMatchDrawer, { MatchRecord } from "@/components/ThreeWayMatchDrawer";
import JournalEntryModal, { JournalLine } from "@/components/JournalEntryModal";

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
  const [matchRecord, setMatchRecord] = useState<MatchRecord | null>(null);
  const [journalModal, setJournalModal] = useState<{ reference: string; lines: JournalLine[]; description: string } | null>(null);
  const [notification, setNotification] = useState("");

  const flagged = invoices.filter((inv) => inv.riskLevel === "Elevated" || inv.riskLevel === "High");

  const saveBill = (bill: { supplier: string; invoiceNumber: string; amount: string }) => {
    setInvoices((current) => [{
      id: bill.invoiceNumber,
      supplier: bill.supplier,
      amount: Number(bill.amount) || 0,
      poRef: "Pending match",
      status: "Pending",
      riskLevel: "Medium",
      createdAt: new Date().toISOString()
    }, ...current]);
    setScannerOpen(false);
    setNotification(`Invoice ${bill.invoiceNumber} recorded and queued for 3-way matching.`);
  };

  const open3WayMatch = (inv: typeof mockInvoices[number]) => {
    // Generate realistic 3-way match data
    const isDiscrepant = inv.riskLevel === "High" || inv.riskLevel === "Elevated";
    const poQty = 100;
    const poPrice = isDiscrepant ? 1500 : Math.round(inv.amount / 100);
    const grnQty = isDiscrepant ? 90 : 100;
    const invoiceQty = 100;
    const invoicePrice = isDiscrepant ? 1600 : poPrice;

    setMatchRecord({
      invoiceId: inv.id,
      poId: inv.poRef || "PO-2026-00441",
      grnId: `GRN-2026-${inv.id.slice(-4)}`,
      supplier: inv.supplier,
      poQty,
      poPrice,
      grnQty,
      invoiceQty,
      invoicePrice,
      paymentTerms: "Net 30 Days",
    });
  };

  const previewGL = (inv: typeof mockInvoices[number]) => {
    const netAmount = Math.round(inv.amount / 1.05);
    const vatAmount = inv.amount - netAmount;

    setJournalModal({
      reference: inv.id,
      description: `Purchase invoice entry for ${inv.supplier} against PO ${inv.poRef}`,
      lines: [
        { accountCode: "1300", accountName: "Inventory Asset / Goods Received (GRNI)", debit: netAmount, credit: 0 },
        { accountCode: "2210", accountName: "VAT Input Tax Recoverable (5%)", debit: vatAmount, credit: 0 },
        { accountCode: "2010", accountName: "Accounts Payable (Trade Creditors)", debit: 0, credit: inv.amount },
      ],
    });
  };

  const handleResolve3Way = (action: string) => {
    if (!matchRecord) return;
    setInvoices((current) => current.map((inv) =>
      inv.id === matchRecord.invoiceId ? { ...inv, status: "Approved", riskLevel: "Low" } : inv
    ));
    setNotification(`Audit Decision applied (${action}) for invoice ${matchRecord.invoiceId}. GL adjusted.`);
    setMatchRecord(null);
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="page-title">Accounts Payable & Supplier Invoices</h2>
          <p className="page-description">
            Continuous 3-way validation comparing Purchase Orders, Warehouse GRNs, and Supplier Invoices.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setScannerOpen((c) => !c)}>
            <Plus size={13} /> Scan Bill (OCR)
          </button>
        </div>
      </div>

      {notification && (
        <div className="toast" role="status">
          <CheckCircle size={15} /> {notification}
          <button type="button" onClick={() => setNotification("")}>Dismiss</button>
        </div>
      )}

      {scannerOpen && <BillScanner onSaved={saveBill} />}

      {flagged.length > 0 && (
        <div className="alert-banner danger" style={{ marginBottom: 20 }}>
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <div>
            <strong>{flagged.length} invoice{flagged.length > 1 ? "s" : ""} flagged by 3-Way Match Audit.</strong>
            &nbsp;Discrepancies identified between PO contract unit rates and warehouse physical receipt counts.
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Supplier</th>
                <th>Gross Total</th>
                <th>PO Reference</th>
                <th>Validation Status</th>
                <th>Risk Exposure</th>
                <th>Date Received</th>
                <th>Institutional Controls</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>{inv.id}</td>
                  <td style={{ fontWeight: 500 }}>{inv.supplier}</td>
                  <td style={{ fontWeight: 600, fontFamily: "monospace" }}>{formatCurrency(inv.amount)}</td>
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
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        title="Open 3-Way Match Audit Breakdown"
                        onClick={() => open3WayMatch(inv)}
                      >
                        <Split size={12} style={{ color: "var(--color-accent)" }} /> 3-Way Audit
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        title="Simulate General Ledger Impact"
                        onClick={() => previewGL(inv)}
                      >
                        <BookOpen size={12} /> GL Impact
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3-Way Match Reconciliation Drawer */}
      {matchRecord && (
        <ThreeWayMatchDrawer
          record={matchRecord}
          onClose={() => setMatchRecord(null)}
          onResolve={handleResolve3Way}
        />
      )}

      {/* General Ledger Impact Modal */}
      {journalModal && (
        <JournalEntryModal
          reference={journalModal.reference}
          entityType="Supplier Invoice"
          description={journalModal.description}
          lines={journalModal.lines}
          onClose={() => setJournalModal(null)}
          onPost={() => {
            setNotification(`GL Entry posted to immutable ledger for ${journalModal.reference}.`);
          }}
        />
      )}
    </div>
  );
}
