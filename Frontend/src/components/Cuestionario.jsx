import { useMemo, useState } from "react"
import Pregunta from "./Pregunta"

export default function Cuestionario({
  preguntas,
  respuestas,
  onCambio,
  onEvaluar,
}) {
  const zona = respuestas.p1_zona
  const [indiceActual, setIndiceActual] = useState(0)

  const preguntasVisibles = useMemo(() => {
    return preguntas.filter((p) => {
      if (p.condicion === null) return true
      if (p.condicion === "urbano" && zona === "A") return true
      if (p.condicion === "rural" && zona === "B") return true
      return false
    })
  }, [preguntas, zona])

  const totalRequeridas = preguntasVisibles.length
  const respondidas = preguntasVisibles.filter(
    (p) => respuestas[p.id] != null
  ).length
  const completo = respondidas === totalRequeridas && zona != null

  const preguntaActual = preguntasVisibles[indiceActual]
  const preguntaActualRespondida = preguntaActual ? respuestas[preguntaActual.id] != null : false
  const esPrimera = indiceActual === 0
  const esUltima = indiceActual === preguntasVisibles.length - 1

  const handleAnterior = () => {
    if (!esPrimera) setIndiceActual((prev) => prev - 1)
  }

  const handleSiguiente = () => {
    if (!esUltima) setIndiceActual((prev) => prev + 1)
  }

  const progreso = zona != null
    ? Math.round((respondidas / totalRequeridas) * 100)
    : 0

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-on-surface">
            Cuestionario de Evaluación
          </h2>
          <span className="text-sm text-on-surface-variant">
            {respondidas} de {totalRequeridas}
          </span>
        </div>
        <div className="w-full h-2 bg-outline-variant/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {zona == null && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <span className="material-icons text-primary">info</span>
            <div>
              <p className="text-sm font-medium text-on-surface">Selecciona tu ubicación</p>
              <p className="text-sm text-on-surface-variant mt-1">
                Primero indica tu ubicación geográfica para personalizar el análisis de vulnerabilidad.
              </p>
            </div>
          </div>
        </div>
      )}

      {preguntaActual && (
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
            <span className="material-icons text-base">flag</span>
            <span>Paso {indiceActual + 1} de {totalRequeridas}</span>
          </div>
          <Pregunta
            key={preguntaActual.id}
            pregunta={preguntaActual}
            valor={respuestas[preguntaActual.id]}
            onCambio={onCambio}
          />
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handleAnterior}
          disabled={esPrimera}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-150 cursor-pointer ${
            esPrimera
              ? "text-on-surface-variant/40 cursor-not-allowed"
              : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
          }`}
        >
          <span className="material-icons">arrow_back</span>
          Anterior
        </button>

        {esUltima ? (
          <button
            onClick={onEvaluar}
            disabled={!completo}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-150 shadow-sm cursor-pointer ${
              completo
                ? "bg-primary text-white hover:bg-primary-container"
                : "bg-outline-variant/40 text-on-surface-variant/50 cursor-not-allowed"
            }`}
          >
            Evaluar Vivienda
            <span className="material-icons">arrow_forward</span>
          </button>
        ) : (
          <button
            onClick={handleSiguiente}
            disabled={!preguntaActualRespondida}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-150 shadow-sm cursor-pointer ${
              preguntaActualRespondida
                ? "bg-primary text-white hover:bg-primary-container"
                : "bg-outline-variant/40 text-on-surface-variant/50 cursor-not-allowed"
            }`}
          >
            Siguiente
            <span className="material-icons">arrow_forward</span>
          </button>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <div className="flex gap-2">
          {preguntasVisibles.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === indiceActual
                  ? "bg-primary w-6"
                  : respuestas[preguntasVisibles[i]?.id] != null
                  ? "bg-primary/60"
                  : "bg-outline-variant/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
