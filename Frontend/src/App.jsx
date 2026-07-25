import { useState, useCallback } from "react"
import Header from "./components/Header"
import Bienvenida from "./components/Bienvenida"
import Cuestionario from "./components/Cuestionario"
import Cargando from "./components/Cargando"
import Resultado from "./components/Resultado"
import Recomendaciones from "./components/Recomendaciones"
import { preguntas } from "./data/preguntas"
import { evaluarVivienda } from "./lib/api"

function App() {
  const [paso, setPaso] = useState("bienvenida")
  const [respuestas, setRespuestas] = useState({})
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)

  const handleCambio = useCallback((campo, valor) => {
    setRespuestas((prev) => ({ ...prev, [campo]: valor }))
  }, [])

  const handleEvaluar = useCallback(async () => {
    setPaso("cargando")
    setError(null)
    try {
      const data = await evaluarVivienda(respuestas)
      setResultado(data)
      setPaso("resultado")
    } catch (err) {
      setError(err.message)
      setPaso("cuestionario")
    }
  }, [respuestas])

  const handleNavigate = useCallback((destino) => {
    if (destino === "bienvenida") {
      setPaso("bienvenida")
    } else if (destino === "cuestionario") {
      setPaso("cuestionario")
    } else if (destino === "resultado" && resultado) {
      setPaso("resultado")
    }
  }, [resultado])

  const handleFinalizar = useCallback(() => {
    setRespuestas({})
    setResultado(null)
    setError(null)
    setPaso("bienvenida")
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header paso={paso} onNavigate={handleNavigate} />

      {error && (
        <div className="max-w-3xl mx-auto mt-4 px-4">
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-xl p-4 text-sm flex items-center gap-3">
            <span className="material-icons">error</span>
            {error}
          </div>
        </div>
      )}

      {paso === "bienvenida" && (
        <Bienvenida onComenzar={() => setPaso("cuestionario")} />
      )}

      {paso === "cuestionario" && (
        <Cuestionario
          preguntas={preguntas}
          respuestas={respuestas}
          onCambio={handleCambio}
          onEvaluar={handleEvaluar}
        />
      )}

      {paso === "cargando" && <Cargando />}

      {paso === "resultado" && resultado && (
        <Resultado
          resultado={resultado}
          onVerRecomendaciones={() => setPaso("recomendaciones")}
        />
      )}

      {paso === "recomendaciones" && resultado && (
        <Recomendaciones
          recomendaciones={resultado.recomendaciones}
          onFinalizar={handleFinalizar}
        />
      )}
    </div>
  )
}

export default App
