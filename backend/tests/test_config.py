from app.config import Settings


def test_frontend_origins_are_normalized_and_deduplicated():
    settings = Settings(
        frontend_origin="http://localhost:3000/",
        frontend_origins="http://127.0.0.1:3000/, http://localhost:3000",
    )

    assert settings.frontend_origin == "http://localhost:3000"
    assert settings.frontend_origins == ["http://127.0.0.1:3000", "http://localhost:3000"]
    assert settings.cors_allow_origins == [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]


def test_dev_env_exposes_localhost_regex():
    settings = Settings(app_env="development")

    assert settings.cors_allow_origin_regex == r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$"


def test_non_dev_env_disables_localhost_regex():
    settings = Settings(app_env="production")

    assert settings.cors_allow_origin_regex is None
