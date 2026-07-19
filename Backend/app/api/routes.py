from __future__ import annotations

from fastapi import APIRouter

from app.schemas.evaluacion import RespuestaCuestionario, ResultadoEvaluacion
from app.services.evaluacion_service import EvaluacionService

router = APIRouter(prefix="/api", tags=["evaluacion"])

_service: EvaluacionService | None = None


def init_service(service: EvaluacionService) -> None:
    global _service
    _service = service


@router.post("/evaluar", response_model=ResultadoEvaluacion)
async def evaluar_vivienda(
    respuestas: RespuestaCuestionario,
) -> ResultadoEvaluacion:
    if _service is None:
        raise RuntimeError("El servicio de evaluación no está inicializado")
    return _service.evaluar(respuestas)
