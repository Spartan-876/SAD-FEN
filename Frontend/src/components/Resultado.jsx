const COLORES_RIESGO = {
  bajo: {
    bg: "bg-green-500",
    text: "text-white",
    card: "bg-green-50 border-green-200",
    label: "Bajo",
  },
  medio: {
    bg: "bg-yellow-500",
    text: "text-white",
    card: "bg-yellow-50 border-yellow-200",
    label: "Medio",
  },
  alto: {
    bg: "bg-orange-500",
    text: "text-white",
    card: "bg-orange-50 border-orange-200",
    label: "Alto",
  },
  muy_alto: {
    bg: "bg-red-500",
    text: "text-white",
    card: "bg-red-50 border-red-200",
    label: "Muy Alto",
  },
}

function getColor(nivel) {
  return COLORES_RIESGO[nivel] || COLORES_RIESGO.bajo
}

export default function Resultado({ resultado, onNuevaEvaluacion }) {
  const colorGlobal = getColor(resultado.nivel_riesgo_global)

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-on-surface mb-1">
          Resultados de la Evaluación
        </h2>
        <p className="text-on-surface-variant text-sm">
          ID de evaluación: {resultado.vivienda_id}
        </p>
      </div>

      <div
        className={`${colorGlobal.card} border-2 rounded-xl p-8 text-center mb-8`}
      >
        <p className="text-sm font-medium text-on-surface-variant mb-2 uppercase tracking-wide">
          Nivel de Riesgo Global
        </p>
        <span
          className={`${colorGlobal.bg} ${colorGlobal.text} inline-block px-6 py-2 rounded-full text-xl font-bold`}
        >
          {colorGlobal.label}
        </span>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-on-surface mb-4">
          Dimensiones de Riesgo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {resultado.dimensiones.map((dim) => {
            const color = getColor(dim.nivel)
            return (
              <div
                key={dim.nombre}
                className={`${color.card} border rounded-lg p-4 flex justify-between items-center`}
              >
                <span className="text-sm text-on-surface">{dim.nombre}</span>
                <span
                  className={`${color.bg} ${color.text} text-xs font-bold px-3 py-1 rounded-full`}
                >
                  {color.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {resultado.recomendaciones.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-on-surface mb-4">
            Recomendaciones
          </h3>
          <div className="space-y-3">
            {resultado.recomendaciones.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white border border-outline-variant/20 rounded-lg p-4 shadow-sm"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-warning/20 text-warning rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  !
                </span>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={onNuevaEvaluacion}
          className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-container transition-colors duration-150 shadow-sm cursor-pointer"
        >
          Nueva Evaluación
        </button>
      </div>
    </div>
  )
}
