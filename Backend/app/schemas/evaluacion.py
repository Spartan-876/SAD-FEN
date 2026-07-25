from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, model_validator


class RespuestaCuestionario(BaseModel):
    p1_zona: Literal["A", "B"] = Field(
        ..., description="[A] Urbana, [B] Rural"
    )
    p2_muro: Literal["A", "B"] = Field(
        ..., description="[A] Noble, [B] Precario"
    )
    p3_techo: Literal["A", "B"] = Field(
        ..., description="[A] Inclinado, [B] Plano"
    )
    p4_agua: Literal["A", "B"] = Field(
        ..., description="[A] Tecnificado, [B] Precario"
    )
    p5_poblacion: Literal["A", "B"] = Field(
        ..., description="[A] Vulnerable, [B] No vulnerable"
    )
    p6_techo_protegido: Literal["A", "B"] = Field(
        ..., description="[A] Adecuado, [B] Inadecuado"
    )

    p7_valvula: Literal["A", "B"] | None = Field(
        default=None,
        description="[A] Si tiene válvula check, [B] No tiene",
    )
    p8_electrica: Literal["A", "B"] | None = Field(
        default=None,
        description="[A] Altura segura, [B] Altura baja",
    )
    p9_calle: Literal["A", "B"] | None = Field(
        default=None,
        description="[A] Buena absorción, [B] Mala absorción",
    )
    p10_sotano: Literal["A", "B"] | None = Field(
        default=None,
        description="[A] No tiene sótano, [B] Si tiene",
    )
    p11_energia: Literal["A", "B"] | None = Field(
        default=None,
        description="[A] Tiene respaldo, [B] No tiene",
    )

    p7r_rio: Literal["A", "B"] | None = Field(
        default=None,
        description="[A] Lejos del río, [B] Cerca del río",
    )
    p8r_refugio: Literal["A", "B"] | None = Field(
        default=None,
        description="[A] Tiene refugio alto, [B] No tiene",
    )
    p9r_agro: Literal["A", "B"] | None = Field(
        default=None,
        description="[A] No tiene agro, [B] Tiene dependencia agropecuaria",
    )
    p10r_suelo: Literal["A", "B"] | None = Field(
        default=None,
        description="[A] Suelo dreza, [B] Suelo retiene agua",
    )
    p11r_radio: Literal["A", "B"] | None = Field(
        default=None,
        description="[A] Tiene radio, [B] No tiene radio",
    )

    p12_vectores: Literal["A", "B"] = Field(
        ..., description="[A] Sin criaderos, [B] Con criaderos"
    )
    p13_medicina: Literal["A", "B"] = Field(
        ..., description="[A] Tiene kit médico, [B] No tiene"
    )
    p14_alimentos: Literal["A", "B"] = Field(
        ..., description="[A] Elevados, [B] En el piso"
    )
    p15_vecinos: Literal["A", "B"] = Field(
        ..., description="[A] Coordinado, [B] Descoordinado"
    )

    @model_validator(mode="after")
    def validar_zona(self) -> RespuestaCuestionario:
        es_urbana = self.p1_zona == "A"

        if es_urbana:
            campos_urbanos = {
                "p7_valvula": self.p7_valvula,
                "p8_electrica": self.p8_electrica,
                "p9_calle": self.p9_calle,
                "p10_sotano": self.p10_sotano,
                "p11_energia": self.p11_energia,
            }
            faltantes = [clave for clave, valor in campos_urbanos.items() if valor is None]
            if faltantes:
                raise ValueError(
                    f"Zona urbana requiere preguntas 7-11: {', '.join(faltantes)}"
                )
            if any(
                getattr(self, campo) is not None
                for campo in ["p7r_rio", "p8r_refugio", "p9r_agro", "p10r_suelo", "p11r_radio"]
            ):
                raise ValueError(
                    "Zona urbana no debe incluir preguntas rurales (p7r-p11r)"
                )
        else:
            campos_rurales = {
                "p7r_rio": self.p7r_rio,
                "p8r_refugio": self.p8r_refugio,
                "p9r_agro": self.p9r_agro,
                "p10r_suelo": self.p10r_suelo,
                "p11r_radio": self.p11r_radio,
            }
            faltantes = [clave for clave, valor in campos_rurales.items() if valor is None]
            if faltantes:
                raise ValueError(
                    f"Zona rural requiere preguntas 7R-11R: {', '.join(faltantes)}"
                )
            if any(
                getattr(self, campo) is not None
                for campo in ["p7_valvula", "p8_electrica", "p9_calle", "p10_sotano", "p11_energia"]
            ):
                raise ValueError(
                    "Zona rural no debe incluir preguntas urbanas (p7-p11)"
                )

        return self


class DimensionRiesgo(BaseModel):
    nombre: str
    nivel: str


class ResultadoEvaluacion(BaseModel):
    vivienda_id: str
    nivel_riesgo_global: str
    dimensiones: list[DimensionRiesgo]
    recomendaciones: list[str]
