import { mockExceptions } from "@/lib/mock-data";
import Link from "next/link";

export default function ReviewsPage() {
  const underReview = mockExceptions.filter((e) => e.status === "Under Review" || e.status === "Monitoring");

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Control Reviews</h2>
        <p className="page-description">
          Transactions and records currently under formal review. Manage review assignments and outcomes.
        </p>
      </div>

      {underReview.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <p>No items currently under review.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {underReview.map((ex) => (
            <div key={ex.id} className="card">
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span className={`badge ${ex.status === "Under Review" ? "badge-warning" : "badge-info"}`}>
                        {ex.status}
                      </span>
                      <span className="tag">{ex.area}</span>
                      <span style={{ fontFamily: "monospace", fontSize: 11.5, color: "var(--color-text-muted)" }}>{ex.id}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{ex.summary}</div>
                    <div style={{ fontSize: 12.5, color: "var(--color-text-muted)" }}>
                      Assigned to: <strong>{ex.assignedTo}</strong>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/control/exceptions/${ex.id}`} className="btn btn-secondary btn-sm">
                      View Details
                    </Link>
                    <button className="btn btn-primary btn-sm">Complete Review</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
