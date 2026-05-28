# Aplikasi Pembelajaran ASD

An AI-powered web application for learning **Algoritma dan Struktur Data (ASD)** — Algorithms and Data Structures. The app provides interactive learning materials, worked examples, AI-generated practice exercises, and progress tracking across 10 topics.

## Features

- **10 learning topics** — each with Materi, Contoh, Latihan, and Ringkasan tabs
- **AI-generated exercises** — unique practice questions per topic, powered by OpenAI
- **AI answer evaluation** — per-question feedback with scoring, strengths, and weak-concept tagging
- **Progress tracking** — saved per user per topic, synced to the backend
- **User authentication** — register, login, and profile management via JWT
- **Adaptive latihan** — follow-up exercises focus on concepts the student struggled with

### Topics

| # | Slug | Title |
|---|------|-------|
| 1 | `pengantar` | Pengantar Algoritma dan Struktur Data |
| 2 | `adt-sederhana` | ADT Sederhana |
| 3 | `list` | List |
| 4 | `mesin-karakter` | Mesin Karakter & Kata |
| 5 | `stack-queue` | Stack & Queue |
| 6 | `set-map` | Set & Map |
| 7 | `list-linier` | List Linier |
| 8 | `binary-tree` | Binary Tree |
| 9 | `graph` | Graph |
| 10 | `aplikasi` | Aplikasi |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | FastAPI (Python 3.11+), SQLAlchemy, Pydantic |
| Database | PostgreSQL |
| Auth | JWT (PyJWT) |
| AI | OpenAI API (`gpt-4o-mini`) |
| Deployment | GCP Cloud Run + Artifact Registry |
| CI/CD | GitHub Actions |

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── ai.py          # AI question generation & evaluation logic
│   │   ├── api/routes.py  # All API endpoints
│   │   ├── config.py      # Settings via pydantic-settings
│   │   ├── db.py          # Database init & session
│   │   ├── main.py        # FastAPI app entry point
│   │   ├── models.py      # SQLAlchemy ORM models
│   │   ├── schemas.py     # Pydantic request/response schemas
│   │   └── security.py    # JWT & password hashing
│   ├── contents/          # Reference learning materials (markdown & PDF)
│   ├── Dockerfile
│   └── pyproject.toml
├── frontend/
│   ├── app/
│   │   ├── api/           # Next.js route handlers (proxy to backend)
│   │   ├── dashboard/     # Dashboard, topic pages, profile, progress
│   │   ├── lib/           # Auth & progress client utilities
│   │   ├── login/
│   │   └── register/
│   ├── public/            # Static assets (images, cover materials)
│   └── Dockerfile
├── documentation/         # DEPLOYMENT.md, planning.md
└── .github/workflows/     # deploy.yml — CI/CD to GCP Cloud Run
```

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env   # then fill in your values
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive docs at `/docs`.

### Frontend

```bash
cd frontend
npm install
# create frontend/.env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev
```

The app will be available at `http://localhost:3000`.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_NAME` | `Aplikasi Pembelajaran ASD API` | App display name |
| `APP_ENV` | `development` | Environment (`development` / `production`) |
| `APP_HOST` | `0.0.0.0` | Bind host |
| `APP_PORT` | `8000` | Bind port |
| `SECRET_KEY` | — | JWT signing secret |
| `FRONTEND_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
| `DATABASE_URL` | `postgresql+psycopg://...` | PostgreSQL connection string |
| `DATABASE_SCHEMA` | `public` | PostgreSQL schema |
| `OPENAI_API_KEY` | — | OpenAI API key (required for latihan) |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model to use |

> If your PostgreSQL password contains special characters (e.g. `#`), URL-encode them: `Farah#2004` → `Farah%232004`.

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g. `http://localhost:8000/api`) |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive a JWT |
| `GET` | `/api/auth/me` | Get current user info |
| `PUT` | `/api/auth/profile` | Update name, email, or password |
| `GET` | `/api/progress` | Get all topic progress for current user |
| `PUT` | `/api/progress/{topic_slug}` | Upsert topic progress |
| `POST` | `/api/latihan/{topic_slug}/generate` | Generate AI practice questions |
| `POST` | `/api/latihan/{topic_slug}/evaluasi` | Evaluate a single answer |
| `POST` | `/api/latihan/{topic_slug}/evaluasi-batch` | Evaluate all answers at once |
| `GET` | `/api/health` | Health check |

## Deployment

CI/CD is handled by `.github/workflows/deploy.yml`. On every push to `main`:

1. Changed paths are detected (only the affected service is rebuilt).
2. Docker images are built and pushed to **GCP Artifact Registry** (`asia-southeast2`).
3. Images are deployed to **GCP Cloud Run** (`asd-backend` / `asd-frontend`).

Required GitHub secrets:

| Secret | Description |
|--------|-------------|
| `GCP_PROJECT_ID` | GCP project ID |
| `WIF_PROVIDER` | Workload Identity Federation provider |
| `WIF_SERVICE_ACCOUNT` | Service account email |
| `DATABASE_URL` | Production database URL |
| `SECRET_KEY` | JWT secret for production |
| `FRONTEND_ORIGIN` | Production frontend URL |
| `OPENAI_API_KEY` | OpenAI API key |
| `NEXT_PUBLIC_API_URL` | Production backend API URL |

See [documentation/DEPLOYMENT.md](documentation/DEPLOYMENT.md) for detailed deployment instructions.
