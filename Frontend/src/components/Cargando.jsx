export default function Cargando() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <span className="material-icons text-primary text-4xl animate-pulse-slow">analytics</span>
        </div>

        <h2 className="text-2xl font-bold text-on-surface mb-3">
          Analizando información...
        </h2>
        <p className="text-on-surface-variant mb-8">
          Estamos procesando los datos para brindarte la mejor recomendación de seguridad.
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-surface rounded-xl p-4 border border-outline-variant/20">
            <span className="material-icons text-primary">verified_user</span>
            <div className="text-left">
              <p className="text-sm font-medium text-on-surface">Datos Oficiales</p>
              <p className="text-xs text-on-surface-variant">Consultando fuentes gubernamentales en tiempo real.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-surface rounded-xl p-4 border border-outline-variant/20">
            <span className="material-icons text-success">security</span>
            <div className="text-left">
              <p className="text-sm font-medium text-on-surface">Protocolo Seguro</p>
              <p className="text-xs text-on-surface-variant">Toda la información es validada por expertos en gestión de riesgos.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
