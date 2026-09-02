import { mockUsers } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";
import { Plus, UserPlus } from "lucide-react";

export default function UsersPage() {
  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="page-title">Users</h2>
          <p className="page-description">Manage platform users, roles and access levels.</p>
        </div>
        <button className="btn btn-primary btn-sm"><UserPlus size={13} /> Add User</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: "var(--color-primary-light)",
                        color: "var(--color-primary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, flexShrink: 0,
                      }}>
                        {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--color-text-secondary)" }}>{u.email}</td>
                  <td><span className="tag">{u.role}</span></td>
                  <td style={{ color: "var(--color-text-secondary)" }}>{u.branch}</td>
                  <td>
                    <span className={`badge ${u.status === "Active" ? "badge-success" : "badge-muted"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                    {formatDateTime(u.lastLogin)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-secondary btn-sm">Edit</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: "var(--color-danger)" }}>
                        Deactivate
                      </button>
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
