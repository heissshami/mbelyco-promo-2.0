# Project Structure

## Root Directory
mbelyco-promo-2.0/
├── Docs/
│   ├── Implementation.md
│   ├── project_structure.md
│   └── UI_UX_doc.md
├── apps/
│   └── admin-frontend/ (Next.js + Tailwind + shadcn/ui)
├── src/  (Backend Modular Monolith - Node/TypeScript + Express/Fastify)
│   ├── app/                  (bootstrap: server, DI, configs, routes registry)
│   ├── core/                 (Shared Kernel: base types, Result/Either, errors, events)
│   ├── shared/               (cross-cutting: middleware, auth, cache, mail/sms, observability)
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── domain/        (entities, value-objects, aggregates, domain events)
│   │   │   ├── application/   (use-cases, services, ports)
│   │   │   ├── infrastructure/(repositories via Drizzle, external adapters)
│   │   │   └── presentation/  (http controllers, routes, validation)
│   │   ├── admin/
│   │   ├── promo/
│   │   ├── batch/
│   │   └── redemption/
│   └── server.ts
├── drizzle/
│   ├── schema/           (Drizzle table definitions & relations for Neon Postgres)
│   ├── migrations/       (SQL migrations generated via Drizzle targeting Neon)
│   └── drizzle.config.ts (configured for Neon DATABASE_URL)
├── scripts/
│   ├── seed.ts
│   └── generate-migration.ts
├── docker/
│   ├── Dockerfile.server
│   ├── Dockerfile.web
│   └── docker-compose.yml
├── config/
│   ├── env.example       (includes DATABASE_URL for Neon)
│   └── openapi.yaml
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── .github/
    └── workflows/
        └── ci.yml

## Detailed Structure
- Docs/: Project planning and design documentation
- apps/admin-frontend: Admin dashboard UI, routing, pages, components, services
  - src/
    - app/ or pages/: routes and layouts
    - components/: reusable UI components
    - features/: domain-based modules (batches, codes, users, reports)
    - lib/: api client, auth helpers
    - styles/: Tailwind config and globals
- src/ (Backend Modular Monolith)
  - app/: bootstrap server, DI container, config, routes registry
  - core/: shared kernel (base types, Result/Either, domain events, errors)
  - shared/: cross-cutting (middleware, auth, cache, mail/sms, observability)
  - modules/:
    - auth/: domain, application (use-cases), infrastructure (Drizzle repos), presentation (HTTP)
    - users/: domain, application, infrastructure (Drizzle), presentation
    - batches/: domain, application, infrastructure (Drizzle), presentation
    - promo/: domain, application, infrastructure (Drizzle), presentation
    - redemption/: domain, application, infrastructure (Drizzle), presentation
    - disbursements/: domain, application, infrastructure (MoMo adapter + Drizzle), presentation
    - reports/: domain, application, infrastructure (report builders), presentation
    - settings/: domain, application, infrastructure, presentation
    - alerts/: domain, application, infrastructure (notifiers), presentation
  - jobs/: BullMQ processors and queues (disbursement, exports)
  - utils/: helpers (idempotency, concurrency, SSE/WS)
- drizzle/: Drizzle schema (schema/), migrations/, drizzle.config.ts
- scripts/: seeding for roles, permissions, demo data
- docker/: Containerization and local orchestration
- config/: Example envs and API docs
- tests/: Automated tests (unit, integration, e2e)
- .github/workflows: CI pipelines

## Conventions
- TypeScript everywhere; strict mode
- Domain-driven folders under modules/
- Use Zod for request validation; central error handler
- RBAC enforced by middleware with permission strings from PRD
- Audit logs persisted to DB with structured logging via Winston
- Idempotency keys and retry policies for disbursements
- Downloads: CSV via fast-csv; PDFs via Puppeteer (12 codes per A4)
- Real-time updates via SSE or WebSocket channels
- Configuration via Settings module and persisted in DB
- Data layer: Drizzle ORM targeting Neon (managed Postgres); repositories under each module's infrastructure/

## Build & Deployment
- CI runs lint, typecheck, tests, build artifacts
- Environment variables managed via env files and secrets store
- Versioned OpenAPI in config/openapi.yaml, served by API

## Environment-specific Configurations
- Development: verbose logging, sandbox integrations, hot reload
- Staging: staging MoMo/USSD credentials, seeded roles/permissions
- Production: strict CORS, secure cookies, rate limits, backups and retention policies