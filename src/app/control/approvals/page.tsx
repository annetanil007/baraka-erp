import { mockApprovals } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { CheckCircle, XCircle, Eye } from "lucide-react";

const RISK_CLASS: Record<string, string> = {
  Critical: "priority-critical", High: "priority-high",
  Elevated: "priority-medium", Medium: "priority-medium", Low: "priority-low",
};

export default function ApprovalsPage() {
  const pending = mockApprovals.filter((a) => a.status === "Pending");
  const processed = mockApprovals.filter((a) => a.status !== "Pending");

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Approvals</h2>
        <p className="page-description">
          Transactions submitted for authorisation. Review required before processing.
        </p>
      </div>

      {/* Pending */}
      <div className="section-heading">Pending Review — {pending.length} Items</div>
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
                <tr key={apr.id}>
                  <td>
                    <div style={{ fontFamily: "monospace", fontSize: 12 }}>{apr.reference}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{apr.id}</div>
                  </td>
                  <td>{apr.type}</td>
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
                      <button className="btn btn-secondary btn-sm"><Eye size={12} /> Review</button>
                      <button className="btn btn-primary btn-sm"><CheckCircle size={12} /> Approve</button>
                      <button className="btn btn-danger btn-sm"><XCircle size={12} /> Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Processed */}
      <div className="section-heading">Recently Processed</div>
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
