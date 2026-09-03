import { mockExceptions } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import ExceptionActions from "@/components/ExceptionActions";

export default async function ExceptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ex = mockExceptions.find((e) => e.id === id);
  if (!ex) notFound();

  const { details } = ex;

  const RISK_CLASS: Record<string, string> = {
    Critical: "priority-critical", High: "priority-high",
    Elevated: "priority-medium", Medium: "priority-medium", Low: "priority-low",
  };
  const STATUS_CLASS: Record<string, string> = {
    Open: "badge-danger", "Under Review": "badge-warning",
    Monitoring: "badge-info", Resolved: "badge-success",
  };

  return (
    <div>
      {/* Back nav */}
      <Link href="/control/exceptions" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
        <ArrowLeft size={14} /> Exceptions
      </Link>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <h2 className="page-title">{ex.id}</h2>
            <span className={`badge ${STATUS_CLASS[ex.status] ?? "badge-muted"}`}>{ex.status}</span>
            <span className={`badge ${RISK_CLASS[ex.riskLevel] ?? "badge-muted"}`}>
              Risk Level: {ex.riskLevel}
            </span>
          </div>
          <p className="page-description">{ex.summary}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <ExceptionActions exceptionId={ex.id} compact />
        </div>
      </div>

      {/* Control evaluation banner */}
      <div className={`alert-banner ${
        ex.priority === "Critical" || ex.priority === "High" ? "danger" :
        ex.priority === "Medium" ? "warning" : "info"
      }`} style={{ marginBottom: 24 }}>
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <strong>Review Required.</strong> {ex.details.recommendation}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

        {/* Left: Main detail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Summary fields */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Exception Detail</div>
              <span className="tag">{ex.area}</span>
            </div>
            <div className="card-body">
              <div className="detail-field" style={{ marginBottom: 20 }}>
                <div className="detail-field-item">
                  <div className="label">Exception ID</div>
                  <div className="value" style={{ fontFamily: "monospace" }}>{ex.id}</div>
                </div>
                <div className="detail-field-item">
                  <div className="label">Priority</div>
                  <div className="value">
                    <span className={`badge ${RISK_CLASS[ex.priority]}`}>{ex.priority}</span>
                  </div>
                </div>
                <div className="detail-field-item">
                  <div className="label">Area</div>
                  <div className="value">{ex.area}</div>
                </div>
                <div className="detail-field-item">
                  <div className="label">Assigned To</div>
                  <div className="value">{ex.assignedTo}</div>
                </div>
                <div className="detail-field-item">
                  <div className="label">Created</div>
                  <div className="value">{formatDateTime(ex.createdAt)}</div>
                </div>
              </div>

              {/* Evaluation figures */}
              {details.difference > 0 && (
                <div style={{ background: "var(--color-surface-muted)", borderRadius: "var(--radius-md)", padding: 16 }}>
                  <div className="section-heading" style={{ marginBottom: 12 }}>Evaluation</div>
                  <div className="eval-row">
                    <span className="eval-label">Approved Value</span>
                    <span className="eval-value">{details.currency === "AED"
                      ? formatCurrency(details.approvedValue)
                      : `${details.approvedValue} ${details.currency}`}
                    </span>
                  </div>
                  <div className="eval-row">
                    <span className="eval-label">Submitted Value</span>
                    <span className="eval-value" style={{ color: "var(--color-danger)" }}>
                      {details.currency === "AED"
                        ? formatCurrency(details.submittedValue)
                        : `${details.submittedValue} ${details.currency}`}
                    </span>
                  </div>
                  <div className="eval-row">
                    <span className="eval-label">Difference</span>
                    <span className="eval-value" style={{ color: "var(--color-danger)", fontWeight: 600 }}>
                      {details.currency === "AED"
                        ? formatCurrency(details.difference)
                        : `${details.difference} ${details.currency}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Factors */}
              <div style={{ marginTop: 16 }}>
                <div className="section-heading">Contributing Factors</div>
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                  {details.factors.map((f, i) => (
                    <li key={i} style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 6 }}>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Related Records */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Related Records</div>
            </div>
            <div className="card-body" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {details.relatedRecords.map((r) => (
                <span key={r} className="tag" style={{ fontFamily: "monospace", cursor: "pointer" }}>
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <ExceptionActions exceptionId={ex.id} />
          </div>
        </div>

        {/* Right: Timeline */}
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Activity Timeline</div>
            </div>
            <div className="card-body">
              <div className="timeline">
                {ex.timeline.map((t, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-time">{t.time}</div>
                    <div className="timeline-label">{t.label}</div>
                    {t.note && <div className="timeline-note">{t.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Action */}
          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-header">
              <div className="card-title">Recommended Action</div>
            </div>
            <div className="card-body">
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                {details.recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return mockExceptions.map((e) => ({ id: e.id }));
}
