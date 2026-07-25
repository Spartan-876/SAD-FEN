const CATEGORIAS = {
  estructural: {
    titulo: "Vivienda",
    subtitulo: "Estructura y cerramiento",
    icono: "home",
    color: "bg-danger/10 text-danger",
  },
  sanitaria: {
    titulo: "Agua y Saneamiento",
    subtitulo: "Prevención de contaminación",
    icono: "water_drop",
    color: "bg-primary/10 text-primary",
  },
  electrico: {
    titulo: "Electricidad",
    subtitulo: "Seguridad eléctrica",
    icono: "bolt",
    color: "bg-warning/10 text-warning",
  },
  epidemiologico: {
    titulo: "Salud",
    subtitulo: "Prevención de epidemias",
    icono: "health_and_safety",
    color: "bg-success/10 text-success",
  },
  resiliencia: {
    titulo: "Preparación Familiar",
    subtitulo: "Mochila de emergencia",
    icono: "family_restroom",
    color: "bg-purple-100 text-purple-600",
  },
  hidrologico: {
    titulo: "Riesgo Hidrológico",
    subtitulo: "Protección ante inundaciones",
    icono: "flood",
    color: "bg-cyan-100 text-cyan-600",
  },
  general: {
    titulo: "Acciones Generales",
    subtitulo: "Medidas preventivas",
    icono: "shield",
    color: "bg-gray-100 text-gray-600",
  },
}

function categorizarRecomendacion(rec) {
  const texto = rec.toLowerCase()
  if (texto.includes("muro") || texto.includes("adobe") || texto.includes("techo") || texto.includes("calaminas") || texto.includes("plástico") || texto.includes("estructura inclinada") || texto.includes("loza") || texto.includes("filtraciones")) return "estructural"
  if (texto.includes("válvula") || texto.includes("check") || texto.includes("sacos de arena") || texto.includes("desagüe") || texto.includes("sótano") || texto.includes("ambiente hundido")) return "sanitaria"
  if (texto.includes("eléctric") || texto.includes("tomacorriente") || texto.includes("linterna") || texto.includes("recargable")) return "electrico"
  if (texto.includes("dengue") || texto.includes("criadero") || texto.includes("mosquit") || texto.includes("llantas") || texto.includes("botella") || texto.includes("vector")) return "epidemiologico"
  if (texto.includes("kit") || texto.includes("médico") || texto.includes("medicin") || texto.includes("suero") || texto.includes("vecino") || texto.includes("evacuación") || texto.includes("refugio") || texto.includes("comunidad")) return "resiliencia"
  if (texto.includes("río") || texto.includes("inundación") || texto.includes("drenaje") || texto.includes("suelo") || texto.includes("agua") || texto.includes("hermétic")) return "hidrologico"
  return "general"
}

export default function Recomendaciones({ recomendaciones, onFinalizar }) {
  const agrupadas = {}
  recomendaciones.forEach((rec) => {
    const cat = categorizarRecomendacion(rec)
    if (!agrupadas[cat]) agrupadas[cat] = []
    agrupadas[cat].push(rec)
  })

  const ordenCategorias = ["estructural", "sanitaria", "electrico", "hidrologico", "epidemiologico", "resiliencia", "general"]

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="material-icons text-primary text-2xl">recommend</span>
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-2">
          Plan de Mitigación Personalizado
        </h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto">
          Basado en tu evaluación, hemos priorizado estas acciones clave para proteger tu hogar y familia ante el fenómeno de El Niño.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {ordenCategorias.map((catKey) => {
          const recs = agrupadas[catKey]
          if (!recs || recs.length === 0) return null
          const cat = CATEGORIAS[catKey]
          return (
            <div key={catKey} className="bg-surface rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
              <div className="p-5 border-b border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat.color}`}>
                    <span className="material-icons">{cat.icono}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-on-surface">{cat.titulo}</h3>
                    <p className="text-xs text-on-surface-variant">{cat.subtitulo}</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-outline-variant/20">
                {recs.map((rec, i) => (
                  <div key={i} className="p-4 flex items-start gap-3 hover:bg-background/50 transition-colors">
                    <span className="material-icons text-primary mt-0.5">check_circle</span>
                    <p className="text-sm text-on-surface leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onFinalizar}
          className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-container transition-colors duration-150 shadow-sm cursor-pointer"
        >
          <span className="material-icons">task_alt</span>
          Finalizar
        </button>
      </div>
    </div>
  )
}
