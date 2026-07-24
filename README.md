# SAD-FEN

**Sistema de Apoyo a la Decisión ante el Fenómeno El Niño**

SAD-FEN es una herramienta de evaluación de preparación ante desastres orientada a la región de Lambayeque, Perú. El sistema combina un cuestionario de campo, un motor de reglas en Prolog y una aplicación web para estimar el nivel de riesgo de una vivienda frente al Fenómeno El Niño y recomendar acciones de mitigación.

> Todo el contenido de dominio (cuestionario, reglas del sistema experto, recomendaciones) está en español y así debe mantenerse.

## Estructura del proyecto

```
SAD-FEN/
├── Frontend/                    # Aplicación React 19 + Vite (JavaScript)
├── Backend/
│   └── app/                     # API FastAPI (Python, arquitectura por capas)
│       ├── api/routes.py        # Rutas HTTP
│       ├── services/            # Lógica de negocio
│       ├── engine/              # Wrapper del motor Prolog (pyswip)
│       ├── schemas/             # Modelos Pydantic
│       └── config.py            # Configuración
├── Investigacion3/               # Documento LaTeX de investigación + sistema experto
│   └── conocimientos.pl         # Base de conocimiento en SWI-Prolog
├── Preguntas-sistema-experto.md # Cuestionario de 15 preguntas que alimenta la base de conocimiento
└── AGENTS.md                    # Guía para agentes/colaboradores del repositorio
```

## Arquitectura

- **Frontend** (`Frontend/`): aplicación en React 19 con Vite. Usa archivos `.jsx` (sin TypeScript).
- **Backend** (`Backend/app/`): API en FastAPI con arquitectura de capas de servicio:
  - `api/` — endpoints HTTP
  - `services/` — lógica de negocio
  - `engine/` — integración con el motor Prolog mediante `pyswip`
  - `schemas/` — modelos de datos (Pydantic)
- **Sistema experto** (`Investigacion3/conocimientos.pl`): base de conocimiento en SWI-Prolog que usa hechos dinámicos (`assert`/`retractall`) por vivienda, identificados con un ID tipo `v001`.

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

> Nota: el archivo `requeriments.txt` está mal escrito intencionalmente (debería ser `requirements.txt`); no se corrige salvo indicación explícita.

### Sistema experto (Prolog)

```prolog
swi-prolog
?- consult('Investigacion3/conocimientos.pl').
?- nivel_riesgo_global(v001, Global).
?- recomendar(v001, Lista).
```

## Estado del proyecto

Este es un repositorio en etapa muy temprana:

- El **Frontend** aún corresponde a la plantilla por defecto de Vite (demo del contador); todavía no tiene componentes, rutas ni integración con la API propios del proyecto.
- El **Backend** ya implementa la arquitectura por capas de servicio descrita arriba.
- Aún no hay pruebas automatizadas, integración continua (CI) ni herramientas de monorepo, y no hay un gestor de paquetes fijado.

## Contribuir

- Mantén el contenido de dominio (preguntas, reglas, recomendaciones) en español.
- Sigue la arquitectura por capas del backend (`api/`, `services/`, `engine/`, `schemas/`).
- Usa `.jsx`, no `.tsx`, en el frontend.

Para más detalles orientados a agentes/colaboradores automatizados, consulta [`AGENTS.md`](./AGENTS.md).

## Licencia

No especificada.
