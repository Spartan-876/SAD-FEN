import logging
from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.config import settings
from app.engine.prolog_engine import PrologEngine
from app.services.evaluacion_service import EvaluacionService

logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def _create_evaluacion_service(kb_path: Path) -> EvaluacionService:
    engine = PrologEngine(kb_path)
    return EvaluacionService(engine)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("Iniciando SAD-FEN API")
    app.state.evaluacion_service = _create_evaluacion_service(
        settings.knowledge_base_path
    )
    logger.info("Motor Prolog y servicios inicializados")
    yield
    logger.info("Apagando SAD-FEN API")


app = FastAPI(
    title="SAD-FEN API",
    description="Sistema de Apoyo a la Decisión ante el Fenómeno El Niño",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
