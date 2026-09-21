"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { AnalysisT, App, AuditT, MessageT, PatientT, ReportT, ReviewT, ScreeningT, Session, ToastTone, ViewKey } from "@/lib/types";
import { LoginScreen } from "@/components/login";
import { Sidebar } from "@/components/sidebar";
import { Badge, Spinner } from "@/components/ui";
import { DashboardView, StageView, UniqueView } from "./views/overview";
import { AnalysisDetailView, HistoryView, NewAnalysisView } from "./views/clinical";
import { PatientsView } from "./views/patients";
import { AuditView, ModelsView, QAView, ReportsView, ReviewsView, SettingsView } from "./views/governance";
import { DatasetsView } from "./views/datasets";
import { ExplainabilityView } from "./views/explainability";
import { MessagingView } from "./views/messaging";
import { LANGS, LangProvider, useLang } from "@/lib/i18n";

type Props = {
  initialPatients: PatientT[];
  initialAnalyses: AnalysisT[];
  initialReviews: ReviewT[];
  initialReports: ReportT[];
  initialScreenings: ScreeningT[];
  initialMessages: MessageT[];
  initialAuditLogs: AuditT[];
};

type Toast = { id: number; message: string; tone: ToastTone };

const SESSION_KEY = "hepatoxai.session.v1";

const titles: Record<ViewKey, string> = {
  dashboard: "Dashboard",
  unique: "Unique Solution",
  "new-analysis": "New Analysis",
  patients: "Patient Register",
  analysis: "Analysis Workspace",
  imaging: "Image Analysis",
  clinical: "Clinical Analysis",
  multimodal: "Multimodal Result",
  explainability: "Explainability",
  uncertainty: "Uncertainty",
  history: "History",
  reviews: "Doctor Review",
  reports: "Reports",
  qa: "QA Loop",
  models: "Model Registry",
  audit: "Audit Log",
  settings: "Settings",
  datasets: "Sample Datasets",
  messages: "Secure Messaging",
};

export default function HepatoXaiDashboard({ initialPatients, initialAnalyses, initialReviews, initialReports, initialScreenings, initialMessages, initialAuditLogs }: Props) {
  const [checked, setChecked] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<ViewKey>("dashboard");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editingPatientId, setEditingPatientId] = useState<number | null>(initialPatients[0]?.id ?? null);
  const [mobileNav, setMobileNav] = useState(false);
  const [patients, setPatients] = useState(initialPatients);
  const [analyses, setAnalyses] = useState(initialAnalyses);
  const [reviews, setReviews] = useState(initialReviews);
  const [reports, setReports] = useState(initialReports);
  const [screenings, setScreenings] = useState(initialScreenings);
  const [messages, setMessages] = useState(initialMessages);
  const [audit, setAudit] = useState(initialAuditLogs);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) setSession(JSON.parse(raw) as Session);
    } catch {
      setSession(null);
    }
    setChecked(true);
  }, []);

  function toast(message: string, tone: ToastTone = "info") {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((t) => [...t, { id, message, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4600);
  }

  function pushAudit(actor: string, action: string, entity: string, details = "", entityId?: number) {
    setAudit((a) => [
      { id: -(Date.now() + Math.floor(Math.random() * 100000)), actor, action, entity, entityId: entityId ?? null, details, createdAt: new Date().toISOString() },
      ...a,
    ]);
  }

  async function createPatient(f: FormData) {
    const tempId = -(Date.now());
    const optimistic: PatientT = {
      id: tempId,
      patientCode: String(f.get("patientCode") || `HX-P-${Date.now()}`),
      fullName: String(f.get("fullName") || "De-identified Patient"),
      age: Number(f.get("age") || 50),
      sex: String(f.get("sex") || "Unknown"),
      diagnosisStatus: String(f.get("diagnosisStatus") || "Under Review"),
      riskLevel: String(f.get("riskLevel") || "Moderate"),
      notes: String(f.get("notes") || ""),
      createdAt: new Date().toISOString(),
    };
    setPatients((p) => [optimistic, ...p]);
    setBusy("patient");
    try {
      const res = await fetch("/api/patients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(optimistic) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Patient save failed.");
      setPatients((p) => p.map((x) => (x.id === tempId ? { ...x, ...data.patient, createdAt: new Date().toISOString() } : x)));
      setEditingPatientId(data.patient.id);
      pushAudit(session?.name ?? "User", "Created patient", "patient", data.patient.patientCode, data.patient.id);
      toast("Patient record saved to PostgreSQL.", "success");
    } catch (e) {
      setPatients((p) => p.filter((x) => x.id !== tempId));
      toast(e instanceof Error ? e.message : "Patient save failed.", "error");
    } finally {
      setBusy(null);
    }
  }

  async function updatePatient(f: FormData) {
    const id = editingPatientId;
    if (!id) return;
    const previous = patients;
    const patch = {
      fullName: String(f.get("fullName") || ""),
      age: Number(f.get("age") || 0),
      sex: String(f.get("sex") || ""),
      riskLevel: String(f.get("riskLevel") || ""),
      diagnosisStatus: String(f.get("diagnosisStatus") || ""),
      notes: String(f.get("notes") || ""),
    };
    setPatients((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    setBusy("patient");
    try {
      const res = await fetch(`/api/patients/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Patient update failed.");
      setPatients((p) => p.map((x) => (x.id === id ? { ...x, ...data.patient, createdAt: x.createdAt } : x)));
      pushAudit(session?.name ?? "User", "Updated patient", "patient", data.patient.patientCode, id);
      toast("Patient update saved.", "success");
    } catch (e) {
      setPatients(previous);
      toast(e instanceof Error ? e.message : "Patient update failed.", "error");
    } finally {
      setBusy(null);
    }
  }

  async function deletePatient(id: number) {
    const previous = patients;
    setPatients((p) => p.filter((x) => x.id !== id));
    setBusy("patient");
    try {
      const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed.");
      const affected = analyses.filter((a) => a.patientId === id);
      setAnalyses((a) => a.filter((x) => x.patientId !== id));
      setReviews((r) => r.filter((x) => !affected.some((a) => a.id === x.analysisId)));
      setReports((r) => r.filter((x) => !affected.some((a) => a.id === x.analysisId)));
      pushAudit(session?.name ?? "User", "Deleted patient (cascade)", "patient", `${affected.length} linked cases removed`, id);
      toast("Patient and linked records deleted.", "success");
    } catch {
      setPatients(previous);
      toast("Delete failed; record restored.", "error");
    } finally {
      setBusy(null);
    }
  }

  async function createAnalysis(f: FormData): Promise<number | null> {
    const payload = {
      patientId: Number(f.get("analysisPatientId")),
      caseId: String(f.get("caseId") || `HX-C-${Date.now()}`),
      modality: String(f.get("modality") || "CT"),
      afp: Number(f.get("afp") || 0),
      alt: Number(f.get("alt") || 0),
      ast: Number(f.get("ast") || 0),
      cirrhosis: String(f.get("cirrhosis") || "Unknown"),
      scanPath: String(f.get("scanPath") || "Object-storage path pending"),
    };
    if (!payload.patientId) {
      toast("Select a patient first.", "error");
      return null;
    }
    setBusy("analysis");
    try {
      const res = await fetch("/api/analyses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis creation failed.");
      setAnalyses((a) => [data.analysis, ...a]);
      pushAudit(session?.name ?? "User", "Created analysis", "analysis", String(f.get("notes") || payload.scanPath), data.analysis.id);
      toast(`Case ${payload.caseId} persisted to PostgreSQL.`, "success");
      return data.analysis.id as number;
    } catch (e) {
      toast(e instanceof Error ? e.message : "Analysis creation failed.", "error");
      return null;
    } finally {
      setBusy(null);
    }
  }

  async function runAnalysis(id: number) {
    const target = analyses.find((a) => a.id === id);
    if (!target) return;
    setBusy(`run-${id}`);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: target.caseId, patientId: target.patientId }),
      });
      const data = await res.json();
      const patchRes = await fetch(`/api/analyses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Doctor Review Required", prediction: "Not computed — validated models pending (Phases 4–6)" }),
      });
      const patchData = await patchRes.json();
      if (!patchRes.ok) throw new Error(patchData.error || "Case update failed.");
      setAnalyses((a) => a.map((x) => (x.id === id ? { ...x, ...patchData.analysis, createdAt: x.createdAt } : x)));
      pushAudit(session?.name ?? "User", "Executed placeholder inference run", "analysis", data.disclaimer ?? "Inference service returns placeholder in this phase.", id);
      toast("Placeholder run complete. Predictions remain 'Not computed' until validated models are connected.", "info");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Analysis run failed.", "error");
    } finally {
      setBusy(null);
    }
  }

  async function deleteAnalysis(id: number) {
    const previous = analyses;
    setAnalyses((a) => a.filter((x) => x.id !== id));
    setBusy("analysis");
    try {
      const res = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed.");
      setReviews((r) => r.filter((x) => x.analysisId !== id));
      setReports((r) => r.filter((x) => x.analysisId !== id));
      setScreenings((s) => s.filter((x) => x.analysisId !== id));
      pushAudit(session?.name ?? "User", "Deleted analysis (cascade)", "analysis", "", id);
      toast("Case and linked records deleted.", "success");
    } catch {
      setAnalyses(previous);
      toast("Delete failed; record restored.", "error");
    } finally {
      setBusy(null);
    }
  }

  async function saveReview(f: FormData) {
    const tempId = -(Date.now());
    const optimistic: ReviewT = {
      id: tempId,
      analysisId: Number(f.get("analysisId")),
      doctorName: String(f.get("doctorName") || session?.name || "Clinician"),
      status: String(f.get("reviewStatus") || "Pending"),
      notes: String(f.get("reviewNotes") || ""),
      createdAt: new Date().toISOString(),
    };
    setReviews((r) => [optimistic, ...r]);
    setBusy("review");
    try {
      const res = await fetch("/api/doctor-review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(optimistic) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Review save failed.");
      setReviews((r) => r.map((x) => (x.id === tempId ? { ...x, ...data.review, createdAt: new Date().toISOString() } : x)));
      pushAudit(optimistic.doctorName, "Saved doctor review", "doctor_review", `${optimistic.status}`, data.review.id);
      toast(`Review saved with decision '${optimistic.status}'.`, "success");
    } catch (e) {
      setReviews((r) => r.filter((x) => x.id !== tempId));
      toast(e instanceof Error ? e.message : "Review save failed.", "error");
    } finally {
      setBusy(null);
    }
  }

  async function generateReport(analysisId: number) {
    const tempId = -(Date.now());
    const analysis = analyses.find((a) => a.id === analysisId);
    const optimistic: ReportT = {
      id: tempId,
      analysisId,
      title: `HepatoXAI Research Report — ${analysis?.caseId ?? analysisId}`,
      summary: "Draft report shell. No standalone diagnosis is provided; qualified professional review is required.",
      status: "Draft",
      createdAt: new Date().toISOString(),
    };
    setReports((r) => [optimistic, ...r]);
    setBusy("report");
    try {
      const res = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(optimistic) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Report generation failed.");
      setReports((r) => r.map((x) => (x.id === tempId ? { ...x, ...data.report, createdAt: new Date().toISOString() } : x)));
      pushAudit(session?.name ?? "User", "Generated report", "report", optimistic.title, data.report.id);
      toast(`Report generated for ${analysis?.caseId ?? "case"} — opening Reports…`, "success");
      setView("reports");
    } catch (e) {
      setReports((r) => r.filter((x) => x.id !== tempId));
      toast(e instanceof Error ? e.message : "Report generation failed.", "error");
    } finally {
      setBusy(null);
    }
  }

  async function sendMessage(f: FormData) {
    const payload = {
      fromName: String(f.get("fromName") || session?.name || "HepatoXAI User"),
      fromEmail: String(f.get("fromEmail") || session?.email || "notify@hepatoxai.local"),
      toName: String(f.get("toName") || ""),
      toEmail: String(f.get("toEmail") || ""),
      subject: String(f.get("subject") || ""),
      body: String(f.get("body") || ""),
      template: String(f.get("template") || "manual"),
    };
    if (!payload.toEmail || !payload.subject) {
      toast("Recipient and subject are required.", "error");
      return;
    }
    const tempId = -(Date.now());
    setBusy("message");
    try {
      const res = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, toName: payload.toName || payload.toEmail.split("@")[0] }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Message failed.");
      setMessages((m) => [{ ...data.message, createdAt: new Date().toISOString() }, ...m]);
      pushAudit(payload.fromName, "Sent email notification", "message", `${payload.subject} → ${payload.toEmail}`, data.message.id);
      toast(`Email sent to ${payload.toEmail}.`, "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Message failed.", "error");
    } finally {
      setBusy(null);
    }
  }

  async function runScreening(f: FormData) {
    const analysisId = Number(f.get("analysisId"));
    if (!analysisId) return;
    setBusy("screen");
    try {
      const res = await fetch("/api/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          childPugh: String(f.get("childPugh") || "A"),
          tumorCount: String(f.get("tumorCount") || "none"),
          tumorSizeCm: f.get("tumorSizeCm") ? Number(f.get("tumorSizeCm")) : null,
          vascularInvasion: String(f.get("vascularInvasion") || "No"),
          lymphNodes: String(f.get("lymphNodes") || "No"),
          metastasis: String(f.get("metastasis") || "No"),
          ps: String(f.get("ps") || "0"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Screening failed.");
      const screening = data.screening as ScreeningT;
      setScreenings((s) => [screening, ...s]);
      pushAudit(session?.name ?? "User", "Ran screening & staging", "screening", `${screening.suspicion} · ${screening.riskScore}/100 · ${screening.bclcStage}`, screening.id);
      toast(
        screening.suspicion === "YES"
          ? `Screening: SUSPICION YES (${screening.riskScore}/100) — staged ${screening.bclcStage}. Treatment plan ready for MDT review.`
          : `Screening: SUSPICION NO (${screening.riskScore}/100) — continue surveillance. No oncologic workup triggered.`,
        screening.suspicion === "YES" ? "info" : "success",
      );
    } catch (e) {
      toast(e instanceof Error ? e.message : "Screening failed.", "error");
    } finally {
      setBusy(null);
    }
  }

  function logout() {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setView("dashboard");
    setSelectedId(null);
  }

  if (!checked) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="grid size-14 place-items-center rounded-2xl bg-teal-400 font-display text-xl font-extrabold text-slate-950">Hx</div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <Spinner /> Preparing research workspace…
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <LoginScreen
        onLogin={(s) => {
          window.localStorage.setItem(SESSION_KEY, JSON.stringify(s));
          setSession(s);
        }}
      />
    );
  }

  const app: App = {
    session,
    view,
    selectedId,
    editingPatientId,
    navigate: (v, id = null) => {
      setView(v);
      setSelectedId(id);
    },
    setEditingPatientId,
    patients,
    analyses,
    reviews,
    reports,
    screenings,
    messages,
    audit,
    busy,
    toast,
    createPatient,
    updatePatient,
    deletePatient,
    createAnalysis,
    deleteAnalysis,
    runAnalysis,
    saveReview,
    generateReport,
    runScreening,
    sendMessage,
    logout,
  };

  return (
    <LangProvider>
      <Shell app={app} mobileNav={mobileNav} setMobileNav={setMobileNav} toasts={toasts} />
    </LangProvider>
  );
}

function Shell({ app, mobileNav, setMobileNav, toasts }: { app: App; mobileNav: boolean; setMobileNav: (b: boolean) => void; toasts: Toast[] }) {
  const { lang, setLang, t } = useLang();
  const { view, session, busy } = app;

  let viewEl: ReactNode;
  switch (view) {
    case "dashboard":
      viewEl = <DashboardView app={app} />;
      break;
    case "unique":
      viewEl = <UniqueView app={app} />;
      break;
    case "new-analysis":
      viewEl = <NewAnalysisView app={app} />;
      break;
    case "analysis":
      viewEl = <AnalysisDetailView app={app} />;
      break;
    case "patients":
      viewEl = <PatientsView app={app} />;
      break;
    case "history":
      viewEl = <HistoryView app={app} />;
      break;
    case "reviews":
      viewEl = <ReviewsView app={app} />;
      break;
    case "reports":
      viewEl = <ReportsView app={app} />;
      break;
    case "qa":
      viewEl = <QAView app={app} />;
      break;
    case "models":
      viewEl = <ModelsView />;
      break;
    case "audit":
      viewEl = <AuditView app={app} />;
      break;
    case "settings":
      viewEl = <SettingsView app={app} />;
      break;
    case "datasets":
      viewEl = <DatasetsView app={app} />;
      break;
    case "messages":
      viewEl = <MessagingView app={app} />;
      break;
    case "explainability":
      viewEl = <ExplainabilityView app={app} />;
      break;
    case "imaging":
    case "clinical":
    case "multimodal":
    case "uncertainty":
      viewEl = <StageView app={app} name={view} />;
      break;
  }

  return (
    <div className="min-h-screen bg-[#f2f6f8]">
      <Sidebar app={app} open={mobileNav} onClose={() => setMobileNav(false)} />
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button onClick={() => setMobileNav(true)} className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-600 lg:hidden" aria-label="Open menu">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div className="min-w-0">
                <p className="truncate font-display text-[15px] font-extrabold text-slate-950">{titles[view]}</p>
                <p className="truncate text-[11px] font-semibold text-slate-400">HEPATOXAI · Multimodal Liver Cancer Decision Support</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {busy && (
                <span className="hidden items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-extrabold text-amber-800 ring-1 ring-amber-200 sm:flex">
                  <Spinner className="size-3" /> Syncing…
                </span>
              )}
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-extrabold text-slate-700 outline-none transition focus:border-teal-600"
                title="Patient language — 12 languages, no language barrier"
                aria-label="Choose language"
              >
                {LANGS.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <Badge tone="teal">Research build v0.1</Badge>
              <span className="hidden text-xs font-bold text-slate-500 md:block">{session.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 border-t border-amber-200/70 bg-amber-50 px-4 py-2 sm:px-6 lg:px-8">
            <svg className="size-4 shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l8 4v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <p className="text-[11px] font-bold leading-4 text-amber-900">{t("disclaimer")}</p>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{viewEl}</main>
      </div>

      <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-in pointer-events-auto flex items-start gap-2.5 rounded-xl px-4 py-3 text-[13px] font-bold shadow-lg ring-1 ${
              t.tone === "success" ? "bg-emerald-600 text-white ring-emerald-700" : t.tone === "error" ? "bg-rose-600 text-white ring-rose-700" : "bg-slate-950 text-white ring-slate-800"
            }`}
          >
            {t.tone === "success" ? (
              <svg className="mt-0.5 size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 7" /></svg>
            ) : (
              <svg className="mt-0.5 size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
            )}
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
