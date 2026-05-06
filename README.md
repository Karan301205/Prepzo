# Prepzo.ai

> "We are not another AI study tool — we are a decision engine that tells students exactly what to study when time is limited."

Prepzo is a **Deadline-Aware Exam Preparation Engine**. It figures out how much time a student has, uses ML to prioritize what matters most, and generates a personalized preparation plan with high-probability questions.

---

## Features & USP

1. **Deadline Mode:**
   - **≤ 3 days** → 🔥 Survival Mode (top 30% topics only)
   - **4–7 days** → ⚡ Balanced Mode (top 60% topics)
   - **> 7 days** → 📚 Full Mode (all topics)
2. **Priority System:**
   - 🔴 Must Do
   - 🟡 Should Do
   - ⚪ Optional
3. **ML-Powered Intelligence:**
   - **TF-IDF (scikit-learn)** — Analyzes uploaded PDFs to compute data-driven topic importance
   - **Naive Bayes Classifier** — Predicts question type (MCQ / Coding / Theory) per topic
   - **Pareto Engine** — Focuses on the top 30% topics that carry 70% of the marks
4. **AI Question Generation:**
   - **Groq API (LLaMA-3 70B)** — Generates high-probability exam questions with solutions
5. **AI Chatbot** — Ask doubts, get explanations, request more questions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI (Python) |
| AI / LLM | Groq API — LLaMA-3 70B (`llama3-70b-8192`) |
| ML Models | scikit-learn — TF-IDF + Naive Bayes (MultinomialNB) |
| PDF Parsing | pdfplumber |
| Storage | In-memory (MVP) |
| Frontend | React.js (Vite) |

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/generate-plan` | Generate a personalized exam prep plan |
| `POST` | `/api/upload-pdf` | Upload syllabus/past papers for text extraction |
| `POST` | `/api/chat` | AI chatbot for doubts and explanations |
| `POST` | `/api/send-otp` | Send OTP for phone authentication |
| `POST` | `/api/verify-otp` | Verify OTP |
| `GET` | `/api/analytics` | Get platform usage analytics |
| `POST` | `/api/analytics/track` | Track an event |

---

## ML Models Used

### 1. TF-IDF Vectorizer + Cosine Similarity
- **Library:** `scikit-learn` (`TfidfVectorizer`)
- **Purpose:** Analyzes uploaded past papers/syllabus PDFs and scores each topic based on how frequently it appears
- **Output:** Normalized topic weight (0.0–1.0)
- **Integration:** Blended 50/50 with rule-based Pareto weights

### 2. Naive Bayes Classifier (MultinomialNB)
- **Library:** `scikit-learn` (`MultinomialNB` + `Pipeline`)
- **Purpose:** Predicts whether a topic will likely appear as MCQ, Coding, or Theory
- **Training Data:** 22 keyword-pattern samples across 3 categories
- **Output:** Predicted type + confidence scores per category
- **Integration:** Returned as `topicInsights` in the `/generate-plan` response

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
└── backend/
    ├── main.py                          # FastAPI app entry point
    ├── requirements.txt                 # Python dependencies
    ├── .env.example                     # Environment variables template
    ├── .gitignore
    └── app/
        ├── __init__.py
        ├── models/
        │   ├── __init__.py
        │   └── schemas.py               # Pydantic models + Enums
        ├── routes/
        │   ├── __init__.py
        │   ├── plan.py                  # POST /generate-plan
        │   ├── upload.py                # POST /upload-pdf
        │   ├── chat.py                  # POST /chat
        │   ├── auth.py                  # POST /send-otp, /verify-otp
        │   └── analytics.py             # GET /analytics
        ├── services/
        │   ├── __init__.py
        │   ├── deadline_service.py      # Mode selection + Pareto + priority scoring
        │   ├── groq_service.py          # LLaMA-3 question generation + chatbot
        │   └── ml_service.py            # TF-IDF weights + Naive Bayes predictor
        └── utils/
            ├── __init__.py
            ├── pdf_parser.py            # PDF text extraction + topic detection
            └── store.py                 # In-memory analytics tracking
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
Student Input (Subject, Date, Topics, PDF)
        │
        ▼
   Deadline Engine ──► Mode: Survival / Balanced / Full
        │
        ▼
   ML Layer (scikit-learn)
   ├── TF-IDF ──► Topic Importance Weights
   └── Naive Bayes ──► Question Type Predictions
        │
        ▼
   Groq LLM (LLaMA-3 70B) ──► Generated Questions + Solutions
        │
        ▼
   Priority Scoring ──► Must / Should / Optional
        │
        ▼
   Structured JSON Response ──► Frontend Rendering
```

---

## Team Execution Plan & Roles

### 1. Yash: Backend Lead + Deadline Engine + AI Integration
- **Core APIs:** `/send-otp`, `/verify-otp`, `/upload-pdf`, `/generate-plan`, `/chat`
- **Logic:** Deadline Mode, ML integration, LLM call with retry, In-memory storage

### 2. Rudransh: Frontend — React UI
- **UI Elements:** Auth page, Input page (chips, PDF upload), Result page (Mode banner, Pareto plan card), Filters, Chatbot UI

### 3. Mridul: AI & Prompt Engineering
- **Prompt Logic:** Strict JSON schema, Mode-aware instructions, Post-processing rules

### 4. Anuj: Data & Priority Logic
- **Logic:** Extract topics, Priority mapping, Weight formula

### 5. Karan: Chatbot + Testing + Analytics + PPT
- **Flow:** Chatbot intents, Full flow testing, Analytics tracking, Demo PPT

---

## 3-Day Execution Timeline

| | Yash | Rudransh | Mridul | Anuj | Karan |
|---|---|---|---|---|---|
| **Day 1** | Auth APIs + deadline logic | All pages (static UI) | Prompt v1 in Playground | Topic priority map | PPT skeleton + test cases |
| **Day 2** | AI integration + `/generate-plan` | Hit APIs, result page live | Prompt finalised + fallback | Weights JSON to Yash | Chatbot flow + analytics |
| **Day 3** | Bug fixes + deploy | Polish + chatbot UI | Output QA | Pareto data ready | 25 users + full test + demo |

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
