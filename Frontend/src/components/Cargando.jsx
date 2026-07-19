export default function Cargando() {
  return (
    <div className="max-w-md mx-auto text-center py-24 px-6">
      <div className="relative w-16 h-16 mx-auto mb-6">
        <div className="absolute inset-0 border-4 border-outline-variant/30 rounded-full" />
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>

      <h2 className="text-xl font-semibold text-on-surface mb-2">
        Analizando Resultados
      </h2>
      <p className="text-on-surface-variant text-sm">
        El sistema experto está evaluando tu vivienda...
      </p>
    </div>
  )
}
