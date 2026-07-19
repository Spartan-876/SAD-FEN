const API_URL = "http://localhost:8000"

export async function evaluarVivienda(respuestas) {
  const res = await fetch(`${API_URL}/api/evaluar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(respuestas),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => null)
    throw new Error(error?.detail || "Error al evaluar la vivienda")
  }
  return res.json()
}
