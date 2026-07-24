from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_evaluacion_service
from app.schemas.evaluacion import RespuestaCuestionario, ResultadoEvaluacion
from app.services.evaluacion_service import EvaluacionService

router = APIRouter(prefix="/api", tags=["evaluacion"])


@router.post("/evaluar", response_model=ResultadoEvaluacion)
async def evaluar_vivienda(
    respuestas: RespuestaCuestionario,
    service: EvaluacionService = Depends(get_evaluacion_service),
) -> ResultadoEvaluacion:
    return service.evaluar(respuestas)
