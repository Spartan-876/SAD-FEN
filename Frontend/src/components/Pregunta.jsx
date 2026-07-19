export default function Pregunta({ pregunta, valor, onCambio }) {
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-outline-variant/30 p-6">
      <div className="flex items-start gap-3 mb-3">
        <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
          {pregunta.numero}
        </span>
        <div>
          <h3 className="font-semibold text-on-surface text-base">
            {pregunta.titulo}
          </h3>
          <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
            {pregunta.texto}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {Object.entries(pregunta.opciones).map(([letra, texto]) => (
          <button
            key={letra}
            onClick={() => onCambio(pregunta.id, letra)}
            className={`text-left p-4 rounded-lg border-2 transition-all duration-150 cursor-pointer ${
              valor === letra
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-outline-variant/40 bg-background hover:border-primary/40 hover:bg-primary/[0.02]"
            }`}
          >
            <span
              className={`inline-block w-6 h-6 rounded-full border-2 mr-3 align-middle text-xs font-bold leading-6 text-center ${
                valor === letra
                  ? "border-primary bg-primary text-white"
                  : "border-outline bg-transparent"
              }`}
            >
              {letra}
            </span>
            <span className="text-sm text-on-surface-variant">{texto}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
