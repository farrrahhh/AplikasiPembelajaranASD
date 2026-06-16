from __future__ import annotations

import json
from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Name must not be empty.")
        return cleaned

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        cleaned = value.strip().lower()
        if "@" not in cleaned or cleaned.startswith("@") or cleaned.endswith("@"):
            raise ValueError("Email must be a valid email address.")
        return cleaned

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        return value


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        cleaned = value.strip().lower()
        if "@" not in cleaned or cleaned.startswith("@") or cleaned.endswith("@"):
            raise ValueError("Email must be a valid email address.")
        return cleaned


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    name: str
    email: str
    created_at: datetime


class AuthResponse(BaseModel):
    message: str
    user: UserResponse
    token: str


class UpdateProfileRequest(BaseModel):
    name: str | None = None
    email: str | None = None
    current_password: str | None = None
    new_password: str | None = None


class ProgressResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    topic_slug: str
    materi: bool
    contoh: bool
    latihan: bool
    ringkasan: bool
    weak_concepts: list[str] = []

    @field_validator("weak_concepts", mode="before")
    @classmethod
    def parse_weak_concepts(cls, v: object) -> list[str]:
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                return parsed if isinstance(parsed, list) else []
            except Exception:
                return []
        if isinstance(v, list):
            return v
        return []


class ProgressUpdateRequest(BaseModel):
    materi: bool = False
    contoh: bool = False
    latihan: bool = False
    ringkasan: bool = False
    weak_concepts: list[str] | None = None  # None = jangan ubah nilai yang sudah ada
