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
When the API starts, the app initializes the database schema automatically with
`Base.metadata.create_all(...)`.
Default local connection:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/asd_learning_db
```

## Troubleshooting

If `uvicorn` starts with a different Python version, your shell may be using a
global binary instead of the one in `.venv`. Running `python -m uvicorn ...`
uses the active virtualenv interpreter directly.
