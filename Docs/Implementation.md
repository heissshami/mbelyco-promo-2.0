# Implementation Plan for MBELYCO Promo 2.0

## Feature Analysis

### Identified Features:
- Authentication & Authorization (RBAC, granular permissions, session management, MFA)
- User Management & Admin Registration controls
- Admin Panel: Dashboard, Batch Management, Promo Code Management, Code Generation
- Codes Download (PDF, CSV) and Import
- Transaction/Redemption Monitoring and Search
- System Alerts & Notifications
- Reporting & Analytics
- System Configuration (branding, USSD, payments, business rules, security, notifications, analytics, integrations, backup)
- USSD Redemption Flows
- MTN MoMo Disbursement Integration with retry policies
- Idempotency & Concurrency Control; Audit Logging
- API design and versioning; Integration Layer
- Database design (ERD, constraints, indexing, retention)

### Feature Categorization:
- Should-be-improved Features: None yet implemented; all features are planned
- Functioning Features: Static landing/auth pages (current repo), no backend yet
- Third-party-integrated Features: MTN MoMo, USSD Gateway (aggregator), Email/SMS provider

## Recommended Tech Stack
### Frontend:
- Framework: Next.js (React) with TypeScript – SSR/SSG, routing, great DX for admin panel
- UI: Tailwind CSS + shadcn/ui – rapid development and consistent design system
- Charts: Recharts or Chart.js – simple dashboards and analytics

### Backend:
- Framework: Next.js API Routes with TypeScript – simple, flexible HTTP API
- Auth: JWT (httpOnly cookies) + role/permission middleware
- Validation: Zod – schema validation for inputs and configs
- Documentation: OpenAPI/Swagger – API contracts and testing

### Database:
- Neon (serverless Postgres) – serverless, auto-scaling Postgres with branching support
- ORM: Drizzle – type-safe, SQL-first schema and migrations

### Additional Tools:
- Caching/Queues: Upstash Redis + BullMQ – disbursement retries, background jobs, rate limiting
- Logging: Winston + audit tables – structured logs and compliance trail
- File generation: CSV (fast-csv) and PDF (Puppeteer)
- Testing: Jest + Supertest; E2E: Playwright/Cypress
- DevOps: CI (GitHub Actions) for tests/lint/build

## Implementation Stages

### Stage 1: Foundation & Setup
Dependencies: None
- [ ] Initialize modular monolith structure (frontend, backend, shared)
- [ ] Configure TypeScript and ESLint
- [ ] Set up Next.js app with Tailwind + shadcn/ui
- [ ] Create Next.js API with healthcheck and OpenAPI scaffold
- [ ] Provision Neon + Drizzle; create base schema and migrations
- [ ] Add Upstash Redis + BullMQ; job processor skeleton
- [ ] Implement basic JWT auth (login/logout, refresh) with httpOnly cookies
- [ ] add GitHub Actions CI

### Stage 2: Core Features
Dependencies: Stage 1 completion
- [ ] RBAC: roles, permissions, middleware, seeded defaults (Super Admin, Financial Admin, Batch Manager, Customer)
- [ ] User Management & Registration Controls (admin approval workflow)
- [ ] Batch Management CRUD with validation and uniqueness rules
- [ ] Promo Code Generation service (secure, unique format XXXX-XXYY-XXMM-XXDD)
- [ ] Promo Code Management (search, filter, status changes, bulk ops)
- [ ] Import/Export (CSV) with validation + error reporting
- [ ] Download Codes (PDF: 12 per A4) with progress tracking
- [ ] Admin Dashboard (key KPIs, recent activities, quick actions)

### Stage 3: Advanced Features
Dependencies: Stage 2 completion
- [ ] USSD Integration (webhooks, sessions, flows, automatic customer registration)
- [ ] MTN MoMo Disbursement Integration (queues, retries, reconciliation)
- [ ] Real-time Monitoring (Server-Sent Events or WebSocket for dashboards)
- [ ] Reporting & Analytics (standard reports, drill-down, exports)
- [ ] System Alerts & Notifications (configurable channels, thresholds)
- [ ] System Configuration UI (branding, security, rate limits, integrations)
- [ ] Comprehensive Audit Logging (auth, RBAC, batches, codes, payouts)

### Stage 4: Polish & Optimization
Dependencies: Stage 3 completion
- [ ] Performance: DB indexes, caching, pagination, N+1 avoidance
- [ ] Security hardening: rate limiting, input sanitization, CSRF, helmet
- [ ] Reliability: idempotency keys, concurrency controls, deduplication
- [ ] UX: accessibility, responsive refinements, empty/loading/error states
- [ ] Testing: unit/integration coverage, E2E critical flows, load tests
- [ ] Deployment: production Docker images, environment configs, observability

## Resource Links (Official)
Frontend
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com
- Recharts: https://recharts.org/en-US
- Chart.js: https://www.chartjs.org/docs/latest/

Backend & Infra
- Express: https://expressjs.com
- TypeScript: https://www.typescriptlang.org/docs/
- Zod: https://zod.dev
- OpenAPI: https://swagger.io/specification/

Data & Jobs
- Neon: https://neon.tech/docs
- Drizzle ORM: https://orm.drizzle.team/docs
- Upstash Redis: https://upstash.com/docs/redis/overall/getstarted
- BullMQ: https://docs.bullmq.io/

Utilities
- jsonwebtoken: https://github.com/auth0/node-jsonwebtoken
- Winston: https://github.com/winstonjs/winston
- Puppeteer: https://pptr.dev
- fast-csv: https://c2fo.github.io/fast-csv/
- Jest: https://jestjs.io/docs

Notes
- Third-party integrations: USSD Gateway (Africa's Talking) and MTN MoMo will require credentials, sandbox accounts, and specific callback endpoints. Plan separate integration test environments.