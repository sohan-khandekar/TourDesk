# AGENTS.md — AI Agent Guidelines for TourDesk

This file provides instructions for AI coding agents (Claude, Copilot, Cursor, etc.)
working on this repository.

## Project Structure
TourDesk-main/
├── backend/          # FastAPI Python backend
│   ├── app/
│   │   ├── api/routes/   # Route handlers
│   │   ├── core/         # Config, data loader
│   │   ├── schemas/      # Pydantic models
│   │   └── tests/        # pytest test suite
│   └── data/             # JSON data files
├── frontend/         # Next.js 13 TypeScript frontend
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities, i18n
│   └── services/     # API client
├── specs/            # Spec-Kit feature specs
└── .specify/         # Spec-Kit configuration
## Stack

- **Backend**: Python 3.12, FastAPI, Pydantic v2, pytest
- **Frontend**: Next.js 13, TypeScript, Tailwind CSS, Biome, ESLint
- **Linting**: Ruff (Python), Biome + ESLint (JS/TS)
- **Type checking**: Mypy (Python), TypeScript tsc (frontend)

## Key Conventions

### Python (Backend)
- All routes live in `backend/app/api/routes/`
- Use Pydantic v2 models for request/response schemas in `backend/app/schemas/`
- Run tests with: `pytest` from the repo root
- Run type checks with: `mypy backend/app` from the repo root
- Run linter with: `ruff check backend/` and `ruff format backend/`

### TypeScript (Frontend)
- Pages use the Next.js 13 App Router (`app/` directory)
- Components go in `frontend/components/`
- API calls go through `frontend/services/api.ts`
- Run type checks with: `npm --prefix frontend run typecheck`
- Run lint with: `npx biome check frontend/` or `npx eslint frontend/`

## Do NOT

- Do not add secrets or API keys to any tracked file; use `.env` (gitignored)
- Do not modify `LICENSE` — project is AGPLv3
- Do not break the Pydantic v2 schema format in `backend/app/schemas/`
- Do not install packages without updating `backend/requirements.txt` or `frontend/package.json`

## Running the Project Locally

```bash
# Backend
pip install -r backend/requirements.txt
uvicorn app.main:app --reload --app-dir backend

# Frontend (separate terminal)
npm --prefix frontend install
npm --prefix frontend run dev
```

## CI Pipeline Stages (in order)
1. `lint` — Biome + ESLint
2. `type_check` — tsc + mypy
3. `test` — pytest
4. `coverage` — pytest --cov
5. `security` — npm audit + pip-audit + gitleaks
6. `release` — cliff.toml + CHANGELOG.md check
