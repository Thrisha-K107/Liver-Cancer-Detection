# 🏥 AI-Powered Liver Cancer Early Detection System
## Complete Implementation Guide — Aspire Seed Fund Project ($500 USD)
### Google Colab + FastAPI + React + PostgreSQL | Full Stack | Vibe Coding Edition

---

> **Congratulations on your Aspire Seed Fund selection!**
> This guide gives you every Claude prompt, every implementation step, and everything you need to build this project from zero to deployment in 9 weeks.

---

## 📖 PART 0: Explain Like I'm 5 (ELI5) — What Is This Project?

Imagine your liver is a big city. Sometimes bad guys (cancer cells) try to take over parts of the city.

Doctors take special X-ray pictures called **CT scans** — like a Google Maps photo of the liver city. But looking at thousands of these photos every day is very hard and tiring for doctors — they can miss things.

**Your AI system is like a super-smart robot assistant** that:
1. Looks at the liver photo (CT scan)
2. Finds the bad-guy cancer cells (even tiny ones doctors might miss)
3. Draws a red circle around the dangerous area — like a map highlighting a bad neighborhood
4. Tells the doctor: "Hey, look HERE, this looks suspicious — 94% chance it's cancer, Stage 2"
5. Gives the doctor a full report so they can help the patient faster

**Why is this better than existing solutions?**
- Existing AI tools are expensive ($50,000+/year hospital software)
- Yours will be affordable and accessible even in low-resource hospitals
- It explains WHY it thinks it's cancer (Grad-CAM visual maps) — doctors can trust it
- It works on regular hospital CT scan files (DICOM format) without special hardware

---

## 📊 PART 1: Complete Medical Knowledge — Liver Cancer Facts

### What Is Liver Cancer?

Liver cancer (Hepatocellular Carcinoma / HCC) is one of the most dangerous cancers globally:
- **6th most common cancer** worldwide (906,000 new cases/year)
- **3rd leading cause of cancer death** (830,000 deaths/year)
- **5-year survival rate**: Only 20% if caught late, 70%+ if caught early (Stage 1)
- **India-specific**: ~50,000 new cases/year; often detected too late due to limited screening

### CT Scan Differences: Cancer vs. Normal Liver

**Normal Liver CT Scan Characteristics:**
- Uniform density: 50–70 Hounsfield Units (HU)
- Smooth edges and homogeneous texture
- Hepatic veins and portal vein visible as dark branching lines
- No focal lesions or masses
- Liver size: 15–17 cm in adults
- Enhancement pattern: Uniform after contrast injection

**Liver Cancer CT Scan Characteristics:**
- Focal hypervascular lesion (bright spot in arterial phase)
- "Washout" appearance in portal venous/delayed phase (tumor becomes darker)
- Irregular margins and heterogeneous texture
- Possible satellite nodules (smaller tumors nearby)
- Portal vein tumor thrombus (PVTT) in advanced cases
- Capsule enhancement on delayed imaging
- Size: 1 cm to >10 cm depending on stage

### BCLC Staging System (Most Used Globally)

| Stage | Size/Spread | Liver Function | Treatment | 5-Year Survival |
|-------|-------------|---------------|-----------|-----------------|
| Very Early (0) | Single <2cm | Good (A) | Surgery/Ablation | 70-80% |
| Early (A) | Single or 3 nodules <3cm | Good (A/B) | Surgery/Transplant | 50-70% |
| Intermediate (B) | Multinodular | Good | TACE (chemo) | 16-40% |
| Advanced (C) | Portal invasion/metastasis | Any | Sorafenib drug | 8-18% |
| Terminal (D) | Any | Poor (D) | Palliative care | <3 months |

### All Existing AI Solutions for Liver Cancer (2025)

| System | Accuracy | Method | Cost | Limitation |
|--------|----------|--------|------|------------|
| **LiRADS AI (FDA 2022)** | 88.4% | Deep CNN on CT | $40k+/yr | US-only, large hospitals |
| **Alibaba DAMO Medical AI** | 91.2% | 3D ResNet | Proprietary | China market only |
| **Google Health Liver AI** | 89.7% | Transformer + CNN | Not released | Research only |
| **Siemens AI-Rad Companion** | 86.1% | Multi-organ CNN | $60k+/yr | No explainability |
| **Enlitic Deep Learning** | 84.3% | CNN ensemble | $25k+/yr | General, not liver-specific |
| **InferRead CT Liver** | 90.1% | 3D nnU-Net | $30k+/yr | No staging output |
| **Radiopaedia AI** | 82.5% | ResNet50 | Subscription | No clinical integration |
| **Your Target** | **>92%** | EfficientNet+SHAP | **$500 seed** | Accessible globally |

### How Existing Solutions Work (Technical Mechanism)

**Standard AI Pipeline Used by Most:**
1. DICOM CT scan ingested → Preprocessed (HU normalization, resampling to 1mm³)
2. Liver segmented from surrounding organs (U-Net segmentation)
3. Candidate lesion regions identified (Region Proposal Network)
4. Classification CNN trained on 10,000+ annotated scans
5. Output: Binary (cancer/no cancer) or staging score
6. **Missing in most**: Explainability (WHY the AI said yes/no)

**Your Advantage**: Adding Grad-CAM + SHAP explainability maps means doctors can verify the AI's reasoning — critical for clinical trust and regulatory approval.

---

## 🗂️ PART 2: Project Structure

```
liver-cancer-ai/
├── frontend/                    # React app (Vercel)
│   ├── src/
│   │   ├── components/
│   │   │   ├── CTScanUploader.jsx
│   │   │   ├── ResultsDashboard.jsx
│   │   │   ├── GradCAMViewer.jsx
│   │   │   ├── PatientForm.jsx
│   │   │   └── ReportExporter.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Results.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── api/
│   │   │   └── axiosClient.js
│   │   └── App.jsx
│   ├── .env
│   └── package.json
│
├── backend/                     # FastAPI Python (AWS EC2)
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── predict.py
│   │   │   ├── patients.py
│   │   │   ├── reports.py
│   │   │   └── auth.py
│   │   ├── models/
│   │   │   ├── ai_model.py      # PyTorch model loader
│   │   │   ├── gradcam.py       # Explainability
│   │   │   └── shap_explainer.py
│   │   ├── services/
│   │   │   ├── dicom_processor.py
│   │   │   ├── s3_service.py
│   │   │   └── report_generator.py
│   │   └── database/
│   │       ├── db.py
│   │       └── schemas.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── ai_model/                    # Google Colab notebooks
│   ├── 01_data_preprocessing.ipynb
│   ├── 02_model_training.ipynb
│   ├── 03_gradcam_shap.ipynb
│   ├── 04_model_evaluation.ipynb
│   └── 05_model_export.ipynb
│
└── database/
    ├── schema.sql
    └── migrations/
```

---

## 🤖 PART 3: ALL OPTIMIZED CLAUDE PROMPTS

Use these exact prompts in Claude (or Claude Code) to build each component.

---

### 📦 PROMPT SET A: PROJECT SETUP & ENVIRONMENT

---

#### PROMPT A1 — Project Initialization

```
You are a senior full-stack AI/ML engineer. I am building an AI-Powered Liver Cancer Early Detection System using:
- Frontend: React 18 + Tailwind CSS + Vite (deployed on Vercel)
- Backend: FastAPI + Python 3.11 (deployed on AWS EC2 Free Tier)
- Database: PostgreSQL 15 (AWS RDS Free Tier) + Firebase Auth + AWS S3 for CT scan storage
- AI Model: PyTorch EfficientNetB4 + Grad-CAM + SHAP (trained on Google Colab Pro)
- Explainability: SHAP and Grad-CAM heat maps

Create the complete project folder structure with all necessary files:
1. Generate the frontend React project with Vite: `npm create vite@latest frontend -- --template react`
2. Generate the backend FastAPI project structure with all necessary folders
3. Create a root-level docker-compose.yml that runs frontend, backend, and PostgreSQL together locally
4. Create .env.example files for both frontend and backend with all required environment variables
5. Create a requirements.txt with these exact dependencies:
   fastapi, uvicorn, python-multipart, pydicom, Pillow, torch, torchvision, 
   transformers, shap, opencv-python, numpy, pandas, sqlalchemy, psycopg2-binary, 
   boto3, firebase-admin, reportlab, python-jose[cryptography], passlib[bcrypt], 
   python-dotenv

Output all file contents with complete code, no placeholders.
```

---

#### PROMPT A2 — Google Colab Environment Setup

```
You are an expert ML engineer specializing in medical imaging AI. Set up a complete Google Colab Pro environment for training a liver cancer CT scan detection model.

Create a Google Colab notebook cell-by-cell that:

1. CELL 1 - Install all dependencies:
   pip install pydicom SimpleITK nibabel monai torch torchvision timm 
   shap grad-cam scikit-learn matplotlib seaborn albumentations kaggle

2. CELL 2 - Mount Google Drive and set up folder structure:
   /content/drive/MyDrive/LiverCancerAI/
   ├── datasets/raw/
   ├── datasets/processed/
   ├── models/checkpoints/
   ├── models/final/
   ├── results/gradcam/
   └── results/shap/

3. CELL 3 - Configure Kaggle API to download:
   - TCGA-LIHC liver CT dataset (free, NIH)
   - LiTS17 Challenge Dataset (liver tumor segmentation)

4. CELL 4 - Set all random seeds for reproducibility:
   torch.manual_seed(42), numpy, random, CUDA deterministic mode

5. CELL 5 - Configure GPU: verify CUDA, set float16 precision for Colab A100

Show complete Python code for every cell with error handling.
```

---

### 🧠 PROMPT SET B: AI MODEL TRAINING

---

#### PROMPT B1 — DICOM Data Preprocessing

```
You are a medical imaging AI expert. Write complete Python code for a DICOM CT scan preprocessor for liver cancer detection.

Create a file `preprocessing.py` that:

1. DICOM LOADING:
   - Load .dcm files using pydicom
   - Handle multi-slice CT volumes (3D stacks)
   - Extract Hounsfield Units (HU): pixel_array * slope + intercept
   - Apply liver window: center=60 HU, width=350 HU → clip to [-115, 235] HU
   - Normalize to [0, 1] float32

2. PREPROCESSING PIPELINE:
   - Resize all scans to 512×512 pixels (bilinear interpolation)
   - Apply liver segmentation mask using thresholding (HU 40-60 range)
   - Extract 2.5D slices: take the center 5 slices of liver region as 5-channel input
   - Save as .npy arrays for fast training loading

3. DATA AUGMENTATION (Albumentations):
   - RandomRotate90 (p=0.5)
   - HorizontalFlip (p=0.5)
   - ElasticTransform (p=0.3, alpha=120, sigma=6)
   - GaussNoise (p=0.3, var_limit=(10, 50))
   - RandomBrightnessContrast (p=0.4)
   - CoarseDropout (p=0.2, max_holes=8, max_height=32)
   - NEVER augment the test set

4. DATASET SPLITS:
   - 70% training, 15% validation, 15% test
   - Stratified split to maintain class balance (cancer vs. normal)
   - Save split indices to JSON for reproducibility

5. PYTORCH DATASET CLASS:
   - LiverCTDataset(Dataset) class
   - __getitem__ returns (image_tensor, label, patient_id, slice_info)
   - DataLoader with num_workers=4, pin_memory=True for GPU

Include complete error handling, progress bars (tqdm), and logging.
```

---

#### PROMPT B2 — Model Architecture & Training

```
You are a deep learning researcher specializing in medical imaging. Build a production-quality liver cancer detection model.

Create `model_training.py` with:

1. MODEL ARCHITECTURE - EfficientNetB4 Transfer Learning:
   - Base: timm.create_model('efficientnet_b4', pretrained=True)
   - Modify final classifier: 
     * Dropout(0.4)
     * Linear(1792, 512)
     * ReLU + BatchNorm
     * Dropout(0.3)
     * Linear(512, 2) → [Normal, Cancer]
   - Freeze first 60% of layers initially (fine-tune gradually)
   - Input: 512×512×5 (5-channel 2.5D input)
   - Output: probability scores + BCLC stage (0-4)

2. DUAL OUTPUT HEADS:
   - Head 1: Binary classification (Normal vs Cancer) — CrossEntropyLoss
   - Head 2: Cancer staging (Stage 0-4) — only active if Head 1 = Cancer — weighted CrossEntropyLoss
   - Combined loss: 0.7 * detection_loss + 0.3 * staging_loss

3. TRAINING CONFIG:
   - Optimizer: AdamW(lr=1e-4, weight_decay=1e-4)
   - Scheduler: CosineAnnealingWarmRestarts(T_0=10, T_mult=2)
   - Epochs: 50 with early stopping (patience=10, monitor val_AUC)
   - Batch size: 16 (Colab A100) or 8 (Colab T4)
   - Mixed precision: torch.cuda.amp.autocast()
   - Gradient clipping: clip_grad_norm_(model.parameters(), max_norm=1.0)

4. CLASS IMBALANCE HANDLING:
   - Compute class weights: weight = total_samples / (n_classes * class_count)
   - Use WeightedRandomSampler in DataLoader
   - Add Focal Loss option: FocalLoss(gamma=2, alpha=0.25)

5. METRICS TO TRACK (every epoch):
   - AUC-ROC (primary metric — target >0.95)
   - Sensitivity/Recall (target >0.92 — critical for cancer detection)
   - Specificity (target >0.88)
   - F1 Score, Precision, Accuracy
   - Confusion matrix visualization
   - Save best model checkpoint: save when val_AUC improves

6. TRAINING LOOP with:
   - TensorBoard logging
   - Checkpoint saving every 5 epochs
   - MLflow experiment tracking (optional)
   - Resume from checkpoint capability

Show complete, runnable Python code.
```

---

#### PROMPT B3 — Grad-CAM & SHAP Explainability

```
You are an AI explainability expert for medical imaging. Implement clinical-grade explainability for the liver cancer detection model.

Create `explainability.py` with:

1. GRAD-CAM IMPLEMENTATION:
   - Use pytorch-grad-cam library: pip install grad-cam
   - Target layer: model.features[-1] (last conv layer of EfficientNet)
   - Compute GradCAM, GradCAM++, and ScoreCAM
   - Apply to: cam = GradCAM(model=model, target_layers=[target_layer])
   - Generate heatmap: cam_image = show_cam_on_image(original_img, grayscale_cam, use_rgb=True)
   - Overlay heatmap on original CT slice with alpha=0.5
   - Save as PNG: red = high attention (cancer probability), blue = low attention

2. SHAP EXPLANATION:
   - Use shap.DeepExplainer(model, background_data)
   - background_data = random sample of 100 normal scans
   - Compute SHAP values for cancer class
   - Generate SHAP summary plot showing top 20 most influential regions
   - SHAP force plot for individual prediction explanation

3. EXPLAINABILITY REPORT FUNCTION:
   def generate_explanation(ct_scan_tensor, patient_id):
       Returns dict with:
       - gradcam_image: numpy array (512×512×3)
       - shap_values: numpy array
       - top_regions: list of suspicious regions with coordinates
       - confidence_score: float [0,1]
       - explanation_text: string (human-readable explanation for doctors)
   
4. CLINICAL EXPLANATION TEXT GENERATOR:
   - If cancer probability > 0.85: "High probability of HCC detected in [region]. 
     The model identified hypervascular enhancement in the [lobe] segment."
   - If 0.5-0.85: "Suspicious lesion requiring further imaging..."
   - If < 0.5: "No significant hepatic lesion detected. Routine follow-up recommended."

5. BOUNDING BOX EXTRACTION:
   - From Grad-CAM heatmap, extract bounding box of highest activation region
   - Convert pixel coordinates to anatomical region (right lobe S5/S6/S7/S8, left lobe S2/S3/S4)
   - Return as: {"segment": "S6", "coordinates": [x1,y1,x2,y2], "size_cm": 3.2}

Show complete Python code with visualization functions.
```

---

#### PROMPT B4 — Model Evaluation & Export

```
You are a clinical AI validation expert. Write complete model evaluation and export code.

Create `model_evaluation.py` that:

1. COMPREHENSIVE EVALUATION on held-out test set:
   - Plot ROC curve with AUC score and 95% confidence interval (DeLong method)
   - Plot Precision-Recall curve with Average Precision score
   - Generate confusion matrix (normalized and absolute)
   - Compute: Sensitivity, Specificity, PPV, NPV, F1, Accuracy, MCC
   - Bootstrap confidence intervals (n=1000 iterations) for all metrics
   - Compare against published benchmarks in a table

2. SUBGROUP ANALYSIS:
   - Performance by BCLC stage (0, A, B, C, D)
   - Performance by tumor size (<2cm, 2-5cm, >5cm)
   - Performance by liver cirrhosis status (present/absent)
   - Performance by patient demographics (age groups, sex)

3. CALIBRATION ANALYSIS:
   - Reliability diagram (calibration curve)
   - Expected Calibration Error (ECE)
   - Apply temperature scaling if poorly calibrated

4. MODEL EXPORT:
   - Export to TorchScript: torch.jit.script(model) → liver_cancer_model.pt
   - Export to ONNX: torch.onnx.export(...) → liver_cancer_model.onnx
   - Export to HuggingFace Hub format
   - Create model card (model_card.md) with: 
     * Architecture details
     * Training data description
     * Performance metrics
     * Intended use and limitations
     * Ethical considerations

5. VALIDATION REPORT:
   - Generate PDF report with all metrics and plots
   - Include sample Grad-CAM visualizations (5 true positives, 5 false negatives)
   - Ready for clinical validation review

Show complete code with matplotlib/seaborn visualizations.
```

---

### 🔧 PROMPT SET C: BACKEND (FastAPI)

---

#### PROMPT C1 — FastAPI Main Application & Database

```
You are a senior Python backend engineer. Build the complete FastAPI backend for a medical AI web application.

Create `backend/app/main.py` and all supporting files:

1. MAIN APP (main.py):
   - FastAPI app with CORS middleware (allow frontend origin)
   - Include routers: /api/auth, /api/predict, /api/patients, /api/reports
   - Startup event: load PyTorch model into memory once (not per request)
   - Health check endpoint: GET /health → {"status": "ok", "model_loaded": true}
   - Request ID middleware for tracing
   - Rate limiting: 10 predictions/minute per user (slowapi)

2. DATABASE SETUP (database/db.py):
   - SQLAlchemy async engine with PostgreSQL
   - Connection string from env: DATABASE_URL=postgresql+asyncpg://user:pass@host/db
   - Session dependency: async def get_db()
   - Create all tables on startup

3. DATABASE MODELS (database/models.py):
   - Patient: id, name, age, sex, patient_id (hospital), created_at
   - CTScan: id, patient_id (FK), s3_key, dicom_metadata (JSON), uploaded_at
   - Prediction: id, scan_id (FK), model_version, cancer_probability, 
                  stage_prediction, confidence, gradcam_s3_key, shap_s3_key,
                  processing_time_ms, created_at
   - User: id, email, hashed_password, role (doctor/admin), hospital_name

4. PYDANTIC SCHEMAS (database/schemas.py):
   - PatientCreate, PatientResponse
   - PredictionResponse: includes cancer_probability, stage, gradcam_url, 
                          shap_url, explanation_text, bounding_boxes
   - UserCreate, UserLogin, Token

5. AUTH SYSTEM (routers/auth.py):
   - POST /api/auth/register → create user
   - POST /api/auth/login → return JWT access token (expires 24h)
   - JWT verification dependency: async def get_current_user()
   - Password hashing with bcrypt

Show complete code for all files, fully working, no placeholders.
```

---

#### PROMPT C2 — CT Scan Processing & AI Prediction Endpoint

```
You are a medical AI backend engineer. Build the CT scan upload and AI prediction pipeline.

Create `backend/app/routers/predict.py` and supporting services:

1. UPLOAD ENDPOINT: POST /api/predict/upload
   - Accept: multipart/form-data with files[] (multiple .dcm files) + patient_id
   - Validate: check file extension .dcm, max 500MB total, max 500 slices
   - Upload to S3: boto3 upload to bucket liver-cancer-scans/{patient_id}/{timestamp}/
   - Save scan metadata to PostgreSQL
   - Return: {scan_id, s3_keys[], upload_status}

2. PREDICT ENDPOINT: POST /api/predict/analyze/{scan_id}
   Full async pipeline:
   
   Step 1 - DICOM Load:
   - Download scan from S3
   - Load DICOM series with pydicom
   - Extract HU values, apply liver window
   
   Step 2 - Preprocessing:
   - Run preprocessing pipeline (from model training code)
   - Select optimal center slices
   - Convert to tensor [1, 5, 512, 512]
   
   Step 3 - AI Inference:
   - model.eval() + torch.no_grad()
   - prediction = model(tensor.to(device))
   - Extract: cancer_prob, stage_probs
   - Measure inference time (milliseconds)
   
   Step 4 - Explainability:
   - Generate Grad-CAM heatmap
   - Generate SHAP values
   - Extract bounding boxes
   - Generate explanation text
   
   Step 5 - Save Results:
   - Upload gradcam_image.png to S3
   - Upload shap_plot.png to S3
   - Save Prediction record to PostgreSQL with all fields
   - Generate presigned URLs (valid 1 hour) for frontend display
   
   Return: Full PredictionResponse JSON

3. STATUS ENDPOINT: GET /api/predict/status/{scan_id}
   - Return current processing status (queued/processing/complete/failed)
   - Include progress percentage

4. RESULTS ENDPOINT: GET /api/predict/results/{prediction_id}
   - Return full prediction with fresh presigned S3 URLs

5. BACKGROUND TASK HANDLING:
   - Use FastAPI BackgroundTasks for async processing
   - Or Celery + Redis for production queue
   - Store processing status in Redis cache

Show complete code. Include error handling for every step with specific error messages.
```

---

#### PROMPT C3 — Report Generation & Patient Management

```
You are a medical software engineer. Build the patient management and PDF report generation system.

1. PATIENT ROUTER (routers/patients.py):
   - GET /api/patients - list all patients (paginated, 20/page)
   - POST /api/patients - create new patient
   - GET /api/patients/{id} - get patient with all scans and predictions
   - GET /api/patients/{id}/history - all predictions sorted by date
   - PATCH /api/patients/{id} - update patient info
   - Role-based: doctors see their patients, admin sees all

2. PDF REPORT GENERATOR (services/report_generator.py):
   Using ReportLab:
   
   Create generate_report(prediction_id) → bytes:
   
   Report structure:
   ┌─────────────────────────────────────┐
   │  HOSPITAL LETTERHEAD                │
   │  AI-Assisted Liver Cancer Analysis  │
   ├─────────────────────────────────────┤
   │  Patient Information                │
   │  Name | Age | Sex | Patient ID      │
   │  Date | Referring Doctor            │
   ├─────────────────────────────────────┤
   │  CT Scan Details                    │
   │  Scan Date | Slices | Equipment     │
   ├─────────────────────────────────────┤
   │  AI Detection Results               │
   │  ● Cancer Probability: 94.2%        │
   │  ● Staging: BCLC Stage A (Early)    │
   │  ● Location: Right Lobe, Segment 6  │
   │  ● Lesion Size: ~3.2 cm             │
   ├─────────────────────────────────────┤
   │  Grad-CAM Heatmap (image)           │
   │  [CT Scan with overlaid attention]  │
   ├─────────────────────────────────────┤
   │  SHAP Explanation (image)           │
   ├─────────────────────────────────────┤
   │  Clinical Explanation (text)        │
   ├─────────────────────────────────────┤
   │  ⚠️ DISCLAIMER: AI-assisted only.  │
   │  Clinical decision rests with doctor│
   └─────────────────────────────────────┘

3. REPORT ENDPOINT:
   - GET /api/reports/{prediction_id}/pdf → download PDF
   - GET /api/reports/{prediction_id}/preview → base64 encoded preview
   - POST /api/reports/{prediction_id}/email → send to doctor's email

Show complete ReportLab code with proper styling and layout.
```

---

### 🎨 PROMPT SET D: FRONTEND (React)

---

#### PROMPT D1 — React App Foundation & UI Design

```
You are a senior React/UI engineer building a medical AI web application. Create a beautiful, professional, accessible frontend.

Tech stack:
- React 18 + Vite
- Tailwind CSS for styling
- React Query for data fetching
- Axios for API calls
- React Router v6 for navigation
- Framer Motion for animations
- React Dropzone for file upload
- Recharts for data visualization

Design system:
- Primary color: #1B4F72 (deep medical blue)
- Accent: #2ECC71 (success/safe green) and #E74C3C (danger/cancer red)
- Font: Inter for UI, Merriweather for medical content
- Clean, clinical aesthetic — trustworthy, not playful
- Dark mode support

Create:

1. App.jsx — Main app with React Router:
   Routes:
   - / → Landing/Home page
   - /dashboard → Doctor dashboard with patient list
   - /upload → CT scan upload page
   - /results/:predictionId → Results viewer
   - /patients/:patientId → Patient history
   - /login, /register → Auth pages

2. Layout.jsx — Main layout with:
   - Sidebar navigation (collapsible on mobile)
   - Top header with user info and logout
   - Notification bell
   - Breadcrumb navigation

3. tailwind.config.js — Custom medical color palette and typography

4. axiosClient.js — Configured Axios instance:
   - Base URL from env variable VITE_API_URL
   - JWT token interceptor (auto-attach from localStorage)
   - 401 interceptor → redirect to login
   - Request/response logging in development
   - Retry logic (3 retries on network error)

Show complete code for all files.
```

---

#### PROMPT D2 — CT Scan Upload Component

```
You are a React expert. Build a professional, accessible CT scan upload component for a medical AI application.

Create `src/components/CTScanUploader.jsx`:

FEATURES:
1. DRAG & DROP ZONE:
   - Accept: .dcm files only (DICOM format)
   - Multiple file selection (for CT series — up to 500 slices)
   - Visual feedback: dashed border → solid highlight on drag
   - File count and total size display
   - Reject non-.dcm files with clear error message

2. PATIENT FORM (above upload zone):
   - Patient Name (required)
   - Patient ID (hospital number)
   - Age, Sex dropdown
   - Referring Doctor name
   - Clinical notes (optional textarea)
   - Form validation with React Hook Form + Zod

3. UPLOAD PROGRESS:
   - Per-file progress bars (Axios upload progress)
   - Overall progress indicator
   - Upload speed display
   - Cancel upload button
   - Animated upload icon (Framer Motion)

4. PRE-UPLOAD PREVIEW:
   - Show number of DICOM files selected
   - Display basic DICOM metadata if parseable (patient name from DICOM, study date)
   - Warning if less than 30 slices (may be incomplete scan)

5. SUBMIT BUTTON:
   - Disabled until form valid + files selected
   - Loading spinner during upload
   - Success → navigate to /results/:predictionId
   - Error → show specific error message with retry option

6. ACCESSIBILITY:
   - Keyboard navigable (Tab + Enter/Space to trigger)
   - ARIA labels on all interactive elements
   - Screen reader announcements for upload status

Use Tailwind CSS classes for styling. Show complete component code.
```

---

#### PROMPT D3 — Results Dashboard & Grad-CAM Viewer

```
You are a medical UI/UX expert. Build the AI prediction results display component.

Create `src/pages/Results.jsx` and `src/components/GradCAMViewer.jsx`:

1. RESULTS PAGE LAYOUT:
   Split into 3 panels:

   LEFT PANEL (30%): Patient & Scan Info
   - Patient name, age, sex, ID
   - Scan date, number of slices
   - Upload timestamp
   - Processing time

   CENTER PANEL (40%): CT Scan + Heatmap Viewer
   - Original CT scan display (grayscale DICOM-like)
   - Toggle: Original / Grad-CAM Overlay / SHAP Map
   - Slider to browse through CT slices (1-N)
   - Zoom and pan controls
   - Bounding box overlay showing detected lesion
   - Lesion coordinates and size display

   RIGHT PANEL (30%): AI Analysis Results
   - Large circular gauge: cancer probability percentage
     * Green < 40%, Orange 40-70%, Red > 70%
   - Stage indicator (BCLC staging with color coding)
   - Confidence score
   - Clinical explanation text (expandable)
   - Location: "Right hepatic lobe, Segment 6"
   - Estimated lesion size

2. GRAD-CAM VIEWER (GradCAMViewer.jsx):
   - Display Grad-CAM heatmap image from S3 URL
   - Opacity slider: 0% (CT only) → 100% (heatmap only), default 50%
   - Color legend: Cool (low risk) → Warm (high risk)
   - Click anywhere → show intensity value
   - Zoom: scroll to zoom, drag to pan
   - Full-screen mode button
   - Download heatmap image button

3. RISK GAUGE COMPONENT (RiskGauge.jsx):
   - SVG arc gauge (270° sweep)
   - Animated fill when results load (Framer Motion)
   - Central number shows percentage
   - Color transition: green → orange → red
   - "NORMAL" / "SUSPICIOUS" / "HIGH RISK" label

4. REPORT ACTIONS:
   - "Download PDF Report" button → calls /api/reports/{id}/pdf
   - "Share with Colleague" → copy shareable link
   - "Request Second Opinion" → form to notify another doctor
   - "Save to Patient Record" → saves to patient history

5. LOADING STATES:
   - Skeleton screens while results load
   - Real-time progress updates (polling /api/predict/status every 2s)
   - Animated "AI is analyzing..." indicator

Show complete React code with Tailwind styling.
```

---

#### PROMPT D4 — Dashboard & Patient Management

```
You are a React dashboard expert. Build the doctor's main dashboard for the liver cancer AI system.

Create `src/pages/Dashboard.jsx`:

1. STATISTICS ROW (top):
   4 metric cards using Recharts/custom:
   - Total Scans Analyzed (this month)
   - Positive Detections (with % change vs last month)
   - Average Processing Time (seconds)
   - Model Accuracy Rate (from validation set)

2. RECENT PREDICTIONS TABLE:
   Columns: Patient Name | Date | Cancer Probability | Stage | Status | Actions
   - Sortable columns
   - Color-coded probability (green/orange/red)
   - Status badges: Pending / Complete / Reviewed
   - Action: View Results | Download Report | Mark Reviewed
   - Pagination (20 rows/page)
   - Search by patient name or ID

3. DETECTION TREND CHART (Recharts LineChart):
   - X-axis: last 30 days
   - Y-axis: number of scans and detections
   - Two lines: total scans (blue) and positive detections (red)
   - Hover tooltip with exact numbers
   - Date range selector (7d / 30d / 90d / Custom)

4. STAGE DISTRIBUTION PIE CHART:
   - BCLC stages 0, A, B, C, D
   - Color coded: green (early) to red (terminal)
   - Click slice → filter table to that stage
   - Percentage labels on each slice

5. QUICK ACTIONS:
   - "New Scan Upload" → /upload
   - "Search Patient" → search modal
   - "Generate Monthly Report" → PDF download

Show complete code with Recharts integration and Tailwind styling.
```

---

#### PROMPT D5 — Authentication Pages

```
Build complete authentication pages for the liver cancer AI medical system.

Create:
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`  
- `src/context/AuthContext.jsx`

1. LOGIN PAGE:
   Clean medical professional design:
   - Logo + "AI Liver Cancer Detection" title
   - Email input with validation
   - Password input with show/hide toggle
   - "Remember me" checkbox
   - Login button with loading state
   - "Forgot password?" link
   - Error display: "Invalid credentials" / "Account not found"
   On success: store JWT in localStorage, redirect to /dashboard

2. REGISTER PAGE:
   - Full Name, Email, Password (with strength indicator)
   - Confirm Password
   - Hospital/Institution name
   - Medical License Number
   - Role: Doctor / Radiologist / Admin
   - Terms acceptance checkbox
   - Submit → POST /api/auth/register
   On success: auto-login → redirect to /dashboard

3. AUTH CONTEXT (AuthContext.jsx):
   - useContext with: user, login(), logout(), isLoading, isAuthenticated
   - Persist user in localStorage
   - Decode JWT for user info (email, role, hospital)
   - Protected Route wrapper component:
     <ProtectedRoute> → redirect to /login if not authenticated

4. FORM VALIDATION:
   Use React Hook Form + Zod:
   - Email: valid format required
   - Password: min 8 chars, 1 uppercase, 1 number
   - All fields required with specific messages

Show complete code.
```

---

### 🗄️ PROMPT SET E: DATABASE SETUP

---

#### PROMPT E1 — PostgreSQL Schema

```
You are a database architect. Design and implement the complete PostgreSQL schema for the AI liver cancer detection system.

Create `database/schema.sql`:

Tables needed:

1. users
   - id UUID PRIMARY KEY DEFAULT gen_random_uuid()
   - email VARCHAR(255) UNIQUE NOT NULL
   - hashed_password VARCHAR(255) NOT NULL
   - full_name VARCHAR(255) NOT NULL
   - hospital_name VARCHAR(255)
   - license_number VARCHAR(100)
   - role VARCHAR(50) DEFAULT 'doctor' CHECK (role IN ('doctor','radiologist','admin'))
   - is_active BOOLEAN DEFAULT true
   - created_at TIMESTAMP DEFAULT NOW()
   - updated_at TIMESTAMP DEFAULT NOW()

2. patients
   - id UUID PRIMARY KEY DEFAULT gen_random_uuid()
   - patient_hospital_id VARCHAR(100) UNIQUE NOT NULL
   - full_name VARCHAR(255) NOT NULL
   - date_of_birth DATE
   - sex VARCHAR(10) CHECK (sex IN ('male','female','other'))
   - clinical_notes TEXT
   - created_by UUID REFERENCES users(id)
   - created_at TIMESTAMP DEFAULT NOW()

3. ct_scans
   - id UUID PRIMARY KEY DEFAULT gen_random_uuid()
   - patient_id UUID REFERENCES patients(id) ON DELETE CASCADE
   - uploaded_by UUID REFERENCES users(id)
   - s3_bucket VARCHAR(255) NOT NULL
   - s3_key_prefix VARCHAR(500) NOT NULL
   - num_slices INTEGER
   - slice_thickness_mm FLOAT
   - scan_date DATE
   - equipment_manufacturer VARCHAR(255)
   - dicom_metadata JSONB
   - file_size_bytes BIGINT
   - upload_status VARCHAR(50) DEFAULT 'pending'
   - created_at TIMESTAMP DEFAULT NOW()

4. predictions
   - id UUID PRIMARY KEY DEFAULT gen_random_uuid()
   - scan_id UUID REFERENCES ct_scans(id) ON DELETE CASCADE
   - model_version VARCHAR(50) NOT NULL
   - cancer_probability FLOAT CHECK (cancer_probability BETWEEN 0 AND 1)
   - cancer_detected BOOLEAN GENERATED ALWAYS AS (cancer_probability > 0.5) STORED
   - stage_prediction VARCHAR(20) CHECK (stage_prediction IN ('none','0','A','B','C','D'))
   - stage_confidence FLOAT
   - lesion_location JSONB
   - lesion_size_cm FLOAT
   - gradcam_s3_key VARCHAR(500)
   - shap_s3_key VARCHAR(500)
   - explanation_text TEXT
   - processing_time_ms INTEGER
   - reviewed_by UUID REFERENCES users(id)
   - reviewed_at TIMESTAMP
   - doctor_notes TEXT
   - created_at TIMESTAMP DEFAULT NOW()

5. audit_log
   - id BIGSERIAL PRIMARY KEY
   - user_id UUID REFERENCES users(id)
   - action VARCHAR(100) NOT NULL
   - resource_type VARCHAR(100)
   - resource_id UUID
   - ip_address INET
   - created_at TIMESTAMP DEFAULT NOW()

Add all necessary:
- Indexes (on foreign keys, email, patient_hospital_id, created_at)
- Triggers (auto-update updated_at columns)
- Row Level Security (RLS) policies (doctors see only their patients)
- Seed data for testing (2 test users, 5 test patients)

Show complete SQL.
```

---

#### PROMPT E2 — Database Connection & ORM Setup

```
Build the complete database layer for the FastAPI backend.

Create `backend/app/database/`:

1. db.py — SQLAlchemy Async:
   - Async engine with asyncpg driver
   - Session factory with async context manager
   - get_db() dependency for FastAPI
   - Connection pool: min=5, max=20, timeout=30s
   - Retry on connection failure (3 retries, exponential backoff)

2. models.py — SQLAlchemy ORM models:
   - Match the PostgreSQL schema exactly
   - Use relationship() for foreign keys with lazy="selectin"
   - Add __repr__ methods for debugging

3. crud.py — Database operations:
   For each model, create:
   
   async def create_patient(db, patient_data) → Patient
   async def get_patient(db, patient_id) → Patient | None
   async def get_patients_by_doctor(db, doctor_id, skip=0, limit=20) → list[Patient]
   async def create_scan(db, scan_data) → CTScan
   async def create_prediction(db, pred_data) → Prediction
   async def get_prediction_with_patient(db, pred_id) → dict
   async def get_doctor_stats(db, doctor_id) → dict (dashboard stats)
   
   All with proper error handling and logging.

4. migrations/ using Alembic:
   - alembic init migrations
   - env.py configured for async SQLAlchemy
   - Initial migration: 001_create_all_tables.py
   - Command to run: alembic upgrade head

Show complete code for all files.
```

---

### 🔗 PROMPT SET F: INTEGRATION (Connect Frontend + Backend + Database)

---

#### PROMPT F1 — Frontend ↔ Backend Connection

```
Build the complete API integration layer connecting the React frontend to the FastAPI backend.

1. ENVIRONMENT CONFIGURATION:
   Frontend .env (local development):
   VITE_API_URL=http://localhost:8000
   VITE_ENV=development
   
   Frontend .env.production:
   VITE_API_URL=https://api.livercan-ai.com
   VITE_ENV=production

2. AXIOS CLIENT (src/api/axiosClient.js):
   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL,
     timeout: 120000, // 2 min for AI processing
     headers: {'Content-Type': 'application/json'}
   })
   
   // Auth interceptor — auto-attach JWT
   api.interceptors.request.use(config => {
     const token = localStorage.getItem('access_token')
     if (token) config.headers.Authorization = `Bearer ${token}`
     return config
   })
   
   // 401 interceptor — auto-logout
   api.interceptors.response.use(null, error => {
     if (error.response?.status === 401) {
       localStorage.removeItem('access_token')
       window.location.href = '/login'
     }
     return Promise.reject(error)
   })

3. API SERVICE FUNCTIONS (src/api/services.js):
   
   // Auth
   export const login = (email, password) => api.post('/api/auth/login', {email, password})
   export const register = (data) => api.post('/api/auth/register', data)
   
   // CT Scan Upload (with progress callback)
   export const uploadScan = (files, patientData, onProgress) => {
     const formData = new FormData()
     files.forEach(f => formData.append('files', f))
     formData.append('patient_data', JSON.stringify(patientData))
     return api.post('/api/predict/upload', formData, {
       headers: {'Content-Type': 'multipart/form-data'},
       onUploadProgress: e => onProgress(Math.round(e.loaded/e.total*100))
     })
   }
   
   // AI Analysis (polling)
   export const analyzeScan = (scanId) => api.post(`/api/predict/analyze/${scanId}`)
   export const getPredictionStatus = (scanId) => api.get(`/api/predict/status/${scanId}`)
   export const getResults = (predId) => api.get(`/api/predict/results/${predId}`)
   
   // Patients & Reports
   export const getPatients = (page=1) => api.get(`/api/patients?page=${page}`)
   export const downloadReport = (predId) => api.get(`/api/reports/${predId}/pdf`, {responseType: 'blob'})
   export const getDashboardStats = () => api.get('/api/patients/stats')

4. REACT QUERY HOOKS (src/api/hooks.js):
   
   export const usePredictionPolling = (scanId) => {
     return useQuery({
       queryKey: ['prediction-status', scanId],
       queryFn: () => getPredictionStatus(scanId),
       refetchInterval: (data) => data?.status === 'complete' ? false : 2000,
       enabled: !!scanId
     })
   }
   
   export const usePatients = (page) => useQuery({...})
   export const useDashboardStats = () => useQuery({...})

5. CORS CONFIGURATION (backend/app/main.py):
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(CORSMiddleware,
     allow_origins=["http://localhost:5173", "https://livercan-ai.vercel.app"],
     allow_credentials=True,
     allow_methods=["*"],
     allow_headers=["*"],
   )

Show complete working code for all files.
```

---

#### PROMPT F2 — Backend ↔ Database Connection

```
Build the complete database integration for the FastAPI backend.

1. DATABASE URL CONFIGURATION:
   .env file:
   DATABASE_URL=postgresql+asyncpg://liver_user:securepass@localhost:5432/liver_cancer_db
   
   For AWS RDS:
   DATABASE_URL=postgresql+asyncpg://liver_user:securepass@liver-db.cluster.us-east-1.rds.amazonaws.com:5432/liver_cancer_db

2. SQLALCHEMY ASYNC ENGINE:
   from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
   from sqlalchemy.orm import sessionmaker
   
   engine = create_async_engine(
     DATABASE_URL,
     pool_size=10,
     max_overflow=20,
     pool_timeout=30,
     pool_pre_ping=True,  # verify connection before use
     echo=False  # True for SQL logging in development
   )

3. ALEMBIC MIGRATION WORKFLOW:
   # Initialize (once):
   alembic init migrations
   
   # Create migration:
   alembic revision --autogenerate -m "create_all_tables"
   
   # Apply migration:
   alembic upgrade head
   
   # Rollback if needed:
   alembic downgrade -1

4. STARTUP DATABASE CHECK (in main.py):
   @app.on_event("startup")
   async def startup():
     # Test DB connection
     async with engine.connect() as conn:
       await conn.execute(text("SELECT 1"))
     print("✅ Database connected")
     # Load AI model
     load_model()
     print("✅ AI Model loaded")

5. AWS RDS SETUP (Free Tier):
   - Engine: PostgreSQL 15.4
   - Instance: db.t3.micro (Free Tier)
   - Storage: 20 GB SSD
   - Enable: Automated backups (7 days)
   - Security Group: Allow port 5432 from EC2 only (not public)
   - SSL: enabled (sslmode=require in connection string)

Show complete database setup code and AWS configuration steps.
```

---

### 🚀 PROMPT SET G: DEPLOYMENT

---

#### PROMPT G1 — Frontend Deployment (Vercel)

```
Deploy the React frontend to Vercel with production configuration.

Step-by-step instructions:

1. VERCEL CONFIGURATION (vercel.json in frontend root):
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{"source": "/(.*)", "destination": "/index.html"}],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {"key": "X-Content-Type-Options", "value": "nosniff"},
        {"key": "X-Frame-Options", "value": "DENY"},
        {"key": "Strict-Transport-Security", "value": "max-age=63072000"}
      ]
    }
  ]
}

2. ENVIRONMENT VARIABLES IN VERCEL:
   Dashboard → Settings → Environment Variables:
   VITE_API_URL = https://api.your-domain.com
   VITE_ENV = production

3. DEPLOYMENT COMMANDS:
   npm install -g vercel
   cd frontend
   vercel login
   vercel --prod
   
   Or connect GitHub repo → auto-deploy on every push to main

4. CUSTOM DOMAIN:
   - In Vercel dashboard → Domains → Add your-domain.com
   - Update DNS: CNAME record pointing to cname.vercel-dns.com

5. VITE BUILD OPTIMIZATION:
   In vite.config.js:
   - Code splitting: manualChunks for vendor libraries
   - Image optimization: use vite-imagetools
   - Bundle analyzer: rollup-plugin-visualizer
   - Target: es2020 for modern browsers

Show all config files and deployment commands.
```

---

#### PROMPT G2 — Backend Deployment (AWS EC2 Free Tier)

```
Deploy the FastAPI backend to AWS EC2 Free Tier with production setup.

Complete step-by-step:

1. AWS EC2 SETUP:
   - Instance: t2.micro (1 vCPU, 1GB RAM) — Free Tier
   - OS: Ubuntu 22.04 LTS
   - Security Group rules:
     * Port 22 (SSH) — your IP only
     * Port 80 (HTTP) — 0.0.0.0/0
     * Port 443 (HTTPS) — 0.0.0.0/0
     * Port 8000 — 0.0.0.0/0 (or nginx proxy)
   - Elastic IP: assign static IP
   - Key pair: download .pem file securely

2. SERVER SETUP COMMANDS:
   ssh -i key.pem ubuntu@your-ec2-ip
   
   # System updates
   sudo apt update && sudo apt upgrade -y
   sudo apt install python3.11 python3-pip nginx certbot python3-certbot-nginx -y
   
   # Clone and setup
   git clone https://github.com/your-username/liver-cancer-ai.git
   cd liver-cancer-ai/backend
   pip3 install -r requirements.txt
   
   # Environment file
   nano .env  # Add all environment variables
   
   # Test run
   uvicorn app.main:app --host 0.0.0.0 --port 8000

3. SYSTEMD SERVICE (auto-restart on crash):
   sudo nano /etc/systemd/system/livercanai.service
   
   [Unit]
   Description=Liver Cancer AI Backend
   After=network.target
   
   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/liver-cancer-ai/backend
   ExecStart=/usr/bin/python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
   Restart=always
   RestartSec=10
   
   [Install]
   WantedBy=multi-user.target
   
   sudo systemctl enable livercanai
   sudo systemctl start livercanai

4. NGINX REVERSE PROXY + SSL:
   sudo nano /etc/nginx/sites-available/livercanai
   
   server {
     listen 80;
     server_name api.your-domain.com;
     location / {
       proxy_pass http://localhost:8000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       client_max_body_size 500M;
       proxy_read_timeout 120s;
     }
   }
   
   sudo ln -s /etc/nginx/sites-available/livercanai /etc/nginx/sites-enabled/
   sudo certbot --nginx -d api.your-domain.com  # Free SSL!
   sudo systemctl restart nginx

5. MODEL DEPLOYMENT:
   - Upload trained model .pt file to server
   - Or download from HuggingFace Hub on startup
   - For larger EC2 (t3.medium) if t2.micro RAM insufficient for model

6. AWS S3 BUCKET SETUP:
   aws s3 mb s3://liver-cancer-scans
   aws s3 mb s3://liver-cancer-results
   # Block all public access (use presigned URLs only)
   # Configure lifecycle: delete raw DICOMs after 90 days (cost saving)

Show all commands and configuration files.
```

---

#### PROMPT G3 — Docker & Local Development

```
Create Docker configuration for local development that mirrors production.

Create docker-compose.yml in project root:

services:
  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    environment:
      - VITE_API_URL=http://localhost:8000
    volumes:
      - ./frontend/src:/app/src  # hot reload
    depends_on: [backend]

  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql+asyncpg://liver_user:liver_pass@db:5432/liver_cancer_db
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend:/app  # hot reload with uvicorn --reload
      - ./models:/app/models  # model files
    depends_on: [db, redis]

  db:
    image: postgres:15
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: liver_cancer_db
      POSTGRES_USER: liver_user
      POSTGRES_PASSWORD: liver_pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

volumes:
  postgres_data:

Create Dockerfiles for frontend and backend, plus .dockerignore files.
Commands:
  docker-compose up -d  # start all services
  docker-compose logs -f backend  # view logs
  docker-compose down -v  # stop and remove volumes

Show all Docker files complete.
```

---

## 📅 PART 4: 9-Week Implementation Timeline

| Week | Focus | Budget Used | Deliverable |
|------|-------|-------------|-------------|
| **Wk 1** | Setup environment, Google Colab, GitHub, Docker | $50 (Colab + Copilot) | Dev environment ready |
| **Wk 2** | Data collection, DICOM preprocessing | $50 (datasets) | Preprocessed dataset |
| **Wk 3** | Data augmentation, dataset splits | $40 (3D Slicer) | Training pipeline |
| **Wk 4** | Model training (EfficientNetB4) | $0 | Trained model v1 |
| **Wk 5** | Grad-CAM + SHAP implementation | $20 (SHAP compute) | Explainability working |
| **Wk 6** | Backend FastAPI development | $30 (AWS hosting) | API endpoints working |
| **Wk 7** | Frontend React development | $30 (Streamlit fallback) | UI prototype |
| **Wk 8** | Integration + clinical consultation | $80 (doctor consult) + $30 (QA) | End-to-end working |
| **Wk 9** | Deployment + reports + pitch video | $40 (Canva + video) | Live demo + report |
| **Reserve** | Contingency + model fine-tuning | $100 | Performance buffer |
| **Total** | | **$500** | Full working system |

---

## 🎯 PART 5: Target Accuracy Milestones

| Metric | Existing Best | Your Target | How to Achieve |
|--------|-------------|-------------|----------------|
| AUC-ROC | 0.912 (Alibaba) | **>0.93** | EfficientNetB4 + augmentation |
| Sensitivity | 0.88 | **>0.92** | Focal loss + class weighting |
| Specificity | 0.90 | **>0.90** | Temperature calibration |
| Stage Accuracy | 78% | **>82%** | Dual-head model |
| Processing Speed | 45s | **<30s** | ONNX optimization |

---

## ⚙️ PART 6: Quick Commands Reference

```bash
# Start local development
docker-compose up -d

# Train model (in Colab)
# Open ai_model/02_model_training.ipynb → Run All

# Run database migrations
cd backend && alembic upgrade head

# Deploy frontend
cd frontend && vercel --prod

# Deploy backend (on EC2)
git pull && sudo systemctl restart livercanai

# Check backend health
curl https://api.your-domain.com/health

# View backend logs
sudo journalctl -u livercanai -f
```

---

## ⚠️ Medical & Legal Disclaimer

This AI system is intended as a **clinical decision support tool** only. It does not replace physician judgment. All predictions must be reviewed and confirmed by a qualified medical professional. The system should not be used as the sole basis for diagnosis, staging, or treatment decisions.

---

*Built with ❤️ for Aspire Seed Fund | Helping doctors detect liver cancer earlier, saving lives.*
