from __future__ import annotations

import hashlib
import hmac
import secrets


PBKDF2_ALGORITHM = "sha256"
PBKDF2_ITERATIONS = 100_000
PBKDF2_SALT_BYTES = 16


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
