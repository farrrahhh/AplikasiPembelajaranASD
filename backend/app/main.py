from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router
from app.api.rag_routes import router as rag_router
from app.config import settings
from app.db import init_db


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_origin_regex=settings.cors_allow_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["root"])
async def app_root() -> dict[str, str]:
    return {
        "message": f"Welcome to {settings.app_name}.",
        "docs_url": "/docs",
        "api_base": "/api",
        "health_url": "/api/health",
    }


app.include_router(api_router, prefix="/api")
app.include_router(rag_router, prefix="/api")
