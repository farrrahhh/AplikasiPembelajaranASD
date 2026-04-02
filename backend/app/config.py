from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Aplikasi Pembelajaran ASD API"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    app_secret_key: str = "change-me-in-env"
    frontend_origin: str = "http://localhost:3000"
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


settings = Settings()
