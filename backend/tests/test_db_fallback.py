import warnings

from app import db


def test_resolve_database_url_falls_back_to_sqlite_when_postgres_unavailable_in_development(
    monkeypatch,
):
    monkeypatch.setattr(
        db.settings,
        "database_url",
        "postgresql+psycopg://postgres:postgres@localhost:5432/asd_learning_db",
    )
    monkeypatch.setattr(db.settings, "app_env", "development")
    monkeypatch.setattr(db, "_postgres_is_available", lambda _url: False)

    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")
        resolved = db._resolve_database_url()

    assert resolved == "sqlite:///./asd_learning.db"
    assert any("PostgreSQL is not reachable in development" in str(item.message) for item in caught)


def test_resolve_database_url_keeps_postgres_in_production_even_if_unavailable(
    monkeypatch,
):
    configured_url = "postgresql+psycopg://postgres:postgres@localhost:5432/asd_learning_db"
    monkeypatch.setattr(db.settings, "database_url", configured_url)
    monkeypatch.setattr(db.settings, "app_env", "production")
    monkeypatch.setattr(db, "_postgres_is_available", lambda _url: False)

    resolved = db._resolve_database_url()

    assert resolved == configured_url
