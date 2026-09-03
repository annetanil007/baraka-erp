import ModulePage from "@/components/ModulePage";
import ReportCharts from "@/components/ReportCharts";

export default function Page() {
  return (
    <div>
      <ReportCharts variant="operational" />
      <ModulePage title="Operational Reports" description="Service levels, order throughput and exception performance." actionLabel="Build report" stats={[{ label: "Orders this month", value: "1,284" }, { label: "Fulfilment rate", value: "96.8%", tone: "success" }, { label: "Avg. cycle time", value: "2.4 days" }, { label: "Exceptions resolved", value: "87%", tone: "info" }]} columns={[{ key: "id", label: "Report", mono: true }, { key: "name", label: "Report name" }, { key: "period", label: "Period" }, { key: "owner", label: "Owner" }, { key: "updated", label: "Updated" }, { key: "status", label: "Status" }]} rows={[{ id: "RPT-OPS-09", name: "Order fulfilment", period: "Aug 2026", owner: "Operations", updated: "01 Sep 2026", status: "Completed" }, { id: "RPT-OPS-08", name: "Exception resolution", period: "Aug 2026", owner: "Control", updated: "01 Sep 2026", status: "Completed" }, { id: "RPT-OPS-07", name: "Branch productivity", period: "Q3 2026", owner: "Executive Management", updated: "30 Aug 2026", status: "Scheduled" }]} />
    </div>
  );
}
