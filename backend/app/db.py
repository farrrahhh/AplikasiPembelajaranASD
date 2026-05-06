import warnings
from collections.abc import Generator

from sqlalchemy import MetaData, create_engine, text
from sqlalchemy.engine import URL, make_url
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings


def _sqlite_fallback_url() -> str:
    return "sqlite:///./asd_learning.db"


def _postgres_is_available(database_url: str) -> bool:
    probe_engine = create_engine(database_url, pool_pre_ping=True)

    try:
        with probe_engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True
    except OperationalError:
        return False
    finally:
        probe_engine.dispose()


def _resolve_database_url() -> str:
    configured_url = settings.database_url

    if not configured_url.startswith("postgresql+psycopg"):
        return configured_url

    try:
        import psycopg  # noqa: F401
    except ModuleNotFoundError:
        fallback_url = _sqlite_fallback_url()
        warnings.warn(
            (
                "psycopg is not installed in the active Python environment. "
                "Falling back to SQLite for local development. "
                "Install backend dependencies or use the project virtualenv to keep "
                "using PostgreSQL."
            ),
            RuntimeWarning,
            stacklevel=2,
        )
        return fallback_url

    if settings.app_env.lower() == "development" and not _postgres_is_available(
        configured_url
    ):
        fallback_url = _sqlite_fallback_url()
        warnings.warn(
            (
                "PostgreSQL is not reachable in development. "
                "Falling back to SQLite so the backend can still start locally. "
                "Start PostgreSQL if you want to keep using the configured "
                "DATABASE_URL."
            ),
            RuntimeWarning,
            stacklevel=2,
        )
        return fallback_url

    return configured_url


DATABASE_URL = _resolve_database_url()
DATABASE_BACKEND = make_url(DATABASE_URL).get_backend_name()
DATABASE_SCHEMA = settings.database_schema if DATABASE_BACKEND == "postgresql" else ""


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""

    metadata = MetaData(schema=DATABASE_SCHEMA or None)


sqlite_connect_args = (
    {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

engine = create_engine(DATABASE_URL, connect_args=sqlite_connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _build_admin_database_url(url: URL) -> URL:
    return url.set(database="postgres")


def ensure_database_exists() -> None:
    db_url = make_url(DATABASE_URL)

    if db_url.get_backend_name() != "postgresql" or not db_url.database:
        return

    target_database = db_url.database
    admin_engine = create_engine(
        _build_admin_database_url(db_url),
        isolation_level="AUTOCOMMIT",
    )

    try:
        with admin_engine.connect() as connection:
            database_exists = connection.execute(
                text("SELECT 1 FROM pg_database WHERE datname = :database_name"),
                {"database_name": target_database},
            ).scalar()

            if database_exists:
                return

            safe_database_name = target_database.replace('"', '""')
            connection.exec_driver_sql(f'CREATE DATABASE "{safe_database_name}"')
    finally:
        admin_engine.dispose()


def ensure_schema_exists() -> None:
    db_url = make_url(DATABASE_URL)
    target_schema = (DATABASE_SCHEMA or "").strip()

    if db_url.get_backend_name() != "postgresql" or not target_schema:
        return

    safe_schema_name = target_schema.replace('"', '""')

    with engine.begin() as connection:
        connection.exec_driver_sql(f'CREATE SCHEMA IF NOT EXISTS "{safe_schema_name}"')


def init_db() -> None:
    import app.models  # noqa: F401
    from app.learning import seed_topics_and_exercises

    ensure_database_exists()
    ensure_schema_exists()
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        seed_topics_and_exercises(db)
