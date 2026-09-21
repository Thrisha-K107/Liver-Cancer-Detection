"use client";

import { Badge } from "./ui";

export function ArchitectureFlowchart() {
  const nodes = [
    { n: 1, title: "Doctor intake", sub: "Patient + case, CT/MRI, clinical", live: true },
    { n: 2, title: "HepatoXAI UI", sub: "Workflow, review, reports", live: true },
    { n: 3, title: "Inference service", sub: "imaging · screening · fusion APIs", live: true },
    { n: 4, title: "Imaging AI", sub: "Pixel extraction + attribution", live: true },
    { n: 5, title: "Clinical AI", sub: "Rule engine + exact SHAP", live: true },
    { n: 6, title: "Multimodal fusion", sub: "MC-perturbed channel fusion", live: true },
    { n: 7, title: "Grad-CAM · SHAP · Uncertainty", sub: "WHERE · WHY · HOW SURE", live: true },
    { n: 8, title: "Doctor review", sub: "Approved / Query / Rejected", live: true },
    { n: 9, title: "Report + PostgreSQL", sub: "Versioned, persisted", live: true },
    { n: 10, title: "QA loop", sub: "Feed improvement → next model", live: true },
  ];
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
      {nodes.map((node) => (
        <div key={node.n} className="relative rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-6 place-items-center rounded-lg bg-slate-950 font-display text-[10px] font-extrabold text-white">{node.n}</span>
            <Badge tone={node.live ? "green" : "slate"}>{node.live ? "LIVE" : "Planned"}</Badge>
          </div>
          <p className="mt-2 text-[12px] font-extrabold leading-4 text-slate-900">{node.title}</p>
          <p className="mt-0.5 text-[10px] font-semibold leading-4 text-slate-500">{node.sub}</p>
          {node.n < nodes.length && (
            <svg className="absolute -bottom-3 left-1/2 z-10 h-3 w-6 -translate-x-1/2 text-slate-300 lg:left-auto lg:right-1 lg:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v12" />
              <path d="M6 12l6 6 6-6" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

const rows = [
  { feature: "Model explainability", existing: "Black-box deep CNNs; saliency rarely shipped", hepato: "Exact SHAP + pixel attribution maps on every case", acc: "Trust & auditability" },
  { feature: "Uncertainty awareness", existing: "Single probability, no confidence band", hepato: "150-sample MC ensemble → LOW / MODERATE / HIGH + review gate", acc: "Safer decisions" },
  { feature: "Modality handling", existing: "CT-only or MRI-only pipelines", hepato: "Multimodal fusion: imaging + clinical features fused into one index", acc: "Higher robustness" },
  { feature: "Doctor accountability", existing: "AI output shown as final answer", hepato: "Mandatory doctor decision (Approved/Query/Rejected) before reports", acc: "Clinical safety" },
  { feature: "Validation integrity", existing: "Study-level splits, test-set tuning common", hepato: "Patient-level splits, locked test set, seeded reproducibility", acc: "Honest metrics" },
  { feature: "Accuracy reporting", existing: "90–98% claims, rarely reproducible", hepato: "Measured values published only after locked-test evaluation — target ≥95% documented as an experimental hypothesis", acc: "No fabrication" },
  { feature: "Traceability", existing: "No model versioning or audit log", hepato: "Versioned model registry + immutable audit trail per action", acc: "Governance" },
  { feature: "Patient access", existing: "English-only clinician tools", hepato: "Patient role + 12 languages + direct email notifications", acc: "No language barrier" },
];

export function TechStackFlowchart() {
  const nodes = [
    { x: 20, y: 16, w: 250, h: 62, t: "DOCTOR / PATIENT INTAKE", s: "CT/MRI + clinical data", c: "#0f766e" },
    { x: 360, y: 16, w: 250, h: 62, t: "FRONTEND · Next.js 16", s: "React 19 · Tailwind 4 · TypeScript", c: "#115e59" },
    { x: 700, y: 16, w: 250, h: 62, t: "REST API LAYER", s: "Next.js Route Handlers · Drizzle", c: "#0f766e" },
    { x: 20, y: 128, w: 310, h: 62, t: "IMAGING ENGINE", s: "Pixel extraction · heatmap", c: "#0369a1" },
    { x: 420, y: 128, w: 310, h: 62, t: "CLINICAL ENGINE", s: "Rule scoring · exact SHAP 2ⁿ", c: "#0369a1" },
    { x: 210, y: 240, w: 340, h: 62, t: "MULTIMODAL FUSION", s: "MC weight ensemble · 150 runs", c: "#134e4a" },
    { x: 20, y: 352, w: 230, h: 62, t: "ATTRIBUTION HEATMAP", s: "WHERE on image", c: "#b45309" },
    { x: 285, y: 352, w: 230, h: 62, t: "EXACT SHAP", s: "WHY per parameter", c: "#b45309" },
    { x: 550, y: 352, w: 250, h: 62, t: "UNCERTAINTY BAND", s: "LOW · MOD · HIGH (σ)", c: "#b45309" },
    { x: 20, y: 464, w: 300, h: 62, t: "DOCTOR REVIEW", s: "Approved / Query / Rejected", c: "#7c2d12" },
    { x: 380, y: 464, w: 300, h: 62, t: "POSTGRESQL + REPORTS", s: "Drizzle ORM · printable PDF", c: "#7c2d12" },
    { x: 740, y: 464, w: 260, h: 62, t: "QA LOOP → vNEXT", s: "Retrain · registry · audit", c: "#7c2d12" },
  ];
  const arrows: [number, number, number, number][] = [
    [270, 47, 360, 47], [610, 47, 700, 47],
    [825, 78, 825, 100], [825, 100, 175, 128], [825, 100, 575, 128],
    [175, 190, 380, 240], [575, 190, 380, 240],
    [380, 302, 135, 352], [380, 302, 400, 352], [380, 302, 675, 352],
    [135, 414, 170, 464], [400, 414, 400, 464], [675, 414, 630, 464],
    [320, 495, 380, 495], [680, 495, 740, 495],
  ];
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 1000 550" className="min-w-[820px]" role="img" aria-label="HepatoXAI architecture flowchart with tech stack">
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="#94a3b8" />
          </marker>
        </defs>
        {arrows.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="1.6" markerEnd="url(#arrowhead)" />
        ))}
        {nodes.map((n) => (
          <g key={n.t}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="12" fill="#ffffff" stroke={n.c} strokeWidth="1.6" />
            <rect x={n.x} y={n.y} width={n.w} height="5" rx="2.5" fill={n.c} />
            <text x={n.x + n.w / 2} y={n.y + 28} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#0f172a" fontFamily="Sora, sans-serif">
              {n.t}
            </text>
            <text x={n.x + n.w / 2} y={n.y + 47} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#475569" fontFamily="Manrope, sans-serif">
              {n.s}
            </text>
          </g>
        ))}
      </svg>
      <p className="mt-2 text-center text-[11px] font-bold text-slate-400">
        Full tech stack: Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Drizzle ORM · PostgreSQL · Vercel · future ML: PyTorch, MONAI, scikit-learn, XGBoost, OpenCV, pydicom, NiBabel, SHAP, Grad-CAM
      </p>
    </div>
  );
}

export function TechStackGrid() {
  const stacks = [
    { cat: "Frontend & UX", chips: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "SVG charts", "13-language i18n (incl. ಕನ್ನಡ)"] },
    { cat: "Backend & APIs", chips: ["Next.js Route Handlers (REST)", "Drizzle ORM", "Pydantic-style validation", "Structured error responses"] },
    { cat: "Database", chips: ["PostgreSQL (live)", "11 core tables + screenings, fusion, imaging, messages", "Object-storage scan references", "Audit trail"] },
    { cat: "AI Engines (live)", chips: ["Quantitative Imaging Extractor", "Transparent Rule Engine (BCLC 2022)", "Exact SHAP (2ⁿ enumeration)", "MC Uncertainty Ensemble (150 runs)", "Attribution heatmap"] },
    { cat: "ML Pipeline (Phase 3–6)", chips: ["PyTorch", "MONAI", "scikit-learn", "XGBoost", "OpenCV", "pydicom", "NiBabel", "Grad-CAM", "Platt/Isotonic calibration"] },
    { cat: "Ops & Governance", chips: ["Vercel deploy", "Neon/Supabase Postgres", "Docker", "GitHub Actions", "Patient-level splits", "Locked test set"] },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stacks.map((s) => (
        <div key={s.cat} className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[12px] font-extrabold uppercase tracking-wide text-teal-800">{s.cat}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {s.chips.map((c) => (
              <span key={c} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 ring-1 ring-slate-200">
                {c}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ComparisonTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-950 text-left text-[11px] font-extrabold uppercase tracking-wide text-white">
            <tr>
              <th className="px-4 py-3">Capability</th>
              <th className="px-4 py-3">Existing solutions</th>
              <th className="px-4 py-3 text-teal-300">My non-existing unique HepatoXAI solution</th>
              <th className="px-4 py-3">Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((r) => (
              <tr key={r.feature} className="align-top hover:bg-teal-50/30">
                <td className="px-4 py-3 text-[13px] font-extrabold text-slate-900">{r.feature}</td>
                <td className="px-4 py-3 text-[12px] font-medium leading-5 text-slate-500">{r.existing}</td>
                <td className="px-4 py-3 text-[12px] font-semibold leading-5 text-teal-900">{r.hepato}</td>
                <td className="px-4 py-3"><Badge tone="green">{r.acc}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function WorkflowChart() {
  const steps = [
    { s: "Step 1", t: "Doctor creates patient + case", d: "De-identified registration with CT/MRI study reference" },
    { s: "Step 2", t: "Clinical data captured", d: "AFP, ALT, AST, cirrhosis, age, sex, Child-Pugh, tumor burden" },
    { s: "Step 3", t: "Imaging pipeline runs", d: "Pixel features + attribution heatmap (WHERE)" },
    { s: "Step 4", t: "Clinical engine + exact SHAP", d: "Risk score 0–100 with exact Shapley attributions (WHY)" },
    { s: "Step 5", t: "Multimodal fusion", d: "Clinical + imaging fused with MC weight perturbation → fused index" },
    { s: "Step 6", t: "Uncertainty band", d: "LOW / MODERATE / HIGH from 150 ensemble samples (HOW SURE)" },
    { s: "Step 7", t: "VERDICT + Stage + Risk %", d: "LIVER CANCER: YES/NO · risk % with heat gauge · Stage I–IV · BCLC" },
    { s: "Step 8", t: "Doctor treatment plan by stage", d: "Stage I: resection/ablation · II: TACE · III: systemic · IV: supportive" },
    { s: "Step 9", t: "Doctor review + email", d: "Decision recorded; automated email to patient + care team" },
    { s: "Step 10", t: "Report + QA loop", d: "Printable report; flagged cases feed model improvement" },
  ];
  return (
    <ol className="relative ml-3 space-y-4 border-l-2 border-dashed border-teal-200 pl-6">
      {steps.map((st) => (
        <li key={st.s} className="relative">
          <span className="absolute -left-[33px] grid size-5 place-items-center rounded-full bg-teal-700 text-[9px] font-extrabold text-white ring-4 ring-white">
            {Number(st.s.split(" ")[1])}
          </span>
          <div className="rounded-xl bg-slate-50 p-3.5 ring-1 ring-slate-200">
            <p className="text-[13px] font-extrabold text-slate-900">{st.t}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{st.d}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
