import json
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.ai import TOPIC_CONFIGS, chat_materi_ai, evaluasi_batch, evaluasi_soal, evaluasi_soal_sendiri, generate_soal
from app.config import settings
from app.db import get_db
from app.models import Progress, User
from app.schemas import AuthResponse, LoginRequest, ProgressResponse, ProgressUpdateRequest, RegisterRequest, UpdateProfileRequest, UserResponse
from app.security import create_access_token, decode_access_token, hash_password, verify_password

VALID_TOPIC_SLUGS = {
    "pengantar", "adt-sederhana", "list", "mesin-karakter",
    "stack-queue", "set-map", "list-linier", "binary-tree", "graph", "aplikasi",
}


class GenerateSoalRequest(BaseModel):
    jumlah: int = 5
    kelemahan: list[str] = []
    tipe_paksa: str | None = None
    topik_referensi: list[str] = []


class EvaluasiSoalRequest(BaseModel):
    soal: dict
    jawaban: str = ""


class EvaluasiBatchRequest(BaseModel):
    soal: list[dict]
    jawaban: dict[str, str] = {}


class EvaluasiSoalSendiriRequest(BaseModel):
    pertanyaan: str
    jawaban: str = ""


class ChatRequest(BaseModel):
    pesan: str
    riwayat: list[dict] = []


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


@router.get("/progress", response_model=list[ProgressResponse], tags=["progress"])
async def get_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ProgressResponse]:
    rows = db.execute(
        select(Progress).where(Progress.user_id == current_user.user_id)
    ).scalars().all()
    return [ProgressResponse.model_validate(r) for r in rows]


@router.get("/progress/{topic_slug}", response_model=ProgressResponse, tags=["progress"])
async def get_topic_progress(
    topic_slug: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProgressResponse:
    if topic_slug not in VALID_TOPIC_SLUGS:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topik tidak ditemukan.")
    row = db.execute(
        select(Progress).where(
            Progress.user_id == current_user.user_id,
            Progress.topic_slug == topic_slug,
        )
    ).scalar_one_or_none()
    if row is None:
        return ProgressResponse(topic_slug=topic_slug, materi=False, contoh=False, latihan=False, ringkasan=False)
    return ProgressResponse.model_validate(row)


@router.put("/progress/{topic_slug}", response_model=ProgressResponse, tags=["progress"])
async def upsert_progress(
    topic_slug: str,
    payload: ProgressUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProgressResponse:
    if topic_slug not in VALID_TOPIC_SLUGS:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topik tidak ditemukan.")

    row = db.execute(
        select(Progress).where(
            Progress.user_id == current_user.user_id,
            Progress.topic_slug == topic_slug,
        )
    ).scalar_one_or_none()

    if row is None:
        row = Progress(user_id=current_user.user_id, topic_slug=topic_slug)
        db.add(row)

    row.materi = payload.materi
    row.contoh = payload.contoh
    row.latihan = payload.latihan
    row.ringkasan = payload.ringkasan
    if payload.weak_concepts is not None:
        row.weak_concepts = json.dumps(payload.weak_concepts)
    row.last_accessed = datetime.now(timezone.utc)

    db.commit()
    db.refresh(row)
    return ProgressResponse.model_validate(row)


@router.post("/latihan/{topic_slug}/generate", tags=["latihan"])
async def generate_latihan(
    topic_slug: str,
    payload: GenerateSoalRequest,
) -> dict:
    if topic_slug not in TOPIC_CONFIGS:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topik tidak ditemukan.")
    if not settings.openai_api_key:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="OpenAI API key tidak dikonfigurasi.")
    try:
        result = await generate_soal(
            topic_slug=topic_slug,
            jumlah=payload.jumlah,
            kelemahan=payload.kelemahan,
            tipe_paksa=payload.tipe_paksa,
            topik_referensi=payload.topik_referensi,
        )
        return result
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"OpenAI error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/latihan/{topic_slug}/evaluasi", tags=["latihan"])
async def evaluasi_latihan(
    topic_slug: str,
    payload: EvaluasiSoalRequest,
) -> dict:
    if topic_slug not in TOPIC_CONFIGS:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topik tidak ditemukan.")
    if not settings.openai_api_key:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="OpenAI API key tidak dikonfigurasi.")
    try:
        return await evaluasi_soal(topic_slug=topic_slug, soal=payload.soal, jawaban=payload.jawaban)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"OpenAI error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/latihan/{topic_slug}/evaluasi-soal-sendiri", tags=["latihan"])
async def evaluasi_latihan_soal_sendiri(
    topic_slug: str,
    payload: EvaluasiSoalSendiriRequest,
) -> dict:
    if topic_slug not in TOPIC_CONFIGS:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topik tidak ditemukan.")
    if not settings.openai_api_key:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="OpenAI API key tidak dikonfigurasi.")
    try:
        return await evaluasi_soal_sendiri(topic_slug, payload.pertanyaan, payload.jawaban)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"OpenAI error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/latihan/{topic_slug}/evaluasi-batch", tags=["latihan"])
async def evaluasi_latihan_batch(
    topic_slug: str,
    payload: EvaluasiBatchRequest,
) -> dict:
    if topic_slug not in TOPIC_CONFIGS:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topik tidak ditemukan.")
    if not settings.openai_api_key:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="OpenAI API key tidak dikonfigurasi.")
    soal_dengan_jawaban = [{**s, "jawaban": payload.jawaban.get(str(s["id"]), "")} for s in payload.soal]
    try:
        return await evaluasi_batch(topic_slug=topic_slug, soal_dengan_jawaban=soal_dengan_jawaban)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"OpenAI error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/chat/{topic_slug}", tags=["chat"])
async def chat_materi(
    topic_slug: str,
    payload: ChatRequest,
) -> dict:
    if topic_slug not in TOPIC_CONFIGS:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topik tidak ditemukan.")
    if not settings.openai_api_key:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="OpenAI API key tidak dikonfigurasi.")
    try:
        balasan = await chat_materi_ai(topic_slug, payload.pesan, payload.riwayat)
        return {"balasan": balasan}
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"OpenAI error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
