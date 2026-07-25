export default function Bienvenida({ onComenzar }) {
  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="material-icons text-primary text-3xl">verified_user</span>
          </div>
          <h1 className="text-4xl font-bold text-on-surface mb-3">
            FEN: Evaluación de Riesgo de Vivienda
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto mb-6">
            Protege tu hogar frente al Fenómeno El Niño. Realiza un diagnóstico preventivo y recibe recomendaciones personalizadas.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-on-surface-variant mb-8">
            <span className="material-icons text-base">schedule</span>
            <span>Tiempo estimado: 2-3 minutos</span>
          </div>
          <button
            onClick={onComenzar}
            className="bg-primary text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-primary-container transition-colors duration-150 shadow-md cursor-pointer inline-flex items-center gap-2"
          >
            Iniciar evaluación
            <span className="material-icons">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-outline-variant/20 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-primary">home_repair_service</span>
            </div>
            <h3 className="font-semibold text-on-surface mb-2">Vulnerabilidad</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Análisis de los materiales de construcción, estado de techos y cimientos para determinar la resistencia estructural.
            </p>
          </div>
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-outline-variant/20 text-center">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-success">emergency_home</span>
            </div>
            <h3 className="font-semibold text-on-surface mb-2">Preparación</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Evaluación de planes de evacuación familiar, mochila de emergencia y conocimiento de rutas seguras.
            </p>
          </div>
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-outline-variant/20 text-center">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-warning">location_on</span>
            </div>
            <h3 className="font-semibold text-on-surface mb-2">Riesgos Locales</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Identificación de peligros externos como quebradas, zonas inundables o deslizamientos cercanos a tu zona.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
