# AI Healthcare Prediction & Monitoring System

A full-stack, production-grade healthcare AI web application that predicts risk for **Diabetes**, **Breast Cancer**, and **Heart Disease** using machine learning — with explainable AI (SHAP), personalized health tips, PDF report generation, and a complete user dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| ML / AI | Python, Scikit-learn, SHAP, Joblib |
| Backend | FastAPI, Python |
| Database | Supabase (PostgreSQL) |
| Frontend | React.js, Chart.js |
| Auth | JWT (JSON Web Tokens) |
| PDF | ReportLab |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
healthcare-ai/
├── data/
│   ├── diabetes.csv
│   └── heart.csv
├── models/
│   ├── diabetes_model.pkl
│   ├── diabetes_rf_model.pkl
│   ├── diabetes_scaler.pkl
│   ├── diabetes_features.pkl
│   ├── cancer_model.pkl
│   ├── cancer_rf_model.pkl
│   ├── cancer_scaler.pkl
│   ├── cancer_features.pkl
│   ├── heart_model.pkl
│   ├── heart_rf_model.pkl
│   ├── heart_scaler.pkl
│   └── heart_features.pkl
├── notebooks/
│   └── phase1_models.ipynb
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── schemas.py
│   ├── auth.py
│   ├── predict.py
│   ├── history.py
│   ├── ml_engine.py
│   ├── health_tips.py
│   └── report_generator.py
├── frontend/
│   └── src/
│       ├── App.js
│       ├── api.js
│       ├── index.css
│       ├── pages/
│       │   ├── Login.js
│       │   ├── Dashboard.js
│       │   ├── Predict.js
│       │   └── History.js
│       └── components/
│           ├── Sidebar.js
│           ├── RiskMeter.js
│           └── ShapChart.js
├── retrain.py
├── .env
└── requirements.txt
```

---

## One-Time Setup (do this only once)

### 1. Clone / open the project

```bash
cd C:\Users\yashs\healthcare-ai
```

### 2. Activate virtual environment

```bash
venv\Scripts\activate
```

You will see `(venv)` appear in your terminal. Always activate before running anything.

### 3. Install Python packages (first time only)

```bash
pip install fastapi uvicorn supabase python-jose passlib bcrypt==4.0.1 python-dotenv pydantic[email] scikit-learn pandas numpy shap joblib reportlab email-validator
```

### 4. Install React packages (first time only)

```bash
cd frontend
npm install
cd ..
```

### 5. Set up your `.env` file

Create a file called `.env` in `C:\Users\yashs\healthcare-ai\` (not inside backend):



### 6. Train and save ML models (first time only)

```bash
cd C:\Users\yashs\healthcare-ai
python retrain.py
```

Expected output:
```
diabetes: LR=0.815 RF=0.813 -> best=LR
cancer:   LR=0.995 RF=0.993 -> best=LR
heart:    LR=0.953 RF=0.95  -> best=LR
ALL MODELS RETRAINED AND SAVED
```

---

## Every Day — How to Run the Project

You need **two terminals open at the same time**.

### Terminal 1 — Start the Backend API

```bash
cd C:\Users\yashs\healthcare-ai
venv\Scripts\activate
cd backend
uvicorn main:app --reload
```

Expected output:
```
✓ All ML models loaded
✓ SHAP explainers ready
✓ Supabase connected successfully
✓ Healthcare AI API is running
INFO: Uvicorn running on http://127.0.0.1:8000
```

### Terminal 2 — Start the Frontend

```bash
cd C:\Users\yashs\healthcare-ai\frontend
npm start
```

Expected output:
```
Compiled successfully!
Local: http://localhost:3000
```

### Open in browser

| URL | What it is |
|---|---|
| http://localhost:3000 | Your React app (main UI) |
| http://127.0.0.1:8000/docs | Backend API Swagger docs |

---

## How to Stop the Servers

In each terminal, press `Ctrl + C`.

---

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | /auth/register | No | Create new account |
| POST | /auth/login | No | Login, get JWT token |
| POST | /predict/diabetes | Yes | Predict diabetes risk |
| POST | /predict/cancer | Yes | Predict breast cancer risk |
| POST | /predict/heart | Yes | Predict heart disease risk |
| GET | /predict/report/{id} | Yes | Download PDF report |
| GET | /history/ | Yes | Get all past predictions |
| GET | /history/stats | Yes | Get dashboard stats |
| GET | /health | No | API health check |

---

## Database Tables (Supabase)

Run these once in Supabase SQL Editor if not already created:

```sql
create table users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  password text not null,
  created_at timestamp default now()
);

create table predictions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id),
  user_email text,
  disease text not null,
  input_data jsonb,
  result text,
  probability float,
  risk_level text,
  top_risk_factors text[],
  health_tips text[],
  timestamp timestamp default now()
);
```

---

## Retrain Models

If you need to retrain the ML models (e.g. after updating the datasets):

```bash
cd C:\Users\yashs\healthcare-ai
venv\Scripts\activate
python retrain.py
```

Then restart the backend server.

---

## Troubleshooting

### "venv not found" or "'venv' is not recognized"

```bash
python -m venv venv
venv\Scripts\activate
```

### "Module not found" error in backend

Make sure you activated venv first:
```bash
venv\Scripts\activate
```

### Backend shows port already in use

```bash
# Kill whatever is using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

### Frontend shows "Cannot connect to API" or CORS error

Make sure the backend is running in Terminal 1 before using the frontend.

### Token expired error in Swagger

Login again via `POST /auth/login` in Swagger, copy the new token, click Authorize, paste it.

### Models give wrong results after reinstalling packages

Retrain the models:
```bash
python retrain.py
```

---

## Features

- Multi-disease ML prediction (Diabetes, Breast Cancer, Heart Disease)
- Explainable AI using SHAP — shows top risk factors per prediction
- Personalized health tips based on risk level
- Confidence interval display (e.g. 56% – 70%)
- PDF report download with full patient summary
- JWT authentication (register / login / logout)
- Prediction history with filters
- Dashboard with live stats from database
- Interactive sliders for all input features
- Risk meter (LOW / MEDIUM / HIGH) with visual bar

---

## Resume Description

**AI Healthcare Prediction & Monitoring System**
Built a full-stack healthcare AI web application using React.js, FastAPI, and Scikit-learn that predicts risk for Diabetes, Breast Cancer, and Heart Disease. Implemented Explainable AI (SHAP) to surface top risk factors per prediction, JWT-based authentication, Supabase database integration, PDF report generation with ReportLab, and a live interactive dashboard with risk tracking over time. Deployed frontend on Vercel and backend on Render.


# Summary
Quick reference card (save this)
SituationWhat to doStart working on projectOpen 2 terminals, run backend in one, frontend in otherBackend commandcd backend → uvicorn main:app --reloadFrontend commandcd frontend → npm startForgot to activate venvRun venv\Scripts\activate firstAdded new Python packagepip install packagename (with venv active)Models giving errorsRun python retrain.py from root folderToken expired in SwaggerLogin again via /auth/login, copy new tokenStop serversCtrl + C in each terminal




# Commands to run the project
Every time you want to work on this project, open 2 terminals:
Terminal 1 — Backend:
bashcd C:\Users\yashs\healthcare-ai
venv\Scripts\activate
cd backend
uvicorn main:app --reload
Terminal 2 — Frontend:
bashcd C:\Users\yashs\healthcare-ai\frontend
npm start
That's it. Both run together, every single time.


# push commands
cd C:\Users\yashs\healthcare-ai
git add .
git commit -m "-----"
git push



# This is genuinely major-level work. Let's recap what's fully built so far:
Phase 1 — 3 ML models trained with SHAP explainability
Phase 2 — Full REST API with JWT auth, Supabase database
Phase 3 — React frontend with dashboard, predictions, history
Phase 4 Feature 1 — PDF report generation
Phase 4 Feature 2 — Live what-if simulator


