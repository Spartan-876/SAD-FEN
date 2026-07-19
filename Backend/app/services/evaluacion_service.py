from __future__ import annotations

import uuid

from app.engine.prolog_engine import PrologEngine
from app.schemas.evaluacion import (
    DimensionRiesgo,
    RespuestaCuestionario,
    ResultadoEvaluacion,
)

# Mapeo: campo del schema → functor Prolog + valor si respuesta A + valor si respuesta B
MAPEO_HECHOS: dict[str, tuple[str, str, str]] = {
    "p1_zona": ("zona", "urbana", "rural"),
    "p2_muro": ("material_muro", "noble", "precario"),
    "p3_techo": ("techo", "inclinado", "plano"),
    "p4_agua": ("almacenamiento_agua", "tecnificado", "precario"),
    "p5_poblacion": ("poblacion_vulnerable", "si", "no"),
    "p6_techo_protegido": ("techo_protegido", "adecuado", "inadecuado"),
    "p7_valvula": ("valvula_check", "si", "no"),
    "p8_electrica": ("altura_electrica", "segura", "baja"),
    "p9_calle": ("absorcion_calle", "buena", "mala"),
    "p10_sotano": ("ambiente_hundido", "no", "si"),
    "p11_energia": ("respaldo_energia", "si", "no"),
    "p7r_rio": ("proximidad_rio", "lejos", "cerca"),
    "p8r_refugio": ("refugio_alto", "si", "no"),
    "p9r_agro": ("dependencia_agropecuaria", "no", "si"),
    "p10r_suelo": ("suelo_humedad", "drena", "retiene"),
    "p11r_radio": ("radio_comunicacion", "si", "no"),
    "p12_vectores": ("criaderos_vectores", "no", "si"),
    "p13_medicina": ("kit_medico", "si", "no"),
    "p14_alimentos": ("alimentos_elevados", "si", "no"),
    "p15_vecinos": ("red_apoyo_vecinal", "si", "no"),
}


class EvaluacionService:
    def __init__(self, engine: PrologEngine) -> None:
        self._engine = engine

    def evaluar(
        self, respuestas: RespuestaCuestionario
    ) -> ResultadoEvaluacion:
        vivienda_id = f"v_{uuid.uuid4().hex[:8]}"

        self._engine.limpiar_hechos(vivienda_id)

        resp_dict = respuestas.model_dump()
        for campo, (functor, valor_a, valor_b) in MAPEO_HECHOS.items():
            if resp_dict[campo] is None:
                continue
            valor = valor_a if resp_dict[campo] == "A" else valor_b
            self._engine.assert_hecho(vivienda_id, functor, valor)

        nivel_global = self._engine.nivel_riesgo_global(vivienda_id) or "bajo"

        dimensiones = self._obtener_dimensiones(vivienda_id)
        recomendaciones = self._engine.recomendar(vivienda_id)

        return ResultadoEvaluacion(
            vivienda_id=vivienda_id,
            nivel_riesgo_global=nivel_global,
            dimensiones=dimensiones,
            recomendaciones=recomendaciones,
        )

    def _obtener_dimensiones(self, vivienda_id: str) -> list[DimensionRiesgo]:
        consultas = [
            ("Vulnerabilidad Estructural", self._engine.vulnerabilidad_estructural),
            ("Vulnerabilidad Sanitaria", self._engine.vulnerabilidad_sanitaria),
            ("Riesgo Eléctrico", self._engine.riesgo_electrico),
            ("Riesgo Hidrológico", self._engine.riesgo_hidrologico),
            ("Riesgo Epidemiológico", self._engine.riesgo_epidemiologico),
            ("Capacidad de Resiliencia", self._engine.capacidad_resiliencia),
        ]

        dimensiones: list[DimensionRiesgo] = []
        for nombre, consultar in consultas:
            nivel = consultar(vivienda_id) or "no_aplica"
            dimensiones.append(DimensionRiesgo(nombre=nombre, nivel=nivel))

        return dimensiones
