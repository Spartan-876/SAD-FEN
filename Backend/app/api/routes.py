from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import obtener_servicio_evaluacion
from app.schemas.evaluacion import RespuestaCuestionario, ResultadoEvaluacion
from app.services.evaluacion_service import EvaluacionService

router = APIRouter(prefix="/api", tags=["evaluacion"])


@router.post("/evaluar", response_model=ResultadoEvaluacion)
async def evaluar_vivienda(
    respuestas: RespuestaCuestionario,
    servicio: EvaluacionService = Depends(obtener_servicio_evaluacion),
) -> ResultadoEvaluacion:
    return servicio.evaluar(respuestas)
