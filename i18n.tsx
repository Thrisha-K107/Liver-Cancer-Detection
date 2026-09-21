"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = {
  code: string;
  label: string;
  dir: "ltr" | "rtl";
};

export const LANGS: Lang[] = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "hi", label: "हिन्दी", dir: "ltr" },
  { code: "ta", label: "தமிழ்", dir: "ltr" },
  { code: "te", label: "తెలుగు", dir: "ltr" },
  { code: "bn", label: "বাংলা", dir: "ltr" },
  { code: "es", label: "Español", dir: "ltr" },
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "de", label: "Deutsch", dir: "ltr" },
  { code: "pt", label: "Português", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "zh", label: "中文", dir: "ltr" },
  { code: "ja", label: "日本語", dir: "ltr" },
  { code: "kn", label: "ಕನ್ನಡ", dir: "ltr" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "nav.dashboard": "Dashboard", "nav.unique": "Unique Solution", "nav.newAnalysis": "New Analysis",
  "nav.patients": "Patients", "nav.history": "History", "nav.imaging": "Image Analysis",
  "nav.clinical": "Clinical Analysis", "nav.multimodal": "Multimodal Result", "nav.explainability": "Explainability",
  "nav.uncertainty": "Uncertainty", "nav.reviews": "Doctor Review", "nav.reports": "Reports",
  "nav.qa": "QA Loop", "nav.models": "Model Registry", "nav.audit": "Audit Log", "nav.settings": "Settings",
  "nav.datasets": "Sample Datasets", "nav.messages": "Secure Messaging",
  disclaimer: "Research prototype. AI-generated outputs require appropriate qualified professional review and are not a standalone diagnosis.",
  "label.risk": "Risk percentage", "label.stage": "Stage", "label.treatment": "Treatment plan",
  "label.parameters": "Driving parameters", "label.uncertainty": "Uncertainty",
  "verdict.yes": "LIVER CANCER: YES", "verdict.no": "LIVER CANCER: NO",
  "stats.patients": "Patients", "stats.cases": "Research Cases", "stats.screenings": "Screenings Run",
  "stats.reviews": "Pending Reviews", "stats.reports": "Reports",
};

const dicts: Record<string, Dict> = {
  en,
  hi: {
    "nav.dashboard": "डैशबोर्ड", "nav.unique": "अद्वितीय समाधान", "nav.newAnalysis": "नया विश्लेषण",
    "nav.patients": "मरीज़", "nav.history": "इतिहास", "nav.imaging": "इमेज विश्लेषण",
    "nav.clinical": "क्लिनिकल विश्लेषण", "nav.multimodal": "मल्टीमॉडल परिणाम", "nav.explainability": "व्याख्यात्मकता",
    "nav.uncertainty": "अनिश्चितता", "nav.reviews": "डॉक्टर समीक्षा", "nav.reports": "रिपोर्ट",
    "nav.qa": "QA लूप", "nav.models": "मॉडल रजिस्ट्री", "nav.audit": "ऑडिट लॉग", "nav.settings": "सेटिंग्स",
    "nav.datasets": "नमूना डेटासेट", "nav.messages": "सुरक्षित संदेश",
    disclaimer: "शोध प्रोटोटाइप। AI आउटपुट के लिए योग्य पेशेवर समीक्षा आवश्यक है; यह स्वतंत्र निदान नहीं है।",
    "label.risk": "जोखिम प्रतिशत", "label.stage": "चरण", "label.treatment": "उपचार योजना",
    "label.parameters": "मुख्य पैरामीटर", "label.uncertainty": "अनिश्चितता",
    "verdict.yes": "लिवर कैंसर: हाँ", "verdict.no": "लिवर कैंसर: नहीं",
    "stats.patients": "मरीज़", "stats.cases": "शोध मामले", "stats.screenings": "स्क्रीनिंग",
    "stats.reviews": "लंबित समीक्षाएँ", "stats.reports": "रिपोर्ट",
  },
  ta: {
    "nav.dashboard": "டாஷ்போர்டு", "nav.unique": "தனித்துவ தீர்வு", "nav.newAnalysis": "புதிய பகுப்பாய்வு",
    "nav.patients": "நோயாளிகள்", "nav.history": "வரலாறு", "nav.imaging": "பட பகுப்பாய்வு",
    "nav.clinical": "மருத்துவ பகுப்பாய்வு", "nav.multimodal": "மல்டிமாடல் முடிவு", "nav.explainability": "விளக்கத்திறன்",
    "nav.uncertainty": "நிச்சயமின்மை", "nav.reviews": "மருத்துவ மதிப்பாய்வு", "nav.reports": "அறிக்கைகள்",
    "nav.qa": "QA சுழற்சி", "nav.models": "மாதிரி பதிவகம்", "nav.audit": "தணிக்கை பதிவு", "nav.settings": "அமைப்புகள்",
    "nav.datasets": "மாதிரி தரவுத்தொகுப்புகள்", "nav.messages": "பாதுகாப்பான செய்திகள்",
    disclaimer: "ஆராய்ச்சி முன்மாதிரி. AI வெளியீடுகளுக்கு தகுதிவாய்ந்த நிபுணர் மதிப்பாய்வு தேவை; இது தனி நோயறிதல் அல்ல.",
    "label.risk": "ஆபத்து சதவீதம்", "label.stage": "நிலை", "label.treatment": "சிகிச்சை திட்டம்",
    "label.parameters": "முக்கிய அளவுருக்கள்", "label.uncertainty": "நிச்சயமின்மை",
    "verdict.yes": "கல்லீரல் புற்றுநோய்: ஆம்", "verdict.no": "கல்லீரல் புற்றுநோய்: இல்லை",
    "stats.patients": "நோயாளிகள்", "stats.cases": "ஆராய்ச்சி வழக்குகள்", "stats.screenings": "ஸ்கிரீனிங்",
    "stats.reviews": "நிலுவை மதிப்பாய்வுகள்", "stats.reports": "அறிக்கைகள்",
  },
  te: {
    "nav.dashboard": "డాష్బోర్డ్", "nav.unique": "ప్రత్యేక పరిష్కారం", "nav.newAnalysis": "కొత్త విశ్లేషణ",
    "nav.patients": "రోగులు", "nav.history": "చరిత్ర", "nav.imaging": "చిత్ర విశ్లేషణ",
    "nav.clinical": "వైద్య విశ్లేషణ", "nav.multimodal": "మల్టీమోడల్ ఫలితం", "nav.explainability": "వివరణాత్మకత",
    "nav.uncertainty": "అనిశ్చితి", "nav.reviews": "వైద్య సమీక్ష", "nav.reports": "నివేదికలు",
    "nav.qa": "QA లూప్", "nav.models": "మోడల్ రిజిస్ట్రీ", "nav.audit": "ఆడిట్ లాగ్", "nav.settings": "సెట్టింగ్లు",
    "nav.datasets": "నమూనా డేటాసెట్లు", "nav.messages": "సురక్షిత సందేశాలు",
    disclaimer: "పరిశోధన ప్రోటోటైప్. AI అవుట్పుట్లకు అర్హత కలిగిన నిపుణుల సమీక్ష అవసరం; ఇది స్వతంత్ర రోగ నిర్ధారణ కాదు.",
    "label.risk": "ప్రమాద శాతం", "label.stage": "దశ", "label.treatment": "చికిత్స ప్రణాళిక",
    "label.parameters": "కీ పారామితులు", "label.uncertainty": "అనిశ్చితి",
    "verdict.yes": "కాలేయ క్యాన్సర్: అవును", "verdict.no": "కాలేయ క్యాన్సర్: కాదు",
    "stats.patients": "రోగులు", "stats.cases": "పరిశోధన కేసులు", "stats.screenings": "స్క్రీనింగ్లు",
    "stats.reviews": "పెండింగ్ సమీక్షలు", "stats.reports": "నివేదికలు",
  },
  bn: {
    "nav.dashboard": "ড্যাশবোর্ড", "nav.unique": "অদ্বিতীয় সমাধান", "nav.newAnalysis": "নতুন বিশ্লেষণ",
    "nav.patients": "রোগী", "nav.history": "ইতিহাস", "nav.imaging": "ইমেজ বিশ্লেষণ",
    "nav.clinical": "ক্লিনিকাল বিশ্লেষণ", "nav.multimodal": "মাল্টিমোডাল ফলাফল", "nav.explainability": "ব্যাখ্যাযোগ্যতা",
    "nav.uncertainty": "অনিশ্চয়তা", "nav.reviews": "ডাক্তার পর্যালোচনা", "nav.reports": "রিপোর্ট",
    "nav.qa": "QA লুপ", "nav.models": "মডেল রেজিস্ট্রি", "nav.audit": "অডিট লগ", "nav.settings": "সেটিংস",
    "nav.datasets": "নমুনা ডেটাসেট", "nav.messages": "নিরাপদ বার্তা",
    disclaimer: "গবেষণা প্রোটোটাইপ। AI আউটপুটের জন্য যোগ্য পেশাদার পর্যালোচনা প্রয়োজন; এটি স্বাধীন রোগ নির্ণয় নয়।",
    "label.risk": "ঝুঁকির শতাংশ", "label.stage": "পর্যায়", "label.treatment": "চিকিৎসা পরিকল্পনা",
    "label.parameters": "প্রধান প্যারামিটার", "label.uncertainty": "অনিশ্চয়তা",
    "verdict.yes": "লিভার ক্যান্সার: হ্যাঁ", "verdict.no": "লিভার ক্যান্সার: না",
    "stats.patients": "রোগী", "stats.cases": "গবেষণা কেস", "stats.screenings": "স্ক্রিনিং",
    "stats.reviews": "মুলতুবি পর্যালোচনা", "stats.reports": "রিপোর্ট",
  },
  es: {
    "nav.dashboard": "Panel", "nav.unique": "Solución única", "nav.newAnalysis": "Nuevo análisis",
    "nav.patients": "Pacientes", "nav.history": "Historial", "nav.imaging": "Análisis de imagen",
    "nav.clinical": "Análisis clínico", "nav.multimodal": "Resultado multimodal", "nav.explainability": "Explicabilidad",
    "nav.uncertainty": "Incertidumbre", "nav.reviews": "Revisión médica", "nav.reports": "Informes",
    "nav.qa": "Bucle QA", "nav.models": "Registro de modelos", "nav.audit": "Registro de auditoría", "nav.settings": "Ajustes",
    "nav.datasets": "Conjuntos de datos", "nav.messages": "Mensajería segura",
    disclaimer: "Prototipo de investigación. Los resultados de IA requieren revisión profesional cualificada; no constituyen un diagnóstico independiente.",
    "label.risk": "Porcentaje de riesgo", "label.stage": "Etapa", "label.treatment": "Plan de tratamiento",
    "label.parameters": "Parámetros clave", "label.uncertainty": "Incertidumbre",
    "verdict.yes": "CÁNCER DE HÍGADO: SÍ", "verdict.no": "CÁNCER DE HÍGADO: NO",
    "stats.patients": "Pacientes", "stats.cases": "Casos de investigación", "stats.screenings": "Cribados",
    "stats.reviews": "Revisiones pendientes", "stats.reports": "Informes",
  },
  fr: {
    "nav.dashboard": "Tableau de bord", "nav.unique": "Solution unique", "nav.newAnalysis": "Nouvelle analyse",
    "nav.patients": "Patients", "nav.history": "Historique", "nav.imaging": "Analyse d'image",
    "nav.clinical": "Analyse clinique", "nav.multimodal": "Résultat multimodal", "nav.explainability": "Explicabilité",
    "nav.uncertainty": "Incertitude", "nav.reviews": "Revue médicale", "nav.reports": "Rapports",
    "nav.qa": "Boucle QA", "nav.models": "Registre des modèles", "nav.audit": "Journal d'audit", "nav.settings": "Paramètres",
    "nav.datasets": "Jeux de données", "nav.messages": "Messagerie sécurisée",
    disclaimer: "Prototype de recherche. Les résultats de l'IA nécessitent une revue professionnelle qualifiée ; ils ne constituent pas un diagnostic autonome.",
    "label.risk": "Pourcentage de risque", "label.stage": "Stade", "label.treatment": "Plan de traitement",
    "label.parameters": "Paramètres clés", "label.uncertainty": "Incertitude",
    "verdict.yes": "CANCER DU FOIE : OUI", "verdict.no": "CANCER DU FOIE : NON",
    "stats.patients": "Patients", "stats.cases": "Cas de recherche", "stats.screenings": "Dépistages",
    "stats.reviews": "Revues en attente", "stats.reports": "Rapports",
  },
  de: {
    "nav.dashboard": "Übersicht", "nav.unique": "Einzigartige Lösung", "nav.newAnalysis": "Neue Analyse",
    "nav.patients": "Patienten", "nav.history": "Verlauf", "nav.imaging": "Bildanalyse",
    "nav.clinical": "Klinische Analyse", "nav.multimodal": "Multimodales Ergebnis", "nav.explainability": "Erklärbarkeit",
    "nav.uncertainty": "Unsicherheit", "nav.reviews": "Ärztliche Prüfung", "nav.reports": "Berichte",
    "nav.qa": "QA-Schleife", "nav.models": "Modellregister", "nav.audit": "Audit-Log", "nav.settings": "Einstellungen",
    "nav.datasets": "Beispieldatensätze", "nav.messages": "Sichere Nachrichten",
    disclaimer: "Forschungsprototyp. KI-Ausgaben erfordern qualifizierte fachliche Prüfung; sie sind keine eigenständige Diagnose.",
    "label.risk": "Risikoprozentsatz", "label.stage": "Stadium", "label.treatment": "Behandlungsplan",
    "label.parameters": "Wichtige Parameter", "label.uncertainty": "Unsicherheit",
    "verdict.yes": "LEBERKREBS: JA", "verdict.no": "LEBERKREBS: NEIN",
    "stats.patients": "Patienten", "stats.cases": "Forschungsfälle", "stats.screenings": "Screenings",
    "stats.reviews": "Ausstehende Prüfungen", "stats.reports": "Berichte",
  },
  pt: {
    "nav.dashboard": "Painel", "nav.unique": "Solução única", "nav.newAnalysis": "Nova análise",
    "nav.patients": "Pacientes", "nav.history": "Histórico", "nav.imaging": "Análise de imagem",
    "nav.clinical": "Análise clínica", "nav.multimodal": "Resultado multimodal", "nav.explainability": "Explicabilidade",
    "nav.uncertainty": "Incerteza", "nav.reviews": "Revisão médica", "nav.reports": "Relatórios",
    "nav.qa": "Ciclo QA", "nav.models": "Registro de modelos", "nav.audit": "Registo de auditoria", "nav.settings": "Configurações",
    "nav.datasets": "Conjuntos de dados", "nav.messages": "Mensagens seguras",
    disclaimer: "Protótipo de pesquisa. Os resultados de IA exigem revisão profissional qualificada; não constituem um diagnóstico autónomo.",
    "label.risk": "Percentagem de risco", "label.stage": "Estádio", "label.treatment": "Plano de tratamento",
    "label.parameters": "Parâmetros-chave", "label.uncertainty": "Incerteza",
    "verdict.yes": "CANCER DO FÍGADO: SIM", "verdict.no": "CANCER DO FÍGADO: NÃO",
    "stats.patients": "Pacientes", "stats.cases": "Casos de pesquisa", "stats.screenings": "Rastreios",
    "stats.reviews": "Revisões pendentes", "stats.reports": "Relatórios",
  },
  ar: {
    "nav.dashboard": "لوحة التحكم", "nav.unique": "الحل الفريد", "nav.newAnalysis": "تحليل جديد",
    "nav.patients": "المرضى", "nav.history": "السجل", "nav.imaging": "تحليل الصور",
    "nav.clinical": "التحليل السريري", "nav.multimodal": "النتيجة متعددة الوسائط", "nav.explainability": "قابلية التفسير",
    "nav.uncertainty": "عدم اليقين", "nav.reviews": "مراجعة الطبيب", "nav.reports": "التقارير",
    "nav.qa": "حلقة الجودة", "nav.models": "سجل النماذج", "nav.audit": "سجل التدقيق", "nav.settings": "الإعدادات",
    "nav.datasets": "مجموعات البيانات", "nav.messages": "الرسائل الآمنة",
    disclaimer: "نموذج بحثي. تتطلب مخرجات الذكاء الاصطناعي مراجعة مهنية مؤهلة وليست تشخيصًا مستقلًا.",
    "label.risk": "نسبة المخاطر", "label.stage": "المرحلة", "label.treatment": "خطة العلاج",
    "label.parameters": "المعلمات الرئيسية", "label.uncertainty": "عدم اليقين",
    "verdict.yes": "سرطان الكبد: نعم", "verdict.no": "سرطان الكبد: لا",
    "stats.patients": "المرضى", "stats.cases": "حالات البحث", "stats.screenings": "الفحوصات",
    "stats.reviews": "مراجعات معلقة", "stats.reports": "التقارير",
  },
  zh: {
    "nav.dashboard": "仪表板", "nav.unique": "独特方案", "nav.newAnalysis": "新分析",
    "nav.patients": "患者", "nav.history": "历史记录", "nav.imaging": "影像分析",
    "nav.clinical": "临床分析", "nav.multimodal": "多模态结果", "nav.explainability": "可解释性",
    "nav.uncertainty": "不确定性", "nav.reviews": "医生审核", "nav.reports": "报告",
    "nav.qa": "QA 循环", "nav.models": "模型注册表", "nav.audit": "审计日志", "nav.settings": "设置",
    "nav.datasets": "样本数据集", "nav.messages": "安全消息",
    disclaimer: "研究原型。AI 输出需要合格的专业人员审核，不能作为独立的诊断。",
    "label.risk": "风险百分比", "label.stage": "分期", "label.treatment": "治疗计划",
    "label.parameters": "关键参数", "label.uncertainty": "不确定性",
    "verdict.yes": "肝癌：是", "verdict.no": "肝癌：否",
    "stats.patients": "患者", "stats.cases": "研究案例", "stats.screenings": "筛查",
    "stats.reviews": "待审核", "stats.reports": "报告",
  },
  kn: {
    "nav.dashboard": "ಡ್ಯಾಶ್ಬೋರ್ಡ್", "nav.unique": "ವಿಶಿಷ್ಟ ಪರಿಹಾರ", "nav.newAnalysis": "ಹೊಸ ವಿಶ್ಲೇಷಣೆ",
    "nav.patients": "ರೋಗಿಗಳು", "nav.history": "ಇತಿಹಾಸ", "nav.imaging": "ಚಿತ್ರ ವಿಶ್ಲೇಷಣೆ",
    "nav.clinical": "ಕ್ಲಿನಿಕಲ್ ವಿಶ್ಲೇಷಣೆ", "nav.multimodal": "ಮಲ್ಟಿಮೋಡಲ್ ಫಲಿತಾಂಶ", "nav.explainability": "ವಿವರಣಾತ್ಮಕತೆ",
    "nav.uncertainty": "ಅನಿಶ್ಚಿತತೆ", "nav.reviews": "ವೈದ್ಯರ ಪರಿಶೀಲನೆ", "nav.reports": "ವರದಿಗಳು",
    "nav.qa": "QA ಲೂಪ್", "nav.models": "ಮಾದರಿ ನೋಂದಣಿ", "nav.audit": "ಆಡಿಟ್ ಲಾಗ್", "nav.settings": "ಸೆಟ್ಟಿಂಗ್ಗಳು",
    "nav.datasets": "ಮಾದರಿ ಡೇಟಾಸೆಟ್ಗಳು", "nav.messages": "ಸುರಕ್ಷಿತ ಸಂದೇಶಗಳು",
    disclaimer: "ಸಂಶೋಧನಾ ಮೂಲಮಾದರಿ. AI ಔಟ್ಪುಟ್ಗಳಿಗೆ ಅರ್ಹ ವೃತ್ತಿಪರ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ; ಇದು ಸ್ವತಂತ್ರ ರೋಗನಿರ್ಣಯವಲ್ಲ.",
    "label.risk": "ಅಪಾಯದ ಶೇಕಡಾವಾರು", "label.stage": "ಹಂತ", "label.treatment": "ಚಿಕಿತ್ಸಾ ಯೋಜನೆ",
    "label.parameters": "ಪ್ರಮುಖ ನಿಯತಾಂಕಗಳು", "label.uncertainty": "ಅನಿಶ್ಚಿತತೆ",
    "verdict.yes": "ಯಕೃತ್ತಿನ ಕ್ಯಾನ್ಸರ್: ಹೌದು", "verdict.no": "ಯಕೃತ್ತಿನ ಕ್ಯಾನ್ಸರ್: ಇಲ್ಲ",
    "stats.patients": "ರೋಗಿಗಳು", "stats.cases": "ಸಂಶೋಧನಾ ಪ್ರಕರಣಗಳು", "stats.screenings": "ಸ್ಕ್ರೀನಿಂಗ್ಗಳು",
    "stats.reviews": "ಬಾಕಿ ಪರಿಶೀಲನೆಗಳು", "stats.reports": "ವರದಿಗಳು",
  },
  ja: {
    "nav.dashboard": "ダッシュボード", "nav.unique": "独自ソリューション", "nav.newAnalysis": "新規解析",
    "nav.patients": "患者", "nav.history": "履歴", "nav.imaging": "画像解析",
    "nav.clinical": "臨床解析", "nav.multimodal": "マルチモーダル結果", "nav.explainability": "説明可能性",
    "nav.uncertainty": "不確実性", "nav.reviews": "医師レビュー", "nav.reports": "レポート",
    "nav.qa": "QAループ", "nav.models": "モデルレジストリ", "nav.audit": "監査ログ", "nav.settings": "設定",
    "nav.datasets": "サンプルデータセット", "nav.messages": "セキュアメッセージ",
    disclaimer: "研究プロトタイプ。AI出力には資格のある専門家によるレビューが必要であり、単独の診断ではありません。",
    "label.risk": "リスク率", "label.stage": "病期", "label.treatment": "治療計画",
    "label.parameters": "主要パラメータ", "label.uncertainty": "不確実性",
    "verdict.yes": "肝がん：はい", "verdict.no": "肝がん：いいえ",
    "stats.patients": "患者", "stats.cases": "研究症例", "stats.screenings": "スクリーニング",
    "stats.reviews": "保留中のレビュー", "stats.reports": "レポート",
  },
};

type Ctx = { lang: string; setLang: (c: string) => void; t: (key: string) => string };
const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => en[k] ?? k });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    const meta = LANGS.find((l) => l.code === lang);
    if (meta) document.documentElement.dir = meta.dir;
  }, [lang]);
  const t = (key: string) => (dicts[lang] && dicts[lang][key]) || en[key] || key;
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
