from collections.abc import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL, make_url
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""


sqlite_connect_args = (
    {"check_same_thread": False}
    if settings.database_url.startswith("sqlite")
    else {}
)

engine = create_engine(settings.database_url, connect_args=sqlite_connect_args)
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
    db_url = make_url(settings.database_url)

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


def init_db() -> None:
    import app.models  # noqa: F401

    ensure_database_exists()
    Base.metadata.create_all(bind=engine)
