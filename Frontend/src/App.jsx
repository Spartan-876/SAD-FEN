import { useState, useCallback } from "react"
import Header from "./components/Header"
import Bienvenida from "./components/Bienvenida"
import Cuestionario from "./components/Cuestionario"
import Cargando from "./components/Cargando"
import Resultado from "./components/Resultado"
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

  const handleNuevaEvaluacion = useCallback(() => {
    setRespuestas({})
    setResultado(null)
    setError(null)
    setPaso("cuestionario")
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {error && (
        <div className="max-w-3xl mx-auto mt-4 px-4">
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-4 text-sm">
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
          onNuevaEvaluacion={handleNuevaEvaluacion}
        />
      )}
    </div>
  )
}

export default App
