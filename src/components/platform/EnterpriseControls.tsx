"use client";

import { ChangeEvent, useRef, useState } from "react";
import { CheckCircle2, Download, FileJson, LockKeyhole, ShieldCheck, Upload } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";

type SettingsBackup = { exportedAt: string; retentionDays: number; mfaRequired: boolean; apiAccess: boolean };

export default function EnterpriseControls() {
  const [retentionDays, setRetentionDays] = useLocalStorage("baraka:retention-days", 365);
  const [mfaRequired, setMfaRequired] = useLocalStorage("baraka:mfa-required", false);
  const [apiAccess, setApiAccess] = useLocalStorage("baraka:api-access", false);
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const notify = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(""), 3000); };
  const exportSettings = () => {
    const backup: SettingsBackup = { exportedAt: new Date().toISOString(), retentionDays, mfaRequired, apiAccess };
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
    link.download = "baraka-settings-backup.json";
    link.click();
    URL.revokeObjectURL(link.href);
    notify("Settings backup exported.");
  };
  const importSettings = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as Partial<SettingsBackup>;
        if (typeof data.retentionDays !== "number" || typeof data.mfaRequired !== "boolean" || typeof data.apiAccess !== "boolean") throw new Error("Invalid settings backup.");
        setRetentionDays(data.retentionDays);
        setMfaRequired(data.mfaRequired);
        setApiAccess(data.apiAccess);
        notify("Settings backup imported.");
      } catch (error) {
        notify(error instanceof Error ? error.message : "Unable to import settings backup.");
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  return <section className="enterprise-controls">
    <div className="section-heading">Enterprise controls <span className="section-heading-note">Local policy workspace · connect Supabase policies before production rollout</span></div>
    <div className="enterprise-control-grid">
      <div className="card enterprise-control-card"><div className="enterprise-control-heading"><ShieldCheck size={17} /><div><strong>Authentication posture</strong><span>Supabase Auth remains the production identity boundary.</span></div></div><label className="setting-toggle"><input type="checkbox" checked={mfaRequired} onChange={(event) => setMfaRequired(event.target.checked)} /><span>Require MFA policy</span></label><div className="setting-status"><CheckCircle2 size={13} /> Session refresh enforced by middleware</div></div>
      <div className="card enterprise-control-card"><div className="enterprise-control-heading"><LockKeyhole size={17} /><div><strong>Data governance</strong><span>Define how long operational records remain available.</span></div></div><label className="form-label" htmlFor="retention-days">Retention period</label><div className="retention-input"><input id="retention-days" className="form-input" type="number" min={30} max={3650} value={retentionDays} onChange={(event) => setRetentionDays(Number(event.target.value))} /><span>days</span></div><div className="setting-status">Policy target: {retentionDays} days</div></div>
      <div className="card enterprise-control-card"><div className="enterprise-control-heading"><FileJson size={17} /><div><strong>Integration access</strong><span>Keep API access disabled until a server-side key vault is configured.</span></div></div><label className="setting-toggle"><input type="checkbox" checked={apiAccess} onChange={(event) => setApiAccess(event.target.checked)} /><span>Enable API integration policy</span></label><div className="setting-status">{apiAccess ? "Policy enabled; no secret is stored in the browser." : "Currently disabled"}</div></div>
    </div>
    <div className="enterprise-backup-bar"><div><strong>Backup and recovery</strong><span>Export or restore non-secret workspace policies for controlled handoff.</span></div><div className="enterprise-backup-actions"><button className="btn btn-secondary btn-sm" onClick={exportSettings}><Download size={13} /> Export settings</button><button className="btn btn-secondary btn-sm" onClick={() => fileInput.current?.click()}><Upload size={13} /> Import settings</button><input ref={fileInput} type="file" accept="application/json" onChange={importSettings} hidden /></div></div>
    {message && <div className="toast" role="status">{message}</div>}
  </section>;
}
