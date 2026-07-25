import logging
from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.config import configuracion
from app.engine.prolog_engine import PrologEngine
from app.services.evaluacion_service import EvaluacionService

logging.basicConfig(
    level=logging.DEBUG if configuracion.debug else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def _crear_servicio_evaluacion(ruta_base_conocimientos: Path) -> EvaluacionService:
    motor = PrologEngine(ruta_base_conocimientos)
    return EvaluacionService(motor)


@asynccontextmanager
async def lifespan(aplicacion: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("Iniciando SAD-FEN API")
    aplicacion.state.evaluacion_service = _crear_servicio_evaluacion(
        configuracion.ruta_base_conocimientos
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
    allow_origins=configuracion.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"estado": "ok"}
