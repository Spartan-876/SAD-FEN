export default function Header({ paso, onNavigate }) {
  return (
    <header className="bg-surface border-b border-outline-variant/20 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-icons text-white text-xl">shield</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-on-surface leading-tight">FEN: Evaluación de Riesgo</h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <button
            onClick={() => onNavigate("bienvenida")}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              paso === "bienvenida" ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-icons text-base">home</span>
            Inicio
          </button>
          {(paso === "cuestionario" || paso === "resultado" || paso === "recomendaciones") && (
            <button
              onClick={() => onNavigate("cuestionario")}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                paso === "cuestionario" ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="material-icons text-base">assignment</span>
              Evaluación
            </button>
          )}
          {(paso === "resultado" || paso === "recomendaciones") && (
            <button
              onClick={() => onNavigate("resultado")}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                paso === "resultado" ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="material-icons text-base">analytics</span>
              Resultados
            </button>
          )}
          {paso === "recomendaciones" && (
            <span className="flex items-center gap-1 text-primary font-semibold">
              <span className="material-icons text-base">recommend</span>
              Recomendaciones
            </span>
          )}
        </nav>

        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <span className="material-icons text-base">language</span>
          ES
        </div>
      </div>
    </header>
  )
}
