"use client";

import { useState } from "react";
import { CheckCircle, ChevronDown, UserPlus } from "lucide-react";

type ExceptionActionsProps = { exceptionId: string; compact?: boolean };

export default function ExceptionActions({ exceptionId, compact = false }: ExceptionActionsProps) {
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState(compact);
  const [modal, setModal] = useState("");
  const act = (action: string) => { setMessage(`${action} for ${exceptionId}.`); setModal(action); };
  const controls = <div className="exception-action-controls">
    <button className="btn btn-secondary" onClick={() => act(compact ? "Reviewer assignment opened" : "Reviewer assigned")}><UserPlus size={compact ? 13 : 14} /> {compact ? "Assign" : "Assign Reviewer"}</button>
    {!compact && <button className="btn btn-accent" onClick={() => act("Review requested")}>Request Review</button>}
    <button className={compact ? "btn btn-accent" : "btn btn-primary"} onClick={() => act(compact ? "Exception marked resolved" : "Exception resolved")}><CheckCircle size={compact ? 14 : 13} /> {compact ? "Mark Resolved" : "Resolve"}</button>
  </div>;
  return <>
    {compact ? controls : <div className="exception-action-panel"><button className="exception-action-toggle" onClick={() => setExpanded((current) => !current)}><span><CheckCircle size={15} /> Available Actions</span><ChevronDown size={16} className={expanded ? "is-open" : ""} /></button><div className={`exception-action-body ${expanded ? "is-open" : ""}`}>{controls}</div></div>}
    {message && <div className="action-confirmation" role="status">{message}<button type="button" onClick={() => setMessage("")}>Dismiss</button></div>}
    {modal && <div className="dialog-backdrop" role="presentation" onClick={() => setModal("")}><div className="dialog action-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><div className="dialog-header"><div><div className="card-title">Action completed</div><div className="card-subtitle">Exception workflow update</div></div><button type="button" className="btn btn-ghost btn-sm" onClick={() => setModal("")}>Close</button></div><div className="dialog-body"><div className="action-modal-icon"><CheckCircle size={24} /></div><strong>{modal}</strong><p className="text-secondary">The action was recorded for exception <span className="mono-cell">{exceptionId}</span>.</p><div className="dialog-actions"><button className="btn btn-primary" onClick={() => setModal("")}>Done</button></div></div></div></div>}
  </>;
}
