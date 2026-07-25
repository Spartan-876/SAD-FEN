from __future__ import annotations

import logging
from pathlib import Path

from pyswip import Prolog

logger = logging.getLogger(__name__)

_HECHOS_POR_VIVIENDA: list[str] = [
    "zona",
    "material_muro",
    "techo",
    "almacenamiento_agua",
    "poblacion_vulnerable",
    "techo_protegido",
    "valvula_check",
    "altura_electrica",
    "absorcion_calle",
    "ambiente_hundido",
    "respaldo_energia",
    "proximidad_rio",
    "refugio_alto",
    "dependencia_agropecuaria",
    "suelo_humedad",
    "radio_comunicacion",
    "criaderos_vectores",
    "kit_medico",
    "alimentos_elevados",
    "red_apoyo_vecinal",
]


class PrologEngine:
    def __init__(self, knowledge_base_path: Path) -> None:
        self._prolog = Prolog()
        self._base_path = knowledge_base_path
        self._cargar_base()

    def _cargar_base(self) -> None:
        ruta = str(self._base_path.resolve())
        logger.info("Cargando base de conocimiento desde %s", ruta)
        try:
            self._prolog.consult(ruta)
        except Exception as e:
            logger.error("Error al cargar la base de conocimiento: %s", e)
            raise RuntimeError(
                f"No se pudo cargar la base de conocimiento: {ruta}"
            ) from e
        logger.info("Base de conocimiento cargada correctamente")

    def limpiar_hechos(self, vivienda_id: str) -> None:
        for hecho in _HECHOS_POR_VIVIENDA:
            for _ in self._prolog.query(f"retractall({hecho}('{vivienda_id}', _))"):
                pass

    def assert_hecho(
        self, vivienda_id: str, functor: str, valor: str
    ) -> None:
        for _ in self._prolog.query(
            f"assert({functor}('{vivienda_id}', '{valor}'))"
        ):
            pass

    def consultar_uno(self, consulta: str) -> str | None:
        resultados = list(self._prolog.query(consulta))
        if not resultados:
            return None
        resultado = resultados[0]
        variables = {
            k: v
            for k, v in resultado.items()
            if isinstance(v, str)
        }
        if not variables:
            return None
        return next(iter(variables.values()))

    def consultar_lista(self, consulta: str) -> list[str]:
        resultados = list(self._prolog.query(consulta))
        items: list[str] = []
        for resultado in resultados:
            for v in resultado.values():
                if isinstance(v, list):
                    items.extend(str(item) for item in v)
                elif isinstance(v, str):
                    items.append(v)
        return items

    def nivel_riesgo_global(self, vivienda_id: str) -> str | None:
        return self.consultar_uno(
            f"nivel_riesgo_global('{vivienda_id}', Global)"
        )

    def vulnerabilidad_estructural(self, vivienda_id: str) -> str | None:
        return self.consultar_uno(
            f"vulnerabilidad_estructural('{vivienda_id}', Nivel)"
        )

    def vulnerabilidad_sanitaria(self, vivienda_id: str) -> str | None:
        return self.consultar_uno(
            f"vulnerabilidad_sanitaria('{vivienda_id}', Nivel)"
        )

    def riesgo_electrico(self, vivienda_id: str) -> str | None:
        return self.consultar_uno(
            f"riesgo_electrico('{vivienda_id}', Nivel)"
        )

    def riesgo_hidrologico(self, vivienda_id: str) -> str | None:
        return self.consultar_uno(
            f"riesgo_hidrologico('{vivienda_id}', Nivel)"
        )

    def riesgo_epidemiologico(self, vivienda_id: str) -> str | None:
        return self.consultar_uno(
            f"riesgo_epidemiologico('{vivienda_id}', Nivel)"
        )

    def capacidad_resiliencia(self, vivienda_id: str) -> str | None:
        return self.consultar_uno(
            f"capacidad_resiliencia('{vivienda_id}', Nivel)"
        )

    def recomendar(self, vivienda_id: str) -> list[str]:
        return self.consultar_lista(
            f"recomendar('{vivienda_id}', Lista)"
        )
