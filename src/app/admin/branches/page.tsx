import { mockBranches } from "@/lib/mock-data";
import { Building2, Plus } from "lucide-react";
import ActionButton from "@/components/shared/ActionButton";

export default function BranchesPage() {
  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="page-title">Branches</h2>
          <p className="page-description">Organisation branches, locations and assigned managers.</p>
        </div>
        <ActionButton label="Add branch" className="btn btn-primary btn-sm"><Plus size={13} /> Add Branch</ActionButton>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {mockBranches.map((br) => (
          <div key={br.id} className="card">
            <div className="card-body">
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "var(--radius-md)",
                  background: "var(--color-primary-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Building2 size={18} style={{ color: "var(--color-primary)" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{br.name}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>{br.location}</div>
                </div>
                <span className={`badge ${br.status === "Active" ? "badge-success" : "badge-muted"}`} style={{ marginLeft: "auto" }}>
                  {br.status}
                </span>
              </div>
              <div className="divider" />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="eval-row">
                  <span className="eval-label">Manager</span>
                  <span className="eval-value">{br.manager}</span>
                </div>
                <div className="eval-row">
                  <span className="eval-label">Employees</span>
                  <span className="eval-value">{br.employees}</span>
                </div>
                <div className="eval-row">
                  <span className="eval-label">Branch ID</span>
                  <span className="eval-value" style={{ fontFamily: "monospace", fontSize: 12 }}>{br.id}</span>
                </div>
              </div>
              <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                <ActionButton label={`Edit ${br.name}`} className="btn btn-secondary btn-sm" />
                <ActionButton label={`View details for ${br.name}`} className="btn btn-ghost btn-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
