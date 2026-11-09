"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return <main className="auth-page"><div className="auth-panel"><div className="auth-brand"><div className="auth-mark">B</div><div><strong>Baraka</strong><span>Enterprise Operations Platform</span></div></div><div className="auth-heading"><span className="eyebrow"><ShieldCheck size={13} /> Secure workspace</span><h1>Welcome back</h1><p>Sign in to continue to your operations workspace.</p></div><form className="auth-form" onSubmit={submit}><div className="form-group"><label className="form-label" htmlFor="email">Work email</label><div className="input-with-icon"><Mail size={15} /><input id="email" className="form-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@company.com" required /></div></div><div className="form-group"><label className="form-label" htmlFor="password">Password</label><div className="input-with-icon"><LockKeyhole size={15} /><input id="password" className="form-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /></div></div>{message && <div className="auth-error" role="alert">{message}</div>}<button className="btn btn-primary auth-submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}<ArrowRight size={15} /></button><div className="demo-entry-divider"><span>Demo access</span></div><button type="button" className="btn btn-secondary auth-submit" onClick={() => router.push("/demo/manager")}>Explore Manager Demo</button><button type="button" className="btn btn-secondary auth-submit" style={{ marginTop: 8 }} onClick={() => router.push("/demo/employee")}>Explore Employee Demo</button></form><p className="auth-note">Access is managed by your organisation administrator.</p></div><div className="auth-aside"><div className="auth-aside-content"><span className="eyebrow">Baraka control system</span><h2>One clear view of the work that moves your business.</h2><p>Finance, inventory, procurement, and control workflows in one accountable workspace.</p><div className="auth-stat-row"><span><strong>99.98%</strong> uptime</span><span><strong>4</strong> queues monitored</span></div></div></div></main>;
}