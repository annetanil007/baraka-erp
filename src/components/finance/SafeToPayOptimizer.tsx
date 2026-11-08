"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  CircleDollarSign,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle2,
} from "lucide-react";

type VendorBill = {
  id: string;
  vendor: string;
  dueDate: string;
  daysRemaining: number;
  amount: number;
  discountAvailable?: { percent: number; daysRemaining: number; amount: number };
  criticality: "High" | "Medium" | "Low";
  recommendedAction: "Pay Now (Discount)" | "Pay on Day 28" | "Hold (Protect Reserve)";
};

const vendorBills: VendorBill[] = [
  {
    id: "BILL-2026-091",
    vendor: "Gulf Trading Co.",
    dueDate: "12 Sep 2026",
    daysRemaining: 10,
    amount: 160000,
    discountAvailable: { percent: 2, daysRemaining: 3, amount: 3200 },
    criticality: "High",
    recommendedAction: "Pay Now (Discount)",
  },
  {
    id: "BILL-2026-092",
    vendor: "Emirates Supply LLC",
    dueDate: "28 Sep 2026",
    daysRemaining: 26,
    amount: 48500,
    criticality: "Medium",
    recommendedAction: "Pay on Day 28",
  },
  {
    id: "BILL-2026-093",
    vendor: "Al Noor Industrial",
    dueDate: "14 Sep 2026",
    daysRemaining: 12,
    amount: 95000,
    criticality: "High",
    recommendedAction: "Pay on Day 28",
  },
  {
    id: "BILL-2026-094",
    vendor: "Tech Solutions FZE",
    dueDate: "30 Sep 2026",
    daysRemaining: 28,
    amount: 32000,
    criticality: "Low",
    recommendedAction: "Hold (Protect Reserve)",
  },
];

export default function SafeToPayOptimizer() {
  const [selectedBills, setSelectedBills] = useState<string[]>(["BILL-2026-091"]);
  const [notification, setNotification] = useState("");

  const totalCashAvailable = 842300;
  const payrollReserveTarget = 300000;
  const statutoryTaxBuffer = 94500;
  const totalProtectedReserve = payrollReserveTarget + statutoryTaxBuffer; // 394,500

  const safeToPayCapital = totalCashAvailable - totalProtectedReserve; // 447,800

  const selectedPayoutTotal = vendorBills
    .filter((b) => selectedBills.includes(b.id))
    .reduce((acc, b) => acc + (b.discountAvailable && b.recommendedAction.includes("Discount") ? b.amount - b.discountAvailable.amount : b.amount), 0);

  const netCashAfterPayout = totalCashAvailable - selectedPayoutTotal;
  const totalDiscountCaptured = vendorBills
    .filter((b) => selectedBills.includes(b.id) && b.discountAvailable)
    .reduce((acc, b) => acc + (b.discountAvailable?.amount || 0), 0);

  const toggleBill = (id: string) => {
    setSelectedBills((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const handleExecute = () => {
    setNotification(
      `Authorized disbursement batch of ${formatCurrency(selectedPayoutTotal)} across ${selectedBills.length} vendor bills. Reserve buffer maintained.`
    );
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <ShieldCheck size={14} /> Treasury Intelligence & Liquidity Protection
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>
            Safe-to-Pay Vendor Payment Optimizer
          </h3>
          <p style={{ fontSize: 12.5, color: "var(--color-text-secondary)", marginTop: 2 }}>
            Simulates disbursements against protected reserves (Payroll & VAT). Captures early-payment vendor discounts without risking cash flow.
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Current Safe-to-Disburse</span>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-success)" }}>
            {formatCurrency(safeToPayCapital)}
          </div>
        </div>
      </div>

      <div className="divider" style={{ margin: "16px 0" }} />

      {/* Safety Buffer Equation */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 18 }}>
        <div className="card" style={{ padding: 12, background: "var(--color-surface-muted)" }}>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Operating Cash</span>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{formatCurrency(totalCashAvailable)}</div>
          <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Across all bank accounts</div>
        </div>

        <div className="card" style={{ padding: 12, background: "var(--color-surface-muted)" }}>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Protected Reserves</span>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--color-danger)", marginTop: 4 }}>
            {formatCurrency(totalProtectedReserve)}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
            Payroll (300k) + VAT 201 (94.5k)
          </div>
        </div>

        <div className="card" style={{ padding: 12, background: "var(--color-surface-muted)" }}>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Selected Batch Payout</span>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--color-primary)", marginTop: 4 }}>
            {formatCurrency(selectedPayoutTotal)}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-success)" }}>
            Captured {formatCurrency(totalDiscountCaptured)} in discounts
          </div>
        </div>

        <div className="card" style={{ padding: 12, background: "var(--color-surface-muted)" }}>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Buffer Surplus Post-Pay</span>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--color-success)", marginTop: 4 }}>
            {formatCurrency(netCashAfterPayout - totalProtectedReserve)}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-success)" }}>Fully protected</div>
        </div>
      </div>

      {notification && (
        <div className="action-confirmation" role="status" style={{ marginBottom: 14 }}>
          <CheckCircle2 size={15} /> {notification}
          <button type="button" onClick={() => setNotification("")}>Dismiss</button>
        </div>
      )}

      {/* Bill Selection Table */}
      <div className="table-container">
        <table className="data-table" style={{ fontSize: 12.5 }}>
          <thead>
            <tr>
              <th style={{ width: 40 }}>Select</th>
              <th>Vendor & Bill Reference</th>
              <th>Due Date</th>
              <th style={{ textAlign: "right" }}>Bill Amount</th>
              <th>Early Discount Yield</th>
              <th>System Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {vendorBills.map((bill) => {
              const isSelected = selectedBills.includes(bill.id);
              return (
                <tr key={bill.id} style={isSelected ? { background: "var(--color-primary-light)" } : undefined}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleBill(bill.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{bill.vendor}</div>
                    <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-text-muted)" }}>
                      {bill.id}
                    </div>
                  </td>
                  <td>
                    <div>{bill.dueDate}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                      {bill.daysRemaining} days remaining
                    </div>
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                    {formatCurrency(bill.amount)}
                  </td>
                  <td>
                    {bill.discountAvailable ? (
                      <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <Percent size={11} /> Save {formatCurrency(bill.discountAvailable.amount)} ({bill.discountAvailable.percent}%)
                      </span>
                    ) : (
                      <span style={{ color: "var(--color-text-muted)" }}>Standard Net 30</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        bill.recommendedAction.includes("Discount")
                          ? "badge-success"
                          : bill.recommendedAction.includes("Day 28")
                          ? "badge-warning"
                          : "badge-muted"
                      }`}
                    >
                      {bill.recommendedAction}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          className="btn btn-primary"
          disabled={selectedBills.length === 0}
          onClick={handleExecute}
        >
          Approve & Schedule Batch ({formatCurrency(selectedPayoutTotal)}) <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
