from __future__ import annotations

from fastapi import Request

from app.services.evaluacion_service import EvaluacionService


def get_evaluacion_service(request: Request) -> EvaluacionService:
    """Provider de DI: devuelve el EvaluacionService almacenado en app.state."""
    service: EvaluacionService = request.app.state.evaluacion_service
    return service
