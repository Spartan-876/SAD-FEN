export default function Pregunta({ pregunta, valor, onCambio }) {
  return (
    <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/20 p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="material-icons text-primary">{pregunta.icono}</span>
        </div>
        <div>
          <h3 className="font-semibold text-on-surface text-lg">
            {pregunta.titulo}
          </h3>
          <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
            {pregunta.texto}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {Object.entries(pregunta.opciones).map(([letra, texto]) => (
          <button
            key={letra}
            onClick={() => onCambio(pregunta.id, letra)}
            className={`text-left p-5 rounded-xl border-2 transition-all duration-150 cursor-pointer ${
              valor === letra
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-outline-variant/30 bg-background hover:border-primary/40 hover:bg-primary/[0.02]"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                valor === letra
                  ? "bg-primary text-white"
                  : "bg-outline-variant/20 text-on-surface-variant"
              }`}>
                <span className="text-lg font-bold">{letra}</span>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-on-surface">{texto}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
