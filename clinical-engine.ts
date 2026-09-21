export type ScreeningInput = {
  age: number;
  sex: string;
  afp: number;
  alt: number;
  ast: number;
  cirrhosis: string;
  childPugh: "A" | "B" | "C";
  tumorCount: "none" | "1" | "2-3" | "3+";
  tumorSizeCm: number | null;
  vascularInvasion: "Yes" | "No";
  lymphNodes: "Yes" | "No";
  metastasis: "Yes" | "No";
  ps: "0" | "1" | "2+";
};

export type Factor = {
  name: string;
  patientValue: string;
  rule: string;
  points: number;
};

export type ScreeningResult = {
  engineVersion: string;
  suspicion: "YES" | "NO";
  level: "High suspicion" | "Moderate suspicion" | "Low suspicion";
  verdict: string;
  riskScore: number;
  factors: Factor[];
  bclcStage: string;
  stageBasis: string;
  treatmentPlan: string[];
  workup: string[];
};

export const ENGINE_VERSION = "Transparent Rule Engine v1.0 (BCLC 2022-aligned)";

/** Maps a BCLC stage to the universal numeric Stage I–IV scale. */
export function numericStage(bclcStage: string): string {
  const s = bclcStage;
  if (s.startsWith("0") || s.startsWith("A")) return "Stage I";
  if (s.startsWith("B")) return "Stage II";
  if (s.startsWith("C")) return "Stage III";
  if (s.startsWith("D")) return "Stage IV";
  return "Stage 0 (surveillance)";
}

/** Doctor-prescribed treatment plans for ALL stages — shown automatically with every verdict. */
export const STAGE_TREATMENT_GUIDE: { stage: string; bclc: string; plan: string[] }[] = [
  {
    stage: "Stage 1",
    bclc: "BCLC 0–A (very early / early)",
    plan: [
      "Curative-intent therapy: surgical resection, liver transplantation, or ablation (RFA/MWA)",
      "MDT selects the modality by liver reserve (Child-Pugh), tumor position, and patient fitness",
      "Consider radiofrequency/microwave ablation for tumors ≤ 3 cm",
      "Follow-up imaging every 3 months for recurrence surveillance",
    ],
  },
  {
    stage: "Stage 2",
    bclc: "BCLC B (intermediate)",
    plan: [
      "Transarterial chemoembolization (TACE) — standard for preserved liver function",
      "Consider transarterial radioembolization (TARE/Y-90) where available and appropriate",
      "Clinical trial enrollment strongly encouraged",
      "Portal pressure assessment; monitor for TACE-induced decompensation",
      "Escalate to systemic therapy if progression despite locoregional therapy",
    ],
  },
  {
    stage: "Stage 3",
    bclc: "BCLC C (advanced)",
    plan: [
      "First-line systemic therapy: atezolizumab + bevacizumab (or durvalumab + tremelimumab per regional availability)",
      "Clinical trial enrollment strongly encouraged",
      "Best supportive care optimization in parallel (nutrition, ascites management)",
      "MDT review at every progression checkpoint for second-line options",
    ],
  },
  {
    stage: "Stage 4",
    bclc: "BCLC D (decompensated / terminal)",
    plan: [
      "Best supportive / palliative care with symptom control as priority",
      "Assess liver-transplantation candidacy in select decompensated cases via MDT",
      "Hospice and psychosocial support pathways",
      "Antiviral therapy if HBV positive (prevents viral flare and decompensation)",
    ],
  },
];

const TREATMENT: Record<string, string[]> = {
  surveillance: [
    "Continue structured HCC surveillance: ultrasound + AFP every 6 months",
    "Lifestyle management: absolute alcohol abstinence, weight management, vaccination (HepA/HepB if non-immune)",
    "Antiviral therapy if HBV/HCV positive (viral suppression reduces HCC risk)",
    "Escalate immediately if any new focal lesion appears on follow-up imaging",
  ],
  "0": [
    "Curative-intent therapy: surgical resection, liver transplantation, or ablation (RFA/MWA)",
    "Multidisciplinary tumor board (MDT) to select the modality based on tumor location and liver function",
    "Follow-up imaging every 3 months for recurrence surveillance",
  ],
  A: [
    "Curative-intent therapy: surgical resection, liver transplantation, or ablation",
    "Select by MDT using liver reserve (Child-Pugh), tumor position, and patient fitness",
    "Consider radiofrequency/microwave ablation for tumors ≤ 3 cm",
    "Follow-up imaging every 3 months for recurrence surveillance",
  ],
  B: [
    "Transarterial chemoembolization (TACE) — standard for intermediate-stage, preserved liver function",
    "Consider transarterial radioembolization (TARE/Y-90) where available and appropriate",
    "Clinical trial enrollment strongly encouraged",
    "Portal pressure assessment; monitor for TACE-induced decompensation",
    "Escalate to systemic therapy if progression despite locoregional therapy",
  ],
  C: [
    "First-line systemic therapy: atezolizumab + bevacizumab (or durvalumab + tremelimumab per regional availability)",
    "Clinical trial enrollment strongly encouraged",
    "Best supportive care optimization in parallel (nutrition, ascites management)",
    "MDT review at every progression checkpoint for second-line options",
  ],
  D: [
    "Best supportive / palliative care with symptom control as priority",
    "Assess for liver-transplantation candidacy in select decompensated cases via MDT",
    "Hospice and psychosocial support pathways",
    "Antiviral therapy if HBV positive (prevents viral flare and decompensation)",
  ],
};

function stageFor(input: ScreeningInput): { stage: string; basis: string } {
  if (input.tumorCount === "none") {
    return { stage: "Surveillance (no confirmed lesion)", basis: "No tumor currently confirmed — staging applies only once a lesion is characterized. Surveillance cadence remains mandatory." };
  }
  if (input.metastasis === "Yes" || input.lymphNodes === "Yes") {
    return { stage: "C (Advanced)", basis: "Extrahepatic spread: lymph node involvement or distant metastasis upstages any case to BCLC-C regardless of tumor burden." };
  }
  if (input.vascularInvasion === "Yes") {
    return { stage: "C (Advanced)", basis: "Macrovascular invasion (portal/hepatic vein tumor thrombus) defines advanced stage (BCLC-C)." };
  }
  if (input.ps === "2+" || input.childPugh === "C") {
    return { stage: "D (Decompensated)", basis: "Child-Pugh C liver failure or Performance Status ≥ 2 defines terminal/decompensated stage (BCLC-D)." };
  }
  if (input.tumorCount === "3+") {
    return { stage: "B (Intermediate)", basis: "More than three nodules exceed the curative-intent threshold → intermediate stage (BCLC-B)." };
  }
  if (input.tumorCount === "2-3" && (input.tumorSizeCm ?? 0) > 3) {
    return { stage: "B (Intermediate)", basis: "2–3 nodules with any nodule > 3 cm exceeds the early-stage threshold (BCLC-B)." };
  }
  if (input.tumorCount === "1" && (input.tumorSizeCm ?? 0) > 5) {
    return { stage: "B (Intermediate)", basis: "Single tumor > 5 cm is upstaged to intermediate (BCLC-B) in the fair-liver reserve scenario." };
  }
  if (input.tumorCount === "1" && (input.tumorSizeCm ?? 99) <= 2) {
    return { stage: "0 (Very early)", basis: "Solitary tumor ≤ 2 cm in preserved liver function → very early stage (BCLC-0), best prognosis." };
  }
  return { stage: "A (Early)", basis: "Solitary ≤ 5 cm, or up to 3 nodules each ≤ 3 cm, with preserved liver function → early stage (BCLC-A)." };
}

export function runClinicalScreening(input: ScreeningInput): ScreeningResult {
  const factors: Factor[] = [];
  const add = (name: string, patientValue: string, rule: string, points: number) =>
    factors.push({ name, patientValue, rule, points });

  let afpPts = 0;
  let afpRule = "AFP < 30 ng/mL → +0";
  if (input.afp >= 400) {
    afpPts = 55;
    afpRule = "AFP ≥ 400 ng/mL → +55 (strongly abnormal)";
  } else if (input.afp >= 200) {
    afpPts = 40;
    afpRule = "AFP 200–399 ng/mL → +40";
  } else if (input.afp >= 30) {
    afpPts = 25;
    afpRule = "AFP 30–199 ng/mL → +25";
  }
  add("AFP (alpha-fetoprotein)", `${input.afp} ng/mL`, afpRule, afpPts);

  const cirr = input.cirrhosis === "Yes";
  add("Cirrhosis", input.cirrhosis, cirr ? "Cirrhosis present → +15 (major HCC risk substrate)" : "No confirmed cirrhosis → +0", cirr ? 15 : 0);

  const agePts = input.age >= 60 ? 8 : input.age >= 50 ? 5 : 0;
  add("Age", `${input.age} years`, input.age >= 60 ? "Age ≥ 60 → +8" : input.age >= 50 ? "Age 50–59 → +5" : "Age < 50 → +0", agePts);

  const infl = input.alt > 80 && input.ast > 80;
  add("ALT / AST", `ALT ${input.alt} · AST ${input.ast} U/L`, infl ? "Both > 80 U/L → +10 (active liver injury)" : "Within screening threshold → +0", infl ? 10 : 0);

  const male = input.sex.toLowerCase() === "male";
  add("Sex", input.sex, male ? "Male → +3 (higher population incidence)" : "→ +0", male ? 3 : 0);

  const cpPts = input.childPugh === "C" ? 7 : input.childPugh === "B" ? 5 : 0;
  add("Child-Pugh class", input.childPugh, input.childPugh === "C" ? "Class C → +7 (decompensated)" : input.childPugh === "B" ? "Class B → +5" : "Class A → +0", cpPts);

  const riskScore = Math.min(100, afpPts + (cirr ? 15 : 0) + agePts + (infl ? 10 : 0) + (male ? 3 : 0) + cpPts);

  let level: ScreeningResult["level"];
  let suspicion: ScreeningResult["suspicion"];
  let verdict: string;
  if (riskScore >= 70) {
    level = "High suspicion";
    suspicion = "YES";
    verdict =
      "LIVER CANCER SUSPICION: YES — HIGH. Treat as HCC until excluded. Urgent confirmatory multiphasic imaging and MDT review are mandatory before any treatment decision.";
  } else if (riskScore >= 40) {
    level = "Moderate suspicion";
    suspicion = "YES";
    verdict =
      "LIVER CANCER SUSPICION: YES — MODERATE. Confirmatory imaging (triphasic CT/MRI) and specialist review required to establish or exclude malignancy.";
  } else {
    level = "Low suspicion";
    suspicion = "NO";
    verdict =
      "LIVER CANCER SUSPICION: NO — LOW. No oncologic workup triggered by this screen. Continue standard 6-monthly ultrasound + AFP surveillance in at-risk livers.";
  }

  const { stage, basis } = stageFor(input);
  const treatmentPlan = TREATMENT[stage === "0 (Very early)" ? "0" : stage === "A (Early)" ? "A" : stage === "B (Intermediate)" ? "B" : stage === "C (Advanced)" ? "C" : stage === "D (Decompensated)" ? "D" : "surveillance"] ?? TREATMENT.surveillance;

  const workup =
    suspicion === "YES"
      ? [
          "Triphasic (arterial / portal / delayed) liver CT or contrast-enhanced MRI — mandatory",
          "Contrast-enhanced ultrasound as complementary dynamic imaging",
          "Tumor markers panel: AFP, CEA, CA 19-9 (to exclude cholangiocarcinoma / metastases)",
          "Child-Pugh laboratory panel: bilirubin, albumin, INR + ascites/encephalopathy assessment",
          "HBV / HCV serology and viral load if positive",
          "Biopsy ONLY if imaging is non-diagnostic AND the result would change management",
          "Multidisciplinary tumor board (MDT) presentation before treatment initiation",
        ]
      : [
          "Continue 6-monthly ultrasound + AFP surveillance",
          "Repeat screening if clinical suspicion changes (new symptoms, rising AFP, new lesion)",
          "Optimize risk reduction: alcohol abstinence, antiviral therapy, metabolic management",
        ];

  return { engineVersion: ENGINE_VERSION, suspicion, level, verdict, riskScore, factors, bclcStage: stage, stageBasis: basis, treatmentPlan, workup };
}
