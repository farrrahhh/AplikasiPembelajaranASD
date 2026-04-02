from __future__ import annotations

import base64
import hashlib
import hmac
import json
import secrets
import time

from app.config import settings


PBKDF2_ALGORITHM = "sha256"
PBKDF2_ITERATIONS = 100_000
PBKDF2_SALT_BYTES = 16
ACCESS_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7


def hash_password(password: str) -> str:
    salt = secrets.token_hex(PBKDF2_SALT_BYTES)
    password_hash = hashlib.pbkdf2_hmac(
        PBKDF2_ALGORITHM,
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PBKDF2_ITERATIONS,
    ).hex()
    return (
        f"pbkdf2_{PBKDF2_ALGORITHM}${PBKDF2_ITERATIONS}${salt}${password_hash}"
    )


def verify_password(plain_password: str, stored_password: str) -> bool:
    if not stored_password.startswith("pbkdf2_"):
        return hmac.compare_digest(plain_password, stored_password)

    scheme, iterations, salt, expected_hash = stored_password.split("$", maxsplit=3)
    algorithm = scheme.removeprefix("pbkdf2_")
    password_hash = hashlib.pbkdf2_hmac(
        algorithm,
        plain_password.encode("utf-8"),
        salt.encode("utf-8"),
        int(iterations),
    ).hex()
    return hmac.compare_digest(password_hash, expected_hash)


def _urlsafe_b64encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).decode("utf-8").rstrip("=")


def _urlsafe_b64decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(f"{value}{padding}".encode("utf-8"))


def create_access_token(user_id: int, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": int(time.time()) + ACCESS_TOKEN_TTL_SECONDS,
    }
    encoded_payload = _urlsafe_b64encode(
        json.dumps(payload, separators=(",", ":")).encode("utf-8")
    )
    signature = hmac.new(
        settings.app_secret_key.encode("utf-8"),
        encoded_payload.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return f"{encoded_payload}.{signature}"


def verify_access_token(token: str) -> dict[str, int | str]:
    try:
        encoded_payload, provided_signature = token.split(".", maxsplit=1)
    except ValueError as exc:
        raise ValueError("Invalid access token format.") from exc

    expected_signature = hmac.new(
        settings.app_secret_key.encode("utf-8"),
        encoded_payload.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(provided_signature, expected_signature):
        raise ValueError("Invalid access token signature.")

    try:
        payload = json.loads(_urlsafe_b64decode(encoded_payload).decode("utf-8"))
    except (ValueError, json.JSONDecodeError) as exc:
        raise ValueError("Invalid access token payload.") from exc

    if int(payload.get("exp", 0)) < int(time.time()):
        raise ValueError("Access token has expired.")

    return payload
