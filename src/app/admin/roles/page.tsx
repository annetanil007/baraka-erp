import ModulePage from "@/components/ModulePage";

export default function Page() {
  return (
    <div>
      <ModulePage title="Roles & Permissions" description="Control access with clear role ownership and least-privilege permissions." actionLabel="Create role" stats={[{ label: "Roles", value: "9" }, { label: "Users assigned", value: "74" }, { label: "Custom roles", value: "4" }, { label: "Review due", value: "2", tone: "warning" }]} columns={[{ key: "id", label: "Role", mono: true }, { key: "name", label: "Role name" }, { key: "users", label: "Users", numeric: true }, { key: "scope", label: "Scope" }, { key: "owner", label: "Owner" }, { key: "status", label: "Status" }]} rows={[{ id: "ROLE-001", name: "Finance Manager", users: 2, scope: "Finance + Control", owner: "Executive Management", status: "Active" }, { id: "ROLE-002", name: "Procurement Manager", users: 4, scope: "Procurement", owner: "Executive Management", status: "Active" }, { id: "ROLE-003", name: "Inventory Manager", users: 3, scope: "Operations + Inventory", owner: "Executive Management", status: "Active" }, { id: "ROLE-004", name: "Operations Employee", users: 22, scope: "Sales, Customers", owner: "Operations", status: "Active" }]} />
    </div>
  );
}
