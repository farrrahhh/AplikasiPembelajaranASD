from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Aplikasi Pembelajaran ASD API"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    app_secret_key: str = "change-me-in-env"
    frontend_origin: str = "http://localhost:3000"
    frontend_origins: list[str] = []
    database_url: str = (
        "postgresql+psycopg://postgres:postgres@localhost:5432/asd_learning_db"
    )
    database_schema: str = "public"
    openai_api_key: str = ""
    openai_model: str = "gpt-5.4-mini"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("frontend_origin", mode="before")
    @classmethod
    def normalize_frontend_origin(cls, value: str) -> str:
        if isinstance(value, str):
            return value.rstrip("/")
        return value

    @field_validator("frontend_origins", mode="before")
    @classmethod
    def parse_frontend_origins(cls, value: str | list[str]) -> list[str]:
        if value in (None, ""):
            return []

        if isinstance(value, str):
            return [item.strip().rstrip("/") for item in value.split(",") if item.strip()]

        return [item.rstrip("/") for item in value if item]

    @property
    def cors_allow_origins(self) -> list[str]:
        return list(dict.fromkeys([self.frontend_origin, *self.frontend_origins]))

    @property
    def cors_allow_origin_regex(self) -> str | None:
        if self.app_env.lower() != "development":
            return None
        return r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$"


settings = Settings()
