from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_db
from app.models import User
from app.schemas import AuthResponse, LoginRequest, RegisterRequest, UpdateProfileRequest, UserResponse
from app.security import create_access_token, decode_access_token, hash_password, verify_password

router = APIRouter()


@router.get("/", tags=["root"])
async def read_root() -> dict[str, str]:
    return {"message": "Aplikasi Pembelajaran ASD API is running."}


@router.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.post(
    "/auth/register",
    tags=["auth"],
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
) -> AuthResponse:
    existing_user = db.execute(
        select(User).where(User.email == payload.email)
    ).scalar_one_or_none()

    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered.",
        )

    user = User(
        name=payload.name,
        email=payload.email,
        password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.user_id, user.email, settings.secret_key)
    return AuthResponse(
        message="User registered successfully.",
        user=UserResponse.model_validate(user),
        token=token,
    )


@router.post(
    "/auth/login",
    tags=["auth"],
    response_model=AuthResponse,
)
async def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
) -> AuthResponse:
    user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()

    if user is None or not user.password or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token(user.user_id, user.email, settings.secret_key)
    return AuthResponse(
        message="Login successful.",
        user=UserResponse.model_validate(user),
        token=token,
    )


def get_current_user(
    authorization: str = Header(...),
    db: Session = Depends(get_db),
) -> User:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authorization header.")
    token = authorization.removeprefix("Bearer ")
    try:
        payload = decode_access_token(token, settings.secret_key)
        user_id = int(payload["sub"])
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token tidak valid atau kadaluarsa.")
    user = db.execute(select(User).where(User.user_id == user_id)).scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pengguna tidak ditemukan.")
    return user


@router.get("/auth/me", response_model=UserResponse, tags=["auth"])
async def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse.model_validate(current_user)


@router.put("/auth/profile", response_model=UserResponse, tags=["auth"])
async def update_profile(
    payload: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserResponse:
    if payload.name is not None:
        name = payload.name.strip()
        if not name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nama tidak boleh kosong.")
        current_user.name = name

    if payload.email is not None:
        email = payload.email.strip().lower()
        existing = db.execute(
            select(User).where(User.email == email, User.user_id != current_user.user_id)
        ).scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email sudah digunakan akun lain.")
        current_user.email = email

    if payload.new_password is not None:
        if not payload.current_password:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Kata sandi lama wajib diisi.")
        if not current_user.password or not verify_password(payload.current_password, current_user.password):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Kata sandi lama tidak sesuai.")
        if len(payload.new_password) < 8:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Kata sandi baru minimal 8 karakter.")
        current_user.password = hash_password(payload.new_password)

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)
