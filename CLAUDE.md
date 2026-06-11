# CLAUDE.md Guidelines for TourDesk

## Commands

- **Build Frontend**: `npm run build --workspace frontend`
- **Run Frontend Dev**: `npm run dev --workspace frontend`
- **Run Backend Dev**: `cd backend && uvicorn app.main:app --reload`
- **Lint / Format**: `npm run lint` (uses Biome check and ESLint)
- **Auto-fix Lint/Format**: `npx biome check --write .`
- **Type Check**: `npm run typecheck`
- **Run Python Tests**: `pytest`
- **Run Python Tests with Coverage**: `pytest --cov=backend/app --cov-report=term-missing`

## Code Style & Rules

- **Language**: TypeScript (Frontend), Python (Backend)
- **Formatting**: Spacing/indentation is 2 spaces (JS/TS/JSON/CSS) or 4 spaces (Python).
- **Frontend Code**: Next.js 13 App Router, React, Tailwind CSS, Lucide icons, client-side routing and state persistence (localStorage) for visited places/language.
- **Backend Code**: FastAPI, Pydantic v2, endpoint route architecture.
- **Accessibility**: Buttons must always have an explicit `type` attribute (e.g. `type="button"`).
- **Internationalization (i18n)**: Use React context via `useI18n` hook and `floating` language switcher.
- **Type Safety**: Prefer explicit type annotations for parameters and return types where appropriate.
