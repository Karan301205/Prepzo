# Prepzo.ai

> "We are not another AI study tool — we are a **5-model ML decision engine** that tells students exactly what to study when time is limited."

Prepzo is a **Deadline-Aware Exam Preparation Engine** powered by 5 machine learning models and a large language model. It figures out how much time a student has, uses ML to prioritize what matters most, auto-discovers topics from uploaded PDFs, generates a scientifically-scheduled study plan, and produces high-probability exam questions — all personalized to the student's exact context.

---

## Features & USP

1. **Deadline Mode Detection:**
   - **≤ 3 days** → 🔥 Survival Mode (top 30% topics only)
   - **4–7 days** → ⚡ Balanced Mode (top 60% topics)
   - **> 7 days** → 📚 Full Mode (all topics with deep coverage)
2. **Priority System:**
   - 🔴 Must Do
   - 🟡 Should Do
   - ⚪ Optional
3. **5-Model ML Engine (the core USP):**
   - **ML Model 1 — TF-IDF + Cosine Similarity** → Data-driven topic importance scoring from PDFs
   - **ML Model 2 — Naive Bayes Classifier** → Predicts question type (MCQ / Coding / Theory) per topic
   - **ML Model 3 — K-Means Clustering** → Auto-discovers topic groups from uploaded syllabus
   - **ML Model 4 — SM-2 Spaced Repetition** → Generates day-by-day study schedule based on memory science
   - **ML Model 5 — Cosine Similarity Matrix** → Detects repeating question patterns from past papers
4. **AI Question Generation:**
   - **Groq API (LLaMA-3 70B)** — Generates high-probability exam questions with detailed solutions, obeying ML predictions
5. **AI Chatbot** — Ask doubts, get explanations, request more questions
6. **Analytics Dashboard** — Platform usage tracking and insights

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI (Python) |
| AI / LLM | Groq API — LLaMA-3.3 70B (`llama-3.3-70b-versatile`) |
| ML Models | scikit-learn — TF-IDF, Naive Bayes, K-Means, Cosine Similarity |
| Scheduling | SM-2 Spaced Repetition Algorithm |
| PDF Parsing | pdfplumber |
| Storage | In-memory (MVP) |
| Frontend | React.js (Vite) + Framer Motion |
| Styling | Vanilla CSS with custom design system |

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/generate-plan` | Generate a personalized exam prep plan with study schedule |
| `POST` | `/api/upload-pdf` | Upload PDF → runs clustering + pattern analysis |
| `POST` | `/api/chat` | AI chatbot for doubts and explanations |
| `POST` | `/api/send-otp` | Send OTP for phone authentication |
| `POST` | `/api/verify-otp` | Verify OTP |
| `GET` | `/api/analytics` | Get platform usage analytics |
| `POST` | `/api/analytics/track` | Track an event |

---

## ML Models — Deep Dive

### ML Model 1: TF-IDF Vectorizer + Cosine Similarity
- **Library:** `scikit-learn` (`TfidfVectorizer`)
- **Purpose:** Analyzes uploaded past papers/syllabus PDFs and scores each topic based on frequency and contextual relevance
- **Output:** Normalized topic weight (0.0–1.0)
- **Integration:** Blended 50/50 with rule-based Pareto weights to compute final importance

### ML Model 2: Naive Bayes Classifier (MultinomialNB)
- **Library:** `scikit-learn` (`MultinomialNB` + `Pipeline`)
- **Purpose:** Predicts whether a topic will likely appear as MCQ, Coding, or Theory
- **Training Data:** 22 keyword-pattern samples across 3 categories
- **Output:** Predicted type + confidence scores per category
- **Integration:** Predictions are injected into the Groq prompt as strict constraints, forcing the LLM to generate questions of the predicted type

### ML Model 3: K-Means Topic Clustering
- **Library:** `scikit-learn` (`KMeans` + `TfidfVectorizer`)
- **Purpose:** Auto-discovers topic groups from uploaded PDF text without manual input
- **How it works:**
  1. Splits PDF text into segments
  2. Vectorizes segments using TF-IDF (unigrams + bigrams)
  3. Finds optimal k using the elbow method
  4. Runs K-Means clustering
  5. Extracts cluster labels from top keywords
- **Output:** List of topic clusters with labels, keywords, segment counts, and confidence scores
- **Integration:** Shown on InputPage after PDF upload; students can one-click add discovered topics

### ML Model 4: SM-2 Spaced Repetition Scheduler
- **Algorithm:** SuperMemo-2 (SM-2)
- **Purpose:** Generates a scientifically-optimized day-by-day study timetable
- **How it works:**
  1. Assigns ease factors based on topic importance (high importance = lower ease = more frequent review)
  2. Schedules topics in 3 phases: **Learn** (new material), **Review** (SM-2 intervals), **Practice** (exam simulation)
  3. Adapts to mode: Survival (8h/day, cram all topics), Balanced (5h/day), Full (4h/day, deep spacing)
  4. Last day automatically switches everything to practice mode
- **Output:** Array of day objects with topics, actions, durations, and daily tips
- **Integration:** Rendered as an interactive collapsible schedule on the ResultPage

### ML Model 5: Question Pattern Analyzer (Cosine Similarity Matrix)
- **Library:** `scikit-learn` (`TfidfVectorizer` + `cosine_similarity`)
- **Purpose:** Detects repeating question patterns from uploaded past papers
- **How it works:**
  1. Extracts individual questions from PDF text using regex patterns
  2. Builds TF-IDF matrix for all extracted questions
  3. Computes pairwise cosine similarity matrix
  4. Groups questions with similarity > 0.3 threshold
  5. Classifies each pattern into categories (Implementation, Comparison, Explanation, etc.)
- **Output:** Repeating patterns with frequency counts, exam probability, category breakdown, and topic correlations
- **Integration:** Shown on InputPage after PDF upload so students see examiner patterns before generating a plan

### Priority Scoring Formula
```
score = (ml_topic_weight × 0.6) + (ai_probability × 0.4)

score >= 0.7 → 🔴 Must Do
score >= 0.4 → 🟡 Should Do
score < 0.4  → ⚪ Optional
```

---

## Project Structure

```
prepzo/
├── README.md
├── backend/
│   ├── main.py                          # FastAPI app entry point + CORS
│   ├── requirements.txt                 # Python dependencies
│   ├── .env.example                     # Environment variables template
│   └── app/
│       ├── models/
│       │   └── schemas.py               # Pydantic models + Enums (all 5 ML outputs)
│       ├── routes/
│       │   ├── plan.py                  # POST /generate-plan (orchestrates all ML models)
│       │   ├── upload.py                # POST /upload-pdf (clustering + pattern analysis)
│       │   ├── chat.py                  # POST /chat (context-aware AI chatbot)
│       │   ├── auth.py                  # POST /send-otp, /verify-otp
│       │   └── analytics.py             # GET /analytics, POST /analytics/track
│       ├── services/
│       │   ├── ml_service.py            # ML Model 1 (TF-IDF) + ML Model 2 (Naive Bayes)
│       │   ├── clustering_service.py    # ML Model 3 (K-Means topic clustering)
│       │   ├── spaced_repetition_service.py  # ML Model 4 (SM-2 scheduler)
│       │   ├── pattern_analyzer_service.py   # ML Model 5 (cosine similarity patterns)
│       │   ├── groq_service.py          # LLaMA-3 question generation + chatbot
│       │   └── deadline_service.py      # Mode selection + Pareto + priority scoring
│       └── utils/
│           ├── pdf_parser.py            # PDF text extraction + heuristic topic detection
│           └── store.py                 # In-memory analytics tracking
└── frontend/
    ├── vite.config.js                   # Vite config with /api proxy
    └── src/
        ├── App.jsx                      # Router + page transitions
        ├── index.css                    # Design system + animations
        ├── services/
        │   └── api.js                   # Axios API client
        ├── pages/
        │   ├── InputPage.jsx            # Student input form + ML panels
        │   ├── ResultPage.jsx           # Plan display + schedule + questions
        │   ├── ChatPage.jsx             # AI chatbot interface
        │   └── AnalyticsPage.jsx        # Usage analytics dashboard
        ├── components/
        │   ├── Navbar.jsx               # Navigation bar
        │   ├── ModeBanner.jsx           # Survival/Balanced/Full banner
        │   ├── FilterBar.jsx            # Question type/difficulty/priority filters
        │   ├── QuestionCard.jsx         # Individual question with solution toggle
        │   ├── TopicChip.jsx            # Removable topic tag
        │   ├── TopicInsightsPanel.jsx   # ML Model 2: Naive Bayes predictions
        │   ├── ClusteringPanel.jsx      # ML Model 3: K-Means topic groups
        │   ├── StudySchedulePanel.jsx   # ML Model 4: SM-2 daily schedule
        │   └── PatternAnalysisPanel.jsx # ML Model 5: Repeating question patterns
        └── three/
            └── FloatingOrbs.jsx         # Background 3D animation
```

---

## How to Run

### Backend

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate          # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# 5. Start the server
uvicorn main:app --reload

# Server runs at http://127.0.0.1:8000
# Swagger docs at http://127.0.0.1:8000/docs
```

### Frontend

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# Frontend runs at http://localhost:5173
```

---

## System Flow

```
Student Input (Subject, Date, Topics)
        │
        ├── Upload PDF ──► pdfplumber extracts text
        │       │
        │       ├── ML Model 3: K-Means ──► Auto-discovered topic clusters
        │       └── ML Model 5: Cosine Similarity ──► Repeating question patterns
        │
        ▼
   Deadline Engine ──► Mode: Survival / Balanced / Full
        │
        ▼
   ML Layer (scikit-learn)
   ├── ML Model 1: TF-IDF ──► Topic Importance Weights
   └── ML Model 2: Naive Bayes ──► Question Type Predictions (MCQ/Coding/Theory)
        │
        ▼
   Groq LLM (LLaMA-3 70B)
   ├── Receives ML weights + type predictions as strict constraints
   └── Generates questions + solutions obeying ML decisions
        │
        ▼
   Priority Scoring ──► Must / Should / Optional
        │
        ▼
   ML Model 4: SM-2 ──► Day-by-day spaced repetition schedule
        │
        ▼
   Structured JSON Response ──► Frontend Rendering
```

---

## Team Execution Plan & Roles

### 1. Yash: Backend Lead + ML Engine + AI Integration
- **Core APIs:** `/send-otp`, `/verify-otp`, `/upload-pdf`, `/generate-plan`, `/chat`
- **ML Models:** TF-IDF, Naive Bayes, K-Means, SM-2, Pattern Analyzer
- **Logic:** Deadline Mode, ML integration, LLM call with retry, In-memory storage

### 2. Rudransh: Frontend — React UI
- **UI Elements:** Auth page, Input page (chips, PDF upload, clustering panel), Result page (Mode banner, schedule, filters), Chatbot UI

### 3. Mridul: AI & Prompt Engineering
- **Prompt Logic:** Strict JSON schema, Mode-aware instructions, ML-constrained type enforcement, Post-processing rules

### 4. Anuj: Data & Priority Logic
- **Logic:** Extract topics, Priority mapping, Weight formula, Pattern analysis integration

### 5. Karan: Chatbot + Testing + Analytics + PPT
- **Flow:** Chatbot intents, Full flow testing, Analytics tracking, Demo PPT

---

## 3-Day Execution Timeline

| | Yash | Rudransh | Mridul | Anuj | Karan |
|---|---|---|---|---|---|
| **Day 1** | Auth APIs + deadline logic + ML models 1-2 | All pages (static UI) | Prompt v1 in Playground | Topic priority map | PPT skeleton + test cases |
| **Day 2** | AI integration + ML models 3-5 + `/generate-plan` | Hit APIs, result page + schedule panel live | Prompt finalised + ML type enforcement | Weights JSON + pattern data | Chatbot flow + analytics |
| **Day 3** | Bug fixes + deploy | Polish + clustering/pattern panels + chatbot UI | Output QA | Pareto data ready | 25 users + full test + demo |

---

## Commit History

| Commit | Files | What it unlocks |
|---|---|---|
| 1 | `main.py`, `requirements.txt`, all `__init__.py` | Server boots |
| 2 | `schemas.py`, `plan.py` | `/generate-plan` returns dummy |
| 3 | `deadline_service.py`, `plan.py` | Real mode + Pareto + strategy |
| 4 | `groq_service.py`, `plan.py` | Real AI questions |
| 5 | `pdf_parser.py`, `upload.py` | PDF → topics pipeline |
| 6 | `chat.py` | Chatbot live |
| 7 | `store.py`, `analytics.py` | Usage tracking |
| 8 | `auth.py`, `main.py` | OTP auth flow |
| 9 | `ml_service.py`, `plan.py` | TF-IDF + Naive Bayes ML layer |
| 10 | `groq_service.py`, `FilterBar.jsx`, `QuestionCard.jsx` | CORS fix + filter parity + ML type enforcement |
| 11 | 3 new services, 3 new components, schemas | K-Means clustering + SM-2 scheduler + pattern analyzer |
