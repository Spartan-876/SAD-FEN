export default function Header() {
  return (
    <header className="bg-primary text-white py-4 px-6 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-lg font-bold">
          SF
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-tight">SAD-FEN</h1>
          <p className="text-xs text-white/70 leading-tight">
            Sistema de Apoyo a la Decisión ante el Fenómeno El Niño
          </p>
        </div>
      </div>
    </header>
  )
}
