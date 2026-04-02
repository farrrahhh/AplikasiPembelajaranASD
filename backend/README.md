# Backend

FastAPI backend starter for this project.

## Run locally

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -e ".[dev]"
python -m uvicorn app.main:app --reload
```

If you already have `.venv`, prefer running the interpreter from that
environment. Example:

```bash
cd backend
source .venv/bin/activate
python -m uvicorn app.main:app --reload
```

## Environment

Copy `.env.example` to `.env` if you want a fresh local file.
The backend now expects `DATABASE_URL` and is configured for PostgreSQL.
If the active Python environment does not have `psycopg` installed, the app
will automatically fall back to a local SQLite database for development.

## Database

ORM models are defined with SQLAlchemy in `app/models.py`.
When the API starts, the app will:

1. create the PostgreSQL database if it does not exist,
2. create the configured PostgreSQL schema if it does not exist,
3. create ORM tables with `Base.metadata.create_all(...)`.

Default local connection:

```env
DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/asd_learning_db
DATABASE_SCHEMA=public
```

If your PostgreSQL password contains special characters such as `#`, encode them
in the URL. Example: `Farah#2004` becomes `Farah%232004`.

## Auth API

Available endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/users/me/dashboard`
- `GET /api/users/me/topics`
- `GET /api/users/me/insights`
- `GET /api/users/me/progress`

Example register body:

```json
{
  "name": "Farah",
  "email": "farah@example.com",
  "password": "password123"
}
```

Auth responses now return `access_token`. Send that token in the
`Authorization: Bearer <token>` header for the `/api/users/me/*` endpoints.

## LLM-powered insights

Insights can use OpenAI via the Responses API when `OPENAI_API_KEY` is present.
Recommended local settings:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.4-mini
```

If the key is missing or the API request fails, the backend falls back to a
deterministic recommendation so the UI still works.

## Troubleshooting

If `uvicorn` starts with a different Python version, your shell may be using a
global binary instead of the one in `.venv`. Running `python -m uvicorn ...`
uses the active virtualenv interpreter directly.

If you see `ModuleNotFoundError: No module named 'psycopg'`, that means the
active interpreter does not have PostgreSQL dependencies installed. Use the
project virtualenv, reinstall dependencies, or allow the development fallback
to SQLite.
