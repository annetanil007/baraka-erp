import Link from "next/link";
import {
  ArrowUpRight, CheckCircle2, ClipboardList, Clock3, PackageCheck,
  Plus, ShieldAlert, ShoppingCart,
} from "lucide-react";
import { mockApprovals, mockExceptions, mockInventory } from "@/lib/mock-data";

const employeeTasks = [
  { title: "Complete receiving check", detail: "Verify 24 units against GRN-2026-00112", href: "/procurement/receiving", icon: PackageCheck, tone: "warning" },
  { title: "Prepare purchase request", detail: "Industrial Filter Type A needs replenishment", href: "/procurement/requests", icon: ShoppingCart, tone: "info" },
  { title: "Review assigned exception", detail: "Invoice mismatch requires supporting documents", href: "/control/exceptions/EX-2026-00184", icon: ShieldAlert, tone: "danger" },
];

export default function EmployeeWorkspacePage() {
  const pendingApprovals = mockApprovals.filter((approval) => approval.status === "Pending");
  const assignedExceptions = mockExceptions.filter((exception) => exception.assignedTo === "Accounts Team" || exception.assignedTo === "Procurement");
  const lowStock = mockInventory.filter((item) => item.status !== "OK").slice(0, 3);

  return (
    <div className="employee-workspace">
      <section className="employee-hero">
        <div>
          <div className="eyebrow"><ClipboardList size={13} /> Employee workspace</div>
          <h1 className="page-title">Good evening, Ahmed</h1>
          <p className="page-description">Your work queue, requests, and operational updates in one place.</p>
        </div>
        <Link className="btn btn-primary btn-sm" href="/procurement/requests"><Plus size={14} /> New request</Link>
      </section>

      <section className="employee-summary-grid">
        <div className="employee-summary-card"><span>My open tasks</span><strong>3</strong><small>Due today</small></div>
        <div className="employee-summary-card"><span>Pending approvals</span><strong>{pendingApprovals.length}</strong><small>Waiting for manager review</small></div>
        <div className="employee-summary-card"><span>Assigned exceptions</span><strong>{assignedExceptions.length}</strong><small>Need supporting action</small></div>
        <div className="employee-summary-card"><span>Shift status</span><strong className="employee-status"><i /> Active</strong><small>Head Office · 08:00–17:00</small></div>
      </section>

      <div className="employee-main-grid">
        <section className="card">
          <div className="card-header">
            <div><div className="card-title">My work queue</div><div className="card-subtitle">Prioritized actions for your role</div></div>
            <span className="badge badge-warning">3 open</span>
          </div>
          <div className="employee-task-list">
            {employeeTasks.map((task) => (
              <Link className="employee-task" href={task.href} key={task.title}>
                <span className={`employee-task-icon ${task.tone}`}><task.icon size={16} /></span>
                <span><strong>{task.title}</strong><small>{task.detail}</small></span>
                <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div><div className="card-title">Quick actions</div><div className="card-subtitle">Common tasks without the clutter</div></div>
          </div>
          <div className="employee-quick-actions">
            <Link href="/operations/sales"><Plus size={15} /> Create sales order</Link>
            <Link href="/procurement/requests"><ShoppingCart size={15} /> Request stock</Link>
            <Link href="/procurement/receiving"><PackageCheck size={15} /> Record receiving</Link>
            <Link href="/control/exceptions"><ShieldAlert size={15} /> Report an issue</Link>
          </div>
        </section>
      </div>

      <div className="employee-secondary-grid">
        <section className="card">
          <div className="card-header"><div><div className="card-title">Stock signals</div><div className="card-subtitle">Items needing operational attention</div></div><Link href="/operations/inventory" className="text-link">View inventory <ArrowUpRight size={12} /></Link></div>
          <div className="employee-list">{lowStock.map((item) => <div className="employee-list-row" key={item.id}><PackageCheck size={15} /><span><strong>{item.name}</strong><small>{item.stock} {item.unit} remaining · {item.branch}</small></span><span className="badge badge-warning">{item.status}</span></div>)}</div>
        </section>
        <section className="card">
          <div className="card-header"><div><div className="card-title">Today&apos;s rhythm</div><div className="card-subtitle">Keep work moving on time</div></div></div>
          <div className="employee-list">
            <div className="employee-list-row"><Clock3 size={15} /><span><strong>Morning handover</strong><small>Completed · 08:15</small></span><CheckCircle2 size={15} className="employee-complete" /></div>
            <div className="employee-list-row"><Clock3 size={15} /><span><strong>Warehouse reconciliation</strong><small>Due by 14:00 today</small></span><span className="badge badge-warning">Due soon</span></div>
            <div className="employee-list-row"><Clock3 size={15} /><span><strong>End-of-day update</strong><small>Submit before shift close</small></span><span className="badge badge-neutral">Pending</span></div>
          </div>
        </section>
      </div>
    </div>
  );
}
