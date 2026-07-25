export default function Resumen({ resultado, onNuevaEvaluacion }) {
  const totalRiesgos = resultado.dimensiones.filter(
    (d) => d.nivel !== "no_aplica" && d.nivel !== "baja_resiliencia"
  ).length

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="material-icons text-success text-3xl">check_circle</span>
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-2">
          ¡Evaluación Completada!
        </h2>
        <p className="text-on-surface-variant max-w-lg mx-auto">
          El análisis ha finalizado exitosamente. A continuación se presenta el resumen de los riesgos identificados para su vivienda.
        </p>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/20 p-8 mb-8">
        <h3 className="text-lg font-semibold text-on-surface mb-6">Resumen de Evaluación</h3>

        <div className="flex items-center gap-4 mb-6">
          <span className="material-icons text-warning text-2xl">warning</span>
          <div>
            <p className="text-sm text-on-surface-variant">Nivel Global</p>
            <p className="font-bold text-on-surface text-lg capitalize">
              {resultado.nivel_riesgo_global.replace("_", " ")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 bg-background rounded-xl p-4">
            <span className="material-icons text-danger">error</span>
            <div>
              <p className="text-2xl font-bold text-on-surface">{totalRiesgos}</p>
              <p className="text-xs text-on-surface-variant">Riesgos detectados</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-background rounded-xl p-4">
            <span className="material-icons text-primary">lightbulb</span>
            <div>
              <p className="text-2xl font-bold text-on-surface">{resultado.recomendaciones.length}</p>
              <p className="text-xs text-on-surface-variant">Recomendaciones clave</p>
            </div>
          </div>
        </div>

        <div className="border-t border-outline-variant/20 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-icons text-on-surface-variant">location_on</span>
            <div>
              <p className="text-sm text-on-surface-variant">Región Analizada</p>
              <p className="font-semibold text-on-surface">Lambayeque - Perú</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/20 p-5">
          <div className="flex items-start gap-3">
            <span className="material-icons text-primary">description</span>
            <div>
              <p className="font-semibold text-on-surface">Informe Detallado</p>
              <p className="text-sm text-on-surface-variant mt-1">
                Contiene el desglose técnico por dimensiones y estimación de daños probables.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/20 p-5">
          <div className="flex items-start gap-3">
            <span className="material-icons text-success">campaign</span>
            <div>
              <p className="font-semibold text-on-surface">Protocolos Activos</p>
              <p className="text-sm text-on-surface-variant mt-1">
                Protocolos de emergencia sugeridos según el nivel de alerta detectado.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-container transition-colors duration-150 shadow-sm cursor-pointer"
        >
          <span className="material-icons">picture_as_pdf</span>
          Descargar Informe PDF
        </button>
        <button
          onClick={onNuevaEvaluacion}
          className="flex items-center justify-center gap-2 border-2 border-outline-variant text-on-surface-variant px-8 py-3 rounded-lg font-semibold hover:bg-outline-variant/10 transition-colors duration-150 cursor-pointer"
        >
          <span className="material-icons">refresh</span>
          Realizar otra evaluación
        </button>
      </div>

    </div>
  )
}
