import ModulePage from "@/components/ModulePage";

export default function Page() {
  return (
    <div>
      <ModulePage title="Purchase Requests" description="Internal requests routed through policy-aware approval workflows." actionLabel="New request" stats={[{ label: "Awaiting approval", value: "8", tone: "warning" }, { label: "Requested this month", value: "AED 684,200" }, { label: "Approved", value: "32", tone: "success" }, { label: "Avg. cycle time", value: "1.8 days" }]} columns={[{ key: "id", label: "Request", mono: true }, { key: "requester", label: "Requester" }, { key: "department", label: "Department" }, { key: "amount", label: "Estimated value", numeric: true }, { key: "status", label: "Status" }, { key: "date", label: "Submitted" }]} rows={[{ id: "PR-2026-00201", requester: "Mariam Al Zaabi", department: "Operations", amount: "AED 95,000", status: "Pending", date: "01 Sep 2026" }, { id: "PR-2026-00200", requester: "Sara Al Rashidi", department: "Finance", amount: "AED 8,400", status: "Approved", date: "01 Sep 2026" }, { id: "PR-2026-00199", requester: "Khalid Hassan", department: "Inventory", amount: "AED 42,500", status: "Approved", date: "31 Aug 2026" }, { id: "PR-2026-00198", requester: "Ahmed Al Mansouri", department: "Procurement", amount: "AED 18,600", status: "Rejected", date: "30 Aug 2026" }]} />
    </div>
  );
}
