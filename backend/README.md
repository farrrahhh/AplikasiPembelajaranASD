# Backend

FastAPI backend starter for this project.

## Run locally

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

## Environment

Copy `.env.example` to `.env` if you want a fresh local file.
