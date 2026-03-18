from fastapi import APIRouter

router = APIRouter()


@router.get("/", tags=["root"])
async def read_root() -> dict[str, str]:
    return {"message": "Aplikasi Pembelajaran ASD API is running."}


@router.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
