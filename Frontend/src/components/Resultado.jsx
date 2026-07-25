const COLORES_RIESGO = {
  bajo: {
    bg: "bg-success",
    text: "text-white",
    card: "bg-success/5 border-success/20",
    label: "Bajo",
    icon: "check_circle",
  },
  medio: {
    bg: "bg-warning",
    text: "text-white",
    card: "bg-warning/5 border-warning/20",
    label: "Moderado",
    icon: "info",
  },
  alto: {
    bg: "bg-danger",
    text: "text-white",
    card: "bg-danger/5 border-danger/20",
    label: "Extremo",
    icon: "warning",
  },
  muy_alto: {
    bg: "bg-peruvian-red",
    text: "text-white",
    card: "bg-peruvian-red/5 border-peruvian-red/20",
    label: "Crítico",
    icon: "error",
  },
  no_aplica: {
    bg: "bg-outline-variant",
    text: "text-on-surface",
    card: "bg-outline-variant/10 border-outline-variant/20",
    label: "No aplica",
    icon: "remove",
  },
}

function getColor(nivel) {
  return COLORES_RIESGO[nivel] || COLORES_RIESGO.bajo
}

const DESCRIPCIONES_DIMENSIONES = {
  "Vulnerabilidad Estructural": "Vulnerabilidad alta en cimientos y techos ante precipitaciones extremas.",
  "Vulnerabilidad Sanitaria": "Posible contaminación de suministros de agua por inundación de colectores.",
  "Riesgo Eléctrico": "Instalaciones internas con sistemas de protección o sin protección adecuada.",
  "Riesgo Hidrológico": "Proximidad crítica a zona de escorrentía pluvial y posible activación de quebradas.",
  "Riesgo Epidemiológico": "Aumento de vectores (mosquitos) por estancamiento de aguas pluviales.",
  "Capacidad de Resiliencia": "Evaluación de recursos y preparación ante eventos.",
}

export default function Resultado({ resultado, onVerRecomendaciones }) {
  const colorGlobal = getColor(resultado.nivel_riesgo_global)

  const porcentajeRiesgo = (() => {
    const map = { bajo: 20, medio: 50, alto: 75, muy_alto: 90 }
    return map[resultado.nivel_riesgo_global] || 50
  })()

  const resiliencia = resultado.dimensiones.find(
    (d) => d.nombre === "Capacidad de Resiliencia"
  )

  const puntajeResiliencia = (() => {
    if (!resiliencia) return 50
    const map = { baja_resiliencia: 25, media_resiliencia: 50, alta_resiliencia: 85 }
    return map[resiliencia.nivel] || 50
  })()

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden mb-8">
        <div className="p-8 text-center">
          <div className={`w-20 h-20 ${colorGlobal.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <span className={`material-icons text-4xl ${colorGlobal.text}`}>{colorGlobal.icon}</span>
          </div>
          <p className="text-sm font-medium text-on-surface-variant mb-2 uppercase tracking-wide">
            Nivel de Riesgo Global
          </p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-6xl font-bold text-on-surface">{porcentajeRiesgo}%</span>
            <span className={`${colorGlobal.bg} ${colorGlobal.text} px-4 py-2 rounded-full text-lg font-bold`}>
              {colorGlobal.label}
            </span>
          </div>
          <p className="text-on-surface-variant text-sm max-w-lg mx-auto">
            {resultado.nivel_riesgo_global === "muy_alto" || resultado.nivel_riesgo_global === "alto"
              ? "Se han detectado vulnerabilidades críticas ante el Fenómeno El Niño. Se recomienda una revisión inmediata de los protocolos de evacuación."
              : "Se ha completado la evaluación de su vivienda. Revise las dimensiones individuales para más detalles."}
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-on-surface mb-4">
        Dimensiones de Riesgo
      </h3>
      <div className="space-y-3 mb-8">
        {resultado.dimensiones.filter(d => d.nombre !== "Capacidad de Resiliencia" && d.nivel !== "no_aplica").map((dim) => {
          const color = getColor(dim.nivel)
          return (
            <div
              key={dim.nombre}
              className={`${color.card} border rounded-xl p-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`material-icons ${color.text.replace('text-white', 'text-' + color.bg.replace('bg-', ''))}`}>{color.icon}</span>
                  <div>
                    <p className="font-semibold text-on-surface">{dim.nombre}</p>
                    <p className="text-sm text-on-surface-variant">
                      {DESCRIPCIONES_DIMENSIONES[dim.nombre] || ""}
                    </p>
                  </div>
                </div>
                <span className={`${color.bg} ${color.text} text-xs font-bold px-3 py-1 rounded-full`}>
                  {color.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {resiliencia && (
        <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/20 p-6 mb-8">
          <h3 className="text-lg font-semibold text-on-surface mb-4">
            Capacidad de Resiliencia
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Evaluación de recursos y preparación ante eventos.
          </p>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-on-surface-variant">Puntaje</span>
              <span className="font-semibold text-on-surface">{puntajeResiliencia}/100</span>
            </div>
            <div className="w-full h-3 bg-outline-variant/30 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  puntajeResiliencia >= 70 ? "bg-success" : puntajeResiliencia >= 40 ? "bg-warning" : "bg-danger"
                }`}
                style={{ width: `${puntajeResiliencia}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-on-surface-variant mb-1">Preparación de Emergencia</p>
              <div className="w-full h-2 bg-outline-variant/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.min(puntajeResiliencia + 10, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant mb-1">Recursos de Primera Respuesta</p>
              <div className="w-full h-2 bg-outline-variant/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.max(puntajeResiliencia - 10, 0)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={onVerRecomendaciones}
          className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-container transition-colors duration-150 shadow-sm cursor-pointer"
        >
          <span className="material-icons">recommend</span>
          Ver Recomendaciones
        </button>
      </div>
    </div>
  )
}
