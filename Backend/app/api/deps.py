from __future__ import annotations

from fastapi import Request

from app.services.evaluacion_service import EvaluacionService


def obtener_servicio_evaluacion(request: Request) -> EvaluacionService:
    servicio: EvaluacionService = request.app.state.evaluacion_service
    return servicio
