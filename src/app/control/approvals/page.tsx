"use client";

import { useState } from "react";
import { mockApprovals } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { AlertTriangle, ArrowUpRight, CheckCircle, CircleDollarSign, Clock3, Eye, ShieldCheck, XCircle } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";

const RISK_CLASS: Record<string, string> = {
  Critical: "priority-critical", High: "priority-high",
  Elevated: "priority-medium", Medium: "priority-medium", Low: "priority-low",
};

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useLocalStorage("baraka:approvals", mockApprovals);
  const [message, setMessage] = useState("");
  const pending = approvals.filter((a) => a.status === "Pending");
  const processed = approvals.filter((a) => a.status !== "Pending");
  const pendingValue = pending.reduce((total, approval) => total + approval.amount, 0);
  const urgent = pending.filter((approval) => ["Critical", "High", "Elevated"].includes(approval.riskLevel));
  const updateApproval = (id: string, nextStatus: "Approved" | "Rejected") => {
    setApprovals((current) => current.map((approval) => approval.id === id ? { ...approval, status: nextStatus } : approval));
    setMessage(`Approval ${id} marked ${nextStatus.toLowerCase()}.`);
    window.setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="approval-center">
      <div className="page-header">
        <div>
          <div className="eyebrow"><ShieldCheck size={13} /> Decision control</div>
          <h2 className="page-title">Approval center</h2>
        </div>
        <p className="page-description">
          Make confident decisions with risk, value, and context in one view.
        </p>
      </div>

      <div className="approval-summary-grid">
        <div className="approval-summary-featured"><span>Waiting for your decision</span><strong>{pending.length} <small>items</small></strong><p><Clock3 size={12} /> Oldest request: 18 hours</p></div>
        <div className="approval-summary-card"><span>Financial exposure</span><strong>{formatCurrency(pendingValue)}</strong><small><CircleDollarSign size={12} /> Pending value</small></div>
        <div className="approval-summary-card"><span>Needs priority review</span><strong>{urgent.length}</strong><small className="approval-warning"><AlertTriangle size={12} /> Elevated risk or higher</small></div>
        <div className="approval-summary-card"><span>Average response</span><strong>2.4 hrs</strong><small className="approval-positive">↓ 18% faster this week</small></div>
      </div>

      <div className="approval-focus">
        <div className="approval-focus-icon"><AlertTriangle size={16} /></div>
        <div><span className="eyebrow">Recommended focus</span><strong>Review PO-2026-00441 first</strong><p>It carries the largest exposure and is already flagged for an invoice mismatch.</p></div>
        <button className="btn btn-primary btn-sm" onClick={() => document.getElementById("approval-APR-2026-00091")?.scrollIntoView({ behavior: "smooth", block: "center" })}>Open priority <ArrowUpRight size={13} /></button>
      </div>

      <div className="section-heading">Decision queue <span className="section-heading-note">{pending.length} pending · sorted by risk</span></div>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Type</th>
                <th>Requested By</th>
                <th>Amount</th>
                <th>Risk Level</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((apr) => (
                <tr id={`approval-${apr.id}`} key={apr.id}>
                  <td>
                    <div style={{ fontFamily: "monospace", fontSize: 12 }}>{apr.reference}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{apr.id}</div>
                  </td>
                  <td><div style={{ fontWeight: 500 }}>{apr.type}</div><div style={{ color: "var(--color-text-muted)", fontSize: 11 }}>{apr.riskLevel === "Low" ? "Standard review" : "Context required"}</div></td>
                  <td style={{ color: "var(--color-text-secondary)" }}>{apr.requestedBy}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(apr.amount)}</td>
                  <td>
                    <span className={`badge ${RISK_CLASS[apr.riskLevel] ?? "badge-muted"}`}>
                      {apr.riskLevel}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                    {formatDateTime(apr.submittedAt)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setMessage(`Reviewing ${apr.reference}.`)}><Eye size={12} /> Review</button>
                      <button className="btn btn-primary btn-sm" onClick={() => updateApproval(apr.id, "Approved")}><CheckCircle size={12} /> Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => updateApproval(apr.id, "Rejected")}><XCircle size={12} /> Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {message && <div className="toast" role="status">{message}<button onClick={() => setMessage("")}>Dismiss</button></div>}

      <div className="section-heading">Recently processed <span className="section-heading-note">{processed.length} decisions</span></div>
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Type</th>
                <th>Requested By</th>
                <th>Amount</th>
                <th>Risk Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {processed.map((apr) => (
                <tr key={apr.id}>
                  <td>
                    <div style={{ fontFamily: "monospace", fontSize: 12 }}>{apr.reference}</div>
                  </td>
                  <td>{apr.type}</td>
                  <td style={{ color: "var(--color-text-secondary)" }}>{apr.requestedBy}</td>
                  <td>{formatCurrency(apr.amount)}</td>
                  <td>
                    <span className={`badge ${RISK_CLASS[apr.riskLevel] ?? "badge-muted"}`}>
                      {apr.riskLevel}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${apr.status === "Approved" ? "badge-success" : "badge-danger"}`}>
                      {apr.status}
                    </span>
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
