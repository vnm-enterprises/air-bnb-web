# AirBnB Web Frontend

Next.js 16 frontend for the AirBnB-like booking product, organized with a clean architecture approach for long-term maintainability.

## Run Locally

```bash
pnpm install
pnpm dev
```

Default dev URL: http://localhost:4000

## Architecture

The codebase is organized into explicit layers:

1. UI Layer
	- `app/`: route entrypoints (render/layout composition only)
	- `components/features/`: feature-level view components
	- `components/common/`: shared, non-domain specific building blocks
	- `components/ui/`: reusable UI primitives (shadcn-style)

2. Application Layer
	- `application/hooks/`: route/feature orchestration logic
	- `application/controllers/`: frontend business rules, normalization, validation

3. Domain Layer
	- `domain/models/`: domain-facing model and response types

4. Infrastructure Layer
	- `infrastructure/http/`: API client adapter
	- `infrastructure/services/`: service abstractions for external APIs

## Dependency Direction

Allowed direction:

- UI -> Application -> Domain
- Application -> Infrastructure
- Infrastructure -> external API client

Avoid:

- UI importing `lib/*` API modules directly
- Pages containing API calls or heavy orchestration logic
- Cross-feature imports from route files

## Service Layer Rules

- All network access belongs in `infrastructure/services/*`.
- UI and hooks consume services, never `fetch`/`axios` directly.
- Keep service methods reusable and stateless.

## Component Library Conventions

- Prefer primitives from `components/ui/*` (`button`, `input`, `textarea`, `alert`, `card`).
- Feature screens should compose primitives and common components.
- Keep feature components presentation-focused; move orchestration to application hooks.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```
