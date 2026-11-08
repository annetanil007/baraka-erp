import ModulePage from "@/components/shared/ModulePage";
import ReportCharts from "@/components/intelligence/ReportCharts";

export default function Page() {
  return (
    <div>
      <ReportCharts variant="inventory" />
      <ModulePage title="Inventory Reports" description="Stock valuation, demand coverage and warehouse movement." actionLabel="Build report" stats={[{ label: "Inventory value", value: "AED 4.2M" }, { label: "Stock coverage", value: "28 days" }, { label: "Low stock items", value: "3", tone: "warning" }, { label: "Accuracy", value: "99.1%", tone: "success" }]} columns={[{ key: "id", label: "Report", mono: true }, { key: "name", label: "Report name" }, { key: "scope", label: "Scope" }, { key: "period", label: "Period" }, { key: "owner", label: "Owner" }, { key: "status", label: "Status" }]} rows={[{ id: "RPT-INV-09", name: "Stock valuation", scope: "All branches", period: "Aug 2026", owner: "Inventory", status: "Completed" }, { id: "RPT-INV-08", name: "Demand coverage", scope: "Main Warehouse", period: "Sep 2026", owner: "Inventory", status: "Completed" }, { id: "RPT-INV-07", name: "Movement summary", scope: "All branches", period: "Q3 2026", owner: "Operations", status: "Scheduled" }]} />
    </div>
  );
}
