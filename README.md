# SAD-FEN

**Sistema de Apoyo a la Decisión ante el Fenómeno El Niño**

SAD-FEN es una herramienta de evaluación de preparación ante desastres orientada a la región de Lambayeque, Perú. El sistema combina un cuestionario de campo, un motor de reglas en Prolog y una aplicación web para estimar el nivel de riesgo de una vivienda frente al Fenómeno El Niño y recomendar acciones de mitigación.

## Estructura del proyecto

```
SAD-FEN/
├── Frontend/                    # Aplicación React 19 + Vite (JavaScript) + Tailwind CSS 4
│   ├── src/
│   │   ├── App.jsx              # Orquesta el flujo: bienvenida → cuestionario → cargando → resultado
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Bienvenida.jsx
│   │   │   ├── Cuestionario.jsx # Renderiza las preguntas visibles según la zona (urbano/rural)
│   │   │   ├── Pregunta.jsx
│   │   │   ├── Cargando.jsx
│   │   │   └── Resultado.jsx
│   │   ├── data/preguntas.js    # Definición de las 15 preguntas del cuestionario
│   │   └── lib/api.js           # Cliente HTTP hacia el backend (POST /api/evaluar)
│   └── package.json
├── Backend/
│   └── app/                     # API FastAPI (Python, arquitectura por capas)
│       ├── api/routes.py        # Rutas HTTP
│       ├── services/            # Lógica de negocio
│       ├── engine/              # Wrapper del motor Prolog (pyswip)
│       ├── schemas/             # Modelos Pydantic
│       └── config.py            # Configuración
├── Investigacion3/               # Documento LaTeX de investigación (paper del sistema experto)
├── conocimientos.pl              # Base de conocimiento en SWI-Prolog (sistema experto)
├── Preguntas-sistema-experto.md # Cuestionario de 15 preguntas que alimenta la base de conocimiento
└── AGENTS.md                    # Guía para agentes/colaboradores del repositorio
```

## Arquitectura

- **Frontend** (`Frontend/`): aplicación en React 19 + Vite 8, estilizada con Tailwind CSS 4. Usa archivos `.jsx` (sin TypeScript). Implementa un flujo de evaluación por pasos:
  1. `Bienvenida` — pantalla de inicio.
  2. `Cuestionario` — muestra las preguntas de `data/preguntas.js`, filtrando dinámicamente las que aplican según la zona (urbana o rural) elegida en la primera pregunta, y calcula el progreso de respuestas.
  3. `Cargando` — estado intermedio mientras se espera la respuesta del backend.
  4. `Resultado` — muestra el nivel de riesgo y las recomendaciones devueltas por la API.

  El cliente `lib/api.js` envía las respuestas al backend (`POST http://localhost:8000/api/evaluar`) y propaga los errores a la interfaz.
- **Backend** (`Backend/app/`): API en FastAPI con arquitectura de capas de servicio:
  - `api/` — endpoints HTTP (incluye `deps.py` para dependencias)
  - `services/` — lógica de negocio (`evaluacion_service.py`)
  - `engine/` — integración con el motor Prolog mediante `pyswip` (`prolog_engine.py`, `protocols.py`)
  - `schemas/` — modelos de datos con Pydantic (`evaluacion.py`)
- **Sistema experto** (`conocimientos.pl`, en la raíz del repo): base de conocimiento en SWI-Prolog que usa hechos dinámicos (`assert`/`retractall`) por vivienda, identificados con un ID tipo `v001`.
- **Investigación** (`Investigacion3/`): documento LaTeX/PDF que sustenta el diseño del sistema experto.

## Requisitos previos

- Node.js (para el frontend)
- Python 3.x
- [SWI-Prolog](https://www.swi-prolog.org/) instalado y accesible (requerido por `pyswip`)

## Puesta en marcha

### Frontend

```bash
cd Frontend
npm install
npm run dev        # Servidor de desarrollo (Vite)
npm run build       # Build de producción
npm run lint         # ESLint
npm run preview      # Vista previa del build de producción
```

### Backend

```bash
cd Backend/app
pip install -r requeriments.txt    # Instalar dependencias
uvicorn app.main:app --reload      # Servidor de desarrollo en http://localhost:8000
```

### Sistema experto (Prolog)

```prolog
swi-prolog
?- consult('conocimientos.pl').
?- nivel_riesgo_global(v001, Global).
?- recomendar(v001, Lista).
```

## Estado del proyecto

- El **Frontend** ya tiene su propio flujo de evaluación implementado (bienvenida, cuestionario dinámico, carga y resultado), con estilos en Tailwind CSS y consumo de la API del backend.
- El **Backend** implementa la arquitectura por capas de servicio descrita arriba.
- La URL del backend está fijada como constante (`http://localhost:8000`) en `Frontend/src/lib/api.js`; aún no es configurable por variables de entorno.


