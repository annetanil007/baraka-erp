import { mockExceptions } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { Filter, Download } from "lucide-react";
import ActionButton from "@/components/ActionButton";

const PRIORITY_CLASS: Record<string, string> = {
  Critical: "priority-critical", High: "priority-high",
  Medium: "priority-medium", Low: "priority-low",
};
const STATUS_CLASS: Record<string, string> = {
  Open: "badge-danger", "Under Review": "badge-warning",
  Monitoring: "badge-info", Resolved: "badge-success", Closed: "badge-muted",
};

export default function ExceptionsPage() {
  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="page-title">Exceptions</h2>
          <p className="page-description">
            Active exceptions identified by the control layer requiring review or action.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <ActionButton label="Filter exceptions"><Filter size={13} /> Filter</ActionButton>
          <ActionButton label="Export exceptions"><Download size={13} /> Export</ActionButton>
        </div>
      </div>

      {/* Summary bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Critical", count: mockExceptions.filter(e => e.priority === "Critical").length, cls: "priority-critical" },
          { label: "High", count: mockExceptions.filter(e => e.priority === "High").length, cls: "priority-high" },
          { label: "Medium", count: mockExceptions.filter(e => e.priority === "Medium").length, cls: "priority-medium" },
          { label: "Low", count: mockExceptions.filter(e => e.priority === "Low").length, cls: "priority-low" },
          { label: "Total", count: mockExceptions.length, cls: "badge-muted" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <span className={`badge ${s.cls}`}>{s.count}</span>
            <span style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Exception ID</th>
                <th>Summary</th>
                <th>Area</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockExceptions.map((ex) => (
                <tr key={ex.id}>
                  <td>
                    <span className={`badge ${PRIORITY_CLASS[ex.priority] ?? "badge-muted"}`}>
                      {ex.priority}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--color-text-secondary)" }}>
                      {ex.id}
                    </span>
                  </td>
                  <td style={{ maxWidth: 300 }}>
                    <span className="truncate" title={ex.summary}>{ex.summary}</span>
                  </td>
                  <td>
                    <span className="tag">{ex.area}</span>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_CLASS[ex.status] ?? "badge-muted"}`}>
                      {ex.status}
                    </span>
                  </td>
                  <td style={{ color: "var(--color-text-secondary)" }}>{ex.assignedTo}</td>
                  <td style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
                    {formatDateTime(ex.createdAt)}
                  </td>
                  <td>
                    <Link href={`/control/exceptions/${ex.id}`} className="btn btn-secondary btn-sm">
                      Review
                    </Link>
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
