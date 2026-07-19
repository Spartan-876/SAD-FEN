import { useMemo } from "react"
import Pregunta from "./Pregunta"

export default function Cuestionario({
  preguntas,
  respuestas,
  onCambio,
  onEvaluar,
}) {
  const zona = respuestas.p1_zona

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

  const progreso = zona != null
    ? Math.round((respondidas / totalRequeridas) * 100)
    : 0

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
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
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 text-sm text-on-surface-variant">
          Primero indica tu ubicación geográfica para mostrar las preguntas
          correspondientes a tu zona.
        </div>
      )}

      <div className="space-y-4">
        {preguntasVisibles.map((p) => (
          <Pregunta
            key={p.id}
            pregunta={p}
            valor={respuestas[p.id]}
            onCambio={onCambio}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onEvaluar}
          disabled={!completo}
          className={`px-8 py-3 rounded-lg font-semibold text-base transition-all duration-150 shadow-sm cursor-pointer ${
            completo
              ? "bg-primary text-white hover:bg-primary-container"
              : "bg-outline-variant/40 text-on-surface-variant/50 cursor-not-allowed"
          }`}
        >
          Evaluar Vivenda
        </button>
      </div>
    </div>
  )
}
