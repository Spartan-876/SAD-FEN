# AGENTS.md

## Project

SAD-FEN (Sistema de Apoyo a la Decisión ante el Fenómeno El Niño) — a disaster preparedness evaluation tool for the Lambayeque region, Peru. Content and UI are in Spanish.

## Structure

- `Frontend/` — React 19 + Vite 8 app (JavaScript, not TypeScript). Currently the default Vite template; not yet customized for the project.
- `Backend/app/` — FastAPI backend (Python). Uses Service Layer architecture: `api/routes.py` (HTTP), `services/` (business logic), `engine/` (Prolog wrapper via pyswip), `schemas/` (Pydantic models), `config.py` (settings).
- `Investigacion3/` — LaTeX research document + SWI-Prolog expert system (`conocimientos.pl`).
- `Preguntas-sistema-experto.md` — 15-question survey (in Spanish) that feeds the Prolog knowledge base.

## Commands

### Frontend (run from `Frontend/`)

```bash
cd Frontend
npm run dev        # Vite dev server
npm run build      # Production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

### Backend (run from `Backend/app/`)

```bash
cd Backend/app
pip install -r requeriments.txt    # Instalar dependencias
uvicorn app.main:app --reload --port 8000  # Dev server en http://localhost:8000
```

> **Nota:** El backend se ejecuta en puerto **8001** (el 8000 estaba ocupado). No reiniciar el backend en cada cambio; solo reiniciar si hay errores de importación o cambios en `main.py`.

### Expert system

```bash
# Load in SWI-Prolog
swi-prolog
?- consult('Investigacion3/conocimientos.pl').
?- nivel_riesgo_global(v001, Global).
?- recomendar(v001, Lista).
```

## Conventions

- All domain content (questionnaire, expert system rules, recommendations) is in Spanish. Keep it that way.
- Frontend uses `.jsx` files, not `.tsx`. No TypeScript configured.
- Backend follows a Service Layer architecture (`api/routes.py` for HTTP, `services/` for business logic, `engine/` for Prolog wrapper, `schemas/` for Pydantic models).
- The Prolog expert system uses dynamic facts with `assert`/`retractall` — facts are per-vivienda (household ID like `v001`).

## Gotchas

- Backend directories are now implemented with the Service Layer pattern. The `engine/` layer wraps pyswip, `services/` handles business logic, `api/` handles HTTP.
- The Frontend is the stock Vite React template (counter demo). No app-specific components, routing, or API integration yet.
- No tests, no CI, no monorepo tooling. No lock on package manager.
- Single commit in history — this is a very early-stage repo.
- `Backend/app/requeriments.txt` is misspelled (should be `requirements.txt`). Do not fix this unless instructed; it may be intentional or awaiting a rename.
