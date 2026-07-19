export default function Bienvenida({ onComenzar }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-16 px-6">
      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl font-bold text-primary">SF</span>
      </div>

      <h2 className="text-3xl font-bold text-on-surface mb-3">
        Evaluación de Vulnerabilidad
      </h2>
      <p className="text-on-surface-variant text-lg mb-2">
        Fenómeno El Niño — Lambayeque
      </p>
      <p className="text-on-surface-variant/70 text-sm max-w-md mx-auto mb-10 leading-relaxed">
        Responde 15 preguntas sobre tu vivienda y el sistema experto evaluará
        tu nivel de riesgo ante inundaciones, deslizamientos y otros riesgos
        asociados al Fenómeno El Niño.
      </p>

      <button
        onClick={onComenzar}
        className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-container transition-colors duration-150 shadow-md cursor-pointer"
      >
        Comenzar Evaluación
      </button>

      <div className="mt-12 grid grid-cols-3 gap-6 text-center">
        <div className="bg-surface rounded-lg p-4 shadow-sm border border-outline-variant/20">
          <div className="text-2xl font-bold text-primary mb-1">15</div>
          <div className="text-xs text-on-surface-variant">Preguntas</div>
        </div>
        <div className="bg-surface rounded-lg p-4 shadow-sm border border-outline-variant/20">
          <div className="text-2xl font-bold text-primary mb-1">6</div>
          <div className="text-xs text-on-surface-variant">Dimensiones</div>
        </div>
        <div className="bg-surface rounded-lg p-4 shadow-sm border border-outline-variant/20">
          <div className="text-2xl font-bold text-primary mb-1">~3</div>
          <div className="text-xs text-on-surface-variant">Minutos</div>
        </div>
      </div>
    </div>
  )
}
