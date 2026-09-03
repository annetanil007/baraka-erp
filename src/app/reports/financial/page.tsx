import ModulePage from "@/components/ModulePage";
import ReportCharts from "@/components/ReportCharts";

export default function Page() {
  return (
    <div>
      <ReportCharts variant="financial" />
      <ModulePage title="Financial Reports" description="Revenue, expenditure, payment and budget reports." actionLabel="Build report" stats={[{ label: "Revenue YTD", value: "AED 14.8M", tone: "success" }, { label: "Gross margin", value: "31.4%" }, { label: "Outstanding AR", value: "AED 1.26M", tone: "warning" }, { label: "Cash position", value: "AED 842K" }]} columns={[{ key: "id", label: "Report", mono: true }, { key: "name", label: "Report name" }, { key: "period", label: "Period" }, { key: "amount", label: "Total", numeric: true }, { key: "owner", label: "Owner" }, { key: "status", label: "Status" }]} rows={[{ id: "RPT-FIN-09", name: "Management P&L", period: "Aug 2026", amount: "AED 1.84M", owner: "Finance", status: "Completed" }, { id: "RPT-FIN-08", name: "Cash flow forecast", period: "Sep 2026", amount: "AED 842K", owner: "Finance", status: "Scheduled" }, { id: "RPT-FIN-07", name: "Accounts receivable aging", period: "Aug 2026", amount: "AED 1.26M", owner: "Finance", status: "Completed" }]} />
    </div>
  );
}
