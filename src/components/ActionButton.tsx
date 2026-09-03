"use client";

import { useState } from "react";

type ActionButtonProps = { label: string; className?: string; children?: React.ReactNode };

export default function ActionButton({ label, className = "btn btn-secondary btn-sm", children }: ActionButtonProps) {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" className={className} onClick={() => setOpen(true)}>{children || label}</button>
    {open && <div className="dialog-backdrop" role="presentation" onClick={() => setOpen(false)}><div className="dialog action-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><div className="dialog-header"><div><div className="card-title">{label}</div><div className="card-subtitle">Baraka workflow action</div></div><button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Close</button></div><div className="dialog-body"><p className="text-secondary">{label} is ready to be completed. Connect this workflow to your Supabase records when you are ready to persist the action.</p><div className="dialog-actions"><button type="button" className="btn btn-primary" onClick={() => setOpen(false)}>Done</button></div></div></div></div>}
  </>;
}
