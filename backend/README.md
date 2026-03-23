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

## Environment

Copy `.env.example` to `.env` if you want a fresh local file.
The backend now expects `DATABASE_URL` and is configured for PostgreSQL.

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

Example register body:

```json
{
  "name": "Farah",
  "email": "farah@example.com",
  "password": "password123"
}
```

## Troubleshooting

If `uvicorn` starts with a different Python version, your shell may be using a
global binary instead of the one in `.venv`. Running `python -m uvicorn ...`
uses the active virtualenv interpreter directly.
