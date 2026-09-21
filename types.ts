export type Session = { name: string; email: string; role: string; token?: string };

export type PatientT = {
  id: number;
  patientCode: string;
  fullName: string;
  age: number;
  sex: string;
  diagnosisStatus: string;
  riskLevel: string;
  lastVisit?: string;
  notes: string;
  createdAt: string;
};

export type AnalysisT = {
  id: number;
  caseId: string;
  patientId: number;
  modality: string;
  modelVersion: string;
  prediction: string;
  probability: number;
  uncertainty: string;
  afp: number;
  alt: number;
  ast: number;
  cirrhosis: string;
  scanPath: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
};

export type ReviewT = {
  id: number;
  analysisId: number;
  doctorName: string;
  status: string;
  notes: string;
  createdAt: string;
};

export type ReportT = {
  id: number;
  analysisId: number;
  title: string;
  summary: string;
  status: string;
  createdAt: string;
};

export type AuditT = {
  id: number;
  actor: string;
  action: string;
  entity: string;
  entityId?: number | null;
  details: string;
  createdAt: string;
};

export type ScreeningFactor = {
  name: string;
  patientValue: string;
  rule: string;
  points: number;
};

export type MessageT = {
  id: number;
  fromName: string;
  fromEmail: string;
  toName: string;
  toEmail: string;
  subject: string;
  body: string;
  template: string;
  channel: string;
  status: string;
  createdAt: string;
};

export type ScreeningT = {
  id: number;
  analysisId: number;
  engineVersion: string;
  verdict: string;
  suspicion: string;
  riskScore: number;
  bclcStage: string;
  stageBasis: string;
  childPugh: string;
  tumorCount: string;
  tumorSizeCm: number | null;
  vascularInvasion: string;
  lymphNodes: string;
  metastasis: string;
  ps: string;
  treatmentPlan: string[];
  factors: ScreeningFactor[];
  workup: string[];
  createdAt: string;
};

export type ViewKey =
  | "dashboard"
  | "unique"
  | "new-analysis"
  | "patients"
  | "analysis"
  | "imaging"
  | "clinical"
  | "multimodal"
  | "explainability"
  | "uncertainty"
  | "history"
  | "reviews"
  | "reports"
  | "qa"
  | "models"
  | "audit"
  | "settings"
  | "datasets"
  | "messages";

export type ToastTone = "success" | "error" | "info";

export type App = {
  session: Session;
  view: ViewKey;
  selectedId: number | null;
  editingPatientId: number | null;
  navigate: (view: ViewKey, id?: number | null) => void;
  setEditingPatientId: (id: number | null) => void;
  patients: PatientT[];
  analyses: AnalysisT[];
  reviews: ReviewT[];
  reports: ReportT[];
  screenings: ScreeningT[];
  messages: MessageT[];
  audit: AuditT[];
  busy: string | null;
  runScreening: (f: FormData) => void;
  sendMessage: (f: FormData) => void;
  toast: (message: string, tone?: ToastTone) => void;
  createPatient: (f: FormData) => void;
  updatePatient: (f: FormData) => void;
  deletePatient: (id: number) => void;
  createAnalysis: (f: FormData) => Promise<number | null>;
  deleteAnalysis: (id: number) => void;
  runAnalysis: (id: number) => void;
  saveReview: (f: FormData) => void;
  generateReport: (analysisId: number) => void;
  logout: () => void;
};
