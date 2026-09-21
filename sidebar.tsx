"use client";

import type { App, ViewKey } from "@/lib/types";
import { useLang } from "@/lib/i18n";

const icons: Record<string, string[]> = {
  database: [
    "M12 2C7 2 3 3.6 3 6v12c0 2.4 4 4 9 4s9-1.6 9-4V6c0-2.4-4-4-9-4z",
    "M3 6c0 2.4 4 4 9 4s9-1.6 9-4",
    "M3 12c0 2.4 4 4 9 4s9-1.6 9-4",
    "M3 18c0 2.4 4 4 9 4s9-1.6 9-4",
  ],
  mail: ["M4 4h16v16H4z", "M4 6l8 7 8-7"],
  download: ["M12 3v12", "M7 10l5 5 5-5", "M4 21h16"],
  dashboard: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M3 14h7v7H3z", "M14 14h7v7h-7z"],
  unique: ["M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z", "M19 3l.7 1.8 1.8.7-1.8.7L19 8l-.7-1.8L16.5 5.5l1.8-.7z"],
  plus: ["M12 5v14", "M5 12h14"],
  patients: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  history: ["M12 3a9 9 0 1 0 9 9", "M12 7v5l3 3", "M21 3v5h-5"],
  imaging: ["M3 5h18v14H3z", "M8.5 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z", "M21 15l-5-5-11 10"],
  clinical: ["M9 3h6", "M10 3v6l-5 8.5A2 2 0 0 0 6.8 21h10.4a2 2 0 0 0 1.8-3.5L14 9V3", "M7.5 15h9"],
  multimodal: ["M12 2 2 8l10 6 10-6z", "M2 16l10 6 10-6"],
  explainability: ["M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  uncertainty: ["M20.5 15.5a9 9 0 1 0-17 0", "M12 15l3.5-4.5", "M12 12h.01"],
  review: ["M12 2l8 4v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6z", "M9 12l2 2 4-4.5"],
  reports: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M9 13h6", "M9 17h6"],
  qa: ["M21 12a9 9 0 1 1-2.6-6.4", "M21 3v6h-6"],
  models: ["M6 6h12v12H6z", "M10 10h4v4h-4z", "M9 2v4", "M15 2v4", "M9 18v4", "M15 18v4", "M2 9h4", "M2 15h4", "M18 9h4", "M18 15h4"],
  audit: ["M8 6h13", "M8 12h13", "M8 18h13", "M3.5 6h.01", "M3.5 12h.01", "M3.5 18h.01"],
  settings: [
    "M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  ],
};

export function Icon({ name, className = "size-4" }: { name: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {(icons[name] || []).map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

const NAV: { group: string; items: { key: ViewKey; tkey: string; icon: string }[] }[] = [
  {
    group: "Overview",
    items: [
      { key: "dashboard", tkey: "nav.dashboard", icon: "dashboard" },
      { key: "unique", tkey: "nav.unique", icon: "unique" },
    ],
  },
  {
    group: "Clinical Workflow",
    items: [
      { key: "new-analysis", tkey: "nav.newAnalysis", icon: "plus" },
      { key: "patients", tkey: "nav.patients", icon: "patients" },
      { key: "history", tkey: "nav.history", icon: "history" },
      { key: "imaging", tkey: "nav.imaging", icon: "imaging" },
      { key: "clinical", tkey: "nav.clinical", icon: "clinical" },
      { key: "multimodal", tkey: "nav.multimodal", icon: "multimodal" },
    ],
  },
  {
    group: "Trust & Explainability",
    items: [
      { key: "explainability", tkey: "nav.explainability", icon: "explainability" },
      { key: "uncertainty", tkey: "nav.uncertainty", icon: "uncertainty" },
      { key: "reviews", tkey: "nav.reviews", icon: "review" },
      { key: "reports", tkey: "nav.reports", icon: "reports" },
    ],
  },
  {
    group: "Governance",
    items: [
      { key: "qa", tkey: "nav.qa", icon: "qa" },
      { key: "models", tkey: "nav.models", icon: "models" },
      { key: "audit", tkey: "nav.audit", icon: "audit" },
      { key: "settings", tkey: "nav.settings", icon: "settings" },
    ],
  },
  {
    group: "Open Research Resources",
    items: [{ key: "datasets", tkey: "nav.datasets", icon: "database" }],
  },
  {
    group: "Communication",
    items: [{ key: "messages", tkey: "nav.messages", icon: "mail" }],
  },
];

export function Sidebar({ app, open, onClose }: { app: App; open: boolean; onClose: () => void }) {
  const { t } = useLang();
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="grid size-11 place-items-center rounded-2xl bg-teal-400 font-display text-base font-extrabold text-slate-950">Hx</div>
          <div className="min-w-0">
            <p className="truncate font-display text-[15px] font-extrabold tracking-wide">HEPATOXAI</p>
            <p className="truncate text-[11px] font-semibold text-slate-400">Research build v0.1</p>
          </div>
          <button onClick={onClose} className="ml-auto grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-white/10 lg:hidden" aria-label="Close menu">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((group) => (
            <div key={group.group} className="mb-5">
              <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">{group.group}</p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = app.view === item.key || (app.view === "analysis" && item.key === "new-analysis");
                  return (
                    <li key={item.key}>
                      <button
                        onClick={() => {
                          app.navigate(item.key);
                          onClose();
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold transition ${
                          active ? "bg-teal-400/15 text-teal-200 ring-1 ring-teal-300/25" : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon name={item.icon} className={`size-4 ${active ? "text-teal-300" : "text-slate-500"}`} />
                        {t(item.tkey)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-500/20 font-display text-sm font-extrabold text-teal-200 ring-1 ring-teal-300/30">
              {app.session.name
                .split(" ")
                .filter((w) => !w.endsWith("."))
                .slice(0, 2)
                .map((w) => w[0])
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold">{app.session.name}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-teal-300/80">{app.session.role}</p>
            </div>
            <button onClick={app.logout} className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white" aria-label="Sign out" title="Sign out">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
            </button>
          </div>
          <p className="mt-3 text-center text-[10px] font-semibold text-slate-500">Doctor-in-the-loop · Not a standalone diagnosis</p>
        </div>
      </aside>
    </>
  );
}
