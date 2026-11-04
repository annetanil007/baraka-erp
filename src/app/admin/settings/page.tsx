import ModulePage from "@/components/ModulePage";
import EnterpriseControls from "@/components/EnterpriseControls";

export default function Page() {
  return (
    <div>
      <ModulePage title="System Settings" description="Organisation defaults, workflow rules and integration health." actionLabel="Add setting" stats={[{ label: "Configuration items", value: "28" }, { label: "Workflow rules", value: "14", tone: "info" }, { label: "Integrations", value: "5 / 5", tone: "success" }, { label: "Changes this month", value: "18" }]} columns={[{ key: "key", label: "Setting", mono: true }, { key: "name", label: "Configuration" }, { key: "category", label: "Category" }, { key: "value", label: "Current value" }, { key: "updated", label: "Last updated" }, { key: "status", label: "Status" }]} rows={[{ key: "ORG-CURRENCY", name: "Organisation currency", category: "Finance", value: "AED", updated: "02 Sep 2026", status: "Active" }, { key: "PO-TOLERANCE", name: "Purchase order tolerance", category: "Controls", value: "3%", updated: "01 Sep 2026", status: "Active" }, { key: "INV-MATCH", name: "Invoice matching", category: "Finance", value: "3-way match", updated: "28 Aug 2026", status: "Active" }, { key: "NOTIFY-EX", name: "Exception notifications", category: "Notifications", value: "Enabled", updated: "25 Aug 2026", status: "Active" }]} />
      <EnterpriseControls />
    </div>
  );
}
