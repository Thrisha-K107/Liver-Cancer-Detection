import HepatoXaiDashboard from "./hepatoxai-dashboard";
import { getDashboardSnapshot } from "@/lib/hepatoxai-data";

export const dynamic = "force-dynamic";

function toSerializableDate(value: Date | string | null | undefined) {
  if (!value) return undefined;
  return value instanceof Date ? value.toISOString() : value;
}

function safeJsonList(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeJsonFactors(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <HepatoXaiDashboard
      initialPatients={snapshot.patients.map((patient) => ({
        ...patient,
        createdAt: toSerializableDate(patient.createdAt) ?? new Date().toISOString(),
        lastVisit: toSerializableDate(patient.lastVisit),
      }))}
      initialAnalyses={snapshot.analyses.map((analysis) => ({
        ...analysis,
        createdAt: toSerializableDate(analysis.createdAt) ?? new Date().toISOString(),
        updatedAt: toSerializableDate(analysis.updatedAt),
      }))}
      initialReviews={snapshot.reviews.map((review) => ({
        ...review,
        createdAt: toSerializableDate(review.createdAt) ?? new Date().toISOString(),
      }))}
      initialReports={snapshot.reports.map((report) => ({
        ...report,
        createdAt: toSerializableDate(report.createdAt) ?? new Date().toISOString(),
      }))}
      initialScreenings={snapshot.screenings.map((s) => ({
        ...s,
        treatmentPlan: safeJsonList(s.treatmentPlan),
        factors: safeJsonFactors(s.factors),
        workup: safeJsonList(s.workup),
        createdAt: toSerializableDate(s.createdAt) ?? new Date().toISOString(),
      }))}
      initialMessages={snapshot.messages.map((m) => ({
        ...m,
        createdAt: toSerializableDate(m.createdAt) ?? new Date().toISOString(),
      }))}
      initialAuditLogs={snapshot.auditLogs.map((auditLog) => ({
        ...auditLog,
        createdAt: toSerializableDate(auditLog.createdAt) ?? new Date().toISOString(),
      }))}
    />
  );
}
