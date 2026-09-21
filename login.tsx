"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@/lib/types";
import { Badge, Button, inputCls } from "./ui";

const roles = [
  { label: "Doctor", email: "doctor@hepatoxai.local", desc: "Full clinical workflow" },
  { label: "Nurse", email: "nurse@hepatoxai.local", desc: "Records & review" },
  { label: "Researcher", email: "research@hepatoxai.local", desc: "Models & QA" },
  { label: "Patient", email: "patient@hepatoxai.local", desc: "Open access view" },
];

const pillars = [
  { title: "Multimodal fusion", desc: "CT/MRI imaging features fused with clinical laboratory and history features before prediction." },
  { title: "Dual explainability", desc: "Grad-CAM answers WHERE on the image; SHAP answers WHY across clinical features." },
  { title: "Calibrated uncertainty", desc: "Every output carries LOW / MODERATE / HIGH uncertainty with an explicit review recommendation." },
  { title: "Doctor-in-the-loop", desc: "No case is closed without a recorded professional decision: Approved, Query, or Rejected." },
  { title: "Audit & versioning", desc: "Immutable audit trail, model registry, and patient-level validation integrity with a locked test set." },
];

export function LoginScreen({ onLogin }: { onLogin: (s: Session) => void }) {
  const [email, setEmail] = useState("doctor@hepatoxai.local");
  const [password, setPassword] = useState("demo-pass-2026");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign-in failed.");
      onLogin({ name: data.user.name, email: data.user.email, role: data.user.role, token: data.token });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-slate-950 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-[#072a2e] to-teal-950 p-10 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{ backgroundImage: "radial-gradient(#5eead4 1px, transparent 1px)", backgroundSize: "26px 26px" }}
        />
        <div className="relative flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-teal-400 font-display text-lg font-extrabold text-slate-950">Hx</div>
          <div>
            <p className="font-display text-lg font-extrabold tracking-wide">HEPATOXAI</p>
            <p className="text-xs font-semibold text-teal-200">Liver Cancer Decision Support</p>
          </div>
        </div>

        <div className="relative">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-teal-300">Research Prototype</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl font-extrabold leading-tight">
            Multimodal, explainable &amp; uncertainty-aware liver cancer decision support
          </h1>
          <ul className="mt-8 max-w-xl space-y-4">
            {pillars.map((p) => (
              <li key={p.title} className="flex gap-3">
                <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-teal-400/20 text-teal-300 ring-1 ring-teal-300/30">
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12l5 5L20 7" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold">{p.title}</p>
                  <p className="mt-0.5 text-xs font-medium leading-5 text-teal-100/70">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative rounded-2xl border border-amber-300/30 bg-amber-400/10 p-4 text-xs font-semibold leading-5 text-amber-100">
          Research prototype. AI-generated outputs require appropriate qualified professional review and are not a standalone diagnosis.
        </div>
      </div>

      <div className="flex items-center justify-center bg-[#f5f8fa] px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid size-11 place-items-center rounded-2xl bg-teal-700 font-display text-base font-extrabold text-white">Hx</div>
            <div>
              <p className="font-display text-base font-extrabold text-slate-950">HEPATOXAI</p>
              <p className="text-xs font-semibold text-slate-500">Liver Cancer Decision Support</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-extrabold text-slate-950">Clinical sign-in</h2>
              <Badge tone="teal">Phase 2 · Frontend</Badge>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-500">Access the research workspace with a demo role.</p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {roles.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => setEmail(r.email)}
                  className={`rounded-xl border px-2 py-2.5 text-center transition ${
                    email === r.email ? "border-teal-600 bg-teal-50 ring-2 ring-teal-600/20" : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-xs font-extrabold text-slate-900">{r.label}</span>
                  <span className="mt-0.5 block text-[10px] font-semibold leading-3 text-slate-500">{r.desc}</span>
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</span>
                <input className={inputCls} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@hepatoxai.local" />
              </label>
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Password</span>
                <input className={inputCls} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Any password for the research demo" />
              </label>
              {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 ring-1 ring-rose-200">{error}</p>}
              <Button type="submit" loading={pending} className="w-full">
                {pending ? "Authenticating…" : "Enter workspace"}
              </Button>
            </form>
          </div>

          <p className="mt-5 text-center text-[11px] font-semibold leading-5 text-slate-400">
            Placeholder authentication for the research prototype. Production JWT, bcrypt, and rate-limiting hardening are scheduled for the backend phase.
            No identifiable patient data is used in this environment.
          </p>
        </div>
      </div>
    </div>
  );
}
