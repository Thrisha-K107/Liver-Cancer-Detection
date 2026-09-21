import { db } from "@/db";
import { analyses, auditLogs, doctorReviews, fusionResults, imagingFeatures, messages, patients, reports, screenings, users } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export type Patient = typeof patients.$inferSelect;
export type Analysis = typeof analyses.$inferSelect;
export type DoctorReview = typeof doctorReviews.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type Screening = typeof screenings.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;

export type DashboardSnapshot = {
  patients: Patient[];
  analyses: Analysis[];
  reviews: DoctorReview[];
  reports: Report[];
  screenings: Screening[];
  messages: Message[];
  auditLogs: AuditLog[];
};

let initialized = false;

async function seedPipelineDemo(analysisId: number) {
  const [analysis] = await db.select().from(analyses).where(eq(analyses.id, analysisId));
  if (!analysis) return;
  const [patient] = await db.select().from(patients).where(eq(patients.id, analysis.patientId));

  const { runClinicalScreening } = await import("@/lib/clinical-engine");
  const { computeImagingIndex, exactShapleyValues, IMAGING_ENGINE, FUSION_ENGINE, runFusionEnsemble } = await import("@/lib/fusion-engine");

  const demoFeatures = {
    mean: 52.6,
    std: 24.1,
    entropy: 5.9,
    edgeEnergy: 1.34,
    contrastRatio: 0.18,
    blocks: Array.from({ length: 14 }, (_, i) =>
      Array.from({ length: 14 }, (__, j) =>
        Math.round(Math.min(1, Math.max(0, 0.42 + 0.25 * Math.sin(i * 0.85) * Math.cos(j * 1.3) + 0.18 * Math.sin((i + j) * 0.5) + (i % 3) * 0.03)) * 100) / 100,
      ),
    ),
  };

  const engine = runClinicalScreening({
    age: patient?.age ?? 55,
    sex: patient?.sex ?? "Unknown",
    afp: analysis.afp,
    alt: analysis.alt,
    ast: analysis.ast,
    cirrhosis: analysis.cirrhosis,
    childPugh: "A",
    tumorCount: "none",
    tumorSizeCm: null,
    vascularInvasion: "No",
    lymphNodes: "No",
    metastasis: "No",
    ps: "0",
  });

  const attribution = computeImagingIndex(demoFeatures);
  const clinicalScore = engine.riskScore;
  const ensemble = runFusionEnsemble(clinicalScore, attribution.index, analysisId * 7919 + 17);
  const shapley = exactShapleyValues(engine.factors.map((f) => f.points));
  const shap = engine.factors.map((f, i) => ({ name: f.name, patientValue: f.patientValue, value: Math.round(shapley[i] * 100) / 100, rule: f.rule }));

  await db
    .insert(imagingFeatures)
    .values({
      analysisId,
      fileName: analysis.modality === "MRI" ? "demo-mri-slice.png" : "demo-ct-slice.png",
      mean: demoFeatures.mean,
      std: demoFeatures.std,
      entropy: demoFeatures.entropy,
      edgeEnergy: demoFeatures.edgeEnergy,
      contrastRatio: demoFeatures.contrastRatio,
      index: attribution.index,
      blocks: JSON.stringify(attribution.blockScores),
      engineVersion: IMAGING_ENGINE,
    })
    .onConflictDoNothing();

  await db
    .insert(fusionResults)
    .values({
      analysisId,
      imagingIndex: attribution.index,
      clinicalScore,
      fusedIndex: ensemble.fused,
      uncertaintyLabel: ensemble.label,
      uncertaintyValue: ensemble.std,
      samples: ensemble.samples,
      shap: JSON.stringify(shap),
      engineVersion: FUSION_ENGINE,
    })
    .onConflictDoNothing();
}

export async function ensureDatabase() {
  if (initialized) return;

  await db.execute(sql`
    create table if not exists users (
      id serial primary key,
      name varchar(160) not null,
      email varchar(240) not null unique,
      role varchar(40) not null default 'DOCTOR',
      password_hash varchar(240) not null,
      created_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists patients (
      id serial primary key,
      patient_code varchar(80) not null unique,
      full_name varchar(160) not null,
      age integer not null,
      sex varchar(20) not null,
      diagnosis_status varchar(80) not null default 'Under Review',
      risk_level varchar(40) not null default 'Moderate',
      last_visit timestamptz not null default now(),
      notes text not null default '',
      created_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists analyses (
      id serial primary key,
      case_id varchar(100) not null unique,
      patient_id integer not null references patients(id) on delete cascade,
      modality varchar(40) not null default 'CT',
      model_version varchar(80) not null default 'v0.1 – research placeholder',
      prediction varchar(100) not null default 'Pending doctor-reviewed AI analysis',
      probability integer not null default 0,
      uncertainty varchar(40) not null default 'Not computed',
      afp integer not null default 0,
      alt integer not null default 0,
      ast integer not null default 0,
      cirrhosis varchar(20) not null default 'Unknown',
      scan_path varchar(260) not null default 'Object-storage path pending',
      status varchar(60) not null default 'Draft',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists doctor_reviews (
      id serial primary key,
      analysis_id integer not null references analyses(id) on delete cascade,
      doctor_name varchar(160) not null,
      status varchar(40) not null default 'Pending',
      notes text not null default '',
      created_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists reports (
      id serial primary key,
      analysis_id integer not null references analyses(id) on delete cascade,
      title varchar(180) not null,
      summary text not null,
      status varchar(40) not null default 'Draft',
      created_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists screenings (
      id serial primary key,
      analysis_id integer not null references analyses(id) on delete cascade,
      engine_version varchar(160) not null,
      verdict text not null,
      suspicion varchar(10) not null,
      risk_score integer not null default 0,
      bclc_stage varchar(80) not null,
      stage_basis text not null default '',
      child_pugh varchar(5) not null default 'A',
      tumor_count varchar(10) not null default 'none',
      tumor_size_cm double precision,
      vascular_invasion varchar(10) not null default 'No',
      lymph_nodes varchar(10) not null default 'No',
      metastasis varchar(10) not null default 'No',
      ps varchar(10) not null default '0',
      treatment_plan text not null default '',
      factors text not null default '',
      workup text not null default '',
      created_at timestamptz not null default now()
    )
  `);

  // Migration for databases created before tumor_size_cm accepted decimals.
  await db
    .execute(sql`
      alter table screenings alter column tumor_size_cm type double precision using tumor_size_cm::double precision
    `)
    .catch(() => undefined);

  await db.execute(sql`
    create table if not exists imaging_features (
      id serial primary key,
      analysis_id integer not null unique references analyses(id) on delete cascade,
      file_name varchar(200) not null default 'upload',
      mean double precision not null default 0,
      std double precision not null default 0,
      entropy double precision not null default 0,
      edge_energy double precision not null default 0,
      contrast_ratio double precision not null default 0,
      "index" integer not null default 0,
      blocks text not null default '[]',
      engine_version varchar(160) not null,
      created_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists fusion_results (
      id serial primary key,
      analysis_id integer not null unique references analyses(id) on delete cascade,
      imaging_index integer not null default 0,
      clinical_score integer not null default 0,
      fused_index integer not null default 0,
      uncertainty_label varchar(20) not null default 'LOW',
      uncertainty_value double precision not null default 0,
      samples integer not null default 0,
      shap text not null default '[]',
      engine_version varchar(160) not null,
      created_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists messages (
      id serial primary key,
      from_name varchar(160) not null,
      from_email varchar(240) not null,
      to_name varchar(160) not null,
      to_email varchar(240) not null,
      subject varchar(240) not null,
      body text not null default '',
      template varchar(60) not null default 'manual',
      channel varchar(30) not null default 'EMAIL',
      status varchar(20) not null default 'SENT',
      created_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists audit_logs (
      id serial primary key,
      actor varchar(160) not null,
      action varchar(160) not null,
      entity varchar(80) not null,
      entity_id integer,
      details text not null default '',
      created_at timestamptz not null default now()
    )
  `);

  const existing = await db.select({ count: sql<number>`count(*)::int` }).from(patients);
  if ((existing[0]?.count ?? 0) === 0) {
    await db.insert(users).values([
      {
        name: "Dr. Maya Srinivasan",
        email: "doctor@hepatoxai.local",
        role: "DOCTOR",
        passwordHash: "demo-only-placeholder-hash",
      },
      {
        name: "Nurse Coordinator Amina Patel",
        email: "nurse@hepatoxai.local",
        role: "RESEARCHER",
        passwordHash: "demo-only-placeholder-hash",
      },
    ]);

    const seededPatients = await db
      .insert(patients)
      .values([
        {
          patientCode: "HX-P-1007",
          fullName: "De-identified Patient Alpha",
          age: 62,
          sex: "Female",
          diagnosisStatus: "Under Review",
          riskLevel: "High",
          notes: "Cirrhosis history. Multiphase CT uploaded for research review.",
        },
        {
          patientCode: "HX-P-1014",
          fullName: "De-identified Patient Beta",
          age: 55,
          sex: "Male",
          diagnosisStatus: "Monitoring",
          riskLevel: "Moderate",
          notes: "Elevated AFP. MRI placeholder registered.",
        },
        {
          patientCode: "HX-P-1032",
          fullName: "De-identified Patient Gamma",
          age: 47,
          sex: "Female",
          diagnosisStatus: "Awaiting Imaging",
          riskLevel: "Low",
          notes: "Clinical record prepared; imaging pending.",
        },
      ])
      .returning();

    const seededAnalyses = await db
      .insert(analyses)
      .values([
        {
          caseId: "HX-C-2026-001",
          patientId: seededPatients[0].id,
          modality: "CT",
          modelVersion: "v0.1 – placeholder, no inference",
          prediction: "Research placeholder: pending validated model inference",
          probability: 0,
          uncertainty: "Not computed",
          afp: 487,
          alt: 82,
          ast: 95,
          cirrhosis: "Yes",
          scanPath: "s3://placeholder/hepatoxai/HX-C-2026-001/ct.dcm",
          status: "Doctor Review Required",
        },
        {
          caseId: "HX-C-2026-002",
          patientId: seededPatients[1].id,
          modality: "MRI",
          modelVersion: "v0.1 – placeholder, no inference",
          prediction: "Research placeholder: pending validated model inference",
          probability: 0,
          uncertainty: "Not computed",
          afp: 122,
          alt: 56,
          ast: 60,
          cirrhosis: "No",
          scanPath: "s3://placeholder/hepatoxai/HX-C-2026-002/mri.nii.gz",
          status: "Draft",
        },
      ])
      .returning();

    await db.insert(doctorReviews).values([
      {
        analysisId: seededAnalyses[0].id,
        doctorName: "Dr. Maya Srinivasan",
        status: "Pending",
        notes: "Need portal venous phase confirmation before any clinical discussion.",
      },
    ]);

    await db.insert(screenings).values([
      {
        analysisId: seededAnalyses[0].id,
        engineVersion: "Transparent Rule Engine v1.0 (BCLC 2022-aligned)",
        verdict:
          "LIVER CANCER SUSPICION: YES — HIGH. Treat as HCC until excluded. Urgent confirmatory multiphasic imaging and MDT review are mandatory before any treatment decision.",
        suspicion: "YES",
        riskScore: 88,
        bclcStage: "A (Early)",
        stageBasis: "Solitary ≤ 5 cm, or up to 3 nodules each ≤ 3 cm, with preserved liver function → early stage (BCLC-A).",
        childPugh: "A",
        tumorCount: "1",
        tumorSizeCm: 32,
        vascularInvasion: "No",
        lymphNodes: "No",
        metastasis: "No",
        ps: "0",
        treatmentPlan: JSON.stringify([
          "Curative-intent therapy: surgical resection, liver transplantation, or ablation",
          "Select by MDT using liver reserve (Child-Pugh), tumor position, and patient fitness",
          "Consider radiofrequency/microwave ablation for tumors ≤ 3 cm",
          "Follow-up imaging every 3 months for recurrence surveillance",
        ]),
        factors: JSON.stringify([
          { name: "AFP (alpha-fetoprotein)", patientValue: "487 ng/mL", rule: "AFP ≥ 400 ng/mL → +55 (strongly abnormal)", points: 55 },
          { name: "Cirrhosis", patientValue: "Yes", rule: "Cirrhosis present → +15 (major HCC risk substrate)", points: 15 },
          { name: "Age", patientValue: "62 years", rule: "Age ≥ 60 → +8", points: 8 },
          { name: "ALT / AST", patientValue: "ALT 82 · AST 95 U/L", rule: "Both > 80 U/L → +10 (active liver injury)", points: 10 },
          { name: "Sex", patientValue: "Female", rule: "→ +0", points: 0 },
          { name: "Child-Pugh class", patientValue: "A", rule: "Class A → +0", points: 0 },
        ]),
        workup: JSON.stringify([
          "Triphasic (arterial / portal / delayed) liver CT or contrast-enhanced MRI — mandatory",
          "Contrast-enhanced ultrasound as complementary dynamic imaging",
          "Tumor markers panel: AFP, CEA, CA 19-9 (to exclude cholangiocarcinoma / metastases)",
          "Child-Pugh laboratory panel: bilirubin, albumin, INR + ascites/encephalopathy assessment",
          "HBV / HCV serology and viral load if positive",
          "Biopsy ONLY if imaging is non-diagnostic AND the result would change management",
          "Multidisciplinary tumor board (MDT) presentation before treatment initiation",
        ]),
      },
    ]);

    if (seededAnalyses[0]) await seedPipelineDemo(seededAnalyses[0].id);

    await db.insert(reports).values([
      {
        analysisId: seededAnalyses[0].id,
        title: "Research Case Summary HX-C-2026-001",
        summary:
          "Draft report shell created. No ML diagnosis is available in this phase; qualified professional review is required.",
        status: "Draft",
      },
    ]);

    await db.insert(auditLogs).values([
      {
        actor: "System Seeder",
        action: "Initialized demo research workspace",
        entity: "workspace",
        details: "Seeded de-identified patients, analyses, review, and report placeholders.",
      },
    ]);
  }

  // Seed the 300-patient research history cohort (deterministic, CT + MRI mix).
  const cohortCount = await db.select({ count: sql<number>`count(*)::int` }).from(patients);
  const cohortSize = cohortCount[0]?.count ?? 0;
  if (cohortSize < 300) {
    let seedVal = 20260214;
    const rndSeeded = () => {
      seedVal = (seedVal * 1664525 + 1013904223) % 4294967296;
      return seedVal / 4294967296;
    };
    const pickA = <T,>(arr: T[]) => arr[Math.floor(rndSeeded() * arr.length)];
    const riSeeded = (min: number, max: number) => Math.floor(rndSeeded() * (max - min + 1)) + min;

    const need = 300 - cohortSize;
    const batchPatients: (typeof patients.$inferInsert)[] = [];
    const batchAnalyses: (typeof analyses.$inferInsert)[] = [];
    const now = Date.now();
    for (let i = 0; i < need; i++) {
      const id = cohortSize + i + 1;
      const age = riSeeded(32, 84);
      const sex = pickA(["Female", "Male", "Female", "Male"]);
      const cirrhosis = rndSeeded() < 0.55 ? "Yes" : "No";
      const hasTumor = rndSeeded() < 0.58;
      const afp = hasTumor ? (rndSeeded() < 0.36 ? riSeeded(400, 1250) : rndSeeded() < 0.45 ? riSeeded(30, 395) : riSeeded(2, 29)) : riSeeded(2, 29);
      const alt = riSeeded(18, 145);
      const ast = riSeeded(16, 155);
      const risk = hasTumor || afp > 400 ? pickA(["High", "Moderate"]) : rndSeeded() < 0.7 ? "Low" : "Moderate";
      const status = pickA(["Under Review", "Monitoring", "Awaiting Imaging", "Closed"]);
      const modality = i % 2 === 0 ? "CT" : "MRI";
      const created = new Date(now - i * 43200000).toISOString(); // 12h apart

      const t0 = new Date(now - i * 43200000);
      const t1 = new Date(now - i * 43200000 - 3600000);
      const t2 = new Date(now - i * 43200000 - 7200000);

      batchPatients.push({
        patientCode: `HX-P-${String(2000 + id)}`,
        fullName: `De-identified Patient ${String(id).padStart(3, "0")}`,
        age,
        sex,
        diagnosisStatus: status,
        riskLevel: risk,
        lastVisit: t1,
        notes: "Cohort history record — de-identified research cohort.",
        createdAt: t2,
      });

      batchAnalyses.push({
        caseId: `HX-C-${t0.getFullYear()}-${String(200 + i).padStart(3, "0")}`,
        patientId: cohortSize + i + 1,
        modality,
        modelVersion: "v0.1 – placeholder, no inference",
        prediction: "Research placeholder: pending validated model inference",
        probability: 0,
        uncertainty: "Not computed",
        afp,
        alt,
        ast,
        cirrhosis,
        scanPath: `s3://hepatoxai-cases/hx-${String(id)}/${modality.toLowerCase()}-study-${id}.${modality === "CT" ? "dcm" : "nii.gz"}`,
        status: pickA(["Draft", "Doctor Review Required", "Completed"]),
        createdAt: t2,
        updatedAt: t0,
      });
    }
    for (let chunk = 0; chunk < batchPatients.length; chunk += 100) {
      await db.insert(patients).values(batchPatients.slice(chunk, chunk + 100)).onConflictDoNothing();
      await db.insert(analyses).values(batchAnalyses.slice(chunk, chunk + 100)).onConflictDoNothing();
    }
  }

  // Synthetic demo person names for the cohort (deterministic by record id).
  const nameRows = await db.select({ id: patients.id, sex: patients.sex }).from(patients);
  const femaleNames = ["Priya Sharma", "Ananya Rao", "Kavitha Reddy", "Meera Nair", "Lakshmi Iyer", "Fatima Khan", "Grace Thomas", "Neha Gupta", "Divya Menon", "Sunita Devi", "Elena Petrova", "Maria Garcia", "Wei Chen", "Aiko Tanaka", "Sarah Johnson"];
  const maleNames = ["Arjun Patel", "Rohan Verma", "Vikram Singh", "Karthik Kumar", "Aditya Joshi", "Rahul Mehta", "Suresh Babu", "Mohammed Ali", "David Chen", "Hiroshi Tanaka", "James Wilson", "Rajesh Nair", "Sanjay Gupta", "Ahmed Khan", "Peter Smith"];
  for (const row of nameRows) {
    const pool = row.sex.toLowerCase() === "male" ? maleNames : femaleNames;
    const name = pool[Math.abs(row.id * 7 + 3) % pool.length];
    await db.update(patients).set({ fullName: name }).where(eq(patients.id, row.id));
  }

  const msgCount = await db.select({ count: sql<number>`count(*)::int` }).from(messages);
  if ((msgCount[0]?.count ?? 0) === 0) {
    await db.insert(messages).values([
      {
        fromName: "Dr. Maya Srinivasan",
        fromEmail: "doctor@hepatoxai.local",
        toName: "Patient Access (de-identified)",
        toEmail: "patient@hepatoxai.local",
        subject: "Your screening result is ready for review",
        body: "Your HepatoXAI screening result is available. Risk score 88/100, suspicion positive. Please review with your treating clinician — this is decision support, not a standalone diagnosis.",
        template: "screening-result",
        status: "SENT",
      },
      {
        fromName: "HepatoXAI Notifications",
        fromEmail: "notify@hepatoxai.local",
        toName: "Dr. Maya Srinivasan",
        toEmail: "doctor@hepatoxai.local",
        subject: "Case HX-C-2026-001 flagged HIGH uncertainty",
        body: "Automated AI notification: uncertainty band HIGH on case HX-C-2026-001. Mandatory specialist review recommended per protocol.",
        template: "uncertainty-escalation",
        status: "SENT",
      },
      {
        fromName: "HepatoXAI Notifications",
        fromEmail: "notify@hepatoxai.local",
        toName: "Researcher R. Iyer",
        toEmail: "research@hepatoxai.local",
        subject: "New model version v0.1 registered",
        body: "Model Registry updated: v0.1 placeholder registered. Validation policy requires patient-level splits and a locked test set before any accuracy is published.",
        template: "model-registered",
        status: "SENT",
      },
    ]);
  }

  // Idempotent demo pipeline seeding: whenever the original demo case (oldest)
  // lacks a pipeline result (e.g. a database created before these engines
  // existed), seed it with values computed by the real engines so the flagship
  // case — and the Explainability guide — is live on first load.
  const [firstAnalysis] = await db.select().from(analyses).orderBy(analyses.createdAt).limit(1);
  if (firstAnalysis) {
    const existing = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(imagingFeatures)
      .where(eq(imagingFeatures.analysisId, firstAnalysis.id));
    if ((existing[0]?.count ?? 0) === 0) await seedPipelineDemo(firstAnalysis.id);
  }

  initialized = true;
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  await ensureDatabase();
  const [patientRows, analysisRows, reviewRows, reportRows, screeningRows, messageRows, auditRows] = await Promise.all([
    db.select().from(patients).orderBy(desc(patients.createdAt)),
    db.select().from(analyses).orderBy(desc(analyses.createdAt)),
    db.select().from(doctorReviews).orderBy(desc(doctorReviews.createdAt)),
    db.select().from(reports).orderBy(desc(reports.createdAt)),
    db.select().from(screenings).orderBy(desc(screenings.createdAt)),
    db.select().from(messages).orderBy(desc(messages.createdAt)).limit(20),
    db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(8),
  ]);

  return {
    patients: patientRows,
    analyses: analysisRows,
    reviews: reviewRows,
    reports: reportRows,
    screenings: screeningRows,
    messages: messageRows,
    auditLogs: auditRows,
  };
}

export async function logAudit(actor: string, action: string, entity: string, entityId?: number, details = "") {
  await ensureDatabase();
  await db.insert(auditLogs).values({ actor, action, entity, entityId, details });
}

export async function deletePatient(patientId: number) {
  await ensureDatabase();
  await db.delete(patients).where(eq(patients.id, patientId));
  await logAudit("Demo Clinician", "Deleted patient", "patient", patientId);
}
